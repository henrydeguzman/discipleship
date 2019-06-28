<?php defined('BASEPATH') OR exit('No direct script access allowed'); ?>

ERROR - 2019-05-24 20:47:38 --> Severity: Notice --> Undefined index: user /Applications/XAMPP/xamppfiles/htdocs/discipleship/application/libraries/Data_app_get.php 17
ERROR - 2019-05-24 20:47:38 --> Severity: Notice --> Trying to get property of non-object /Applications/XAMPP/xamppfiles/htdocs/discipleship/application/libraries/Data_app_get.php 17
ERROR - 2019-05-24 20:47:38 --> Query error: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '' at line 1 - Invalid query: SELECT a.userid,a.victory_weekend,a.church_community,a.purple_book,a.making_disciples,a.empowering_leaders,a.leadership_113,a.baptized FROM user_journey a WHERE a.userid=
ERROR - 2019-05-24 20:47:39 --> Severity: Notice --> Undefined index: user /Applications/XAMPP/xamppfiles/htdocs/discipleship/application/libraries/Data_app_get.php 17
ERROR - 2019-05-24 20:47:39 --> Severity: Notice --> Trying to get property of non-object /Applications/XAMPP/xamppfiles/htdocs/discipleship/application/libraries/Data_app_get.php 17
ERROR - 2019-05-24 20:47:39 --> Query error: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '' at line 1 - Invalid query: SELECT a.vgid,b.dayoftheweek,b.time,b.venue FROM user_vg a LEFT JOIN user_vg_info b ON a.leaderid=b.leaderid WHERE a.leaderid=
ERROR - 2019-05-24 20:47:39 --> Severity: Notice --> Undefined index: user /Applications/XAMPP/xamppfiles/htdocs/discipleship/application/libraries/Data_app_get.php 17
ERROR - 2019-05-24 20:47:39 --> Severity: Notice --> Trying to get property of non-object /Applications/XAMPP/xamppfiles/htdocs/discipleship/application/libraries/Data_app_get.php 17
ERROR - 2019-05-24 20:47:39 --> Query error: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '' at line 2 - Invalid query: SELECT xx.vgid, xx.dateadded, x.userid as userid,x.firstname,x.lastname,x.lastname,concat(IFNULL(x.firstname,''),' ',IFNULL(x.middlename,''),' ',IFNULL(x.lastname,'')) as fullname,
                        x.phonenumber,a.personal_number,a.current_address as address,a.degree,b.churchid as centerid,bb.name as centername FROM user_vg xx LEFT JOIN user_vg_users uxx ON uxx.vgid=xx.vgid LEFT JOIN user x ON x.userid=uxx.userid LEFT JOIN user_info a ON x.userid=a.userid LEFT JOIN user_church b ON b.userid=x.userid LEFT JOIN church bb ON b.churchid=bb.churchid  WHERE xx.leaderid=
ERROR - 2019-05-24 20:47:39 --> Severity: Error --> Call to a member function result() on boolean /Applications/XAMPP/xamppfiles/htdocs/discipleship/application/core/core_Model.php 15
ERROR - 2019-05-24 20:47:39 --> Severity: Notice --> Undefined index: user /Applications/XAMPP/xamppfiles/htdocs/discipleship/application/libraries/Data_app_get.php 17
ERROR - 2019-05-24 20:47:39 --> Severity: Notice --> Trying to get property of non-object /Applications/XAMPP/xamppfiles/htdocs/discipleship/application/libraries/Data_app_get.php 17
ERROR - 2019-05-24 20:47:39 --> Query error: You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'AND b.profileid=2' at line 3 - Invalid query: SELECT xx.o2oid, xx.chapter, x.userid as userid,x.firstname,x.lastname,x.lastname,concat(IFNULL(x.firstname,''),' ',IFNULL(x.middlename,''),' ',IFNULL(x.lastname,'')) as fullname,
                        phonenumber,a.personal_number,a.current_address as address,a.degree,b.churchid as centerid,bb.name as centername,c.vgid, if(d.leaderid>0,'1','0') as hasvg, d.leaderid FROM user_one2one xx LEFT JOIN user x ON x.userid=xx.userid LEFT JOIN user_info a ON x.userid=a.userid LEFT JOIN user_church b ON b.userid=x.userid LEFT JOIN church bb ON b.churchid=bb.churchid LEFT JOIN user_vg_users c ON c.userid=x.userid 
                    LEFT JOIN user_vg d ON c.vgid=d.vgid WHERE xx.leaderid= AND b.profileid=2
ERROR - 2019-05-24 20:47:39 --> Severity: Error --> Call to a member function result() on boolean /Applications/XAMPP/xamppfiles/htdocs/discipleship/application/core/core_Model.php 15
ERROR - 2019-05-24 21:02:21 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 21:02:24 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 21:02:25 --> 404 Page Not Found: Page/assets
ERROR - 2019-05-24 21:02:31 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 21:04:23 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 21:16:27 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 21:20:34 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 21:20:34 --> Severity: Error --> Call to undefined method core_loader::tr() /Applications/XAMPP/xamppfiles/htdocs/discipleship/application/views/pages/settings/settings.html 7
ERROR - 2019-05-24 21:21:04 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 21:21:05 --> Severity: Error --> Call to undefined method core_loader::tr() /Applications/XAMPP/xamppfiles/htdocs/discipleship/application/views/jshtml/directives/tabset/tabset.html 23
ERROR - 2019-05-24 21:21:23 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 21:21:24 --> Severity: Error --> Call to undefined method core_loader::tr() /Applications/XAMPP/xamppfiles/htdocs/discipleship/application/views/jshtml/directives/tabset/tabset.html 23
ERROR - 2019-05-24 21:21:29 --> Severity: Error --> Call to undefined method core_loader::tr() /Applications/XAMPP/xamppfiles/htdocs/discipleship/application/views/jshtml/directives/tabset/tabset.html 23
ERROR - 2019-05-24 21:22:35 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 21:23:57 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 21:25:03 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 21:25:12 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 21:31:46 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 21:34:03 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 21:34:35 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 21:54:22 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 21:59:14 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 22:05:02 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 22:15:19 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 22:25:45 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 22:29:29 --> Severity: Error --> Call to undefined method One2one_script::getchapters() /Applications/XAMPP/xamppfiles/htdocs/discipleship/application/models/one2one/One2one_get.php 24
ERROR - 2019-05-24 23:23:48 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 23:24:03 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 23:24:44 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 23:24:44 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 23:24:45 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 23:25:25 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 23:26:43 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 23:30:40 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 23:30:53 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 23:31:08 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 23:33:29 --> 404 Page Not Found: Assets/bower_components
ERROR - 2019-05-24 23:33:35 --> 404 Page Not Found: Assets/bower_components
