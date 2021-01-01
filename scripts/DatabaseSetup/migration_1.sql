DROP VIEW IF EXISTS raspiYearView;
CREATE VIEW raspiYearView AS
    SELECT * FROM raspi_monitoring WHERE id > strftime('%s', 'now')-31536000 AND id < strftime('%s', 'now')-120;

DROP VIEW IF EXISTS raspiGarbageHelper;
CREATE VIEW raspiGarbageHelper AS
    SELECT * FROM raspi_monitoring WHERE id < strftime('%s', 'now')-31536000;

--
--  Habit Tracker Section
--

DROP TABLE If EXISTS habit_track;
DROP TABLE IF EXISTS habit;
DROP TRIGGER IF EXISTS habitGarbageCollector;

CREATE TABLE habit (
    id TIMESTAMP PRIMARY KEY,
    user VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    desc VARCHAR(128)
);

CREATE TABLE habit_track (
    habit TIMESTAMP REFERENCES habit (id) ON DELETE CASCADE ON UPDATE CASCADE,
    date DATE NOT NULL,
    PRIMARY KEY (date, habit)
);

CREATE TRIGGER habitGarbageCollector
    AFTER INSERT ON habit_track
    BEGIN
        DELETE FROM habit_track
        WHERE date < strftime('%Y%m%d', 'now', '-1 years');
    END;