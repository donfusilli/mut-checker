#! /usr/bin/env node

var request = require('request');
var cheerio = require('cheerio');
var url = 'http://www.muthead.com/news';


var getLatest = function () {
	var playerLinks = [];
	var playerNames = [];
	request(url, function (error, response, body) {
		if (!error) {
			var $ = cheerio.load(body);
		 	var players = $(".player-name");
		 	for (var i = 0; i < players.length; i++) {
		 		var playerName = players[i].children[0].data;
		 		var href = players[i].parent.attribs.href;
		 		
		 		if (href) {
		 			playerLinks.push(href);
		 			playerNames.push(playerName);
		 		}
		 	}

		 	if (playerLinks) {
 				for (var k = 0; k < playerLinks.length; k++) {

 					request(playerLinks[k], function (error, response, body) {
 						if (!error) {
 							var $ = cheerio.load(body);
 							var stats = $('.player-stats ul > li');
 							var playerName = $('.first-name').text() + ' ' + $('.last-name').text();
 							
 							console.log(playerName);
 							stats.each(function (index, el) {
								console.log($(this).contents().filter(function () {
									return this.nodeType === 3;
								})[0].nodeValue + ' ---- ' + $(this).find('.stat').text());

								if (index === stats.length - 1) {
									console.log('\n');
								}
 							});
 						} else {
 							console.log('Could not load player page');
 						}
 					});
 				}
		 	}
		} else {
			console.log('Request failed');
		}
	});
};

getLatest();