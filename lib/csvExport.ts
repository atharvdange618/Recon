import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { FetchedBug, FetchedTimelineEvent } from "./database";

export interface ExportData {
  bug: FetchedBug;
  timeline: FetchedTimelineEvent[];
}

/**
 * Generate a sanitized filename for export
 */
const generateFileName = (bug: FetchedBug): string => {
  const bugId = `BUG-${String(bug.id).padStart(3, "0")}`;
  const summary = bug.summary.replace(/[^a-zA-Z0-9\s]/g, "").slice(0, 30);
  const date = new Date().toISOString().split("T")[0];
  return `${bugId}_${summary.replace(/\s+/g, "_")}_${date}.csv`;
};

/**
 * Format date for display
 */
const formatDisplayDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Escape CSV content to handle commas, quotes, and newlines
 */
const escapeCsvCell = (cell: string | null | undefined): string => {
  if (!cell) return "";
  const stringCell = String(cell);
  if (
    stringCell.includes(",") ||
    stringCell.includes('"') ||
    stringCell.includes("\n")
  ) {
    return `"${stringCell.replace(/"/g, '""')}"`;
  }
  return stringCell;
};

/**
 * Generate CSV content from bug and timeline data
 */
const generateCSV = (data: ExportData): string => {
  const { bug, timeline } = data;

  const csvRows: string[] = [];

  // Header
  csvRows.push("Recon Bug Report Export");
  csvRows.push(`Generated on: ${new Date().toLocaleDateString()}`);
  csvRows.push("");

  // Bug Information Section
  csvRows.push("=== BUG DETAILS ===");
  csvRows.push(`Bug ID,BUG-${String(bug.id).padStart(3, "0")}`);
  csvRows.push(`Summary,${escapeCsvCell(bug.summary)}`);
  csvRows.push(`Description,${escapeCsvCell(bug.description)}`);
  csvRows.push(`Status,${escapeCsvCell(bug.status)}`);
  csvRows.push(`Priority,${escapeCsvCell(bug.priority)}`);
  csvRows.push(`Severity,${escapeCsvCell(bug.severity)}`);
  csvRows.push(`Assignee,${escapeCsvCell(bug.assignee_name)}`);
  csvRows.push(`Reporter,${escapeCsvCell(bug.reporter_name)}`);
  csvRows.push(`Environment,${escapeCsvCell(bug.environment)}`);
  csvRows.push(`Resolution,${escapeCsvCell(bug.resolution)}`);
  csvRows.push(`Requirement Number,${escapeCsvCell(bug.requirement_number)}`);
  csvRows.push(`Test Case Name,${escapeCsvCell(bug.test_case_name)}`);
  csvRows.push(`Steps to Reproduce,${escapeCsvCell(bug.steps_to_reproduce)}`);
  csvRows.push(`Expected Result,${escapeCsvCell(bug.expected_result)}`);
  csvRows.push(`Actual Result,${escapeCsvCell(bug.actual_result)}`);
  csvRows.push(`Created At,${formatDisplayDate(bug.created_at)}`);
  csvRows.push("");

  // Timeline Section
  csvRows.push("=== TIMELINE EVENTS ===");
  if (timeline.length > 0) {
    csvRows.push("Event ID,Author,Date,Nexus Event,Comment");

    timeline.forEach((event) => {
      csvRows.push(
        [
          event.id.toString(),
          escapeCsvCell(event.author),
          formatDisplayDate(event.event_at),
          event.is_nexus_event ? "Yes" : "No",
          escapeCsvCell(event.comment),
        ].join(",")
      );
    });
  } else {
    csvRows.push("No timeline events recorded.");
  }

  return csvRows.join("\n");
};

/**
 * Export bug data to CSV and share
 */
export const exportBugToCSV = async (data: ExportData): Promise<void> => {
  try {
    // Generate CSV content
    const csvContent = generateCSV(data);
    const fileName = generateFileName(data.bug);
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    // Write to file
    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      throw new Error("Sharing is not available on this device");
    }

    // Share the file
    await Sharing.shareAsync(fileUri, {
      mimeType: "text/csv",
      dialogTitle: "Export Bug Report",
    });
  } catch (error) {
    console.error("CSV export error:", error);
    throw new Error("Failed to export bug report to CSV");
  }
};
