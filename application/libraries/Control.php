<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 2/4/2019
 * Time: 2:26 PM
 */
class Control {
    public static function fieldRelationalMapper($condition,$activefields=''){
        //$requestedfields= isset($_REQUEST['datafields'])?$_REQUEST['datafields']:$activefields; //commented: 2018-08-11
        $datafields= isset($_REQUEST['datafields'])?$_REQUEST['datafields']:null;
        $requestedfields= empty($datafields)||$datafields=='*'?$activefields:$datafields;
        $fldsarr=array();$joinarr=array();
        if(empty($requestedfields)||$requestedfields=='*'){ // if no posted datafields or ='*' include all available
            foreach($condition['onfields'] as $flds){
                if(trim($flds)!=''){array_push($fldsarr,$flds);}
            }
            foreach($condition['onjoins'] as $join){
                array_push($joinarr,$join);
            }
        }else{ // include posted datafields only as requested
            //$request= explode(",", $requestedfields); //commented: 2018-08-11
            $request= self::validateRequestFields($datafields,$activefields);
            foreach($condition['onfields'] as $key=>$value){
                $keyarr= explode(",", $key);
                foreach($keyarr as $fld){
                    if(substr($key,0,1)=='*'||in_array($fld,$request)){
                        if(trim($value)!=''){array_push($fldsarr,$value);} break;
                    }
                }
            }
            foreach($condition['onjoins'] as $key=>$value){
                $keyarr= explode(",", $key);
                foreach($keyarr as $fld){
                    if(substr($key,0,1)=='*'||in_array($fld,$request)){
                        array_push($joinarr,$value); break;
                    }
                }
            }
        }
        return array('fields'=>empty($fldsarr)?"CONNECTION_ID() as CONN_ID":implode(",", $fldsarr), 'joins'=>empty($joinarr)?"":implode(" ",$joinarr));
    }
    private static function validateRequestFields($datafields,$activefields){
        if((empty($datafields)||$datafields=='*') && (empty($activefields)||$activefields=='*')){ return [];
        }elseif(!empty($datafields) && $datafields!='*' && !empty($activefields) && $activefields!='*'){
            $datafields_array= explode(",",$datafields);
            $activefields_array= explode(",",$activefields); $validfields=[];
            foreach($datafields_array as $field){
                if(in_array($field,$activefields_array)){ $validfields[]=$field; }
            } return $validfields;
        }else{
            if(!empty($datafields) && $datafields!='*'){ return explode(",",$datafields); }
            if(!empty($activefields) && $activefields!='*'){ return explode(",",$activefields); }
        }
    }
}