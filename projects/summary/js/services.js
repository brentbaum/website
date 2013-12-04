'use strict';

angular.module('summaryApp.services', ['summaryApp.controllers']).
    service('summaryService', function() {
        var intersect = function(s1, s2) {
            var count = 0;
            s1.split(' ').forEach(function(w) {
                if(s2.indexOf(w)!=-1)
                    count++;
            });
            return count / ((s1.length+s2.length)/2);
        };

        var makeScoreDictionary = function(text) {
            var sentenceArray = splitIntoSentences(text);
            var matrix = [];
            sentenceArray.forEach(function(s1) {
                var row = [];
                sentenceArray.forEach(function(s2) {
                    row.push(intersect(s1,s2));
                });
                matrix.push(row);
            });
            var dict = new Array();
            for(var x = 0; x < sentenceArray.length; x++) {
                dict[sentenceArray[x]] = 0;
                for(var y = 0; y < sentenceArray.length; y++) {
                    if(sentenceArray[x]!==sentenceArray[y])
                         dict[sentenceArray[x]] += matrix[x][y];
                }
            }
            return dict;
        };

        this.makeSummary = function(text) {
            var dict = makeScoreDictionary(text);
            var summary = "";
            var paragraphs = splitIntoParagraphs(text);
            paragraphs.forEach(function(p) {
                if(p !== "") {
                    var sentences = splitIntoSentences(p);
                    var maxString = "";
                    var maxScore = 0;
                    sentences.forEach(function(sentence) {
                        if(dict[sentence] > maxScore) {
                            maxScore = dict[sentence];
                            maxString = sentence;
                        }
                    });
                    summary += maxString + "\n";
                }
            });
            return summary;
        };

        var splitIntoSentences = function(p) {
            var temp = p.replace("\r\n", " ").split('. ');
            return temp;
        }

        var splitIntoParagraphs = function(text) {
           console.log("-------------");
           var temp = text.split('\n');
            for(var x in temp) {
                console.log(temp+"\n-----------");
            }
           return temp;
        }
    });
