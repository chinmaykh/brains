// Timetable controller
var myApp = angular.module('myApp');
myApp.controller('TimeTableController', function ($scope, $http, $interval) {
        console.log("TimeTable controller loaded.... ");
        var getPath  = "/api/class/timetable/Class " + localStorage.getItem("grade");
        console.log(getPath);
        $http({
            method:"GET",
            url:getPath
        }).then((response)=>{
            $scope.days = response.data;
            console.log($scope.days[0].day);
        },(response)=>{
            alert(response.data);
        })

    });