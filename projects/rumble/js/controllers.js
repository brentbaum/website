'use strict';

/* Controllers */

angular.module('gitApp.controllers', []).
    controller('AppCtrl', function ($scope, $http, processService, restService) {

        // Initial states for the application. Repositories 1 and 2 are blank and comparisons list is empty.
        $scope.repository1 = $scope.repository2 =  {title: "", homepage: "", size: 0, issues: []};
        $scope.comparisons = [];

        $scope.input1 = "Angular";
        $scope.input2 = "Ember";

        // Input panel is visible, comparison and error panels are hidden.
        $scope.inputState = "visible";
        $scope.fightState = "hidden";
        $scope.errorState = "hidden";

        // Called when user clicks "go" button. Starts the comparison if inputs are valid.
        $scope.compare = function() {
            if($scope.input1 == "" || $scope.input2 == "")
                $scope.showError("Input cannot be empty.");
            else {
                $scope.search($scope.input1);
                $scope.search($scope.input2);
            }
        };

        // Queries restService to get the results for a search against the Github Repository Search API.
        // Uses process Service to get the top result for the search from the returned results, then
        // passes the result to $scope.getRepository.
        $scope.search = function(input) {
            restService.getSearchResults(input, function(data) {
                if(typeof(data)==="string") {
                    $scope.showError(data);
                }
                else {
                    var result = processService.processSearch(input, data);
                    if(typeof(result)==="string")
                        $scope.showError(result);
                    else
                        $scope.getRepository(result);
                }
            });
        }

        // Queries restService to get information about a repository. Uses processService to extract
        // important metrics from the results.
        // If both repositories' info are filled, then calls processService to compare the two repos.
        $scope.getRepository = function (repo) {
           restService.getRepository(repo, function (data) {
               if($scope.repository1.title == "")
                   $scope.repository1 = processService.processRepo(data);
               else {
                   $scope.repository2 = processService.processRepo(data);
                   $scope.comparisons = processService.makeComparison($scope.repository1, $scope.repository2);
                   $scope.showFight();
               }
           });
        };

        $scope.showError = function (error) {
            $scope.errorMessage = "Error: " + error;
            $scope.errorState = "visible";
            $scope.inputState = "visible";
            $scope.fightState = "hidden";
        }

        $scope.showFight = function() {
            $scope.inputState = "hidden";
            $scope.fightState = "visible";
            $scope.errorState = "hidden";
        }

        $scope.showInput = function() {
            $scope.inputState = "visible";
            $scope.fightState = "hidden";
            $scope.errorState = "hidden";
        }

        //Resets the application to its initial state.
        $scope.reset = function() {
            $scope.repository1 = $scope.repository2 =  {title: "", homepage: "", size: 0, issues: []};
            $scope.comparisons = [];

            $scope.inputState = "visible";
            $scope.fightState = "hidden";
            $scope.errorState = "hidden";
        }
    });