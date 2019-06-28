<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>

ERROR - 2019-05-25 19:57:48 --> Query error: Unknown column 'x.photo' in 'field list' - Invalid query: SELECT SQL_CALC_FOUND_ROWS x.userid,x.firstname,x.lastname,x.lastname,concat(IFNULL(x.firstname,''),' ',IFNULL(x.middlename,''),' ',IFNULL(x.lastname,'')) as fullname,
         x.phonenumber,x.photo, x.email, a.personal_number,a.current_address as address,a.degree,b.churchid as centerid,bb.name as centername,c.vgid, if(d.leaderid>0,'1','0') as hasvg, d.leaderid 
        FROM user x LEFT JOIN user_info a ON x.userid=a.userid LEFT JOIN user_church b ON b.userid=x.userid LEFT JOIN church bb ON b.churchid=bb.churchid LEFT JOIN user_vg_users c ON c.userid=x.userid 
                    LEFT JOIN user_vg d ON c.vgid=d.vgid WHERE b.profileid=1
ERROR - 2019-05-25 19:57:48 --> Severity: Error --> Call to a member function result() on boolean /Applications/XAMPP/xamppfiles/htdocs/discipleship/application/core/core_Model.php 15
ERROR - 2019-05-25 19:57:52 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-25 19:58:00 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-25 19:58:00 --> Query error: Unknown column 'x.photo' in 'field list' - Invalid query: SELECT SQL_CALC_FOUND_ROWS x.userid,x.firstname,x.lastname,x.lastname,concat(IFNULL(x.firstname,''),' ',IFNULL(x.middlename,''),' ',IFNULL(x.lastname,'')) as fullname,
         x.phonenumber,x.photo, x.email, a.personal_number,a.current_address as address,a.degree,b.churchid as centerid,bb.name as centername,c.vgid, if(d.leaderid>0,'1','0') as hasvg, d.leaderid 
        FROM user x LEFT JOIN user_info a ON x.userid=a.userid LEFT JOIN user_church b ON b.userid=x.userid LEFT JOIN church bb ON b.churchid=bb.churchid LEFT JOIN user_vg_users c ON c.userid=x.userid 
                    LEFT JOIN user_vg d ON c.vgid=d.vgid WHERE b.profileid=1
ERROR - 2019-05-25 19:58:00 --> Severity: Error --> Call to a member function result() on boolean /Applications/XAMPP/xamppfiles/htdocs/discipleship/application/core/core_Model.php 15
ERROR - 2019-05-25 20:24:59 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-25 20:34:19 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-25 20:35:52 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-25 20:37:24 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-25 20:38:09 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-25 20:41:33 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-25 20:42:33 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-25 20:43:12 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-25 20:46:54 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-25 21:02:29 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-25 21:02:50 --> Query error: Unknown column 'x.photo' in 'field list' - Invalid query: SELECT SQL_CALC_FOUND_ROWS x.userid,x.firstname,x.lastname,x.lastname,concat(IFNULL(x.firstname,''),' ',IFNULL(x.middlename,''),' ',IFNULL(x.lastname,'')) as fullname,
         x.phonenumber,x.photo, x.email, b.churchid as centerid,bb.name as centername 
        FROM user x LEFT JOIN user_church b ON b.userid=x.userid LEFT JOIN church bb ON b.churchid=bb.churchid 
ERROR - 2019-05-25 21:02:50 --> Severity: Error --> Call to a member function result() on boolean /Applications/XAMPP/xamppfiles/htdocs/discipleship/application/core/core_Model.php 15
ERROR - 2019-05-25 21:10:06 --> Severity: Parsing Error --> syntax error, unexpected 'if' (T_IF) /Applications/XAMPP/xamppfiles/htdocs/discipleship/application/views/templates/user/footer.html 9
ERROR - 2019-05-25 21:10:18 --> Severity: Parsing Error --> syntax error, unexpected 'if' (T_IF) /Applications/XAMPP/xamppfiles/htdocs/discipleship/application/views/templates/user/footer.html 9
ERROR - 2019-05-25 21:10:19 --> Severity: Parsing Error --> syntax error, unexpected 'if' (T_IF) /Applications/XAMPP/xamppfiles/htdocs/discipleship/application/views/templates/user/footer.html 9
ERROR - 2019-05-25 21:10:19 --> Severity: Parsing Error --> syntax error, unexpected 'if' (T_IF) /Applications/XAMPP/xamppfiles/htdocs/discipleship/application/views/templates/user/footer.html 9
ERROR - 2019-05-25 21:10:19 --> Severity: Parsing Error --> syntax error, unexpected 'if' (T_IF) /Applications/XAMPP/xamppfiles/htdocs/discipleship/application/views/templates/user/footer.html 9
ERROR - 2019-05-25 21:10:19 --> Severity: Parsing Error --> syntax error, unexpected 'if' (T_IF) /Applications/XAMPP/xamppfiles/htdocs/discipleship/application/views/templates/user/footer.html 9
ERROR - 2019-05-25 21:10:19 --> Severity: Parsing Error --> syntax error, unexpected 'if' (T_IF) /Applications/XAMPP/xamppfiles/htdocs/discipleship/application/views/templates/user/footer.html 9
ERROR - 2019-05-25 21:10:20 --> Severity: Parsing Error --> syntax error, unexpected 'if' (T_IF) /Applications/XAMPP/xamppfiles/htdocs/discipleship/application/views/templates/user/footer.html 9
ERROR - 2019-05-25 21:10:46 --> 404 Page Not Found: Assets/bower_components
