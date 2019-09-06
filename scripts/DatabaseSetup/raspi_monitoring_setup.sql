DROP TABLE IF EXISTS raspi_monitoring;

CREATE TABLE raspi_monitoring (
  id timestamp PRIMARY KEY,
  temp FLOAT,
  cpu_usage FLOAT CHECK ( cpu_usage <= 1 ),
  storage_usage FLOAT CHECK ( storage_usage <= 1 ),
  ram_usage FLOAT CHECK ( ram_usage <= 1 )
);

-- Views
DROP VIEW IF EXISTS raspiHourView;
CREATE VIEW raspiHourView AS
  SELECT * FROM raspi_monitoring WHERE id > strftime('%s', 'now')-3600;

DROP VIEW IF EXISTS raspiDayView;
CREATE VIEW raspiDayView AS
  SELECT * FROM raspi_monitoring WHERE id > strftime('%s', 'now')-86400;

DROP VIEW IF EXISTS raspiMonthView;
CREATE VIEW raspiMonthView AS
  SELECT * FROM raspi_monitoring WHERE id > strftime('%s', 'now')-2592000;
--Views END

DROP VIEW IF EXISTS raspiMinHelper;
CREATE VIEW raspiMinHelper AS
    SELECT * FROM raspi_monitoring WHERE id > strftime('%s', 'now')-60;

--Timestamp triggers
DROP TRIGGER IF EXISTS raspiMinuteTrigger;
CREATE TRIGGER raspiMinuteTrigger
  AFTER INSERT ON raspi_monitoring
  WHEN (SELECT COUNT(*) FROM raspiMinHelper) >= 18
  BEGIN
    UPDATE raspi_monitoring SET
                                temp = (SELECT avg(temp) FROM raspiMinHelper),
                                cpu_usage = (SELECT avg(cpu_usage) FROM raspiMinHelper),
                                storage_usage = (SELECT avg(storage_usage) FROM raspiMinHelper),
                                ram_usage = (SELECT avg(ram_usage) FROM raspiMinHelper)
    WHERE id == (SELECT min(id) FROM raspiMinHelper);
    DELETE FROM raspi_monitoring WHERE id > (SELECT min(id) FROM raspiMinHelper);
  END;

