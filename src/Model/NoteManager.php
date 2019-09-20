<?php
if (!defined("BASEPATH")) die("No direct access allowed!");

class NoteManager {
    private $TABLENAME = "raspi_notes";

    // TODO: Return json string containing either data or status.
    public static function getNotes(): string {
        $DATA = getPostData();
        // TODO: Filter by Groups and User!
    }

    public static function addNote(): string {
        $DATA = getPostData();
        // In the case of new groups being added, the group-names should always be sent back.
    }

    public static function deleteNote(): string {
        $DATA = getPostData();

    }

    public static function updateNote(): string {
        $DATA = getPostData();

    }
}