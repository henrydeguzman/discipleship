/**
 * Created by Actino-Dev on 11/24/2018.
 */
angular.module('MainDirectives',[])
    .directive('gtHeaderNav',['pathValue','genvarsValue','centralFctry','$document',gtHeaderNav])
    .directive('gtAccordion',[gtAccordion])
    .directive('gtAccordionContent',['$timeout',gtAccordionContent])
    .directive('gtProfile',['pathValue','$timeout',gtProfile])
    .directive('gtDatepicker',['$filter','genvarsValue',gtDatepicker])
    .directive('gtTab',['$timeout',gtTab])
    .directive('gtTabset',['dialogs','centralFctry',gtTabset])
    .directive("fileread", [fileread])
    .directive('filereader',['$q',filereader])
    .directive('gtToggle',[gtToggle])
    .directive('stringToNumber', function() {return {require: 'ngModel',link: function(scope, element, attrs, ngModel) {ngModel.$parsers.push(function(value) {return '' + value;});ngModel.$formatters.push(function(value) {return parseFloat(value);});}};})
    .directive('gtAutoGrow',[gtAutoGrow])
    .directive('gtInputrequired',[gtInputrequired])
    .directive('clickAndDisable', function() { return { scope: { clickAndDisable: '&' }, link: function(scope, iElement, iAttrs) { iElement.bind('click', function() { iElement.prop('disabled',true); scope.clickAndDisable().then(function() { iElement.prop('disabled',false); }) }); } }; })
    .directive('gtCombobox',['centralFctry','glfnc','pathValue','$timeout',gtCombobox])
    .directive('gtTableTitle',[gtTableTitle])
    .directive('gtTableBtns',['$q',gtTableBtns])
    .directive('gtTableCol',['glfnc','$q','tableService',gtTableCol])
    .directive('gtTable',['centralFctry','tableService','pathValue','glfnc','$filter','$http','$q','inifrmtrValue',gtTable])
    .directive('gtTableSort',[gtTableSort])
    .directive('bindHtmlCompile',['$compile','$sce',bindHtmlCompile]);
function gtHeaderNav(pathValue,genvarsValue,centralFctry,$document){
    return {
        restrict:'E',templateUrl:'page/loadview?dir=jshtml&view=directives/header/nav.html',
        scope:true,link:function(scope,element,attrs,ctrl){
            scope.pathValue=pathValue;
            element.on('click', elementClick);
            $document.on('click', documentClick);
            function documentClick(e) { if(ctrl.user.show){ scope.$apply(function(){ if(ctrl.user.show){ctrl.user.show=false;} }); } }
            function elementClick(e) { e.stopPropagation(); }
            /* remove event handlers when directive is destroyed */
            scope.$on('$destroy', function () { element.off('click', elementClick); $document.off('click', documentClick); });
        },controller:function(){
            var vm=this;
            vm.userdata=genvarsValue.userdata();
            vm.user={show:false};
            vm.user.toggle=function(){
                vm.user.show?vm.user.show=false:vm.user.show=true;
            };
            vm.hidedrops=function(){
                vm.user.toggle(false);
            };
            vm.user.signout=function(){
                var posted=centralFctry.postData({ url:'fetch/users_connection/signout',data:{} });
                if(posted.$$state!==undefined){
                    return posted.then(function(v){
                        console.log(v.data);
                        if(v.data.success){
                            location.reload();
                        }
                    });
                }
            }
        },controllerAs:'gtHeaderNavCtrl'
    }
}
function gtAccordionContent($timeout){
    return {
        restrict:"E",require:"^gtAccordion",transclude:true,template:'<ng-transclude ng-show="false"></ng-transclude>',
        scope:{template:'@',active:'@'},
        link:function(scope,element,attrs,ctrl,transclude){
            console.log(ctrl);
            var data={};
            $timeout(function(){
                transclude(scope,function(clone){
                    if(scope.template===undefined){return;}
                    data.template=scope.template;
                    data.html=clone;
                    if(scope.active!==undefined){
                        data.loaded=true;
                        data.active=true;
                        ctrl.loadtemplate(data,ctrl.accords.c);
                    }
                    ctrl.accords.list[ctrl.accords.c]=data;
                    ctrl.accords.c++;
                })
            });
        },
        controller:function(){
        },controllerAs:''
    }
}
function gtAccordion(){
    return {
        restrict:'E',templateUrl:'page/loadview?dir=jshtml&view=directives/accordion/accordion.html',
        scope:{},link:function(){},transclude:true,controller:function(){
            var vm=this;
            vm.header={text:'Sample header'};
            vm.accords={list:[],c:0};
            vm.toggle=function(item){
                if(item.active){
                    item.active=false;
                }else{
                    item.active=true;
                }
                vm.loadtemplate(item);
            };
            vm.loadtemplate=function(item,$index){
                console.log(item);
                vm.accords.active=$index;
                item.loaded=true;
                item.loadtemplate=item.template;
            };
        },controllerAs:'gtAccordionCtrl'
    }
}
function gtProfile(pathValue,$timeout){
    return {
        restrict:'E',templateUrl:'page/loadview?dir=jshtml&view=directives/profile/profile.html',
        scope:{photo:'<',size:'@',name:'<',userid:'<'},link:function(){},controller:function($scope){
            var vm=this;
            vm.photo={size:0,class:'',show:false};
            if($scope.size==='28'){
                vm.photo.size='32';vm.photo.class='size-28';
            } else {
                vm.photo.size='32';vm.photo.class='size-28';
            }
            $scope.pathValue=pathValue;
            vm.viewprofile=function(){ window.open('#!/profile', '_blank'); };
            vm.hover=function(){
                vm.photo.timer=$timeout(function(){
                    vm.photo.show=true;
                },1000);
            };
            vm.leave=function(){
                $timeout.cancel(vm.photo.timer);
                vm.photo.show=false;
            };
            function getdata(){}
        },controllerAs:'gtProfileCtrl'
    }
}
function gtDatepicker($filter,genvarsValue){
    return {
        restrict:'E',
        templateUrl:'page/loadview?dir=jshtml&view=directives/datepicker/datepicker.html',
        scope:{ validationModel:"<",inputModel:'=',dt:'@',minDate:'@',maxDate:'@',gtOptions:'<',onChange:'&',format:'@',align:'@' },
        link:function($scope,element,attr,ctrl){
            if($scope.align==='center'||$scope.align==='right'){ ctrl.picker.align={'text-align':$scope.align}; }
            if($scope.gtOptions!==undefined){
                if($scope.gtOptions.date!==undefined){ $scope.inputModel=$scope.gtOptions.date; }
                if($scope.gtOptions.opts!==undefined){
                    if($scope.gtOptions.opts.minDate===undefined||$scope.gtOptions.opts.minDate===""){ $scope.gtOptions.opts.minDate=$scope.minDate; }
                    if($scope.gtOptions.opts.maxDate===undefined||$scope.gtOptions.opts.maxDate===""){ $scope.gtOptions.opts.maxDate=$scope.maxDate; }
                } else {
                    $scope.gtOptions.opts={};
                    if($scope.minDate!==undefined){ $scope.gtOptions.opts.minDate=$scope.minDate; }
                    if($scope.maxDate!==undefined){ $scope.gtOptions.opts.maxDate=$scope.maxDate; }
                }
            } else {
                $scope.gtOptions={opts:{}};
                if($scope.minDate!==undefined){ $scope.gtOptions.opts.minDate=$scope.minDate; }
                if($scope.maxDate!==undefined){ $scope.gtOptions.opts.maxDate=$scope.maxDate; }
            }
        },
        controller:function($scope,$attrs){
            var vm=this;
            $scope.dt=undefined;
            $scope.$watch('gtOptions.date',function(o,n){
                $scope.date=$scope.gtOptions.date;
            });
            vm.picker={show:false,format:genvarsValue.dateformat};
            vm.picker.toggle=function(){
                vm.picker.show?vm.picker.show=false:vm.picker.show=true;
            };
            if($scope.format!==undefined){
                vm.picker.format=$scope.format;
            }


            vm.picker.changed=function(dt){
                $scope.date=$filter('date')($scope.dt,vm.picker.format);
                if($attrs.inputModel!==undefined){
                    $scope.inputModel=$filter('date')($scope.dt,genvarsValue.dateformat);
                }
                if($scope.onChange()!==undefined){
                    $scope.onChange()($filter('date')($scope.dt,genvarsValue.dateformat),$scope.gtOptions);
                }
            };
        },controllerAs:'gtDatepickerCtrl'
    }
}
function gtTab($timeout){
    return {
        restrict:'E',template:'<ng-transclude ng-show="false"></ng-transclude>',transclude:true,
        require:'^gtTabset',
        scope:{template:'@',active:'@',as:'@',node:'<',ngif:'<'},
        link:function(scope,element,attrs,ctrl,transclude){
            var data={};
            $timeout(function(){
                transclude(scope,function(clone){
                    if(scope.template==undefined){return;}
                    data.html=clone;data.text=clone.text();
                    data.template=scope.template;
                    data.as=scope.as;
                    data.node=scope.node;
                    data.ngif=scope.ngif;
                    if(scope.active!==undefined){
                        data.loaded=true;
                        data.active=true;
                        ctrl.loadtemplate(data,ctrl.tabs.c);
                    }
                    ctrl.tabs.list[ctrl.tabs.c]=data;
                    ctrl.tabs.c++;
                });
            },0);
        },
        controller:function(){},controllerAs:''
    }
}
function gtTabset(dialogs,centralFctry){
    return {
        restrict:'E',templateUrl:'page/loadview?dir=jshtml&view=directives/tabset/tabset.html',transclude:true,
        scope:true,
        controller:function($scope,$attrs){
            var vm=this;
            vm.tabs={list:[],active:null,theme:'gen-tabset-theme-default',c:0,fit:false};
            vm.settings={visibility:false,template:'',show:false,style:{'width':'300px'}};
            vm.btns=[];
            var panelConfig=$scope.$eval($attrs.panelConfig);
            if(panelConfig!==undefined){
                vm.settings.visibility=true;
                if(panelConfig.width!==undefined){vm.settings.style={width:panelConfig.width}}
                if(panelConfig.template!==undefined&&vm.settings.show){vm.settings.template=panelConfig.template;}
            } else { vm.settings.show=false; }
            if($attrs.theme!==undefined&&$attrs.theme!==''){vm.tabs.theme='gen-tabset-theme-'+$attrs.theme;}
            if($attrs.fit!==undefined){ $attrs.fit=='true'?vm.tabs.fit=true:vm.tabs.fit=false; }
            vm.ctrl=$attrs.controller;
            vm.content='';
            vm.settings.toggle=function(){
                var fn=$scope.$eval($attrs.gtOnchange);
                if(fn!==undefined){ fn(undefined,undefined,'settings'); }
                if(vm.settings.show){
                    vm.settings.show=false;
                }else{
                    vm.settings.show=true;
                    if(panelConfig!==undefined){
                        if(panelConfig.template!==undefined){vm.settings.template=panelConfig.template;}
                    }
                }
            };
            vm.btnfn=function(type,e,item){

                if(type==='remove'){
                    e.stopPropagation();
                    var index=vm.tabs.list.indexOf(item);
                    if(confirm('Are you sure?')){
                        var posted=centralFctry.postData({ url:'app?api=angular_tabset::removetab', data:{pageid:item.pageid} });
                        if(posted.$$state!==undefined){
                            posted.then(function(v){
                                vm.tabs.list.splice(index, 1);
                            });
                        }
                    }
                }
                else if(type==='add'||type==='edit'){

                    var title='';
                    if(type==='add'){ title='Add tab'; } else if(type==='edit'){ title='Update tab';e.stopPropagation(); }
                    dialogs.create({
                        url:'mvs/app?fetch=directives/tabset/dialog/addtab.html',
                        title:title,options:{size:'md'},data:item,
                        onclosed:function(params,frm){
                            if(params!==undefined&&params.success){
                                if(type==='add'){
                                    vm.tabs.list.push(params);
                                } else if(type==='edit'){
                                    var index=vm.tabs.list.indexOf(item);
                                    vm.tabs.list[index].html=params.html;
                                    vm.tabs.list[index].title_en=params.title_en;
                                    vm.tabs.list[index].title_fr=params.title_fr;
                                    vm.tabs.list[index].desc_fr=params.desc_fr;
                                    vm.tabs.list[index].desc_en=params.desc_en;
                                }


                            }
                        }
                    });
                }
            };
            vm.loadtemplate=function(item,$index){
                vm.tabs.active=$index;
                item.loaded=true;
                item.active=true;
                item.loadtemplate=item.template;
                var fn=$scope.$eval($attrs.gtOnchange);
                if(fn!==undefined){ fn(item,$index,'tab'); }
                hideall($index);
            };
            function hideall(index){
                for(var x=0;x<vm.tabs.list.length;x++){
                    if(x!==index){
                        vm.tabs.list[x].active=false;
                    }
                }
            }
        },controllerAs:'gtTbsetCtrl'
    }
}
function fileread() {
    return {
        scope: {
            fileread: "<"
        },
        link: function (scope, element, attributes) {
            var vm=this;
            vm.files={callback:undefined};
            if(scope.fileread!==undefined){
                if(scope.fileread.callback!==undefined){vm.files.callback=scope.fileread.callback;}
                element.attr('accept',scope.fileread.accept);
            }
            element.bind("change", function (changeEvent) {
                scope.$apply(function () {
                    var form = new FormData();
                    // or all selected files:
                    scope.fileread = changeEvent.target.files[0];
                    if(vm.files.callback!==undefined&&typeof(vm.files.callback)==='function'){ vm.files.callback(changeEvent.target.files[0]); }
                });
            });
        }
    }
}
function filereader($q){
    /* filereader='callback function' */
    var slice = Array.prototype.slice;
    return { restrict: 'A', require: '?ngModel',
        scope:{filereader:'<'},
        link: function(scope, element, attrs, ngModel) {
            if (!ngModel) return;
            var vm=this;
            vm.files={opts:{continuous:false},callback:undefined,model:[]};
            if(scope.filereader!==undefined){
                if(scope.filereader.callback!==undefined){vm.files.callback=scope.filereader.callback;}
                if(scope.filereader.continuous!==undefined){vm.files.continuous=scope.filereader.continuous;}
                if(scope.filereader.format!==undefined){vm.files.format=scope.filereader.format;}else{vm.files.format=undefined;}
                element.attr('accept',scope.filereader.accept);
            }
            ngModel.$render = function(a) {if(ngModel.$viewValue!==undefined){vm.files.model=ngModel.$viewValue;}};
            element.bind('change', function(e) {
                var element = e.target;
                //var onChangeHandler = scope.$eval(vm.files.callback);
                $q.all(slice.call(element.files, 0).map(readFile))
                    .then(function(values) {
                        if (element.multiple){
                            if(!vm.files.continuous){
                                if(vm.files.format==='standard'){ var files=[]; for(var x=0;x<values.length;x++){ files.push({file:values[x],title:''}); } vm.files.model=files; } else { vm.files.model=values; }
                            }
                            else{
                                if(vm.files.model.length>0){
                                    for(var x=0;x<values.length;x++){ if(vm.files.format==='standard'){ vm.files.model.push({file:values[x],title:''}); } else { vm.files.model.push(values[x]); } }
                                } else {
                                    if(vm.files.format==='standard'){ var files=[]; for(var x=0;x<values.length;x++){ files.push({file:values[x],title:''}); } vm.files.model=files; }
                                    else { vm.files.model=values; }
                                }
                            }
                            ngModel.$setViewValue(vm.files.model);
                            if(vm.files.callback!==undefined&&typeof(vm.files.callback)==='function'){ vm.files.callback(values); }
                        }
                        else { ngModel.$setViewValue(values.length ? values[0] : null);
                            if(vm.files.callback!==undefined&&typeof(vm.files.callback)==='function'){ vm.files.callback(values[0]); }
                        }
                    });

                function readFile(file) {
                    var deferred = $q.defer();
                    var reader = new FileReader();
                    reader.onload = function(e) {
                        deferred.resolve({"data":e.target.result,"name":file.name,"type":file.type,"size":file.size});
                    };
                    reader.onerror = function(e) { deferred.reject(e); };
                    reader.readAsDataURL(file);

                    return deferred.promise;
                }

            });
        }
    };
}
function gtToggle(){
    return {
        restrict:'E',templateUrl:'page/loadview?dir=jshtml&view=directives/button/toggle.html',
        scope:{inputModel:'=',node:'<',callback:'&'},link:function(){},
        controller:function($scope){
            var vm=this;
            vm.switch=function(){
                $scope.inputModel>'0'?$scope.inputModel='0':$scope.inputModel='1';
                if($scope.callback()!==undefined){ $scope.callback()($scope.inputModel,$scope.node); }
            };
        },controllerAs:'gtbtnCtrl'
    }
}
function gtAutoGrow(){
    return function(scope, element, attr){
        var minHeight = element[0].offsetHeight,paddingLeft = element.css('paddingLeft'),paddingRight = element.css('paddingRight');
        if(attr.gtAutoGrow!==''){ minHeight=attr.gtAutoGrow; }
        var $shadow = angular.element('<div></div>').css({position: 'absolute', top: -10000, left: -10000,width: element[0].offsetWidth - parseInt(paddingLeft || 0) - parseInt(paddingRight || 0),fontSize: element.css('fontSize'), fontFamily: element.css('fontFamily'), lineHeight: element.css('lineHeight'), resize:'none'});
        angular.element(document.body).append($shadow);
        var update = function() {
            var times = function(string, number) { for (var i = 0, r = ''; i < number; i++) { r += string; } return r; };
            var val = element.val().replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;').replace(/\n$/, '<br/>&nbsp;').replace(/\n/g, '<br/>').replace(/\s{2,}/g, function(space) { return times('&nbsp;', space.length - 1) + ' ' });
            $shadow.html(val);
            element.css('height', Math.max($shadow[0].offsetHeight + 10 /* the "threshold" */, minHeight) + 'px').css('overflow-y','hidden');
        }; element.bind('keyup keydown keypress change', update);update();
    }
}
function gtInputrequired(){
    /* help to tell the user to all required input by turning the input into red borders
     * sample: gt-inputrequired='required' */
    return {
        restrict:'A',scope:{ gtInputrequired:'<',bindModel:'=ngModel' }, link:function(scope,element,attr){
            scope.$watch('gtInputrequired',function(n,o){ apply(n,element); });
            scope.$watch('bindModel',function(n){ apply(scope.gtInputrequired,element); });
            function apply(istrue,e){ if(istrue==undefined||istrue==''){ return;}
                if(istrue=='required'&&(e.val()==null||e.val()==undefined||e.val()=='')){ e.addClass('required'); }
                else { e.removeClass('required'); }
            }
        }
    }
}
function gtCombobox(centralFctry,glfnc,pathValue,$timeout){
    var instance = [];
    return {
        restrict:'E',templateUrl:'page/loadview?dir=jshtml&view=directives/combobox/combobox.html',
        scope:{type:'@',inputModel:'=?',model:'@',json:'@',multi:'@',validationModel:'<',selected:'<',isEditable:'<',callback:'&',node:'=',islink:'@',reloadlist:'@'},
        link:function(scope){ instance.push(scope);scope.boxes=instance;scope.pathValue=pathValue; },
        controller:function($scope,$attrs){
            var vm=this,isMulti=false;
            vm.validation={};
            if($scope.selected===undefined){
                $scope.selected={disabled:false}
            }
            $scope.$watch("validationModel",function(n,v){
                if(n!==v){ vm.validation=$scope.validationModel; }
            });
            if($scope.isEditable==undefined){$scope.isEditable=true;}
            if($attrs.multi!==undefined){isMulti=true}
            $scope.isMulti=isMulti;
            vm.list={users:{show:false},common:{show:false},multidata:[],show:false,isMulti:isMulti};
            $scope.$watch("selected.id", function (n, o) {
                if(isMulti){
                    if($scope.inputModel===undefined){$scope.inputModel={combo_identifier:'internal'};}
                    $scope.inputModel.combo_id=n;
                    //$scope.inputModel.combo_identifier='internal';
                }else{
                    $scope.inputModel=n;
                }
            });
            vm.input=function(){
                closeothers();
                if(isMulti){
                    if(glfnc.isEmpty(vm.list.multidata)||($scope.reloadlist!==undefined&&$scope.reloadlist=='true')&&vm.list.show==false){ getData(); }
                    else { vm.list.show?vm.list.show=false:vm.list.show=true; }
                }
                else{
                    if(glfnc.isEmpty(vm.list[$scope.type].data)||($scope.reloadlist!==undefined&&$scope.reloadlist=='true')&&vm.list.show==false){ getData($scope.type); }
                    else { vm.list.show?vm.list.show=false:vm.list.show=true; }
                }
            };
            if($attrs.node!==undefined){
                getData($scope.type,false);
            }
            vm.select=function($event,item,multidata){
                var name='',type=$scope.type;
                if(isMulti){ type=multidata.type;$scope.type=type; }
                if($attrs.inputModel!==undefined){
                    /*
                     * comment the direct set of value to inputModel because we already have watch function on selected.id that will set the value of inputModel
                     * */
                    if(isMulti){
                        //if($scope.inputModel===undefined){$scope.inputModel={};}
                        if(type==="users"){
                            //$scope.inputModel.combo_id=item.userid;
                            $scope.selected.id=item.userid;
                        }
                        else {
                            $scope.selected.id=item.id;
                            //$scope.inputModel.combo_id=item.id;
                        }
                        $scope.inputModel.combo_identifier=multidata.identifier;
                    }else{
                        if($scope.type==='users'){
                            //$scope.inputModel=item.userid;
                            $scope.selected.id=item.userid;
                        }
                        else {
                            //$scope.inputModel=item.id;
                            $scope.selected.id=item.id;
                        }
                    }
                }
                if(type==='users'){
                    $scope.selected.photo=item.photo;
                    $scope.selected.name=item.fullname;
                } else {
                    $scope.selected.name=item.name;
                }
                vm.list.show=false;
                if($scope.callback()!==undefined){
                    $scope.callback()(item);
                }
            };
            function closeothers(){
                for(var x=0;x<$scope.boxes.length;x++){
                    if($scope.$id!==$scope.boxes[x].$id){$scope.boxes[x].gtcmbboxCtrl.close();}
                }
            }
            function getData(type,isshow){
                var json='';
                if(isMulti){
                    if($scope.json!==undefined){json=$scope.json;}else{json='page/loadview?dir=jshtml&view=directives/combobox/multi/multi.json'}
                } else {
                    if(type==="users"){ json="page/loadview?dir=jshtml&view=directives/combobox/types/users.json"; }
                    else if(type==="common"){ if($scope.json!==undefined){ json=$scope.json; } else { json='page/loadview?dir=jshtml&view=directives/combobox/types/common.json';} }
                }

                var response=centralFctry.getData({ url:$scope.model, json:json });
                if(response.$$state!==undefined){
                    response.then(function(v){
                        if(isMulti){
                            vm.list.multidata=v.data;
                        }else{ vm.list[type].data=v.data; }


                        if($attrs.node!==undefined){
                            $scope.node=v.data;
                        }
                        if(isshow===undefined){ vm.list.show=true; } else { vm.list.show=isshow; }
                    });
                }
            }
            vm.close=function(){ vm.list.show=false; }
        },controllerAs:"gtcmbboxCtrl"
    }
}
function gtTableTitle(){
    return {
        restrict:'E',transclude:true,require:"^gtTable",
        link:function(scope,element,attr,ctrl,transclude){
            transclude(scope, function(clone) {
                ctrl.headertitle(clone);
            });
        }
    }
}
function gtTableBtns($q){
    var i="";
    return {
        restrict:'E',require:'^gtTable',replace:true,template:'<div class="_tbl-btns" style="display:none;"></div>',
        scope:{action:'@',gtclick:'&?'},
        link:function(scope,element,attr,ctrl){
            if(scope.action==='add'){i='fa fa-plus';}
            ctrl.table.header.btns.push({i:i,onclick:scope.gtclick});
        }
    }
}
function gtTableSort(){
    var instance=[];
    return {
        restrict:'E',require:'^gtTable',templateUrl:'page/loadview?dir=jshtml&view=directives/table/tbl_sort/tbl_sort.html',
        scope:{callback:'&',field:'<'},
        link:function(scope){
            instance.push(scope);
            scope.boxes=instance;
        },
        controller:function($scope){
            var vm=this;
            vm.list={show:false};
            vm.list.toggle=function(){ if(vm.list.show){vm.list.show=false;}else{ vm.list.show=true;closeothers(); } };
            vm.list.sort=function(type,field){
                if($scope.callback()!==undefined){ $scope.callback()(type,field); }
                vm.list.show=false;
            };
            vm.closeothers=closeothers;
            function closeothers(){ for(var x=0;x<$scope.boxes.length;x++){ if($scope.$id!==$scope.boxes[x].$id){$scope.boxes[x].gtTblSortCtrl.list.close();} } }
            vm.list.close=function(){ vm.list.show=false; };
        },controllerAs:'gtTblSortCtrl'
    }
}
function gtTableCol(glfnc,$q,tableService){
    return {
        restrict:'E',templateUrl:'page/loadview?dir=jshtml&view=directives/table/cols.html',transclude:true,
        require:"^gtTable",
        scope:{field:'@',format:'@',gtclick:'&?',addrow:'@',textAlign:'@',addrowStyle:'<',tdStyle:'<',dropdown:'@',parent:'@',accessRights:'<',colIf:'<',context:'@',contextfn:'&'},
        link:function(scope, element, attr, ctrl,transclude){
            scope.th_index=ctrl.column.count;
            ctrl.column.count++;
            if(scope.textAlign===undefined){scope.textAlign='left';}
            /* ctrl.response.hiddencols; temporary removed */
            $q.all([ctrl.response.content,ctrl.response.formatter]).then(function(a){
                tableService.cols_th('tblcol',ctrl,scope,transclude,organize);/* October 9, 2018 = function to service _apply */
                if(ctrl.column.settings.list===undefined){ /* for not dynamic only */
                    organize(ctrl);
                }
                ctrl.column.list.push({_apply:_apply});/* only for not dynamic because of scope and attr */
            });
            function organize(c){
                for(var x=0;x<c.table.tr.length;x++){ c.table.tr[x]['td'].push(_apply(c,x)); }
                c.addrow.ncols++;
            }
            function _apply(c,x,params){
                /* October 9, 2018 = function to service _apply */
                return tableService.cols_apply(c,x,params,scope,attr,scope.th_index);
                /* October 9, 2018 = function to service _apply */
            }
            function updaterow(c,index){
                c.table.tr[index]['td'].push(_apply(c,index)); c.addrow.ncols++;
            }
        },
        controller:function($scope){
            var vm=this;
            vm.sample='1';

        },controllerAs:'gtTblClCtrl'
    }
}
function gtTable(centralFctry,tableService,pathValue,glfnc,$filter,$http,$q,inifrmtrValue){
    return {
        restrict:'E',transclude:true,templateUrl:'page/loadview?dir=jshtml&view=directives/table/table.html', scope:true,
        link:function(scope, element, attr, controller){
            scope.pathValue=pathValue;
            if(attr.id!==undefined){ var modal={id:attr.id,refresh:controller.refresh,refreshrow:controller.refreshrow}; tableService.add(modal); }
            controller.getData('content');controller.getData('formatter');
            var cols=scope.$eval(attr.columns);
            if(attr.columns!==undefined&&typeof(cols)==='object') {
                controller.column.settings=cols;
                if(attr.format!==undefined){ controller.column.setlistformat(attr.format); }
            }
        },
        controller:function($scope,$attrs,$element){
            var vm=this,tblformatter={};
            vm.table={tr:[],export:{show:false,data:[]},td:{data:[],show:false},data:[],refreshed:1,valid:false,count:0,header:{btns:[]},pagination:{offset:0},settings:{sort:undefined,search:undefined}};
            $scope.header={show:true,style:{}};
            if($attrs.headerstyle!==undefined){$scope.header.style=$scope.$eval($attrs.headerstyle);}
            if($attrs.tablestyle!==undefined){$scope.tablestyle=$scope.$eval($attrs.tablestyle);}

            $scope.content={headerstyle:{},contentstyle:{}};
            if($attrs.header!==undefined&&$attrs.header!==''){
                $scope.header.show=$attrs.header;
            }
            vm.headertitle=function(html){ $scope.header.title=html; };
            /* enabled right click on generic table */
            vm.contextmenu={show:false,model:$attrs.contextmodel};
            vm.contextmenu.rclick=function(e,tr,td){
                /* assign context fn */
                vm.table.contextFn=td.contextfn;
                /* end */
                vm.contextmenu.node=tr;
                vm.contextmenu.e=e;
                var params=angular.copy(tr);
                getData('context',params);
                params['cb']=cb;
            };
            function cb(){
                if(vm.contextmenu.show===true){
                    vm.contextmenu.show=1;
                }else{ vm.contextmenu.show=true; }
            }
            /* end */
            vm.table.export.submit=function(type){
                var datenow=$filter('date')(new Date(), 'yyyy_MM_dd'), elm=angular.element($element),elemname=elm.attr('name'), table=elm.find('.gen-table-content').children(), th=table.find('thead tr:first th:visible'); if(elemname===undefined){elemname='file';}
                vm.table.export.response=centralFctry.postData({url:$attrs.model,data:{export:'true'}});
                if(vm.table.export.response.$$state!==undefined){
                    vm.table.export.response.then(function(v){
                        if(v.data.rows!==undefined){ vm.table.export.data=v.data.rows; vm.table.export.datalength=v.data.count; }else{ vm.table.export.data=v.data;vm.table.export.datalength=v.data.length; }
                        switch (type){
                            case 'word': case 'excel':
                            var html='<table%20border=1><thead><tr>',fields=[],href='',fname='';
                            for(var x=0;x<th.length;x++){ var clone=angular.element(th[x]).clone(), _th=encodeURI(glfnc.trim(clone.find('span').text())), fld=clone.attr('field'); if(_th!==''&&fld!==''){ fields.push(fld); html+='<th>'+_th+'</th>'; } }
                            html+='</tr></thead><tbody>';
                            for(var y=0;y<vm.table.export.datalength;y++){
                                var tds='';
                                for(var z=0;z<fields.length;z++){ var data=encodeURI(vm.table.export.data[y][fields[z]]); tds+='<td>'+data+'</td>'; } html+='<tr>'+tds+'</tr>'; }
                            html+='</tbody></table>';
                            if(type==='word'){ href='data:application/msword'; fname=elemname+'_export_'+datenow+'.doc'; } else if(type==='excel'){ href='data:application/vnd.ms-excel'; fname=elemname+'_export_'+datenow+'.xls'; }else{return;} var a=document.createElement('a'); a.innerHTML="Export";a.href=href+','+html; a.target='_blank';a.download=fname; document.body.appendChild(a);a.click(); break;
                            case 'pdf':
                                $scope.plugin={pdf:{_1:$http({method:'GET',url:'js/jspdf.min.js',cache:true}),_2:$http({method:'GET',url:'js/jspdf.plugin.autotable.src.js',cache:true})}};
                                $q.all([$scope.plugin.pdf._1,$scope.plugin.pdf._2]).then(function(values){
                                    eval(values[0].data); eval(values[1].data); var columns=[];
                                    for(var x=0;x<th.length;x++){ var clone=angular.element(th[x]).clone(), _th=glfnc.trim(clone.find('span').text()), fld=clone.attr('field'); if(_th!==''&&fld!==''){ columns.push({title:_th,dataKey:fld}); } }
                                    var doc = new jsPDF('l','pt','legal'); doc.autoTable(columns,vm.table.export.data,{theme:'actino',styles:{overflow:'linebreak',cellPadding:4},headerStyles:{halign:'center'},bodyStyles:{fontSize:8,valign:'top'}}); doc.save(elemname+'_export_'+datenow+'.pdf'); }); break;
                        }

                    });
                }
                vm.table.export.show=false;
            };
            vm.table.export.toggle=function(){
                vm.table.export.show?vm.table.export.show=false:vm.table.export.show=true;
                vm.table.td.show=false;
            };
            vm.settings={};
            vm.settings.sort=function(type,field){
                vm.table.valid=true;
                vm.table.settings.sort=field+' '+type;
                getData('content');
            };
            vm.settings.search=function(){
                vm.table.valid=true;
                getData('content');
            };
            vm.table.td.toggle=function(){
                vm.table.export.show=false;
                vm.table.td.show?vm.table.td.show=false:vm.table.td.show=true;
            };
            vm.column={list:[],settings:{},count:0};
            vm.column.check=function(item){ vm.column.hiddencolumns!==undefined&&vm.column.hiddencolumns!==null&&vm.column.hiddencolumns.indexOf(item.field)!==-1?item.show=false:item.show=true; };
            vm.column.btn=function(item){
                var hiddencols=[], hiddencols_raw=_.filter(vm.table.td.data,function(i){if(!i.show){hiddencols.push(i.field);return true;} else {return false;}}),
                    data={table:$attrs.id,settype:item.id,hiddencols:hiddencols.join(';')};
                vm.table.td.show=false;
                var posted=centralFctry.postData({url:'global?api=setup/table::sethiddencolumns',data:data});
                if(posted.$$state!==undefined){ posted.then(function(v){ console.log(v.data); }); }
            };
            vm.column.setlistformat=function(v){vm.column.getlistformat=v};
            vm.response={};
            vm.listener={};
            var toggle=false;
            vm.tdkick=function(td,tr,inifrmtr){
                if(typeof(td)==='string'&&td==='th'){
                    toggle?toggle=false:toggle=true;
                    if(tr.onclick!==undefined){ tr.onclick(tr,{id:vm.id,model:$attrs.model,toggle:toggle}); }
                }
                else if(inifrmtr in $scope.formatter.inifrmtr){ $scope.formatter.frmtrkik[inifrmtr](td,tr); }
                else {
                    if(td.onclick!==undefined&&td.onclick()!==undefined){
                        var _tr=angular.copy(tr);
                        _tr.td=""; td.onclick()(td,_tr);
                    } else if(glfnc.trim(td._dropdown)!==''&&glfnc.trim(td._dropdown)!==undefined){
                        if(!td._dropdown.appended){
                            td.value=td.value+'<gt-table-drpdwn settings="td._dropdown" bind-model="{{gtTblCtrl.bindModel}}" node="tr" listener="td._dropdown.listener"></gt-table-drpdwn>';td._dropdown.appended=true;
                        }else{ td._dropdown.listener++; }
                    }
                }
            };
            vm.refresh=function(modelext){
                vm.table.valid=true;
                getData('content',{modelext:modelext});
            };
            vm.refreshrow=function(uniqueid,idname){
                /* if this not working. please see first the api list. because this refreshrow will postData: $_POST['rowid'] to get the unique id */
                var _idname="id";
                if(idname!==undefined){_idname=idname;}
                var index=_.filter(_.keys(vm.table.tr),function(key){ if(vm.table.tr[key][_idname]==uniqueid){ return key;} });
                if(index[0]===undefined){ console.log('Cannot refresh the row:id is not defined. Note: that the default is "id", please add 3rd params to specify the id target.'); }
                else{ getData('getrow',{rowid:uniqueid,index:index[0]}); }
            };
            vm.parent={};
            vm.parent.toggle=function($index,td,tr,event){
                if(td._parent.expand){
                    td._parent.expand=false;
                    var nth=$index+2,indexes=0,level=tr._level,whileloop=true;
                    while(whileloop===true){
                        var next=angular.element(event.currentTarget).parent().parent().parent().find('tr:nth-child('+nth+')').attr('level');
                        if(level>=parseInt(next)){ whileloop=false; } else { indexes++; nth++; }
                        if(nth===1000){ whileloop=false; }/* loop laps. */
                    }
                    vm.table.tr.splice($index+1,indexes);
                }else{
                    td._parent.expand=true; td._parent.indexes=[];
                    var posted=centralFctry.postData({url:$attrs.model,data:{_parentid:tr.id}}),indent="";
                    if(posted.$$state!==undefined){
                        posted.then(function(v){

                            var _data=[];
                            if(v.data.rows!==undefined){ _data=v.data.rows }
                            else { _data=v.data; }
                            for(var x=0;x<_data.length;x++){
                                _data[x]['td']=[];
                                td._parent.indexes.push($index+(x+1));
                                vm.table.tr.splice($index+(x+1),0,_data[x]);
                                for(var y=0;y<vm.column.list.length;y++){
                                    _data[x]['td'].push(vm.column.list[y]._apply(vm,$index+(x+1),{level:(td._parent.level+1),indent:indent}));
                                }
                            }
                        });
                    }
                }
            };

            vm.pagination=function(type,item){
                var length=vm.table.pagination.pages.length,execute=false;
                if(type==='li'){ vm.table.pagination.active=item.value; execute=true; }
                else if(type==='prev'&&1<vm.table.pagination.active){ vm.table.pagination.active--;execute=true; }
                else if(type==='next'&&length>vm.table.pagination.active){ vm.table.pagination.active++;execute=true; }
                if(execute){ getData('content',{rowoffset:(parseInt($attrs.limit)*(vm.table.pagination.active-1))}); vm.table.valid=true; }
            };
            vm.addrow={row:{},ncols:0};
            vm.addrow.toggle=function(x,c){
                if(vm.addrow.row[x][c].show){ vm.addrow.row[x][c].show=false; }else{ vm.addrow.row[x][c].show=true; }
                if(vm.addrow.row[x].show){ vm.addrow.row[x].show=false; }
                else{
                    vm.addrow.row[x].show=true;
                    if(vm.table.formatter[vm.addrow.row[x][c].formatter]!==undefined){
                        vm.addrow.row[x].value=vm.table.formatter[vm.addrow.row[x][c].formatter](vm.table.tr[x]);
                        vm.addrow.row[x].style=vm.addrow.row[x][c].style;
                    }
                }
            };
            vm.id=$attrs.id;
            vm.getData=getData;
            $scope.formatter={
                attr:$attrs.formatter,
                inifrmtr:inifrmtrValue,
                frmtrkik:{
                    checkbox:function(td,tr){ this.submit({field:td.field,rowid:tr.id,value:tr[td.field]==='1'?'0':'1'},tr); },
                    submit:function(data,tr){ var posted=centralFctry.postData({ url:$attrs.bindmodel, data:data }); if(posted.$$state!==undefined){ posted.then(function(v){ vm.refreshrow(tr.id); }); }
                    }
            }};
            function getData(type,params){
                if(type==='content'){
                    var method='getData',data={},model=$attrs.model;
                    if($attrs.limit!==undefined&&glfnc.trim($attrs.limit)!==''){
                        method='postData'; data.rowcount=$attrs.limit;
                        if(params!==undefined&&params.rowoffset!==undefined){ data.rowoffset=params.rowoffset; } else { data.rowoffset=0; }
                        if(params!==undefined&&params.sorter!==undefined){ data.sorter=params.sorter; }
                    }
                    if(vm.table.settings.sort!==undefined){data.sorter=vm.table.settings.sort;}
                    if(vm.table.settings.search!==undefined){data.search=vm.table.settings.search;}
                    if(params!==undefined&&params.modelext!==undefined){
                        model+=params.modelext;
                    }
                    vm.response.content=centralFctry[method]({url:model,data:data,json:'page/loadview?dir=jshtml&view=directives/table/table.json'});
                    if(vm.response.content.$$state!==undefined){
                        vm.response.content.then(function(v){
                            if(typeof (v.data)==='string'){console.log(v.data); return;}
                            if(v.data.rows!==undefined){
                                vm.table.tr=v.data.rows;
                                if(v.data.count!==undefined){
                                    vm.table.count=v.data.count;
                                    var length=parseInt(v.data.count)/parseInt($attrs.limit),pages=[];
                                    for(var x=0;x<length;x++){ pages.push({value:x+1}); }
                                    vm.table.pagination.pages=pages;
                                    if(params===undefined){vm.table.pagination.active=1; }
                                }
                            } else { vm.table.tr=v.data; }

                            for(var x=0;x<vm.table.tr.length;x++){
                                vm.table.tr[x]['td']=[];
                                if(vm.table.valid&&vm.column.settings.list===undefined){ /*vm.table.refreshed++;*/
                                    for(var y=0;y<vm.column.list.length;y++){
                                        vm.table.tr[x]['td'].push(vm.column.list[y]._apply(vm,x));
                                    }
                                    vm.addrow.ncols++;
                                }
                            }
                        });
                    }
                } else if(type==='formatter') {
                    /*$scope.formatter={attr:$attrs.formatter};*/
                    vm.response.formatter=centralFctry.getData({url:"page/loadview?dir=pages&view="+$attrs.formatter,newurl:'static'});
                    if(vm.response.formatter.$$state!==undefined){
                        vm.response.formatter.then(function(v){ eval(v.data); vm.table.formatter=angular.extend(tblformatter,$scope.formatter.inifrmtr); });
                    }
                } else if(type==='getrow'){
                    if(params===undefined||params.rowid===undefined){return false;}
                    vm.response.rowupdate=centralFctry.postData({url:$attrs.model,data:{rowid:params.rowid}});
                    if(vm.response.rowupdate.$$state!==undefined){
                        vm.response.rowupdate.then(function(v){
                            if(v.data.rows!==undefined){if(v.data.rows[0]===undefined){ vm.table.tr[params.index]=v.data.rows; } else { vm.table.tr[params.index]=v.data.rows[0]; } }
                            else { if(v.data[0]===undefined){ vm.table.tr[params.index]=v.data; }else{ vm.table.tr[params.index]=v.data[0]; } }
                            vm.table.tr[params.index]['td']=[];
                            for(var y=0;y<vm.column.list.length;y++){
                                vm.table.tr[params.index]['td'].push(vm.column.list[y]._apply(vm,params.index,{getdatatype:'getrow'}));
                                vm.addrow.ncols++;
                            }
                        });
                    }
                } else if(type==='context'){
                    vm.response.context=centralFctry.postData({
                        url:vm.contextmenu.model,
                        json:'mvs/app?fetch=directives/contextmenu/contextmenu.json',
                        data:{userid:params.userid}
                    });
                    if(vm.response.context.$$state!==undefined){
                        vm.response.context.then(function(v){
                            vm.contextmenu.data=v.data;
                            params.cb();
                        });
                    }
                } else if(type==='hiddencols'){
                    if($attrs.id===undefined){return;}
                    vm.response.hiddencols=centralFctry.getData({url:'global?api=setup/table::gethiddencolumns/'+$attrs.id,json:'mvs/app?fetch=directives/table/hiddencolumn.json'});
                    if(vm.response.hiddencols.$$state!==undefined){
                        vm.response.hiddencols.then(function(v){
                            vm.column.buttons=v.data.buttons;
                            if(v.data.hiddencolumns!==null&&v.data.hiddencolumns!==undefined){
                                vm.column.hiddencolumns=v.data.hiddencolumns.split(';');
                            }
                        });
                    }
                }
            }
        },controllerAs:'gtTblCtrl'
    }
}
function bindHtmlCompile($compile,$sce){
    return { restrict: 'A', link: function (scope, element, attrs) {
        scope.$watch(function () { return scope.$eval(attrs.bindHtmlCompile); }, function (value) {
            if(typeof (value)=='string'){ element.html(_.unescape(value)); /* new: decode html entities and then convert it to html */ } else { element.html(value);/* old: only convert to html and miss the encoded entities */ }
            $compile(element.contents())(scope);
        });
    }
    }
}