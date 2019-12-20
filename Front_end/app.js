var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function($routeProvider){
    $routeProvider
    .when('/', {
		templateUrl:'views/views/uvinn.html' // Viewto be embedded in index.html
    })
    .when('/createNode',{
      controller:'NodeCreationController',
      templateUrl:'views/newNode.html'
    })
    .when('/editNode',{
      controller:'NodeEditController',
      templateUrl:'views/nodeDetails.html'
    })
    .when('/scribble',{
      templateUrl:'views/draw.html'
    })
    /*
    .when('/urlextension', {
        controller:'CntrlName'
        templateUrl:'views/filename.html'
    })
    */
.otherwise({
		redirectTo:'/'
	})
})