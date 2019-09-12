<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 06/07/2019
 * Time: 11:04 AM
 */
class Reports_Script {
    function getlist(){
        return "SELECT count(b.vgid) as vg_count,a.churchid FROM church a
                LEFT JOIN (SELECT churchid,vgid FROM user INNER JOIN user_vg ON user.userid=user_vg.leaderid) b ON b.churchid=a.churchid";
    }
}
