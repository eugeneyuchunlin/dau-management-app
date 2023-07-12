DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS service_stats;
DROP TABLE IF EXISTS test_service_stats;

CREATE TABLE users(
    id INTEGER PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    api_key TEXT UNIQUE
);

CREATE TABLE service_stats (
	id INTEGER PRIMARY KEY,
	username TEXT NOT NULL,
	job_id TEXT UNIQUE NOT NULL,
	computation_time_ms INTEGER,
	start_time DATETIME,
	start_time_utc8 DATETIME,
            status TEXT,
	FOREIGN KEY(username) REFERENCES users(username)
);

CREATE TABLE test_service_stats (
	id INTEGER PRIMARY KEY,
	username TEXT NOT NULL,
	job_id TEXT UNIQUE NOT NULL,
	computation_time_ms INTEGER,
	start_time DATETIME,
	start_time_utc8 DATETIME,
            status TEXT,
	FOREIGN KEY(username) REFERENCES users(username)
);
