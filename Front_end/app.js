var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function($routeProvider){
    $routeProvider
    .when('/', {
		controller:'StudentsController', // Controller name ( declaration )
		templateUrl:'views/login_1.html' // Viewto be embedded in index.html
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