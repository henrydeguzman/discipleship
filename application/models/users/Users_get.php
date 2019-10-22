<?php

/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 1/14/2019
 * Time: 04:09 PM
 */
/*
 * Users profile
 * 1:member = done one 2 one
 * 2:non-member = during one 2 one
 * 3:admin = access administration pages
 * */
class Users_get extends Core_Model
{
     public function __construct()
     {
          $this->script->load('users_script');
     }
     public function tablelist()
     { /* api/gateway?re=fetch/users_get/tablelist */
          $whr = '';
          $toprow = false;
          if (isset($_POST['rowid'])) {
               $whr = self::extendwhr($whr, 'x.userid=' . $_POST['rowid'], "AND");
               $toprow = true;
          }
          $sql = $this->users_script->getusers() . $whr;
          return $this->query($sql, $toprow);
     }
     /** api/gateway?re=fetch/users_get/getusers */
     public function getusers($userid = null, $activefields = null)
     {
          //return 'd';
          $whr = 'WHERE x.churchid=' . $this->data_app_get->getchurch('churchid');
          $toponly = false;
          if ($userid != null) {
               $whr = self::extendwhr($whr, "x.userid=" . $userid, "AND");
               $toponly = true;
          }
          $sql = $this->users_script->getusers($activefields) . $whr;
          return $this->query($sql, $toponly);
     }
     /** api/gateway?re=fetch/users_get/getlist */
     /*public function getlist(){
        return $this->getusers(null);
    }*/
     /** api/gateway?re=fetch/users_get/novg */
     public function novg()
     {
          $result = array();
          $this->script->load('vg_script');
          $sql = $this->vg_script->getnovg();
          $result['rows'] = $this->query($sql);
          return $result;
     }
     /** api/gateway?re=fetch/users_get/notyetone2one */
     public function notyetone2one()
     {
          $whr = " WHERE xx.leaderid=0 ";
          $this->script->load('one2one_script');
          $sql = $this->one2one_script->getlist() . $whr;
          return $this->query($sql);
     }
     /** api/gateway?re=fetch/users_get/inviteslist */
     public function inviteslist()
     { 
          $sql = $this->users_script->inviteslist();
          return $this->query($sql);
     }
}
