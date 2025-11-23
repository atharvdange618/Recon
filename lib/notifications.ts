import * as Notifications from "expo-notifications";
import { addReminder, deleteReminder, getRemindersForBug } from "./database";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Request notification permissions
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === "granted";
  } catch (error) {
    console.error("Failed to request notification permissions:", error);
    return false;
  }
}

// Schedule a reminder notification
export async function scheduleReminder(
  bugId: number,
  title: string,
  dueDate: Date,
  daysBefore: number
): Promise<string | null> {
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.warn("Notification permission not granted");
      return null;
    }

    // Calculate reminder date
    const reminderDate = new Date(dueDate);
    reminderDate.setDate(reminderDate.getDate() - daysBefore);

    // Don't schedule if reminder date is in the past
    if (reminderDate <= new Date()) {
      console.warn("Reminder date is in the past, not scheduling");
      return null;
    }

    // Schedule the notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Bug Reminder",
        body: `Bug "${title}" is due in ${daysBefore} day${
          daysBefore === 1 ? "" : "s"
        }`,
        data: { bugId, type: "bug_reminder" },
      },
      trigger: null, // For now, schedule immediately - can be improved later
    });

    // Save reminder to database
    await addReminder(bugId, notificationId, reminderDate.toISOString());

    return notificationId;
  } catch (error) {
    console.error("Failed to schedule reminder:", error);
    return null;
  }
}

// Cancel a reminder notification
export async function cancelReminder(notificationId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    await deleteReminder(notificationId);
  } catch (error) {
    console.error("Failed to cancel reminder:", error);
  }
}

// Cancel all reminders for a bug
export async function cancelAllRemindersForBug(bugId: number): Promise<void> {
  try {
    const reminders = await getRemindersForBug(bugId);
    for (const reminder of reminders) {
      if (reminder.notification_id) {
        await cancelReminder(reminder.notification_id);
      }
    }
  } catch (error) {
    console.error("Failed to cancel reminders for bug:", error);
  }
}

// Update reminders for a bug (cancel existing and create new ones)
export async function updateRemindersForBug(
  bugId: number,
  title: string,
  dueDate: Date | null,
  reminderEnabled: boolean,
  daysBefore: number
): Promise<void> {
  try {
    // Cancel existing reminders
    await cancelAllRemindersForBug(bugId);

    // Schedule new reminder if enabled and due date exists
    if (reminderEnabled && dueDate) {
      await scheduleReminder(bugId, title, dueDate, daysBefore);
    }
  } catch (error) {
    console.error("Failed to update reminders:", error);
  }
}

// Initialize notifications on app start
export async function initializeNotifications(): Promise<void> {
  try {
    await requestNotificationPermissions();
  } catch (error) {
    console.error("Failed to initialize notifications:", error);
  }
}

// Get all scheduled notifications (for debugging)
export async function getScheduledNotifications() {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error("Failed to get scheduled notifications:", error);
    return [];
  }
}
