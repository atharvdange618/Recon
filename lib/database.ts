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

export { db, initDb };
