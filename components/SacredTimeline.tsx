import { FetchedTimelineEvent } from "@/lib/database";
import { COLORS } from "@/lib/theme";
import {
  Blur,
  Canvas,
  Circle,
  Group,
  Path,
  Skia,
} from "@shopify/react-native-skia";
import { useEffect, useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  Easing,
  runOnJS,
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const EventDot = ({
  eventId,
  cx,
  cy,
  color,
  activeEventId,
  tapPulse,
}: {
  eventId: number;
  cx: number;
  cy: number;
  color: string;
  activeEventId: SharedValue<number | null>;
  tapPulse: SharedValue<number>;
}) => {
  const derivedRadius = useDerivedValue(() => {
    const baseRadius = 6;
    const pulseAmount = 4;
    if (activeEventId.value === eventId) {
      return baseRadius + tapPulse.value * pulseAmount;
    }
    return baseRadius;
  });

  return <Circle cx={cx} cy={cy} r={derivedRadius} color={color} />;
};

export const SacredTimeline = ({
  events,
  onEventPress,
}: {
  events: FetchedTimelineEvent[];
  onEventPress: (
    event: FetchedTimelineEvent | null,
    x: number,
    y: number
  ) => void;
}) => {
  const { width } = useWindowDimensions();
  const canvasWidth = Math.min(width - 40, 350);
  const canvasHeight = events.length * 100 + 50;

  const pulseAnimation = useSharedValue(0);
  const activeEventId = useSharedValue<number | null>(null);
  const tapPulse = useSharedValue(0);

  useEffect(() => {
    pulseAnimation.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [pulseAnimation]);

  const blur = useDerivedValue(() => 4 + pulseAnimation.value * 4);
  const nexusOpacity = useDerivedValue(() => pulseAnimation.value);

  const nexusDirections = useMemo(
    () => events.map((_, index) => (index % 2 === 0 ? 1 : -1)),
    [events]
  );

  const eventPositions = useMemo(
    () =>
      events.map((event, index) => {
        const yPos = index * 100 + 50;
        const xPos = canvasWidth * 0.5 + Math.sin(yPos / 50) * 5;
        const direction = nexusDirections[index];
        return {
          x: event.is_nexus_event ? xPos + 120 * direction : xPos,
          y: yPos,
          radius: 20,
          event: event,
        };
      }),
    [events, nexusDirections, canvasWidth]
  );

  const tapGesture = Gesture.Tap().onEnd((e) => {
    "worklet";
    let hit = false;
    for (const pos of eventPositions) {
      const distance = Math.sqrt(
        Math.pow(e.x - pos.x, 2) + Math.pow(e.y - pos.y, 2)
      );
      if (distance < pos.radius) {
        activeEventId.value = pos.event.id;
        tapPulse.value = withSequence(
          withTiming(1, { duration: 200 }),
          withTiming(0, { duration: 200 })
        );
        runOnJS(onEventPress)(pos.event, pos.x, pos.y);
        hit = true;
        break;
      }
    }
    if (!hit) {
      activeEventId.value = null;
      runOnJS(onEventPress)(null, 0, 0);
    }
  });

  const mainPath = Skia.Path.Make();
  mainPath.moveTo(canvasWidth * 0.5, 0);
  for (let i = 0; i <= canvasHeight; i += 10) {
    const xOffset = Math.sin(i / 50) * 5;
    mainPath.lineTo(canvasWidth * 0.5 + xOffset, i);
  }

  return (
    <GestureDetector gesture={tapGesture}>
      <Canvas style={{ width: canvasWidth, height: canvasHeight }}>
        <Group>
          <Blur blur={blur} />
          <Path
            path={mainPath}
            style="stroke"
            strokeWidth={5}
            color={COLORS.primary}
          />
        </Group>
        <Path
          path={mainPath}
          style="stroke"
          strokeWidth={2.5}
          color={COLORS.primary}
        />

        {events.map((event, index) => {
          const { x, y } = eventPositions[index];
          const direction = nexusDirections[index];
          const isNexus = event.is_nexus_event;

          if (isNexus) {
            const startX = canvasWidth * 0.5 + Math.sin(y / 50) * 5;
            const nexusPath = Skia.Path.Make();
            nexusPath.moveTo(startX, y);
            nexusPath.cubicTo(
              startX + 50 * direction,
              y - 10,
              startX + 80 * direction,
              y + 20,
              x,
              y
            );
            return (
              <Group key={event.id}>
                <Group opacity={nexusOpacity}>
                  <Blur blur={8} />
                  <Path
                    path={nexusPath}
                    style="stroke"
                    strokeWidth={4}
                    color={COLORS.error}
                  />
                </Group>
                <Path
                  path={nexusPath}
                  style="stroke"
                  strokeWidth={2}
                  color={COLORS.error}
                />
                <EventDot
                  eventId={event.id}
                  cx={x}
                  cy={y}
                  color={COLORS.error}
                  activeEventId={activeEventId}
                  tapPulse={tapPulse}
                />
              </Group>
            );
          } else {
            return (
              <Group key={event.id}>
                <EventDot
                  eventId={event.id}
                  cx={x}
                  cy={y}
                  color={COLORS.text}
                  activeEventId={activeEventId}
                  tapPulse={tapPulse}
                />
              </Group>
            );
          }
        })}
      </Canvas>
    </GestureDetector>
  );
};
