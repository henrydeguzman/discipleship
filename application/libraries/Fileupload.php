<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 5/20/2019
 * Time: 4:30 PM
 */
class Fileupload {
    public function upload($_files=null,$type=null,$to='default',$encrypt=true){/* api/gateway?re=fetch/fileupload/upload */
        $allowed=$this->allowed($type);
        $filename= strtok($_files['name'],'?');
        $extension= strtolower(pathinfo($filename,PATHINFO_EXTENSION));
        $path=PATH_UPLOAD.$to;
        $basename= pathinfo($filename,PATHINFO_FILENAME);
        $defaultname=$basename;
        $response= new StdClass;
        if($this->checkPath($path, true)){
            if(in_array($_files['type'],$allowed["types"])){
                if($encrypt){
                    $basename=sha1(microtime());
                }
                $name= $basename.".".$extension;
                if(isset($_files->data)){//base64
                    $data= base64_decode(end((explode(';base64,',$_files['data']))));
                    //$this->createThumbnails($path,$basename,$_files['data']);
                    file_put_contents($path."/".$name, $data);
                }else{

                    move_uploaded_file($_files['tmp_name'], $path."/".$name);
                    //$this->createThumbnails($path,$basename,$_files['tmp_name']);
                }
                $response->url= URI_UPLOAD.$to;
                $response->result= true;
                $response->name= $name;
                $response->default_filename= $defaultname.".".$extension;
                $response->filetype= $_files['type'];
                $response->file= $_files;
                if($type==='image'){
                    $this->createThumbnails($path,$basename,PATH_UPLOAD.$to.$response->name);
                }
            } else {

                $response->result= false;
                $response->message= "invalid file format";
                $response->file= $_files;
            }
        }
        return $response;
    }
    public function createThumbnails($path,$basename,$data){
        /* creating thumbnails */
        $this->resize_image($path.'thumbnails',$basename,$data,120,120);
        $this->resize_image($path.'thumbnails',$basename,$data,64,64);
        $this->resize_image($path.'thumbnails',$basename,$data,32,32);
    }
    public static function load_image($filename, $type) {
        if( $type == IMAGETYPE_JPEG ) { $image = imagecreatefromjpeg($filename); }
        elseif( $type == IMAGETYPE_PNG ) { $image = imagecreatefrompng($filename); }
        elseif( $type == IMAGETYPE_GIF ) { $image = imagecreatefromgif($filename); } return $image;
    }
    /** Resize Image to Fixed Width While Maintaining the Aspect Ratio */
    private function resize_to_width($new_width, $file, $width, $height) {
        $resize_ratio = $new_width / $width;
        $new_height = $height * $resize_ratio;
        return self::resize_image($new_width, $new_height, $file, $width, $height);
    }
    /** Resize Image to Fixed Height While Maintaining the Aspect Ratio */
    private function resize_to_height($new_height, $file, $width, $height) {
        $ratio = $new_height / $height;
        $new_width = $width * $ratio;
        return self::resize_image($new_width, $new_height, $file, $width, $height);
    }
    private function resize_image($path,$basename,$file, $w, $h,$new_ext='jpeg') {
        list($width, $height, $type) = getimagesize($file);
        $old_image = self::load_image($file, $type);
        $new_image = imagecreatetruecolor($w, $h);
        imagecopyresampled($new_image, $old_image, 0, 0, 0, 0, $w, $h, $width, $height);
        $checkpath=$path.'/'.$w.'x'.$h.'/';
        if($this->checkPath($checkpath,true)){ return self::save_image($new_image,$checkpath.$basename.'.'.$new_ext, $new_ext, 75); }
    }
    private function save_image($new_image, $new_filename, $new_type='jpeg', $quality=80) {
        if( $new_type == 'jpeg' ) { $result=imagejpeg($new_image, $new_filename, $quality); }
        elseif( $new_type == 'png' ) { $result=imagepng($new_image, $new_filename); }
        elseif( $new_type == 'gif' ) { $result=imagegif($new_image, $new_filename); }
        return $result;
    }
    private function checkPath($path, $isCreate=false){
        if(file_exists($path)){
            return true;
        }else{
            if($isCreate){mkdir($path, 0777, true);return true;}else{return false;} }
    }
    public function allowed($type=null){
        /** api/gateway?re=fetch/fileupload/allowedExts */
        /** should be same on assets/js/main/services/values/main.values.js */
        $exts=array(
            "image"=>array(
                "icon"=>"fa-file-image-o",
                "types"=>array(
                    "image/jpeg","image/bmp","image/png"
                ),
                "extensions"=>array("jpg","png","bmp")
            )
        );
        if($type==='image'){ return $exts['image']; }
        else if($type==='all') { return $exts; }
    }
}