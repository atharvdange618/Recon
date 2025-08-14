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
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  Easing,
  runOnJS,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

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
  const canvasHeight = events.length * 100 + 50;
  const canvasWidth = 350;

  const pulseAnimation = useSharedValue(0);

  useEffect(() => {
    pulseAnimation.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [pulseAnimation]);

  const blur = useDerivedValue(
    () => 4 + pulseAnimation.value * 4,
    [pulseAnimation]
  );
  const nexusOpacity = useDerivedValue(
    () => pulseAnimation.value,
    [pulseAnimation]
  );

  const nexusDirections = useMemo(
    () => events.map(() => (Math.random() > 0.5 ? 1 : -1)),
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
    [events, nexusDirections]
  );

  const tapGesture = Gesture.Tap().onEnd((e) => {
    "worklet";
    let hit = false;
    for (const pos of eventPositions) {
      const distance = Math.sqrt(
        Math.pow(e.x - pos.x, 2) + Math.pow(e.y - pos.y, 2)
      );
      if (distance < pos.radius) {
        runOnJS(onEventPress)(pos.event, pos.x, pos.y);
        hit = true;
        break;
      }
    }
    if (!hit) {
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
          color={COLORS.lightGray2}
        />

        {events.map((event, index) => {
          const { x, y } = eventPositions[index];
          const direction = nexusDirections[index];
          if (event.is_nexus_event) {
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
                    color={COLORS.warning}
                  />
                </Group>
                <Path
                  path={nexusPath}
                  style="stroke"
                  strokeWidth={2}
                  color={COLORS.error}
                />
                <Circle cx={x} cy={y} r={6} color={COLORS.error} />
              </Group>
            );
          } else {
            return (
              <Group key={event.id}>
                <Circle cx={x} cy={y} r={6} color={COLORS.white} />
              </Group>
            );
          }
        })}
      </Canvas>
    </GestureDetector>
  );
};
