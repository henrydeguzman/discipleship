Note: '/' specified as or/choices

params

title:'sample title'
    - title of the dialog
data: {varia:'value'}
    - data should be in json format, it will be acessible in templateurl provided. e.g. {{data.varia}}
    - Note: you can now add model on data as function
        e.g: data:function(){}
        - return "string" or {url:'modelurl',dataurl:{id:1},data:{value:1,name:'name'}}
            - url: fetch the server with the get method
            - dataurl: is optional data that throw when fetching data.
            - data: it will merge to the fetched data from model and it will be as $scope.data={modeldata:v.data,exdata:data}
                - modeldata: is the data fetched from model
                - exdata: is the data {value:1, name:'name'}
options:
    {backdrop:'static'/true/false,keyboard:false}
        - 'static' will not close when you click on blury gray outside the dialog, true it will close with callback, false background will not visible outside the dialog
    size:'sm'/'lg'/'md'/'xl'/'xl-10'
        - size of the modal
        - xl-10 with the size of xl and fix margin 10;
    windowClass:'nomargin'
        - no margin on content dialog
    keyboard: boolean
        - if true escape will close the dialog box, default: true;

otherdata: {varia:'value'}
    - this data use when you wan't otherdata to bind on actual form data.
onclosed:function(params,dgdata)
    - if the $scope.$parent.close(p) is called the "p" should be the params on onclosed function
    - if the $scope.$parent.dgdata is initialized, the dgdata on onclosed will be the value.
type:'wait','error','notify','confirm'
    - error
        dialogs.error('content',function(){})
    - notify
        dialogs.notify('notify body content')
    - confirm
        ex. dialogs.confirm('confirm ?',function(){})
        - function will be executed when clicked on "Yes"
    - asynchronous
        - usual params of dialogs
        * default but it can be edit *
            1. size:'sm'
            2. backdrop:'static'
            3. keyboard:false
            4. otherdata:{autoclosed:true}
        * required params *
            1. model:''
                - to api data: {successcnt:0,percent:0,total:0} = matic
                - return value from model should be : {total:5,success:true,successcnt:1,done:array()} = manual
                example data to api.
                percent: "0"
                request: "1"
                rows: [{…}]
                successcnt: "0" = > count all _done true.
                total: "0"

                model should have id, if the id already done rows data should append _done:true
