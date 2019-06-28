/**
 * Created by Actino-Dev on 1/19/2019.
 */
var tblformatter = {
    no:function(){
        return '{{trindex+1}}';
    },
    chapter:function(){
        return '<select ng-model="tr.chapter" ng-change="one2onepageCtrl.chapter(tr)" class="gen-input-control"><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option></select>';
    },
    toggle:function(){
        return '<gt-toggle callback="one2onepageCtrl.addtovg" node="tr" input-model="tr.hasvgid"></gt-toggle>';
    },
    action:function(){
        return '<ul class="gttbl-btns horizontal">' +
            '<li ng-click="one2onepageCtrl.form.dialog(tr)"><i class="fa fa-pencil-square-o"></i></li>' +
            '<li ng-click="one2onepageCtrl.form.delete(tr.o2oid)"><i class="fa fa-trash-o"></i></li></ul>';
    }
};