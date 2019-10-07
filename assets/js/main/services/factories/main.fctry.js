/**
 * Created by Actino-Dev on 11/24/2018.
 */
angular.module('MainFactories',[])
    .factory('searchEngine',['centralFctry','$timeout',searchEngine])
    .factory('setdataService', ['genvarsValue',setdataService])
    .factory('isloadingService',[isloadingService])
    .factory('pageService',['centralFctry',pageService])
    .factory('tableService',['glfnc',tableService])
    .factory('glfnc',['$window',glfnc])
    .factory('centralFctry',['$http','$httpParamSerializer','$httpParamSerializerJQLike','pathValue','dialogs',centralFctry]);
function searchEngine(centralFctry,$timeout){
     var vm=this;
     var opts={debounce:1000};
     var timeout=$timeout(function(){});
     vm.search=function(url,params){
         var a={url:url}; if(params.data!==undefined&&typeof(params.data)==='object'){ a.data=params.data; }
         $timeout.cancel(timeout);
         timeout=$timeout(function(){
             console.log('searching');
             var posted=centralFctry.getData(a);
             if(params.onSuccess!==undefined&&typeof(params.onSuccess)==='function'){ if(posted.$$state!==undefined){ posted.then(function(v){ params.onSuccess(v); }); } }
         },opts.debounce);
     };
     return vm;
}
function setdataService(genvarsValue){
    return { userdata:{ photo: function (scope,photo){ scope.$broadcast('emiter_appmainctrl', {photo:photo}); } } }
}
function isloadingService(){
    var loading={content:false};
    return { set:function(type,value){ loading[type]=value; }, get:loading }
}
function pageService(centralFctry){
    var vm=this; vm.pages={};
    function getdata(params){
        var key=params.tab,url='';
        if(key==='profile'){ url='fetch/profile_get/getpagedata'; }
        else { vm.pages; }
        vm.pages[key]=centralFctry.getData({url:url}); return vm.pages;
    }
    function setdata(data){ vm.response=data; }
    function response(){ return vm.response; }
    return { getdata:getdata,setdata:setdata,response:response };
}
function tableService(glfnc){
    var tables=[];
    return {
        refresh:function(id,modelext){
            if(id===undefined||glfnc.trim(id)===''){return;}
            var table = _.where(tables, { id: id });
            if(!glfnc.isEmpty(table)){ for(var x=0;x<table.length;x++){ table[x].refresh(modelext); } }
        },
        add:function(table){ tables.push(table); },
        refreshrow:function(id,uniqueid,idname){
            /* 3 param [idname] - added:oct-5-2017 -> identify which id name should be the unique. default if not set is :id  */
            if(id===undefined||glfnc.trim(id)===''){return;}
            var table = _.where(tables, { id: id });
            if(!glfnc.isEmpty(table)){ for(var x=0;x<table.length;x++){ table[x].refreshrow(uniqueid,idname); } }
        },
        view:function(){ return tables; },
        cols_th:function(type,ctrl,scope,transclude,index){
            if(type==='tblcol'){
                if(ctrl.column.settings.list==='dynamic'){return;}
                transclude(scope, function(clone) {
                    ctrl.table.td.data.push({html:clone,text:clone.text(),field:scope.field,show:true,colif:scope.colIf,format:scope.format,onclick:scope.gtclick});
                });
            } else if(type==='dynamic'){
                var isthclickable=false,onclick=scope.$eval(ctrl.column.settings.rclick);
                if(onclick!==undefined&&typeof(onclick)==='function'&&scope.field==='reverse'){ isthclickable=true; }
                if(ctrl.column.settings.rclick!==undefined){}
                ctrl.table.td.data.push({html:scope.clone,text:scope.text,field:scope.field,show:true,isthclickable:isthclickable,onclick:onclick,format:scope.format,onclick:scope.gtclick});
                ctrl.column.list.push({_apply:this.cols_apply});/* only for dynamic because of scope and attr */
            }
        },
        cols_apply:function(c,x,params,scope,attr,th_index){ /* gtTableCol apply */
            var produced,addrow='',dropdown=null,parent={type:undefined,value:'',indexes:[],level:1,indent:''},style=scope.tdStyle,tdparent=false;
            var isEditable=false,istdclickable=false,editico='';
            if(scope.gtclick!==undefined){
                if(scope.format==='numchecklist'){/** immediate return when format found. */
                istdclickable=false;
                }else { istdclickable=true; }
            }
            if(attr.editable!==undefined){ isEditable=true;if(attr.editable!==''){editico=attr.editable;}else{editico='_edit';} }

            /* added for accessrights editable */
            if(scope.accessRights===undefined){
            } else {
                if(scope.accessRights.editable===undefined){ isEditable=true; }
                else if(scope.accessRights.editable==0){ isEditable=false;istdclickable=false; }
            }
            if(scope.parent!==undefined&&glfnc.trim(scope.parent)!==''){
                tdparent=true;
                if(params!==undefined){
                    if(params.level!==undefined){
                        parent.level=params.level;
                        scope.level=parent.level;
                        if(style===undefined){style={};}
                        //style['padding-left']=(parent.level*15)+'px';/* revise as css on file */
                        /* problem on updating the row */
                    } else if(params.getdatatype==='getrow'){ parent.level=scope.level; }
                    else { parent.level=0;scope.level=parent.level; }

                    if(params.indent!==undefined){ parent.indent=params.indent; }
                }
                if(c.table.tr[x][scope.parent]==0){
                    parent.type=false;
                    parent.value=parent.indent+'<i class="fa fa-minus gttblparent" aria-hidden="true"></i>';
                }else if(c.table.tr[x][scope.parent]>=1){
                    parent.type=true;
                    parent.expand=false;
                    parent.value=parent.indent+'<i class="fa gttblparent" ng-class="td._parent.expand===false?\'fa-caret-down\':\'fa-caret-up\'" ng-click="gtTblCtrl.parent.toggle(trindex,td,tr,$event)" aria-hidden="true"></i>';
                }
                c.table.tr[x]['_level']=parent.level;
            }
            if(scope.dropdown!==undefined&&glfnc.trim(scope.dropdown)!==''){dropdown={model:scope.dropdown,appended:false,listener:1,field:scope.field};istdclickable=true;}
            if(scope.addrow!==undefined&&scope.addrow!==''){
                addrow='<i ng-click="gtTblCtrl.addrow.toggle(trindex,'+c.addrow.ncols+')" ng-class="gtTblCtrl.addrow.row['+x+']['+c.addrow.ncols+'].show?\'fa-angle-up\':\'fa-angle-down\'" class="fa gttbladdrow" aria-hidden="true"></i>';
                if(c.addrow.row[x]===undefined){ c.addrow.row[x]={} }
                c.addrow.row[x][c.addrow.ncols]={show:false,formatter:scope.addrow,style:scope.addrowStyle,field:scope.field};
            }
            if(scope.editor!==undefined){
                var val="<gt-table-editor td='td' tr='tr' bindmodel='editormodel'></gt-table-editor>";
                produced={value:parent.value+val+addrow,editable:isEditable,onclick:scope.gtclick,istdclickable:istdclickable,txtalign:scope.textAlign,tdstyle:style,_dropdown:dropdown,_parent:parent,context:scope.context,contextfn:scope.contextfn,editico:editico,editor:true,field:scope.field,parent:tdparent};
            }
            else if(c.response.formatter.$$state!==undefined&&scope.format!==undefined&&scope.format!==''){
                if(c.table.formatter[scope.format]!==undefined){
                    /*produced=angular.extend({value:parent.value+c.table.formatter[scope.format](c.table.tr[x],scope.field)+addrow,editable:isEditable,onclick:scope.gtclick,istdclickable:istdclickable,txtalign:scope.textAlign,tdstyle:scope.tdStyle,_dropdown:dropdown},c.table.tr[x]);*/
                    produced={format:scope.format,value:parent.value+c.table.formatter[scope.format](c.table.tr[x],scope.field,c.table.td.data[th_index],x)+addrow,editable:isEditable,onclick:scope.gtclick,istdclickable:istdclickable,txtalign:scope.textAlign,tdstyle:style,_dropdown:dropdown,_parent:parent,context:scope.context,contextfn:scope.contextfn,editico:editico,field:scope.field,parent:tdparent};
                }
                else {
                    produced={format:scope.format,value:'<div class="unset">-</div>',editable:isEditable,txtalign:scope.textAlign,tdstyle:style,_dropdown:dropdown,_parent:parent,context:scope.context,contextfn:scope.contextfn,editico:editico,field:scope.field,parent:tdparent};
                }
            } else {
                var val=c.table.tr[x][scope.field];
                if(glfnc.trim(val)==='-') { val="<div class='unset'>"+val+"</div>"; }
                else if(val===null||val===undefined||val===''){val="<div class='unset'>-</div>"; }
                produced={format:scope.format,value:parent.value+val+addrow,editable:isEditable,onclick:scope.gtclick,istdclickable:istdclickable,txtalign:scope.textAlign,tdstyle:style,_dropdown:dropdown,_parent:parent,context:scope.context,contextfn:scope.contextfn,editico:editico,field:scope.field,parent:tdparent};
            }
            return produced;
        }
    }
}
function glfnc(){
    return {
        trim:function(str){ if((str===undefined||str===null)||typeof(str)!=='string'){return;} return str.replace(/^\s+|\s+$/gm,''); },
        isEmpty:function(obj){ var bar; for (bar in obj) { if (obj.hasOwnProperty(bar)) { return false; } } return true; }
    }
}
function centralFctry($http,$httpParamSerializer,$httpParamSerializerJQLike,pathValue,dialogs){
    var headers={'Content-Type':'application/x-www-form-urlencoded'};
    return {
        dialoghandler:function(v,cb){
            if(v.data!==undefined&&v.data.type==='error'){ dialogs.error(v.data.info,function(){ if(cb!==undefined){ cb(); } }); }
            if(v.data!==undefined&&v.data.type==='notify'){ dialogs.notify(v.data.info,function(){ if(cb!==undefined){ cb(); } }); }
        },
        getData:function(params){
            var url='',data;
            if(typeof(params)!=='object'){return false;}
            if(params.url!==''&&params.url!==undefined){
                url='api/gateway?re=';
                if(params.newurl==='static'&&params.newurl!==undefined){ url=''; }
                url+=params.url;
            }
            else if(params.json!==''&&params.json!==undefined){url+=params.json}
            else{return false;}
            if(params.data!==''&&params.data!==undefined&&typeof(params.data)==='object'){
                url+="&"+$httpParamSerializer(params.data);
            }
            return $http({method:'GET',data:data,url:url,headers:headers});
        },
        uploadfile:function(params){
            /** Try with the usual upload using xmlhttprequest */
            var url='api/gateway?re=',data;
            if (typeof (params) !== 'object') { return false; }
            if (params.url !== '' && params.url !== undefined) {
                if (params.newurl === 'static' && params.newurl !== undefined) { url = ''; }
                url += params.url;
            }
            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener('progress', onprogressHandler, false);
            xhr.upload.onloadstart=onloadstartHandler;
            xhr.upload.onload=onloadHandler;
            xhr.upload.onerror=onerrorHandler;
            xhr.upload.onabort=onabortHandler;
            var form = new FormData();
            xhr.open('POST', url, true);
            xhr.responseType = 'json';
            xhr.onreadystatechange=function(){
                if (params.data !== undefined && params.onreadystatechange !== undefined) {
                    params.onreadystatechange(xhr, this.response);
                }
            }
            form.append('file', params.data.file);
            if(params.data!==undefined && params.data.data!==undefined) { form.append('data', params.data.data); }
            xhr.send(form); // Simple!

            function onprogressHandler(evt) {
                var percent = evt.loaded / evt.total * 100;
                if (typeof percent === 'number') { percent = percent.toFixed(0); }
                // console.log('=>>>Upload progress: ' + percent + '%');
                if (params !== undefined && params.onprogress !== undefined) { params.onprogress(evt, evt.loaded, evt.total, percent); }
            }
            /** the upload begins */
            function onloadstartHandler(evt) {
                if (params !== undefined && params.onstart !== undefined) { params.onstart(evt); }
            }
            /** the upload ends successfully */
            function onloadHandler(evt) {
                if (params !== undefined && params.onsuccess !== undefined) { params.onsuccess(evt); }
            }
            /** the upload ends in error */
            function onerrorHandler(evt) {
                if (params !== undefined && params.onerror !== undefined) { params.onerror(evt); }
            }
            /** the upload has been aborted by the user */
            function onabortHandler(evt) {
                if (params !== undefined && params.onabort !== undefined) { params.onabort(evt); }
            }
        },
        uploadfile2_notworking:function(params){
            var url='api/gateway?re=',data;
            if(typeof(params)!=='object'){return false;}
            if(params.url!==''&&params.url!==undefined){
                if(params.newurl==='static'&&params.newurl!==undefined){url='';}
                url+=params.url;
            }
            var xhr = new XMLHttpRequest();
            xhr.responseType='json';
            var form = new FormData();
            xhr.open("POST", url,true);
            //console.log(JSON.stringify(params.data));
            xhr.onprogress = function (e) { if(params.data!==undefined&&params.data.onprogress!==undefined){ params.data.onprogress(e); } };
            xhr.onloadstart = function (e) { if(params.data!==undefined&&params.data.onloadstart!==undefined){ params.data.onloadstart(e); } };
            xhr.onloadend = function (e) { if(params.data!==undefined&&params.data.onloadend!==undefined){ params.data.onloadend(e); } };
            xhr.onreadystatechange=function(v){
                if(params.data!==undefined&&params.data.onreadystatechange!==undefined){
                    params.data.onreadystatechange(xhr,this.response);
                }
            };
            form.append('file',params.data.file);
            console.log(params.data);
            xhr.send(form);
        },
        postData:function(params){
            var url='api/gateway?re=',data;
            if(typeof(params)!=='object'){return false;}
            if(params.url!==''&&params.url!==undefined){
                if(params.newurl==='static'&&params.newurl!==undefined){url='';}
                url+=params.url;
            }
            else if(params.json!==''&&params.json!==undefined){url=params.json}
            else{ return false; }
            if(params.data!==''&&params.data!==undefined&&typeof(params.data)==='object'){
                data=angular.extend({"request":1},params.data);
                if(params.serializer==='jqlike'){ data=$httpParamSerializerJQLike(data);}
                else{ data=$httpParamSerializer(data); }
            }
            return $http({method:'POST',url:pathValue.base_url+url,data:data,headers:headers,
                eventHandlers:{
                    progress:function(c){
                        if(params.EHandler_pr!==undefined&&typeof(params.EHandler_pr)==='function'){
                            params.EHandler_pr(c);
                        }
                    }
                },
                uploadEventHandlers: {
                    progress: function(e) {
                        if(params.uploadEHandler_pr!==undefined&&typeof(params.uploadEHandler_pr)==='function'){
                            if (e.lengthComputable) {
                                params.uploadEHandler_pr(e);
                            }
                        }
                    }
                }
            });
        }
    }
}