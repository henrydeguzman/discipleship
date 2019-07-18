<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 16/07/2019
 * Time: 10:44 AM
 */
class Profile_Script {
    function vgleader(){
        return "SELECT DISTINCT a.vgid, COUNT(b.vgid) as memcnt FROM user_vg a 
                LEFT JOIN user_vg_users b ON a.vgid=b.vgid ";
    }
}