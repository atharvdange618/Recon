import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("recon.db");

// --- SQL TABLE DEFINITIONS ---

const SQL_CREATE_BUGS_TABLE = `
  CREATE TABLE IF NOT EXISTS Bugs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    summary TEXT NOT NULL,
    description TEXT,
    steps_to_reproduce TEXT,
    expected_result TEXT,
    actual_result TEXT,
    severity TEXT NOT NULL CHECK(severity IN ('Blocker', 'Critical', 'Major', 'Minor')),
    priority TEXT NOT NULL CHECK(priority IN ('High', 'Medium', 'Low', 'Critical')),
    status TEXT NOT NULL CHECK(status IN ('Reported', 'In Progress', 'On Hold', 'Resolved', 'Closed')),
    assignee_name TEXT,
    reporter_name TEXT,
    environment TEXT,
    resolution TEXT CHECK(resolution IN ('Fixed', 'Won''t Fix', 'Duplicate', 'Cannot Reproduce', 'Done')),
    requirement_number TEXT,
    test_case_name TEXT,
    is_archived INTEGER NOT NULL DEFAULT 0,
    created_at TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime'))
  );
`;

const SQL_CREATE_TIMELINE_EVENTS_TABLE = `
  CREATE TABLE IF NOT EXISTS TimelineEvents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bug_id INTEGER NOT NULL,
    author TEXT NOT NULL,
    comment TEXT NOT NULL,
    attachment_url TEXT,
    event_at TEXT NOT NULL,
    is_nexus_event INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (bug_id) REFERENCES Bugs (id) ON DELETE CASCADE
  );
`;

// --- DATABASE INITIALIZATION FUNCTION ---
/**
 * Initializes the database by creating the necessary tables if they don't exist.
 * This function should be called once when the app starts up.
 */
const initDb = () => {
  try {
    db.execSync("PRAGMA journal_mode = WAL;");
    db.execSync(SQL_CREATE_BUGS_TABLE);
    db.execSync(SQL_CREATE_TIMELINE_EVENTS_TABLE);
    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

// DATA TYPE DEFINITIONS

export type Bug = {
  id?: number;
  summary: string;
  description?: string;
  steps_to_reproduce?: string;
  expected_result?: string;
  actual_result?: string;
  severity: "Blocker" | "Critical" | "Major" | "Minor";
  priority: "High" | "Medium" | "Low" | "Critical";
  status: "Reported" | "In Progress" | "On Hold" | "Resolved" | "Closed";
  assignee_name?: string;
  reporter_name?: string;
  environment?: string;
  resolution?:
    | "Fixed"
    | "Won't Fix"
    | "Duplicate"
    | "Cannot Reproduce"
    | "Done";
  requirement_number?: string;
  test_case_name?: string;
};

export type FetchedBug = Bug & {
  id: number;
  created_at: string;
};

export type TimelineEvent = {
  bug_id: number;
  author: string;
  comment: string;
  is_nexus_event?: boolean;
};

export type FetchedTimelineEvent = TimelineEvent & {
  id: number;
  event_at: string;
};

// DATABASE FUNCTIONS

/**
 * Inserts a new bug into the Bugs table.
 * @param bug - An object containing all the bug details.
 * @returns The ID of the newly inserted bug.
 */
const addBug = (bug: Bug): number | null => {
  const sql = `
    INSERT INTO Bugs (
      summary, description, steps_to_reproduce, expected_result, actual_result,
      severity, priority, status, assignee_name, reporter_name, environment,
      requirement_number, test_case_name
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  try {
    const result = db.runSync(
      sql,
      bug.summary,
      bug.description || null,
      bug.steps_to_reproduce || null,
      bug.expected_result || null,
      bug.actual_result || null,
      bug.severity,
      bug.priority,
      bug.status,
      bug.assignee_name || null,
      bug.reporter_name || null,
      bug.environment || null,
      bug.requirement_number || null,
      bug.test_case_name || null
    );

    console.log(`Bug added with ID: ${result.lastInsertRowId}`);
    return result.lastInsertRowId;
  } catch (error) {
    console.error("Failed to add bug:", error);
    return null;
  }
};

/**
 * Fetches all non-archived bugs from the database.
 * @returns An array of bug objects.
 */
const getBugs = (): FetchedBug[] => {
  const sql = `SELECT * FROM Bugs WHERE is_archived = 0 ORDER BY id DESC;`;
  try {
    const results = db.getAllSync<FetchedBug>(sql);
    return results;
  } catch (error) {
    console.error("Failed to fetch bugs:", error);
    return [];
  }
};

/**
 * Fetches a single bug by its ID.
 * @param id The ID of the bug to fetch.
 * @returns The bug object or null if not found.
 */
const getBugById = (id: number): FetchedBug | null => {
  const sql = `SELECT * FROM Bugs WHERE id = ?;`;
  try {
    const result = db.getFirstSync<FetchedBug>(sql, id);
    return result || null;
  } catch (error) {
    console.error(`Failed to fetch bug with id ${id}:`, error);
    return null;
  }
};

/**
 * Fetches all timeline events for a given bug ID.
 * @param bug_id The ID of the bug.
 * @returns An array of timeline event objects.
 */
const getTimelineEvents = (bug_id: number): FetchedTimelineEvent[] => {
  const sql = `SELECT * FROM TimelineEvents WHERE bug_id = ? ORDER BY event_at DESC;`;
  try {
    const results = db.getAllSync<FetchedTimelineEvent>(sql, bug_id);
    return results;
  } catch (error) {
    console.error(`Failed to fetch timeline events for bug ${bug_id}:`, error);
    return [];
  }
};

/**
 * Adds a new event to a bug's timeline.
 * @param event The timeline event object.
 * @returns The ID of the new event.
 */
const addTimelineEvent = (event: TimelineEvent): number | null => {
  const sql = `
        INSERT INTO TimelineEvents (bug_id, author, comment, is_nexus_event, event_at)
        VALUES (?, ?, ?, ?, strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime'));
    `;
  try {
    const result = db.runSync(
      sql,
      event.bug_id,
      event.author,
      event.comment,
      event.is_nexus_event ? 1 : 0
    );
    console.log(`Timeline event added with ID: ${result.lastInsertRowId}`);
    return result.lastInsertRowId;
  } catch (error) {
    console.error("Failed to add timeline event:", error);
    return null;
  }
};

export {
  addBug,
  addTimelineEvent,
  db,
  getBugById,
  getBugs,
  getTimelineEvents,
  initDb,
};
