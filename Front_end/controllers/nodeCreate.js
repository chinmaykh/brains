// node controller
var myApp = angular.module('myApp');
myApp.controller('NodeController', function ($scope, $http, $interval) {
        console.log("node controller loaded.... ");
        // Global variable declarations
        var autoCompleteData = {};
        var nodes = {};
        var edgeList = {};
        var nodeDatas = {};
        $scope.neighbors = [];
        $scope.getNtfs = function () {

                $http({
                        method: "GET",
                        url: "/api/students/" + 5121 // Currently mine :)
                }).then(function mySuccess(response) { })

        }

        // Get all nodes - title and _id only (save data)
        $http({
                method: "GET",
                url: "/api/find/node/",
                params: {}
        }).then(function (res) {
                // Add each title to the autocomplete
                res.data.forEach(element => {
                        autoCompleteData[element.title] = "https://pbs.twimg.com/profile_images/702185727262482432/n1JRsFeB_400x400.png"
                        nodes[element.title] = element._id;
                        edgeList[element.title] = element.edges;
                        nodeDatas[element.title] = element.data;
                });
                // Initiate the autocomplete
                var elems = document.querySelectorAll('.autocomplete');
                var instances = M.Autocomplete.init(elems, { data: autoCompleteData });
        })

        $scope.neighborsNames = [];
        $scope.addNodetoList = function () {
                if ($scope.neighbors.indexOf(nodes[$scope.toAddNode]) == -1 && autoCompleteData[$scope.toAddNode]) {
                        $scope.neighbors.push(nodes[$scope.toAddNode]);
                        $scope.neighborsNames.push($scope.toAddNode);
                        $scope.toAddNode = ""
                }
                console.log($scope.neighborsNames);
        }

        // Create all connectors -> nameing convention !!!
        // Title1-title2
        $scope.createNode = function () {
                // Instantiate new object
                var newNode = {
                        title: $scope.nodeTitle,
                        data: $scope.nodeData,
                        edges: []
                }
                // Make network call and finalize the _id;
                $http({
                        method: "POST",
                        url: "/api/create/node",
                        data: newNode
                }).then((res) => {
                        newNode = res.data;
                        // For each in neighbor
                        console.log($scope.neighbors.length);
                        $scope.neighborsNames.forEach(element => {
                                let neighbor = {
                                        "title": element,
                                        "_id": nodes[element],
                                        "data": nodeDatas[element],
                                        "edges": edgeList[element]
                                }
                                // Create connector
                                var connector = {
                                        "title": newNode.title + "-" + neighbor.title,
                                        "edges": [neighbor._id, newNode._id],
                                        "data": "Connector(" + newNode.title + "-" + neighbor.title + ")"
                                }
                                // Send connector to server
                                $http({
                                        method: "POST",
                                        url: "/api/create/node",
                                        data: connector
                                }).then((res) => {
                                        // Get th _id and add to update neighbor and add to the new object
                                        neighbor.edges.push(res.data._id);
                                        newNode.edges.push(res.data._id);
                                        // Send neighbor to server
                                        $http({
                                                method: "PUT",
                                                url: "/api/update/node",
                                                data: neighbor
                                        }).then((res) => {
                                                console.log(res.data);
                                                // All neighbors,newNode and connectors are updated
                                                // Send the new object to server
                                                $http({
                                                        method: "PUT",
                                                        url: "/api/update/node",
                                                        data: newNode
                                                }).then((res) => {
                                                        alert(res.data);
                                                }, (err) => {
                                                        alert('Final updation failed!')
                                                })
                                        }, (err) => {
                                                alert('Neighbor updation failed!')
                                        })
                                }, (err) => {
                                        alert('Connector creation failed!')
                                })

                        });

                }, (err) => {
                        alert('Check it out !')
                })

        }


});
