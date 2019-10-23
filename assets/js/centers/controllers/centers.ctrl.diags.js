/**
 * Created by Actino-Dev on 12/28/2018.
 */
victory
     .controller('centers.ctrl.diags.addadmin', ['$scope', 'searchEngine', 'centralFctry', function ($scope, searchEngine, centralFctry){
          var vm = this;
          $scope.form = { email: undefined, churchid: $scope.data.churchid, churchname: $scope.data.churchname};
          vm.invite = function() {              
               var users = _.chain(vm.email.users).pluck('userid').value();
              //  console.log($scope.form, users);return;
               var posted = centralFctry.postData({
                    url: 'fetch/centers_set/invite', data: { churchname: $scope.form.churchname, churchid: $scope.form.churchid, email: $scope.form.email, exist: users.length }                    
               });
               if (posted.$$state!==undefined){
                    return posted.then(function(v){
                         console.log(v.data);
                    });
               }
          };
          vm.email = { searching: false, error: false, alreadyexistverify: false};          
          vm.email.change = function(){
               // console.log($scope.form.email);
               vm.email.alreadyexist = undefined;
               vm.email.error = false;
               vm.email.searching = true;
               vm.email.users = [];
               searchEngine.search('fetch/email_validation/isexist', {
                    data: { email: $scope.form.email },
                    onSuccess: function (v) {
                         vm.email.searching = false;
                         if(v.data.success) {
                              vm.email.error = false;
                         }
                         else {
                              vm.email.error = true;
                              vm.email.errortext = v.data.info;
                              if (v.data.errorcode !== undefined && v.data.errorcode === 409) { /** Already exists email */
                                   vm.email.alreadyexist = true; vm.email.users = v.data.data;
                              } else { vm.email.alreadyexist = undefined; }
                         }
                         console.log(v.data);
                    }
               });
          };
     }])
     .controller('centers.ctrl.diags.addfrm', ['$scope', 'Notification', 'notifValues', 'centralFctry', function ($scope, Notification, notifValues, centralFctry) {
          var vm = this;
          $scope.form = { type: 'add' };
          $scope.required = {};
          if ($scope.data !== undefined && $scope.data.id !== undefined) {
               getdata($scope.data.id);
          }
          vm.save = function (form) {

               var notiftype2 = 'added', notifmessage = 'Adding...';
               if (form.type === 'edit') {
                    notiftype2 = 'updated'; notifmessage = 'Updating...';
               }
               var notif = Notification(notifValues['processing']({ message: notifmessage }, $scope));
               var posted = centralFctry.postData({ url: 'fetch/centers_set/create', data: form });
               if (posted.$$state !== undefined) {
                    return posted.then(function (v) {
                         if (v.data.success) {
                              $scope.$parent.close(v.data);
                              Notification(notifValues[notiftype2]($scope));
                         } else {
                              if (v.data.error !== undefined && v.data.error.code !== 0) { alert(JSON.stringify(v.data.error)); }
                              notif.then(function (v) { v.kill(true); });
                              required();
                         }
                    });
               }
          };
          function required() {
               $scope.required = { name: 'required', location: 'required' };
          }
          function getdata($churchid) {
               var posted = centralFctry.getData({
                    url: 'fetch/centers_get/getlist/' + $churchid
               });
               if (posted.$$state !== undefined) {
                    posted.then(function (v) {
                         if (v.data !== undefined) {
                              $scope.form = {
                                   id: v.data.id,
                                   name: v.data.name,
                                   location: v.data.location,
                                   type: 'edit'
                              };
                         }
                    });
               }
          }
     }]);