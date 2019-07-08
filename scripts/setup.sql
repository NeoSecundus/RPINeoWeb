DROP TABLE IF EXISTS raspi_monitoring;

-- Every Capacity Item is in MB or MH
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
  SELECT * FROM raspi_monitoring WHERE id > strftime('%s', 'now')-3600 AND id < strftime('%s', 'now')-150;

DROP VIEW IF EXISTS raspiDayView;
CREATE VIEW raspiDayView AS
  SELECT * FROM raspi_monitoring WHERE id > strftime('%s', 'now')-86400 AND id < strftime('%s', 'now')-7200;

DROP VIEW IF EXISTS raspiWeekView;
CREATE VIEW raspiWeekView AS
  SELECT * FROM raspi_monitoring WHERE id > strftime('%s', 'now')-604800 AND id < strftime('%s', 'now')-172800;

DROP VIEW IF EXISTS raspiMonthView;
CREATE VIEW raspiMonthView AS
  SELECT * FROM raspi_monitoring WHERE id > strftime('%s', 'now')-2592000 AND id < strftime('%s', 'now')-172800;
--Views END

--Helpers
DROP VIEW IF EXISTS raspiMinHelper;
CREATE VIEW raspiMinHelper AS
  SELECT * FROM raspi_monitoring WHERE id > strftime('%s', 'now')-150 AND id < strftime('%s', 'now');

DROP VIEW IF EXISTS raspiHourHelper;
CREATE VIEW raspiHourHelper AS
  SELECT * FROM raspi_monitoring WHERE id > strftime('%s', 'now')-7400 AND id < strftime('%s', 'now')-3600;

DROP VIEW IF EXISTS raspiDayHelper;
CREATE VIEW raspiDayHelper AS
  SELECT * FROM raspi_monitoring WHERE id > strftime('%s', 'now')-176400 AND id < strftime('%s', 'now')-86400;
--Helpers END

--Timestamp triggers
DROP TRIGGER IF EXISTS raspiMinuteTrigger;
CREATE TRIGGER raspiMinuteTrigger
  AFTER INSERT ON raspi_monitoring
  WHEN (SELECT COUNT(*) FROM raspiMinHelper) >= 40
  BEGIN
    UPDATE raspi_monitoring SET
                                temp =  (SELECT avg(temp) FROM raspiMinHelper),
                                cpu_usage = (SELECT avg(cpu_usage) FROM raspiMinHelper),
                                storage_usage = (SELECT avg(storage_usage) FROM raspiMinHelper),
                                ram_usage = (SELECT avg(ram_usage) FROM raspiMinHelper)
    WHERE id == (SELECT min(id) FROM raspiMinHelper);
    DELETE FROM raspi_monitoring WHERE id > (SELECT min(id) FROM raspiMinHelper);
  END;

DROP TRIGGER IF EXISTS raspiHourTrigger;
CREATE TRIGGER raspiHourTrigger
  AFTER INSERT ON raspi_monitoring
  WHEN (SELECT COUNT(*) FROM raspiHourHelper) >= 30
  BEGIN
    UPDATE raspi_monitoring SET
                                temp =  (SELECT avg(temp) FROM raspiHourHelper),
                                cpu_usage = (SELECT avg(cpu_usage) FROM raspiHourHelper),
                                storage_usage = (SELECT avg(storage_usage) FROM raspiHourHelper),
                                ram_usage = (SELECT avg(ram_usage) FROM raspiHourHelper)
    WHERE id == (SELECT min(id) FROM raspiHourHelper);
    DELETE FROM raspi_monitoring WHERE id > (SELECT min(id) FROM raspiHourHelper) AND id < (SELECT max(id) FROM raspiHourHelper);
  END;

DROP TRIGGER IF EXISTS raspiDayTrigger;
CREATE TRIGGER raspiDayTrigger
  AFTER INSERT ON raspi_monitoring
  WHEN (SELECT COUNT(*) FROM raspiDayHelper) >= 24
  BEGIN
    UPDATE raspi_monitoring SET
                                temp =  (SELECT avg(temp) FROM raspiDayHelper),
                                cpu_usage = (SELECT avg(cpu_usage) FROM raspiDayHelper),
                                storage_usage = (SELECT avg(storage_usage) FROM raspiDayHelper),
                                ram_usage = (SELECT avg(ram_usage) FROM raspiDayHelper)
    WHERE id == (SELECT min(id) FROM raspiDayHelper);
    DELETE FROM raspi_monitoring WHERE id > (SELECT min(id) FROM raspiDayHelper) AND id < (SELECT max(id) FROM raspiDayHelper);
  END;

DROP TRIGGER IF EXISTS raspiDeleter;
CREATE TRIGGER raspiDeleter
  AFTER INSERT ON raspi_monitoring
  BEGIN
    DELETE FROM raspi_monitoring WHERE id < (SELECT min(id) FROM raspiMonthView);
  END;

