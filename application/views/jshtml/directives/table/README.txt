<gt-table  tablehstyle="{}" tablecstyle="{}"  limit="10" id="gap.indicators" model="gap?api=indicator::getlist/<?= $gapid; ?>" formatter="gap?fetch=formatter/indicators.js">
    <gt-table-col parent="isparent" text-align="center" field="title"><?= $this->tr('indicator.title');?></gt-table-col>
    <gt-table-col field="period" format="js_funcformat" addrow-style="{padding:'10px'}"><?= $this->tr('indicator.period.title');?></gt-table-col>
    <gt-table-col field="scale" addrow="addrow_jqfunc"><?= $this->tr('indicator.scale.title');?></gt-table-col>
    <gt-table-col field="current" format="lastresult" editable gtclick="tabsCtrl.tab1.indicators.lastresult"><?= $this->tr('indicator.last.title');?></gt-table-col>
    <gt-table-col field="target" dropdown="" editable gtclick="tabsCtrl.tab1.indicators.target"><?= $this->tr('indicator.goal.title');?></gt-table-col>
    <gt-table-col field="control" editable gtclick="tabsCtrl.tab1.indicators.controladmn"><?= $this->tr('indicator.control.title');?></gt-table-col>
</gt-table>

table params:
1. id
    -> if you want to refresh the table just provide id to it.
2. model
    -> getlist
3. bindmodel : built-in in table. also used in dataformatter built in function.
    -> <gt-table-editor> postdata. {field:0,rowid:18,value:'12',args:'comparisonid=1&rowmode=sub'}
    -> note: it will add args value from $scope.tr if there is dataargs
        e.g {id: "18", dataargs: "comparisonid=1&rowmode=sub", title: "test 2 risk", description: null, elementid: "18", …}
    -> field: from $scope.td['field']

    dataformatter build-in functions /assets/js/main/services/values/main.formatter.js
    - numchecklist
        - callback:function(tr,td,rowindex{} if gtclick is defined

3. formatter
    -> get javascript function format for all columns
4. header: true/false
5. limit: '10'
    -> if limit is defined and not empty string the getting of data is "POST" and
        it includes the POST['rowcount'] and $_POST['rowoffset'] into model.
    -> if limit is defined and not empty, first load of the table $_POST['rowoffset']=0 and POST['rowcount'] equal to the limit defined in html attr.
6. name: 'table name used for export'
    -> if name is defined it will use when exporting to excel, word and pdf, if not it will set the name to default "exported_[date]";
7. context-model: string/model
    -> this will be the model of context, it will fetch when you right click.
    Note: This is required if you want the context is visible when you trigger the right click
        -> if the <gt-table-col> has attribute "context", context will only visible with the columns that have "context" attribute
    format: mvs/app?fetch=directives/contextmenu/contextmenu.json
8. headerstyle: styles of header
9. tablestyle: styles of table


For dynamic columns only
8. columns: {list:'dynamic',mainStyle:{},subStyle:{},gtclick:function}
    - list: 'dynamic'
        * if column is dynamic it will depend on model -> columns, also the <gt-table-col is useless. default is undefined
    - mainStyle: {}
        * style of top row element
    - subStyle: {}
        * style of left column element
    - rclick: function
        * this function is for reverse column onclick only
9. settings: {format:'sampleformat',tdStyle:{}}
    - format: 'sampleformat'
        * this format will only use for reverse. Note that dynamic always have reverse first column
    - tdStyle: {color:'red}
    - textAlign: left/center/right

data for dynamic
* columns required
    - field
    - caption
* columns optional
    - dataformat: this will have dataformat on column
    - editor: "auto"
        -> auto: search data option...


cols params:
1. field
    -> field must define any varible that defined on getlist model.
2. format: 'string'
    -> format must define any variable that defined on formatter
    -> must return on formatter -> function(tr,field,col)
3. addrow:
    -> variable that defined in formatter.
4. text-align: left/center/right
    -> define text alignment on each column.
5. addrow-style: {color:'red',padding:'10px'}
4. td-style: {color:'red}
5. dropdown: 'project?api=project::dropdownlist'
    -parameter model, it will send to bind-mode='';
6. parent: 'isparent'
    -parameter string value to compare on object for example "isparent" contain boolean value.
    -onclick of parent it will send to the model. the variable post will be $_POST['_parentid']
7. access-rights: {editable:1}
    -editable: boolean
        -> 0 for disabled editing with the onclick with the cursor and background,1 for enable
8. col-if: true/false
    - if false the column is visible, if true the column is hidden. default is true.
9. context:
    - context menu will visible if the directive has "context" attribute, if not it will not visible.
10. contextfn: function
    - this will trow data into function when click each list
11. editable:with params or null
    - params: add/edit/view/download; the default is edit icon.
    - this editable attr apply the icon on td when hover on the td
12. gtclick:function
    - click on td.


table services
1. tableService.refresh('gap.files','modelextends');
    -> table will refresh all list. refresh is a function that accept table's id.
    -> 2nd parameters will be model extension.
2. tableService.refreshrow('gap.files',1);
    -> table will refresh specific row. refreshrow is a function that accept two parameters.
    -> first param should be the id of the table, second param will be the rowid of list.

    Note: getlist on refreshrow must be only object e.g: {name:'',etc...}. array object will not work e.g [{name:''}];


css table supports
1. gttbl-btns
    -> ul.gttbl-btns for buttons vertical mode
    -> ul.gttbl-btns.horizontal for buttons horizontal mode
2.

------- gt-table-btns -------
<gt-table-btns action="add" gtclick="functionname">sample hover</gt-table-btns>
<gt-table-btns action="button" gtclick="functionname"><span>Create Account!</span></gt-table-btns>
functionname(vm.table.tr){// gives you tr data on the function
}

btns params:
1. action: string
    - action identifier ( coded actions ) add,edit,delete
2. gt-click: function
    - function that will call when clicked.


### data formater defaults ###
1. checkbox: toggle checked or unchecked and it binds on bindmodel


### clases that you can use in td ###
.gttbl_editable =   use when this class is inside td. though the columns have built in "editable"
                    attrs but it happens when only childs has editable cols through formatter.
                    e.g <div class="gttbl_editable"></div>

note:
toggle reverse data to know is reversed or not. - done
tblformatter validation if sub is category - done
column scale - done
column responsible
column data options editable