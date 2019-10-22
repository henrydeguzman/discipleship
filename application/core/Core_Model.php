<?php

/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 11/24/2018
 * Time: 04:19 PM
 */

class Core_Model extends CI_Model
{
     private static $_rowcount = 0;
     private static $_offset = 0;
     const SECRETKEY = "&gqFee#e6ks7!@#$#(secure!)";
     public function __construct()
     {
          $this->load->library('tokenizer');
          parent::__construct();
     }
     public function query($sql, $onerow = false, $pagination = false)
     {
          $result = $this->db->query($sql);
          if (!$result) {
               return $this->db->error();
          }
          $data = $onerow ? $result->row() : $result->result();
          if ($pagination) {
               $dataarr['rows'] = $data;
               $count = $this->db->query("SELECT FOUND_ROWS() as x;");
               $dataarr['count'] = $count->row('x');
               $data = $dataarr;
          }
          return $data;
     }
     public function insert($table, $data, $returndata = null)
     {
          $result = $this->db->insert($table, $data);
          return array('querytype' => 'add', 'success' => $result, "lastid" => $this->db->insert_id(), "error" => $this->db->error('message'), "returndata" => $returndata);
     }
     public function updateinsert($table, $data, $whr = '')
     {
          $result = $this->update($table, $data, $whr);
          $affectedrows = $this->db->affected_rows();
          if ($affectedrows === -1 || $affectedrows === 0) {
               /** can't find record then it will inserted */
               $result = $this->insert($table, $data);
          }
          return $result;
     }
     public function update($table, $data, $whr = '')
     {
          $result = $this->db->update($table, $data, $whr);
          return array('querytype' => 'update', 'success' => $result, "affectedrows" => $this->db->affected_rows(), "error" => $this->db->error('message'));
     }
     public function delete($table, $whr = '')
     {
          $result = $this->db->delete($table, $whr);
          return array('querytype' => 'delete', 'success' => $result, "affectedrows" => $this->db->affected_rows(), "error" => $this->db->error('message'));
     }
     public static function setLimit()
     {
          self::$_rowcount = isset($_REQUEST['rowcount']) ? intval($_REQUEST['rowcount']) : 20;
          $rowcount = self::$_rowcount;
          $pageno = isset($_REQUEST['pageno']) ? intval($_REQUEST['pageno']) : 0;
          if ($pageno > 0) {
               self::$_offset = ($pageno * $rowcount) - $rowcount;
          } else {
               self::$_offset = isset($_REQUEST['rowoffset']) ? intval($_REQUEST['rowoffset']) : 0;
          }
          $rowoffset = self::$_offset < 0 ? 0 : self::$_offset;
          return $rowcount > 0 ? " limit $rowoffset,$rowcount" : "";
     }
     public function datetime()
     {
          return date("Y-m-d H:i:s");
     }
     public function encrypt($pass = null)
     {
          return sha1($pass);
     }
     public static function extendwhr($whr, $str, $con = null)
     {
          if (trim($whr) == '') {
               $whr .= ' WHERE ' . $str;
          } else {
               $whr .= " " . $con . " " . $str;
          }
          return $whr;
     }
     /** isset validation. if $data has value then it will append to array. commonly used in edit sql */
     public static function _isset($container, $POSTID, $variable = null)
     {
          if (isset($_POST[$POSTID])) {
               $container[$variable == null ? $POSTID : $variable] = $_POST[$POSTID];
          }
          return $container;
     }
     public function _secureid($id = null)
     {
          //1 day validity
          if (empty($id)) {
               return false;
          }
          return $this->tokenizer->create($id, self::SECRETKEY, 86400);
     }
     public function _getsecureid($token = null)
     {
          if (empty($token)) {
               return false;
          }
          $result = $this->tokenizer->validate($token, self::SECRETKEY);
          return $result['success'] ? $result['aud'] : false;
     }          
}
