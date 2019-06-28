<gt-combobox selected="{id:1,name:'samplename',photo:'sample.jpg'}" type="users" input-model="form.gapbackid" model=""></gt-combobox>
type list:
1. users
    -> required data for each row
        1.userid,fulllname
2 common
    -> required data for each row
        1. id
        2. name

required params:
1. type - defined what type will show on the list but only if multi is not defined.
2. model - get the datas, if not defined it will get the default data json.

optional params:
1. input-model - pass object to populate the selected id.
2. json: load the json file for temporary data
3. selected:object
    - id -> this variable will pass to the inputModel
    - name -> this variable will pass to name
    - photo -> this variable will prepend to name but for only type="users"
    - disabled -> true if the dropdown is disabled, false if the dropdown is enabled; default is false
3. multi
    - if multi attribute is placed. it will be automatic multi combobox. please see required json format in multi/multi.json
    - Note: if multi is defined. type scope is useless.
4. is-editable
    - if false content is not editable, default is true;
5. callback:function
    - callback function when select.
6. node:=
    -retrieve data from model and load it to node.
7. islink:@ = 'link'
    -> this is only for type=common
    -> when there is default value it is clickable and direct to another tab when islink is true, false is default.
    -> when the value of islink '',undefined,null it is automatic false and also when islink is undefined.
8. reloadlist: true/false; if true the list will always fetch into model, false will not. default:false