/**
 * Created by Actino-Dev on 2/12/2019.
 */
angular.module('MainFilters', [])
     .filter('fltr_asDate', function () { return function (input) { return new Date(input); } })
     .filter('fltr_zeroifnull', function () { return function (value) { return value == null ? 0 : value; } })
     .filter('fltr_asMinutesDiff', function () {
          return function (value) {
               /** as minutes */
               var hrs = value / 60;
               
               if (parseInt(hrs)===0) {
                    if( value == 0 ) { $str = "Just now"; }
                    else if( value == 1 ) { $str = value + " minute ago"; }
                    else { $str = value + " minutes ago"; }             
               } else {
                    var _hrs = parseInt(hrs);
                    if (_hrs > 1) { $str = _hrs + " hours ago"; }
                    else { $str = _hrs + " hour ago"; }                    
               }             
               return $str;
          }
     });