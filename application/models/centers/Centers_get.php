<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 1/14/2019
 * Time: 03:45 PM
 */
class Centers_get extends core_model {
    public function __construct() { $this->script->load('centers_script'); }
    public function tablelist(){ /* api/gateway?re=fetch/centers_get/tablelist */
        $whr='';$toprow=false;
        if(isset($_POST['search'])){
            $whr=self::extendwhr($whr,"a.name LIKE '%".$_POST['search']."%'","AND");
        }
        if(isset($_POST['rowid'])){
            $toprow=true;
            $whr=self::extendwhr($whr,'a.churchid='.$_POST['rowid'],"AND");
        }
        $sql=$this->centers_script->getcenters();
        $data['rows']=$this->query($sql.$whr.self::setLimit(),$toprow);
        $count= $this->query("SELECT FOUND_ROWS() as x;",true);
        $data['count']=$count->x;
        $data['whr']=$whr;
        return $data;
    }
    public function getlist($churchid=0){ /* api/gateway?re=fetch/centers_get/getlist/{$churchid} */
        $toprow=false;$whr='';
        if(!empty($churchid)){
            $whr="WHERE a.churchid=".$churchid;$toprow=true;
        }
        $sql=$this->centers_script->getcenters().$whr;
        return $this->query($sql,$toprow);
    }
}