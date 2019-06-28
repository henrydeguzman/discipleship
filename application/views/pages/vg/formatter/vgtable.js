/**
 * Created by Actino-Dev on 2/16/2019.
 */
var tblformatter={
    no:function(){
        return '{{trindex+1}}';
    },
    action:function(){
        return '<ul class="gttbl-btns horizontal">' +
            '<li ng-click="vgpageCtrl.delete(tr)"><i class="fa fa-trash-o"></i></li></ul>';
    }
};