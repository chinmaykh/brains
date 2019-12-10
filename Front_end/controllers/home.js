// Home controller
var myApp = angular.module('myApp');
myApp.controller('HomeController', function ($scope, $http, $interval) {
        console.log("Home controller loaded.... ");
        // Global variable declarations


        var StudBuffer;
        var solution = [];
        var todayCreate = new Date();
        var today = new Date(todayCreate.getFullYear(), todayCreate.getMonth(), todayCreate.getDate());
        $scope.not_i = [];
        $scope.days = [];
        $scope.ntfs = [];
        $scope.dues = [];
        // Caledndar functions 

        $scope.weekSetter = function () {
                for (let index = 1; index < 8; index++) {
                        var buffer = new Date(today.getTime() + ((index - 1) * (24 * 60 * 60 * 1000)));
                        solution[index - 1] = { date: buffer };
                }
                $scope.days = solution;
                console.log($scope.days);
        };


        $scope.weekSetter();

        $scope.setDate = function () {
                today = new Date($scope.reqdate);
                console.log(today);
                $scope.weekSetter();
        }

        $scope.getDues = function (due_date) {
                console.log('View Deadlines');
                console.log(due_date);

                $scope.ntfs.forEach(element => {
                        var elemDate = new Date(element.due);
                        var duedate = new Date(due_date);
                        if (elemDate == duedate) {
                                alert("FOUND ONE SCSSCSCSCSC");
                        }
                        console.log("The element's date is - " + elemDate + " the due date is - " + duedate);
                        if (elemDate == duedate) {
                                console.log("______________________");
                                console.log(element.due);
                                $scope.dues.push(element.msg);
                                console.log("Found one " + element);
                        }
                });
                console.log($scope.dues);
        }

        // Network call for student info

        $scope.getNtfs = function () {

                $http({
                        method: "GET",
                        url: "/api/students/" + 5121 // Currently mine :)
                }).then(function mySuccess(response) {
                        const Student = response.data;
                        console.log('Hi ! you are ' + Student.name);

                        // Set Local Storage, TODO : After finishing loginpage, import transfer this to that

                        localStorage.setItem("Name", Student.name);
                        localStorage.setItem("_id", Student._id);
                        localStorage.setItem("email", Student.email);
                        localStorage.setItem("groups", JSON.stringify(Student.chats));
                        localStorage.setItem("grade", Student.grade);
                        localStorage.setItem("stud_ntfs",JSON.stringify(Student.ntf));
                        // Assigning the Student notification to StudBuffer for tracking reverse assign;

                        $scope.ntfs =  Student.ntf;
                        StudBuffer = Student;
                        
                        console.log("Just after StudBeffer was assigned to studeent, it looked like this - " + JSON.stringify(StudBuffer));
                        // Assigning the scope variable to the Student.ntf indirectly 

                        // Getting the notifications from all groups(classes) and assigning them to the scope variable
                        $scope.getGrpNtf(Student.chats);

                        // Rectifiying the date ( if needed )
                        $scope.temp_date();

                        // Logging
                        console.log("Notification after all startups have been called" + JSON.stringify(Student.ntf));

                }, function myError(response) {
                        alert("Some error seems to be taking place... , Contact Chin if problem persists")
                        console.log(response);
                });

        }

        // $scope.$watch(StudBuffer.ntf,()=>{alert(StudBuffer.ntf)},true)
        

        $scope.getNtfs($scope.ntfs);

        // Color assignment for all notifications TODO : Pending work
        $scope.assign = function (input_date) {
                var year = input_date.getFullYear();
                var month = input_date.getMonth();
                var day = input_date.getDate();
                console.log("Notification color for " + $scope.ntfs.length + " items has been assigned.");
        }

        // Getting the group notifications and assigning them to the scope !

        $scope.getGrpNtf = function (groups) {
                var temp = [];
                console.log("The groups are " + groups);

                // For each group in groups

                groups.forEach(elemen => {

                        console.log("The group of which notification is being called is " + elemen);

                        $http({
                                method: "GET",
                                url: "/api/class/" + elemen
                        }).then(function mySuccess(response) {

                                var temp = response.data[0];
                                console.log("Incoming group info length - " + JSON.stringify(temp.ntf.length));

                                // For each message in messages

                                temp.ntf.forEach(element => {
                                        // Insert the messages into the scope   

                                        var a = new Date(element.due);
                                        element.due = a;

                                        $scope.ntfs.push(
                                                element
                                        );
                                });

                                // The color for notifications assignment
                                var d = new Date();
                                $scope.assign(d);

                        }, function myError(response) {
                                alert("Some unexpected error has taken place - Contact Chin if problem persists ( or if you're impatient)")
                        });
                });
        }


        $scope.temp_date = function () {

                for (let index = 0; index < $scope.ntfs.length; index++) {
                        var t = new Date($scope.ntfs[index].due);
                        $scope.ntfs[index].due = t;
                        var g = "sbd";
                }
                console.log($scope.ntfs);
        }


        $scope.setRem = function () {
                // console.log("Just after setRem call " + JSON.stringify(Student.ntf));
                var buf = {
                        due: $scope.rem_date,
                        msg: $scope.rem_cont
                }
                StudBuffer.ntf = JSON.parse(localStorage.getItem("stud_ntfs"));
                StudBuffer.ntf.push(buf);
                console.log(StudBuffer.ntf)
                console.log("Studbuffer + " + StudBuffer.ntf);
                // Update the Student info with the new reminder
                $http({
                        method: "POST",
                        url: "/api/students",
                        data: StudBuffer
                }).then(function mySuccess(response) {
                        alert(response.data);
                }, function myError(response) {
                        alert(response.data);
                });
                $scope.ntfs = [];

                $scope.getNtfs();
        }

        $scope.setClassRem = function () {
                var grades = $scope.grades;
                var remdate = $scope.classRemDate;
                var remContent = $scope.classRemContent;


                grades.forEach(element => {

                        $http({
                                method: "POST",
                                url: "/api/class/setRem",
                                data: {
                                        "name": element,
                                        "due": remdate,
                                        "msg": remContent
                                }
                        }).then(function success(response) {
                                console.log("HI")
                        }, function failure(response) {
                                console.log("bye")
                        });
                });

        }




});
