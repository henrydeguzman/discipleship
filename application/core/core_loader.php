<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 11/24/2018
 * Time: 08:31 PM
 */
class core_loader extends CI_Loader {
    public function jshtml_view($view, $vars = array(), $get = FALSE) {
        //  ensures leading /
        if ($view[0] != '/') $view = '' . $view;
        //  ensures extension
        $view .= ((strpos($view, ".", strlen($view)-5) === FALSE) ? '.php' : '');
        //  replaces \'s with /'s
        $view = str_replace('\\', '/', $view);

        if (!is_file($view)) if (is_file($_SERVER['DOCUMENT_ROOT'].$view)) $view = ($_SERVER['DOCUMENT_ROOT'].$view);
        echo $view;
      //  if (is_file($view)) {
            if (!empty($vars)) extract($vars);
            ob_start();
            include($view);
            $return = ob_get_clean();
            if (!$get) echo($return);
            return $return;
      //  }
        return show_404($view);
    }
}