/**
 * Created by Actino-Dev on 1/19/2019.
 */
victory
    .config(['$logProvider','$stateProvider','$urlRouterProvider',function($logProvider,$stateProvider,$urlRouterProvider){
        $stateProvider
            .state('sref_sidebar',{
                url:'/{tab}/{name}',
                resolve: {
                    getdata:function($stateParams,pageService,isloadingService){
                        isloadingService.set('content',true);
                        return pageService.getdata($stateParams);
                    }
                },
                views:{
                    "vwsidetab":{
                        templateUrl:function(stateParams){
                            var f=stateParams.tab.split(';'),path=stateParams.tab+"/"+stateParams.tab+".html";
                            if(f.length>1){ path=f.join("/")+'.html'; }
                            return "page/loadpage?view="+path+"&page="+stateParams.tab;
                        },controller:function(getdata,pageService,$stateParams,isloadingService){
                            var vm=this;
                            isloadingService.set('content',false);
                            pageService.setdata(getdata[$stateParams.tab]);
                        }
                    }
                }
            });
        $urlRouterProvider.otherwise('dashboard/Dashboard');
    }])
    .config(function(NotificationProvider){
        NotificationProvider.setOptions({
            startTop: 20,
            startRight: 20,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'right',
            positionY: 'bottom',
            templateUrl:"page/loadview?dir=jshtml&view=notifications/growl/growl.html"
        });
    })
    .config(['calendarConfig',function(calendarConfig){
        // Use either moment or angular to format dates on the calendar. Default angular. Setting this will override any date formats you have already set.
        calendarConfig.dateFormatter = 'moment';

        // This will configure times on the day view to display in 24 hour format rather than the default of 12 hour
        calendarConfig.allDateFormats.moment.date.hour = 'HH:mm';

        // This will configure the day view title to be shorter
        calendarConfig.allDateFormats.moment.title.day = 'ddd D MMM';

        // This will set the week number hover label on the month view
        calendarConfig.i18nStrings.weekNumber = 'Week {week}';

        // This will display all events on a month view even if they're not in the current month. Default false.
        calendarConfig.displayAllMonthEvents = true;

        // Make the week view more like the day view, ***with the caveat that event end times are ignored***.
        calendarConfig.showTimesOnWeekView = true;
    }]);