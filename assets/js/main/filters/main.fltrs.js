/**
 * Created by Actino-Dev on 2/12/2019.
 */
angular.module('MainFilters',[])
    .filter('fltr_asDate',function(){ return function (input) { return new Date(input); } });