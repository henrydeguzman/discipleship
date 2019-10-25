/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 19/08/2019
 * Time: 1:19 PM
 */
victory
     .controller('victoryweekend.ctrl.diags.createaccnts', ['$scope', function ($scope) {
          var vm = this;
     }])
     .controller('victory_weekend.ctrl.diags.adddates', ['$scope', 'Notification', 'centralFctry', 'tableService', 'notifValues', '$filter', 'genvarsValue', function ($scope, Notification, centralFctry, tableService, notifValues, $filter, genvarsValue) {
          var vm = this;
          $scope.curdate = $filter('date')(genvarsValue.curdate, genvarsValue.dateformat);
          vm.date = { format: 'MMM-dd-yyyy' };
          vm.date.save = function () {
               var notif = Notification(notifValues['processing']({ message: "Adding..." }, $scope)),
                    posted = centralFctry.postData({ url: 'fetch/weekend_set/setdate', data: { weekend_date: vm.date.value } });
               if (posted.$$state !== undefined) {
                    return posted.then(function (v) {
                         if (v.data.success) {
                              tableService.refresh('victoryweekend.dates');
                              Notification(notifValues['added']($scope));
                              $scope.$parent.close(v.data);
                         } else {
                              vm.date.validation = { "weekend_date": "required" };
                              notif.then(function (v) { v.kill(true); });
                         }
                    });
               }
          };
     }])
     .controller('victoryweekend.ctrl.diags.email', ['$scope', 'centralFctry', 'searchEngine', function ($scope, centralFctry, searchEngine) {
          var vm = this;
          $scope.form = { savetype: '' };

          if ($scope.data !== undefined && $scope.data.tr.id !== undefined) { $scope.form.id = $scope.data.tr.id; }
          vm.submit = function () {
               $scope.$parent.load.isloading=true;
               var posted = centralFctry.postData({ url: 'fetch/users_set/edit', data: $scope.form });
               if (posted.$$state !== undefined) {
                    return posted.then(function (v) {
                         console.log(v.data);
                         $scope.$parent.load.isloading = false;
                         if (v.data.success) {
                              $scope.$parent.close(v.data);
                         }
                    });
               }
          };
          vm.email = { error: false, errortext: '', searching: false, valid: false};
          vm.email.change = function() {
               vm.email.searching = true;
               vm.email.error = false;
               searchEngine.search('fetch/email_validation/isexist', {
                    data: { email: $scope.form.email },
                    onSuccess: function (v) {
                         vm.email.searching = false;                         
                         if(!v.data.success) {
                              vm.email.error = true;
                              vm.email.errortext = v.data.info;
                         }
                    }
               });
          }
     }]);