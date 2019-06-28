<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 12/28/2018
 * Time: 5:08 PM
 */
class Centers_Script {
    function getcenters(){
        return "SELECT SQL_CALC_FOUND_ROWS a.name, a.churchid as id, a.location FROM church a ";
    }
}