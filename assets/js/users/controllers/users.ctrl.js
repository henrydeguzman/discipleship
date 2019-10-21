/**
 * Created by Actino-Dev on 12/28/2018.
 */
victory
     .controller('admin.users.page.controller', ['$scope', 'dialogs', 'tableService', function ($scope, dialogs, tableService) {
          var vm = this;
          vm.form = {};
          vm.form.dialog = function (userid) {
               var title = 'Add user';
               if (userid !== undefined) { title = 'Edit user'; }
               dialogs.create({
                    title: title,
                    url: 'page/loadview?dir=pages&view=admin/dialogs/users/addform.html',
                    options: { backdrop: 'static', size: 'md' }, data: { userid: userid },
                    onclosed: function (v) {
                         if (v !== undefined) {
                              if (v.querytype === 'add') {
                                   tableService.refresh('admin.users.tablelist');
                              }
                              else if (v.querytype === 'update') {
                                   tableService.refreshrow('admin.users.tablelist', userid, 'userid');
                              }

                         }
                    }
               });
          };
          vm.invite = {};
          vm.invite.users = function (data) {
               dialogs.create({
                    title: '',
                    url: 'page/loadview?dir=pages&view=admin/dialogs/users/inviteusers.html',
                    options: { backdrop: 'static', size:'md' },
                    onclosed:function(){
                         
                    }
               })
          };
     }]);