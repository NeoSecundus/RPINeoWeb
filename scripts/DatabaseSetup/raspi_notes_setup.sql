DROP TABLE IF EXISTS raspi_notes;
CREATE TABLE raspi_notes (
    title VARCHAR NOT NULL,
    'group' VARCHAR,
    'text' VARCHAR,
    create_date TIMESTAMP NOT NULL,
    clear_date TIMESTAMP,
    PRIMARY KEY (title, 'group')
);