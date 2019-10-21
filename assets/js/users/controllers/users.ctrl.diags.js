/**
 * Created by Actino-Dev on 1/14/2019.
 */
victory
     .controller('users.ctrl.diags.inviteform', ['$scope', 'centralFctry', '$timeout', 'dialogs', 'tableService', function ($scope, centralFctry, $timeout, dialogs, tableService){
          var vm = this;
          vm.check={ischecking:false};
          vm.check.email = function (user) {               
               vm.check.ischecking = true;
               $timeout.cancel(user._timeout);
               user._timeout = $timeout(function () {
                    var get = centralFctry.postData({ url: 'fetch/users_set/checkemail', data: { email: user.email } });
                    if (get.$$state !== undefined) {
                         get.then(function (v) {
                              console.log(v.data);
                              vm.check.ischecking = false;
                              if (v.data.success) { user.valid = true; } else { user.valid = false }
                              vm.check.haserror = vm.checkhaserror();
                         });
                    }
               }, 1000);
          };
          $scope.users = [{ email: '', _checkemail: vm.check.email}];

          vm.add = function(){
               $scope.users.unshift({ email: '', _checkemail:vm.check.email});
          };
          vm.remove = function(key) {
               $scope.users.splice(key, 1);
          }
          vm.send = function(){
               if (vm.check.ischecking || vm.checkhaserror()){ console.log('checking or has error'); }                              
               var users = _.filter($scope.users, function(item) { return item.email!==''; });
               dialogs.asynchronous({
                    url: 'page/loadview?dir=pages&view=admin/dialogs/users/sendingemails.html',
                    model: 'fetch/users_set/invites', data: users,
                    onclosed: function (v) { 
                         console.log(v);
                         tableService.refresh('admin.users.tablelist');
                         $scope.$parent.close();
                         dialogs.notify('<table><tbody><tr>\n' +
                              '<td><i class="fa fa-check ng-scope" aria-hidden="true" style="font-size: 36px;padding-right: 10px;color: green;"></i></td>\n' +
                              '<td><span class="ng-scope">Sending Verification Emails is complete!</span></td>\n' +
                              '</tr></tbody></table>');
                              
                    }
               });
          };
          
          vm.checkhaserror = function() {
               var haserror = _.filter($scope.users, { valid: false});
               return haserror.length>0?true:false;
          };
          vm.save = function(){
               console.log($scope.form);
          }
     }])
     .controller('users.ctrl.diags.addfrm', ['$scope', 'Notification', 'notifValues', 'centralFctry', function ($scope, Notification, notifValues, centralFctry) {
          var vm = this;
          $scope.form = { type: 'add' };
          $scope.required = {};
          $scope.selected = { center: {} };
          if ($scope.data.userid !== undefined) {
               getdata($scope.data.userid);
          }
          vm.save = function (form) {
               var notiftype2 = 'added', notifmessage = 'Adding...';
               if (form.type === 'edit') {
                    notiftype2 = 'updated'; notifmessage = 'Updating...';
               }
               var notif = Notification(notifValues['processing']({ message: notifmessage }, $scope));
               var posted = centralFctry.postData({ url: 'fetch/users_set/create', data: form });
               if (posted.$$state !== undefined) {
                    return posted.then(function (v) {
                         if (v.data.success) {
                              $scope.$parent.close(v.data);
                              Notification(notifValues[notiftype2]($scope));
                         } else {
                              if (v.data.error !== undefined && v.data.error.code !== 0) { alert(JSON.stringify(v.data.error)); }
                              required();
                              notif.then(function (v) { v.kill(true); });
                         }
                    });
               }
          };
          function required() {
               $scope.required = { email: 'required', firstname: 'required', lastname: 'required', center: 'required' };
          }
          function getdata($userid) {
               var posted = centralFctry.getData({ url: 'fetch/users_get/getusers/' + $userid });
               if (posted.$$state !== undefined) {
                    posted.then(function (v) {
                         if (v.data !== undefined) {
                              $scope.form = {
                                   userid: v.data.userid,
                                   firstname: v.data.firstname,
                                   lastname: v.data.lastname,
                                   email: v.data.email
                              };
                              $scope.selected.center = { id: v.data.centerid, name: v.data.centername };
                         }
                    })
               }
          }
     }]);