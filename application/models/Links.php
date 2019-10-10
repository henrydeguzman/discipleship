<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 10/10/2019
 * Time: 12:41 PM
 */
class Links extends Core_Model {
    /** api/gateway?re=fetch/links/sidebar */
    public function __construct(){
        $this->load->model('page_model');
    }

    public function sidebar($parentid=0){
        $sql="SELECT a.pageid,a.code,a.name,a.description,a.icon,a.pageorder,a.collapsible,if(count(b.pageid)>0,1,0) as isparent
              FROM page a
              LEFT JOIN page b ON b.parentid=a.pageid
              WHERE a.parentid=".$parentid." GROUP BY a.pageid";
        $result=$this->query($sql);$collection=array();
        foreach ($result as $list){
            $pagecontrol=$this->page_model->control($list->code);
            if(!$pagecontrol){continue;}
            $list->name=$this->lang->line($list->name);
            $list->description=$this->lang->line($list->description);
            if($list->isparent>0){
                $list->childs=self::sidebar($list->pageid);
            }
            array_push($collection,$list);
        }
        return $collection;
    }
}