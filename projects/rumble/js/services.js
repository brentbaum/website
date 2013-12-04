'use strict';

/* Services */

// Defines two services: restService and processService.
// restService handles restful interactions with the Github API.
// processService processes data from the API and makes comparisons between repositories.
angular.module('gitApp.services', ['gitApp.controllers']).
    service('restService', function($http) {
        this.getSearchResults = function (query, callback) {
            $http({method: 'GET', url: 'https://api.github.com/legacy/repos/search/' + query}).
                success(function (data) {
                    if(data === undefined)
                        callback('No results found for ' + query);
                    else
                        callback(data);
                }).
                error(function (data, status) {
                    if(status === 403) {
                        callback("403: Too many requests. Wait a minute and try again.");
                    }
                    else {
                        callback(status);
                    }
                });
        };

        this.getRepository = function (repoInfo, callback) {
            $http({method: 'GET', url: 'https://api.github.com/repos/' + repoInfo.owner + '/' + repoInfo.title}).
                success(function (data) {
                    if(data != null)
                        callback(data);
                    else
                        callback('That repository does not exist or is private.');
                    }).
                    error(function (data, status) {
                        if (status === 404) {
                            callback('That repository does not exist or is private.');
                        } else {
                            callback(status);
                        }
                    });
        };
    }).
    service('processService', function () {
        // Given the data from a query against the Github Repository Search, returns the top
        // repo's name and owner.
        this.processSearch = function (input, data) {
                var repo = data.repositories[0];
                return {title: repo.name, owner: repo.owner};
        };

        //given the results from a query against the Github Repository API,
        this.processRepo = function (data) {
            var repo = {};
            repo.title = data.name;
            repo.homepage = data.url;
            repo.issues = data.open_issues;
            repo.owner = data.owner;
            repo.watchers_count = data.watchers_count;
            /*Funny enough, the github repo response contains a "watchers" and "watchers_count" field which
             reference the number of watchers for that repo. They probably changed it at some time and
             kept the old one in for backwards compatibility. Same thing for "forks"/"forks_count".
             Oh ambiguity... */
            repo.forks_count = data.forks_count;
            repo.age = differenceInTime(new Date(data.created_at), new Date());
            repo.updated = differenceInTime(new Date(data.updated_at), new Date());

            return repo;
        };

        //returns the number of hours between two Date objects and a formatted string for displaying the difference
        //in time between two Dates.
        var differenceInTime = function (date1, date2) {
            var diff = date2 - date1;
            var years = Math.floor(diff / (365 * 24 * 60 * 60 * 1000));
            var months = Math.floor(diff / (30 * 24 * 60 * 60 * 1000));
            var days = Math.floor(diff / (24 * 60 * 60 * 1000));
            var hours = Math.floor(diff / (60 * 60 * 1000));
            var formatted = "";
            if (years > 1)
                formatted = years + " years";
            else if (years == 1)
                formatted = "1 year";
            else if (months > 1)
                formatted = months + " months";
            else if (months == 1)
                formatted = "1 month";
            else if (days > 1)
                formatted = days + " days";
            else if (days > 1)
                formatted = "1 day";
            else if (hours > 1)
                formatted = hours + " hours";
            else if (hours == 1)
                formatted = "1 hour";
            else
                formatted = "< 1 hour";

            return { "hours": hours, "formatted": formatted };
        };

        //given two repositories, returns an array of comparison titles and results.
        this.makeComparison = function (repository1, repository2) {
            var comp = {};
            comp.matches = [];
            comp.scores = [0, 0];

            var result = compare(repository1.age.hours, repository2.age.hours);
            comp.matches.push({title: "Age",
                repository1: repository1.age.formatted, repository2: repository2.age.formatted, result: result});

            result = compare(repository1.issues, repository2.issues);
            comp.matches.push({title: "Watchers",
                repository1: repository1.watchers_count, repository2: repository2.watchers_count, result: result});

            result = compare(repository1.updated.hours, repository2.updated.hours);
            var temp = result[0];
            result[0] = result[1];
            result[1] = temp;
            comp.matches.push({title: "Last Updated",
                repository1: repository1.updated.formatted, repository2: repository2.updated.formatted, result: result});

            result = compare(repository1.issues, repository2.issues);
            comp.matches.push({title: "Forks",
                repository1: repository1.forks_count, repository2: repository2.forks_count, result: result});

            result = compare(repository1.issues, repository2.issues);
            var temp = result[0];
            result[0] = result[1];
            result[1] = temp;
            comp.matches.push({title: "Issues",
                repository1: repository1.issues, repository2: repository2.issues, result: result});

            for(var x = 0; x < comp.matches.length; x++) {
                if(comp.matches[x].result[2] == ">")
                    comp.scores[0]++;
                else if(comp.matches[x].result[2] == "<")
                    comp.scores[1]++;
                else {
                    comp.scores[0]++;
                    comp.scores[1]++;
                }
            }

            if(comp.scores[0] > comp.scores[1])
                comp.winner = {title: repository1.title, image: repository1.owner.avatar_url};
            else if(comp.scores[0] < comp.scores[1])
                comp.winner = {title: repository2.title, image: repository2.owner.avatar_url};
            else
                comp.winner = {title: "Tie!", image: ""};
            return comp;
        };

       //compareTo for integers using tuples instead of -1, 0, 1 for easy injection into css class.
       var compare = function (x, y) {
            if(x > y)
                return ["win", "lose", ">"];
            if(x < y)
                return ["lose", "win", "<"];
            return ["tie", "tie", "="];
        };
    });
