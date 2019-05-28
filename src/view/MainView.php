<?php
if (!defined("BASEPATH")) die("No direct access allowed!");

class MainView {
    private $htmlPath;
    private $logger;
    
    public function __construct() {
        $this->htmlPath = BASEPATH . "/src/includes/html/";
        global $logger;
        $this->logger = $logger;
    }

    public function buildPage() {
        
        include_once($this->htmlPath . "header.html");
        include_once($this->htmlPath . "pages/home.html");
        include_once($this->htmlPath . "footer.html");
    }

    public function sendPage($pageName) {
        if (!is_file($this->htmlPath . "pages/" . $pageName)) {
            $this->logger->error("Page does not exist: '" . $this->htmlPath . "pages/" . $pageName . "'!");
            $pageName = "/404.html";
        }

        echo file_get_contents($this->htmlPath . "pages" . $pageName);
    }

    function sendResource($url) {
        $fileType = explode(".", $url);
        $fileType = $fileType[sizeof($fileType)-1];

        $contentHeader = "text/plain";

        foreach (array_keys(config['resourceTypes']) as $key) {
            if ($key == $fileType) {
                $contentHeader = config['resourceTypes'][$key];
                break;
            }
        }

        header('Content-Type: ' . $contentHeader);
        include(BASEPATH . $url);
    }
}