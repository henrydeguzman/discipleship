<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 03/10/2019
 * Time: 8:53 PM
 */
defined('BASEPATH') OR exit('No direct script access allowed');
class Core_Lang extends CI_Lang {
    public $base_language = 'english';
    public function __construct()
    {
        parent::__construct();
    }
    /**
     * Load a language file, with fallback to english.
     *
     * @param	mixed	$langfile	Language file name
     * @param	string	$idiom		Language name (english, etc.)
     * @param	bool	$return		Whether to return the loaded array of translations
     * @param 	bool	$add_suffix	Whether to add suffix to $langfile
     * @param 	string	$alt_path	Alternative path to look for the language file
     *
     * @return	void|string[]	Array containing translations, if $return is set to TRUE
     */
    public function line($line, $data=FALSE){
        $value = isset($this->language[$line]) ? $this->language[$line] : FALSE;
        if($value===FALSE){return '{'.$line.'}';}
        if($data!==FALSE){
            $search=array();$replace=array();
            foreach ($data as $key=>$item){
                array_push($search,'{'.strtolower($key).'}');
                array_push($replace,$item);
            }
            $value=str_replace($search,$replace,$value);
        }
        return $value;
    }
    public function ss($langfile){
        return $this->is_loaded;
        return $this->is_loaded[$langfile];
    }
    public function load($langfile, $idiom = '', $return = FALSE, $add_suffix = TRUE, $alt_path = '')
    {
        if (is_array($langfile))
        {
            foreach ($langfile as $value)
            {
                $this->load($value, $idiom, $return, $add_suffix, $alt_path);
            }
            return;
        }

        $langfile = str_replace('.php', '', $langfile);
        if ($add_suffix === TRUE)
        {
            $langfile = preg_replace('/_lang$/', '', $langfile) . '_lang';
        }
        $langfile .= '.php';
        if (empty($idiom) OR ! preg_match('/^[a-z_-]+$/i', $idiom))
        {
            $config = & get_config();
            $idiom = empty($config['language']) ? $this->base_language : $config['language'];
        }
        if ($return === FALSE && isset($this->is_loaded[$langfile]) && $this->is_loaded[$langfile] === $idiom)
        {
            return;
        }
        // load the default language first, if necessary
        // only do this for the language files under system/
        $basepath = SYSDIR . 'language/' . $this->base_language . '/' . $langfile;
        if (($found = file_exists($basepath)) === TRUE)
        {
            include($basepath);
        }

        // Load the base file, so any others found can override it
        $basepath = BASEPATH . 'language/' . $idiom . '/' . $langfile;
        if (($found = file_exists($basepath)) === TRUE)
        {
            include($basepath);
        }
        // Do we have an alternative path to look in?

        if ($alt_path !== '')
        {
            $alt_path .= 'language/' . $idiom . '/' . $langfile;
            if (file_exists($alt_path))
            {
                include($alt_path);
                $found = TRUE;
            }
        } else
        {
            foreach (get_instance()->load->get_package_paths(TRUE) as $package_path)
            {
                $package_path .= 'language/' . $idiom . '/' . $langfile;
                if ($basepath !== $package_path && file_exists($package_path))
                {
                    include($package_path);
                    $found = TRUE;
                    break;
                }
            }
        }

        if ($found !== TRUE)
        {
            show_error('Unable to load the requested language file: language/' . $idiom . '/' . $langfile);
        }

        if (!isset($lang) OR ! is_array($lang))
        {
            log_message('error', 'Language file contains no data: language/' . $idiom . '/' . $langfile);
            if ($return === TRUE)
            {
                return array();
            }
            return;
        }

        if ($return === TRUE)
        {
            return $lang;
        }
        $this->is_loaded[$langfile] = $idiom;
        $this->language = array_merge($this->language, $lang);
        log_message('info', 'Language file loaded: language/' . $idiom . '/' . $langfile);
        return TRUE;
    }
}