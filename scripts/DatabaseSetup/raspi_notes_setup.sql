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
    clear_date TIMESTAMP,
    PRIMARY KEY (title, group_title, "user"),
    FOREIGN KEY (group_title, "user")
        REFERENCES raspi_note_groups(title, "user")
);

DROP VIEW IF EXISTS raspi_note_group_view;
CREATE VIEW raspi_note_group_view AS
    SELECT rng.title, rng."user", rng.color, COUNT(rn.title) AS "note_count"
    FROM raspi_notes rn
    INNER JOIN raspi_note_groups rng ON rn.group_title == rng.title
    GROUP BY rng.title;

