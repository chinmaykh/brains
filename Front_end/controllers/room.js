// Rooms contoller


var myApp = angular.module('myApp');


myApp.controller('RoomsController', function ($scope, $http,$interval) {
        console.log("Rooms controller loaded.... ");

        // declaring all available rooms

        $scope.roms =  [];
        $scope.roms.push({
                name:"Auditorium",
                desc:"Nicsish room",
                pic_url:"www.google.com/images"  // teehee
        })
        
        $scope.roms.push({
                name:"Interactive Room 1",
                desc:"Nicsish room",
                pic_url:"www.google.com/images"  // teehee
        })
        
        
        $scope.roms.push({
                name:"Interactive Room 2",
                desc:"Nicsish room",
                pic_url:"www.google.com/images"  // teehee
        })

        $scope.myFunc = function () {
                var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                //var dater = document.gnoetElementById("datebox").innerHTML;
                //var perioder = document.getElementById("periodbox").innerHTML;
                console.log($scope.dat, $scope.period);
                var mydate = new Date();
                myDate = $scope.dat;                
                console.log(myDate.toDateString());

                $http({
                        method: "POST",
                        url: "/sc/",

                        data: {
                                "authority": localStorage.getItem("Name"),
                                "name": document.getElementById("nameofmodal").innerHTML,
                                "date": myDate.toDateString(),
                                "period": $scope.period
                        }
                }).then(function mySuccess(response) {
                        var incoming = response.data;
                        if(incoming=="Room has been booked"){
                        document.getElementById('fs').style.display = "block";
                        document.getElementById('fl').style.display = "none";
                        $interval(function closealerts() {
                                document.getElementById('fs').style.display = "none";
                                document.getElementById('fl').style.display = "none";
                                $interval.cancel();     
                        },3000);
                        }else{
                        document.getElementById('fs').style.display = "none"
                        document.getElementById('fl').style.display="block";
                        document.getElementById('fl').innerText="Sorry, already booked !";  
                        $interval(function closealerts() {
                                document.getElementById('fs').style.display = "none";
                                document.getElementById('fl').style.display = "none";
                                $interval.cancel();     
                        },3000);
                        }
                        console.log(response);
                }, function myError(response) {

                        console.log(response);
                        document.getElementById('fl').style.display = "block";
                        document.getElementById('fs').style.display = "none"
                        
                });

        }

        $scope.getRoomsByAuthority = function () {
                console.log("Acquiring rooms by authority");
                console.log(localStorage.getItem("Name"));
                $http({
                        method: "POST",
                        url: "/sc/findbyauth",
                        data: {

                                "authority": localStorage.getItem("Name") 
                        }
                }).then(function mySuccess(response) {
                        $scope.rooms = response.data;
                        console.log(response);
                }, function myError(response) {
                        console.log(response);
                        alert("Some error has occured");
                });

        }



        $scope.deleteBooking = function (ind) {
                console.log("Request to delete booking");
                var bookdate = $scope.rooms[ind].date;
                var job = {
                        //
                        "authority": localStorage.getItem("Name") ,
                        "name": $scope.rooms[ind].name,
                        "date": bookdate,
                        "period": $scope.rooms[ind].period
                }

                console.log(job);

                $http({
                        method: "POST",
                        url: "/sc/removeRoom",
                        data: job
                }).then(function mySuccess(response) {
                        console.log('Hi');
                        document.getElementById('fs').style.display = "block";
                        document.getElementById('fl').style.display = "none";
                        $interval(function closealerts() {
                                document.getElementById('fs').style.display = "none";
                                document.getElementById('fl').style.display = "none";
                                $interval.cancel();     
                        },3000);
                        console.log(response);
                        $scope.getRoomsByAuthority();
                }, function myError(response) {
                        console.log(response);
                        document.getElementById('fs').style.display = "none";
                        document.getElementById('fl').style.display = "block";
                        $interval(function closealerts() {
                                document.getElementById('fs').style.display = "none";
                                document.getElementById('fl').style.display = "none";
                                $interval.cancel();     
                        },3000);
                });

        }

        $scope.getTodaysBooking = function () {

                var d = new Date();

                $http({
                        method: "POST",
                        url: "/rooms/withQuery",
                        data: { "date": d }
                }).then(function mySuccess(response) {
                        $scope.rooms = response.data;
                        console.log(response);
                }, function myError(response) {
                        console.log(response);
                        alert("Some error has occured");
                });


        }

        $scope.getBookings = function () {
                $http({
                        method: "GET",
                        url: "/rooms",
                }).then(function mySuccess(response) {
                        $scope.rooms = response.data;
                        console.log(response);
                }, function myError(response) {
                        console.log(response);
                        alert("Some error has occured");
                });
        }

        $scope.deleteBookingAdmin = function (ind) {
                console.log("Request to delete booking");
                var bookdate = $scope.rooms[ind].date;
                var job = {
                        //
                        "authority": $scope.rooms[ind].authority,
                        "name": $scope.rooms[ind].name,
                        "date": bookdate,
                        "period": $scope.rooms[ind].period
                }

                console.log(job);

                $http({
                        method: "POST",
                        url: "/sc/removeRoom",
                        data: job
                }).then(function mySuccess(response) {
                       
                        console.log(response);
                        $scope.getBookings();
                }, function myError(response) {
                        console.log(response);
                       
                });

        }

        $scope.setName = function(name){
                $scope.modal_head = name;
        }

});