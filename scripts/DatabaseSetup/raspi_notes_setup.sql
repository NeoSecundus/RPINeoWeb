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

