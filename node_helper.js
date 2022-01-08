var NodeHelper = require('node_helper');
var fetch = require('node-fetch');

const fs = require('fs');
const path = require('path');

module.exports = NodeHelper.create({
	start: function () {
		console.log('MMM-Cookbook helper started...');
	},

	getJson: function (url) {
		var self = this;

		try {
			// get list with files in recipe directory
			const items = fs.readdirSync(url);

			// get list of *.json files in recipe directory
			self.recipeList = items.filter(file => {
				return path.extname(file).toLowerCase() === '.json';
			});

			// get first recipe in list
			self.curIdx = 0;
			var recipeFile = self.recipeList[self.curIdx];
//			console.log('MMM-Cookbook: Recipe read: ' + recipeFile);

			// read the JSON recipe string
			const data = fs.readFileSync(url + recipeFile, 'utf8');

			// parse JSON string to JSON object
                        const recipe = JSON.parse(data);

                        // Send the json data back with the url to distinguish it on the receiving part
                        self.sendSocketNotification("MMM-Cookbook_JSON_RESULT", {url: url, data: recipe});
                        console.log('MMM-Cookbook: Recipe file fetched: ' + recipeFile);
		} catch (err) {
			console.log('MMM-Cookbook: Error reading recipe file/directory: ${err}');
		}
	},

	getJsonNext: function (url) {
                var self = this;

                try {
                        // get next recipe in list
			self.curIdx = self.curIdx + 1;
			if (self.curIdx >= self.recipeList.length) {
				self.curIdx = 0;
			}
			var recipeFile = self.recipeList[self.curIdx];
//                      console.log('MMM-Cookbook: Recipe read: ' + recipeFile);

                        // read the JSON recipe string
			const data = fs.readFileSync(url + recipeFile, 'utf8');

                        // parse JSON string to JSON object
                        const recipe = JSON.parse(data);

                        // Send the json data back with the url to distinguish it on the receiving part
                        self.sendSocketNotification("MMM-Cookbook_JSON_RESULT", {url: url, data: recipe});
                        console.log('MMM-Cookbook: Recipe file fetched: ' + recipeFile);
                } catch (err) {
                        console.log('MMM-Cookbook: Error reading recipe file/directory: ${err}');
                }
	},

        getJsonPrev: function (url) {
                var self = this;

                try {
                        // get previous recipe in list
                        self.curIdx = self.curIdx - 1;
                        if (self.curIdx < 0) {
				// TODO: catch case when length == 0!
                                self.curIdx = self.recipeList.length - 1;
                        }
                        var recipeFile = self.recipeList[self.curIdx];
//                      console.log('MMM-Cookbook: Recipe read: ' + recipeFile);

                        // read the JSON recipe string
			const data = fs.readFileSync(url + recipeFile, 'utf8');

                        // parse JSON string to JSON object
                        const recipe = JSON.parse(data);

                        // Send the json data back with the url to distinguish it on the receiving part
                        self.sendSocketNotification("MMM-Cookbook_JSON_RESULT", {url: url, data: recipe});
                        console.log('MMM-Cookbook: Recipe file fetched: ' + recipeFile);
                } catch (err) {
                        console.log('MMM-Cookbook: Error reading recipe file/directory: ${err}');
                }
        },


	// Subclass socketNotificationReceived received.
	socketNotificationReceived: function (notification, url) {
		if (notification === "MMM-Cookbook_GET_JSON") {
			this.getJson(url);
		}
		if (notification === "MMM-Cookbook_GET_JSON_NEXT") {
			this.getJsonNext(url);
		}
		if (notification === "MMM-Cookbook_GET_JSON_PREV") {
			this.getJsonPrev(url);
		}
	}
});
