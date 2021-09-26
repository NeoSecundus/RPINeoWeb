DROP TABLE IF EXISTS wsData;
DROP TABLE IF EXISTS pump;

CREATE TABLE pump (
    id INTEGER PRIMARY KEY,
    host VARCHAR UNIQUE,
    port INTEGER NOT NULL CHECK(1024 < port < 65536),
    high_thresh FLOAT NOT NULL,
    low_thresh FLOAT NOT NULL CHECK(0 <= low_thresh <= high_thresh <= 1),
    tank_filled BOOLEAN NOT NULL,
    pump_status VARCHAR,
    watering_delay INTEGER NOT NULL,
    watering_time INTEGER NOT NULL
);

CREATE TABLE wsData (
    date TIMESTAMP NOT NULL,
    pump_id INTEGER NOT NULL REFERENCES pump(id) ON DELETE CASCADE,
    humidity FLOAT NOT NULL CHECK(0 <= humidity <= 1)
);

DROP TRIGGER IF EXISTS wsGarbageCollector;
CREATE TRIGGER wsGarbageCollector 
    AFTER INSERT ON wsData
    BEGIN
        DELETE FROM wsData 
        WHERE date < strftime('%s', 'now')-31536000;
    END;
