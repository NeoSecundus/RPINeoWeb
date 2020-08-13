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
    SELECT * FROM raspi_monitoring WHERE id > strftime('%s', 'now')-120;

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
