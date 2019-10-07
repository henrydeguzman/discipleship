<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 05/10/2019
 * Time: 12:04 AM
 */
class Translation_set extends Core_Model {
    /** api/gateway?re=fetch/translation_set/setlist */
    public function setlist($filename=null){
        return $_GET;
        return 'yehey!';
        $filename='sample.php';
        $html_content='<?php ';
        $html_content.='return 1;';
       // if(file_exists($filename)){
            //Unknown script, need help!
            file_put_contents($filename, $html_content); //or how you want to do it
       // }
    }
}