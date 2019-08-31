/**
 * Created by Actino-Dev on 11/24/2018.
 */
angular.module('MainValues',[])
    .value('pathValue',{
        base_url:vtr.pathValue.base_url,
        userphoto:vtr.pathValue.userphoto
    })
    .value('genvarsValue',{
        curdate:new Date(),
        dateformat:'yyyy-MM-dd',
        timeformat:'HH:mm:ss',
        userdata:function(){
            if(vtr.userdata!==null&&vtr.userdata!==undefined){return JSON.parse(vtr.userdata); }return {};
        },days:[
            {id:1,name:'Monday'},
            {id:2,name:'Tuesday'},
            {id:3,name:'Wednesday'},
            {id:4,name:'Thursday'},
            {id:5,name:'Friday'},
            {id:6,name:'Saturday'},
            {id:7,name:'Sunday'},
        ]
    })
    .value('mimeTypes',{
        "image":{
            "icon":"fa-file-image-o","types":["image/jpeg","image/bmp","image/png"],"extensions":["jpg","png","bmp"]
        }
    })
    .value('notifValues',{
        processing:function(param,scope){
            /*
            * delay:1 min=60000 ms
            * */
            if(scope===undefined){return;} scope.notification={type:'processing'}; return {message:param.message,type:'info',delay:'60000',scope:scope};
        },
        added:function(scope){ if(scope===undefined){return;} scope.notification={type:'done'}; return {message:'Successfully added!',replaceMessage:true,scope:scope}; },
        updated:function(scope){ if(scope===undefined){return;} scope.notification={type:'done'}; return {message:'Successfully updated!',replaceMessage:true,scope:scope}; },
        deleted:function(scope){ if(scope===undefined){return;} scope.notification={type:'done'}; return {message:'Successfully deleted!',replaceMessage:true,scope:scope}; }
    })
    .value('spinnerValues',{
        default:'<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>'
    });