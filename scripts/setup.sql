DROP TABLE IF EXISTS raspi_monitoring;

-- Every Capacity Item is in MB or MH
CREATE TABLE raspi_monitoring (
  id timestamp PRIMARY KEY,
  temp FLOAT,
  cpu_usage FLOAT CHECK ( cpu_usage <= 1 ),
  storage_usage FLOAT CHECK ( storage_usage <= 1 ),
  ram_usage FLOAT CHECK ( ram_usage <= 1 )
);

