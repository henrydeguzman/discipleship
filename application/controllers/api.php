<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 11/24/2018
 * Time: 04:07 PM
 */
class api extends Core_Controller {
    function gateway(){
        if (!array_key_exists('HTTP_ORIGIN', $_SERVER)) {
            $_SERVER['HTTP_ORIGIN'] = $_SERVER['SERVER_NAME'];
        }
        try {
            $this->load->model('api/request');
            echo $this->request->processAPI();
        } catch(Exception $e) {
            echo json_encode(Array('error' => $e->getMessage()));
        }
        return;
    }
    function getfile(){
        if (!array_key_exists('HTTP_ORIGIN', $_SERVER)) {
            $_SERVER['HTTP_ORIGIN'] = $_SERVER['SERVER_NAME'];
        }
        try {
            $this->load->model('api/getfile');
            echo $this->getfile->processFile();
        } catch(Exception $e) {
            echo json_encode(Array('error' => $e->getMessage()));
        }
        return;
    }
}