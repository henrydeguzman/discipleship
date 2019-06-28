<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 5/19/2019
 * Time: 11:13 AM
 */
require_once 'api.class.php';
class getfile extends _API {
    protected  $user;
    public function __construct() {}
    protected function name($path){
        //echo $path;exit();
        $tmp_path=explode('/',$path);
        $filename=array_pop($tmp_path);
        $path=implode('/',$tmp_path);

        $tmp=explode('.', $filename);
        $ext= strtolower(end($tmp));
        $filepath= PATH_UPLOAD.$path;
        //echo $filepath;exit();
        if(file_exists($filepath)&& !empty($ext)){
            list($width, $height, $type) = getimagesize($filepath.'/'.$filename);
            if(IMAGETYPE_JPEG==$type||IMAGETYPE_PNG==$type||IMAGETYPE_GIF==$type){
                return $this->getImage($filepath, $filename, $type);
            }else{
                //return $this->getDocument($filename);
            }
        }else{
            header('HTTP/1.0 404 Not Found', true, 404);
            exit('File: '.$filepath.' not found!');
        }
    }
    private function getImage($filepath,$filename,$type){
        $size=isset($_GET['size'])?$_GET['size']:0;
        $thumbnail='';
        if(!empty($size)&&in_array($size,array("32","64","120"))) {
            $thumbnail="/thumbnails/".$size."x".$size;
            $filename= strtok($filename,'.');
            $filename=$filename.'.jpeg';
        }
        $filepath=$filepath.$thumbnail."/".$filename;
        $img_type= array(IMAGETYPE_JPEG => 'image/jpg',IMAGETYPE_GIF => 'image/gif',IMAGETYPE_PNG => 'image/png');
        header('Pragma: public');
        header('Cache-Control: max-age=86400, public');
        header('Expires: '. gmdate('D, d M Y H:i:s \G\M\T', time() + 86400));
        header('Content-Type: '. $img_type[$type]);
        header('Content-Disposition: inline; filename="'.$filename.'";');
        ob_clean();
        flush();
        readfile($filepath);
        exit;
    }
}