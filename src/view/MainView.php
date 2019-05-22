<?php
if (!defined("BASEPATH")) die("No direct access allowed!");

class MainView {
    private $htmlPath;
    
    public function __construct() {
        $this->htmlPath = BASEPATH . "/src/includes/html/";
    }

    public function buildPage($pageName) {
        global $logger;
        if (!is_file($this->htmlPath . "pages/" . $pageName)) {
            $logger->error("Page does not exist: '" . $this->htmlPath . "pages/" . $pageName . "'!");
            $pageName = "404.html";
        }
        
        include_once($this->htmlPath . "header.html");
        include_once($this->htmlPath . "pages/" . $pageName);
        include_once($this->htmlPath . "footer.html");
    }
}