-- NWEB_DB_VERSION SECTION

DROP TABLE IF EXISTS NWEB_DB_VERSION;
CREATE TABLE NWEB_DB_VERSION (
  version INTEGER PRIMARY KEY CHECK(version >= 0)
);
INSERT INTO NWEB_DB_VERSION VALUES(0);

--- MONITORING SECTION

DROP TABLE IF EXISTS raspi_monitoring;

CREATE TABLE raspi_monitoring (
  id timestamp PRIMARY KEY,
  cpu_temp FLOAT,
  cpu_usage FLOAT CHECK ( cpu_usage <= 1 ),
  storage_usage FLOAT CHECK ( storage_usage <= 1 ),
  ram_usage FLOAT CHECK ( ram_usage <= 1 ),
  room_temp FLOAT,
  room_hum FLOAT CHECK ( room_hum >= 0 AND room_hum <= 100 )
);

-- Views
DROP VIEW IF EXISTS raspiHourView;
CREATE VIEW raspiHourView AS
  SELECT * FROM raspi_monitoring WHERE id > strftime('%s', 'now')-3600 and id < strftime('%s', 'now')-120;

DROP VIEW IF EXISTS raspiDayView;
CREATE VIEW raspiDayView AS
  SELECT * FROM raspi_monitoring WHERE id > strftime('%s', 'now')-86400 and id < strftime('%s', 'now')-120;

DROP VIEW IF EXISTS raspiMonthView;
CREATE VIEW raspiMonthView AS
  SELECT * FROM raspi_monitoring WHERE id > strftime('%s', 'now')-2592000 and id < strftime('%s', 'now')-120;
--Views END

DROP VIEW IF EXISTS raspiMinHelper;
CREATE VIEW raspiMinHelper AS
    SELECT * FROM raspi_monitoring WHERE id > strftime('%s', 'now')-140;

DROP VIEW IF EXISTS raspiGarbageHelper;
CREATE VIEW raspiGarbageHelper AS
    SELECT * FROM raspi_monitoring WHERE id < strftime('%s', 'now')-2592000;

--Timestamp triggers
DROP TRIGGER IF EXISTS raspiMinuteTrigger;
CREATE TRIGGER raspiMinuteTrigger
  AFTER INSERT ON raspi_monitoring
  WHEN (SELECT COUNT(*) FROM raspiMinHelper) >= 38
  BEGIN
    UPDATE raspi_monitoring SET
                                cpu_temp = (SELECT avg(cpu_temp) FROM raspiMinHelper),
                                cpu_usage = (SELECT avg(cpu_usage) FROM raspiMinHelper),
                                storage_usage = (SELECT avg(storage_usage) FROM raspiMinHelper),
                                ram_usage = (SELECT avg(ram_usage) FROM raspiMinHelper),
                                room_temp = (SELECT avg(room_temp) FROM raspiMinHelper),
                                room_hum = (SELECT avg(room_hum) FROM raspiMinHelper)
    WHERE id == (SELECT min(id) FROM raspiMinHelper);
    DELETE FROM raspi_monitoring WHERE id > (SELECT min(id) FROM raspiMinHelper);
  END;

DROP TRIGGER IF EXISTS raspiGarbageCollector;
CREATE TRIGGER raspiGarbageCollector
  AFTER INSERT ON raspi_monitoring
  BEGIN
    DELETE FROM raspi_monitoring
    WHERE id == (SELECT id FROM raspiGarbageHelper);
  END;

--
-- NOTES SECTION
--

DROP TABLE IF EXISTS raspi_notes;
DROP TABLE IF EXISTS raspi_note_groups;

CREATE TABLE raspi_note_groups (
    title VARCHAR NOT NULL,
    "user" VARCHAR NOT NULL,
    color VARCHAR CHECK(color LIKE('#______')),
    PRIMARY KEY (title, "user")
);

CREATE TABLE raspi_notes (
    title VARCHAR NOT NULL,
    "user" VARCHAR NOT NULL,
    group_title VARCHAR NOT NULL,
    "text" VARCHAR NOT NULL,
    create_date TIMESTAMP NOT NULL,
    PRIMARY KEY (title, group_title, "user"),
    FOREIGN KEY (group_title, "user")
        REFERENCES raspi_note_groups(title, "user")
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

DROP VIEW IF EXISTS raspi_note_group_view;
CREATE VIEW raspi_note_group_view AS
    SELECT rng.title, rng."user", rng.color, COUNT(rn.title) AS "note_count"
    FROM raspi_note_groups rng
        LEFT OUTER JOIN raspi_notes rn ON rng.title == rn.group_title
    GROUP BY rng.title;
