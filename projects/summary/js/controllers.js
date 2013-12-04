'use strict';

/* Controllers */

angular.module('summaryApp.controllers', []).
    controller('AppCtrl', function ($scope, summaryService) {

        $scope.errorState = "hidden";
        $scope.inputState = "visible";
        $scope.summaryState = "hidden";

        $scope.summarize = function() {
            console.log($scope.input);
            if($scope.input === "")
                $scope.showError("Input can't be empty!");
            else {
                $scope.summary = summaryService.makeSummary($scope.input);
                $scope.summmaryState = "visible";
            }
        };

        $scope.showError = function (error) {
            $scope.errorMessage = "Error: " + error;
            $scope.errorState = "visible";
        };
    });