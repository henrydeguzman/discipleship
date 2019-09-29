<?php
/**
 * Created by VS CODE.
 * User: Henrilics
 * Date: 19/29/2019
 * Time: 12:19 PM
 */
class Data_App_Set {
      public static function dataCurrentUser($type=null,$value=null){
         if(!empty($value)&&!empty($type)&&isset($_SESSION['user'])&&isset($_SESSION['user']->$type)){
              $_SESSION['user']->$type=$value;
         }
    }
}