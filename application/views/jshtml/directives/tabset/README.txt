<gt-tabset gt-onchange="svyCtrl.tab.Onchange" theme="" >
    <gt-tab template="mvs/survey?fetch=html/survey/tabs/surveylist.html" active><?= $this->tr('lbl.survey.list');?></gt-tab>
    <gt-tab template="mvs/survey?fetch=html/survey/tabs/surveyview.html"><?= $this->tr('lbl.visualize.survey');?></gt-tab>
</gt-tabset>

<gt-tabset>
required params

optional params
1. gt-onchange:function(item,index,type)
    - callback function everyload of template
    - 2 types, "tab" or "settings"
2. theme:string
    -> italic-light
    -> light
3 panel-config:{template:'path of the template',width:100px}
    - template: this will be loaded when clicking the settings button
    - width: this will be the width of the panel, the default size is 300px
4. fit: true/false
    - if true the tabs will equally equal with 100% width of tabset, false is default;



<gt-tab>
required params
1. template:string path of template
    - the tag won't work if there is no template attribute
2. active: no params
    - assign tab with active one.

- for review -
3.ng-if: true/false
    -custom ngif of tabs
4.as: "url"
    - if the value is "url"
    for comparison table only
5. node: {id:12}: Note that you can access the item by writing {{item.node}}; global accessed
    -this is for comparison table only


<gt-tab-btns action="">
required params
1. action:string
    -add,edit or delete.


<gt-tab-centralize>
required params
1. template:string path of template
    - this template will use as central template
2. model:string
    - this model will use to query the data as json to convert as tabs
    - format: {html:'<div>sample with div</div> sample',id:1,active:0,icon:''} : important fields: name,id,active.
3. on-load:function(data)
    - this will load when the model is successfully executed. the param will be the data fetched.

--- themes ---
 1. light
 2. italic-light

