/**
 * Created by Actino-Dev on 6/14/2017.
 */
var translateSubMod=angular.module('translated.sub',[]);



/* Controllers */
var ctrls;
try {

    ctrls=angular.module('dialogs.controllers',[])
}catch(err){
    ctrls=angular.module('dialogs.controllers',[])
}

ctrls.controller('dCtrl',function($scope,$uibModalInstance,data,onclosed,title,url,otherdata,centralFctry,type){
    $scope.otherdata=otherdata;
    $scope.url=url;
    $scope.type=type;
    /*$scope.data=data;*/
    /*
    * october 30, 2018: data added validation for function that data will fetch on models, old passing data is on else
    * */
    if(typeof(data)==='function'){
        var datafn=data(),dataurl='',urldata={};
        if(typeof(datafn)==='object'){ dataurl=datafn.url; urldata=datafn.urldata; } else if(typeof(datafn)==='string') { dataurl=datafn; } else { $scope.data=undefined; }
        var posted=centralFctry.getData({url:dataurl,data:urldata});
        if(posted.$$state!==undefined){ posted.then(function(v){ if(datafn.exdata!==undefined){ $scope.data={modeldata:v.data,exdata:datafn.exdata}; } else { /** if no exdata */ $scope.data=v.data; } }); }
    } else { $scope.data=data; }
    $scope.closeshow=true;
    $scope.close=function(param){ $uibModalInstance.close(); if(onclosed!==undefined){ if(typeof(onclosed)==='function'){ onclosed(param,$scope.dgdata); } } };
    $scope.diagwindow={maximize:false,default:null,show:true};
    $scope.diagwindow.toggle=function(){
        //$scope.diagwindow.maximize?$scope.diagwindow.maximize=false:$scope.diagwindow.maximize=true;
        if($scope.diagwindow.default===null){ $scope.diagwindow.default=$scope.$$childHead.size }
       if($scope.diagwindow.maximize){
           $scope.diagwindow.maximize=false;
           $scope.$$childHead.size=$scope.diagwindow.default;
       } else {
           $scope.$$childHead.size='fullscreen';
           $scope.diagwindow.maximize=true;
       }
    };
    switch (type) {
        case "wait":
            $scope.title="<i class=\"fa fa-clock-o\" aria-hidden=\"true\"></i>&nbsp;<span>Please Wait</span>";
            $scope.diagwindow.show=false;$scope.closeshow=false;
            break;
        case "error":
            $scope.title="<i class=\"fa fa-exclamation-triangle\" aria-hidden=\"true\"></i>&nbsp;<span>Error</span>";
            $scope.diagwindow.show=false;
            break;
        case "notify":
            $scope.title="<i class=\"fa fa-info-circle\" aria-hidden=\"true\"></i>&nbsp;<span>Something Happened!</span>";
            $scope.diagwindow.show=false;
            break;
        case "confirm":
            $scope.title="<i class=\"fa fa-check-square-o\" aria-hidden=\"true\"></i>&nbsp;<span>Please Confirm</span>";
            $scope.diagwindow.show=false;
            break;
        default:
            $scope.title=title;
            break;
    }
});

/* directives */
angular.module('dialogs.directive',[])
    .directive('gtDialog',['$compile','$templateRequest',function($compile,$templateRequest){
        return {
            restrict: 'E',
            templateUrl: 'page/loadview?dir=jshtml&view=dialogs/generic-popup/generic-popup.html',
            template:'',
            link:function(scope,element,attrs,ctrl){
                if(scope.type==='confirm'){
                    scope.url='page/loadview?dir=jshtml&view=dialogs/generic-popup/types/confirm.html';
                }
                else{
                    if(scope.url===''||scope.url===undefined){return;}
                }
                console.log(scope.url,scope.type);
                $templateRequest(scope.url).then(function(res){
                    element.find('.gen-dialog-c-content').html($compile(res)(scope));
                });
            },
            controller:function($scope){
                var vm=this;
                vm.submit=function(form){
                    if($scope.data.submitfn!==undefined){
                        if(typeof $scope.data.submitfn==='function'){
                            $scope.data.submitfn(form);
                        }
                    }
                }
            },controllerAs:'formCtrl'
        }
    }]);

/* Services */
angular.module('dialogs.services',['ui.bootstrap','dialogs.controllers','dialogs.directive'])
    .provider('dialogs',[function(){
        var _b=true,/*backdrop*/
            _k=true,/*keyboard*/
            _w='dialogs-default',/*windowClass*/
            _bdc='dialogs-backdrop-default',
            _copy=true,
            _wTmpl=null,
            _wSize='lg',
            _animation=false,
            _fa=false;

            var _setOpts=function(opts,params){
                var _opts={};
                opts=opts || {};
                _opts.kb=(angular.isDefined(opts.keyboard)) ? !!opts.keyboard: _k; /* values: true,false */
                _opts.bd=(angular.isDefined(opts.backdrop)) ? opts.backdrop: _b; /* values: 'static',true,false */
                _opts.bdc=(angular.isDefined(opts.backdropClass)) ? opts.backdropClass: _bdc; /* additional CSS class(es) to be added to the modal backdrop */
                _opts.ws=(angular.isDefined(opts.size) && ((opts.size==='sm') || (opts.size==='lg') || (opts.size==='md') || (opts.size==='xl') || (opts.size==='xl-10'))) ? opts.size: _setsize(params); /* values: 'sm','lg','md' */
                _opts.wc=(angular.isDefined(opts.windowClass)) ? opts.windowClass : _w; /* additional CSS class(es) to be added to a modal window */
                _opts.anim=(angular.isDefined(opts.animation)) ? !!opts.animation : _animation; /* values: true,false *_opts._type=(angular.isDefined(opts._type)) ? !!opts._type : _type; /* values: true,false */
                return _opts;
            };
            function _setsize(params){
                var size='';
                if(params.type==='confirm'){
                    size='sm';
                } else {
                    size=_wSize;
                }
                return size;
            }
        this.useBackdrop = function(val){ // possible values : true, false, 'static'
            if(angular.isDefined(val))
                _b = val;
        }; // end useStaticBackdrop
        this.$get=['$uibModal',function($uibModal){
            return {
                create:function(params,url,ctrlr,data,opts,ctrlAs){
                    var copy = (params.options && angular.isDefined(params.options.copy)) ? opts.copy : _copy;
                    opts = _setOpts(params.options,params);
                    return $uibModal.open({
                        template:'<gt-dialog></gt-dialog>',
                        /*templateUrl:'templates/angular/sample/sample.html',*/
                        keyboard : opts.kb,
                        controller:'dCtrl',
                        backdrop : opts.bd,
                        backdropClass: opts.bdc,
                        windowClass: opts.wc,
                        size: opts.ws,
                        animation: opts.anim,
                        resolve : {
                            type:function(){
                                return params.type===undefined?'custom':params.type;
                                },
                            onclosed:function(){return params.onclosed;},
                            title:function(){ return params.title; },
                            url:function(){return params.url;},
                            otherdata:function(){
                                if(copy){
                                    return angular.copy(params.otherdata);
                                }
                            },
                            data : function() {
                                if(copy){
                                    if(params.submitfn!==undefined){
                                        params.data=angular.extend({submitfn:params.submitfn},params.data);
                                    }
                                    return angular.copy(params.data);
                                } else { return params; }

                            }
                        }
                    });
                }
            }
        }];
    }]);

/* Main module */
angular.module('dialogs.main',['dialogs.services'])
    .run(["$templateCache", function($templateCache) {
        $templateCache.put("uib/template/modal/window.html", "<div ng-class='' class=\"modal-dialog {{size ? 'modal-' + size : ''}}\"  ><div class=\"modal-content\" uib-modal-transclude></div></div>\n");
    }]);