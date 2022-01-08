/* Magic Mirror
 * Module: MMM-Cookbook
 *
 * By Strifus
 */

Module.register("MMM-Cookbook",{
	// Default module config.
	defaults: {
		url: "modules/MMM-Cookbook/recipes/"
	},

    	start: function () {
		this.getJson();
	},

	// Forward received notification to node_helper
	notificationReceived: function (notification, payload, sender) {
		if (notification == "COOKBOOK_NEXT") {
			this.sendSocketNotification("MMM-Cookbook_GET_JSON_NEXT", this.config.url);
		}
		else if (notification == "COOKBOOK_PREV") {
                        this.sendSocketNotification("MMM-Cookbook_GET_JSON_PREV", this.config.url);
                }

	},

	// Request node_helper to get json from url
	getJson: function () {
		this.sendSocketNotification("MMM-Cookbook_GET_JSON", this.config.url);
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "MMM-Cookbook_JSON_RESULT") {
			// Only continue if the notification came from the request we made
			// This way we can load the module more than once
			if (payload.url === this.config.url)
			{
				this.jsonData = payload.data;
				this.updateDom(100);
			}
		}
	},

	// Get element containing the list with ingredients
	getIngredientsBody: function (recipe) {
                var ingredientsBody;

		try {
		// check for format of json file (distinguishable by "Parts" entry)
		if (recipe.Parts) {
			// extended json file format
			ingredientsBody = document.createElement("div");
			ingredientsBody.setAttribute("class", "table");
			var row, cell;

			// Loop through Parts
			for (j=0; j<recipe.Parts.length; j++) {

				// Add name of current part (if available)
				if (recipe.Parts[j].Name) {
					var partName = document.createElement("div");
					partName.innerHTML = recipe.Parts[j].Name;
					ingredientsBody.appendChild(partName);
				}

				// Add list (table) of ingredients of current part
				// ToDo: find a way to avoid duplicate code (generation of ingredient table)
				var partTable = document.createElement("table");
	                        for (i=0; i<recipe.Parts[j].Ingredients.length; i++) {
	                                row = partTable.insertRow(i);
               		                cell = row.insertCell(0);
	                               	//cell.style.textAlign = "right";
       		                        //cell.width = "50px";
					cell.setAttribute("class", "table-col1");
       		                        cell.innerHTML = recipe.Parts[j].Ingredients[i].Value;
       		                        cell = row.insertCell(1);
               		                //cell.style.textAlign = "left";
       		        	        //cell.width = "40px";
       	 		                cell.setAttribute("class", "table-col2");
					cell.innerHTML = recipe.Parts[j].Ingredients[i].Unit;
       			                cell = row.insertCell(2);
       		   			//cell.style.textAlign = "left";
					cell.setAttribute("class", "table-col3");
	                                cell.innerHTML = recipe.Parts[j].Ingredients[i].Name;
        			}
				ingredientsBody.appendChild(partTable);
			}
		} else {
			// standard json file format
			// ToDo: find a way to avoid duplicate code (generation of ingredient table)
			ingredientsBody = document.createElement("table");
	                ingredientsBody.setAttribute("class", "table");
	                var row, cell;
	                for (i=0; i<recipe.Ingredients.length; i++) {
	                        row = ingredientsBody.insertRow(i);
	                        cell = row.insertCell(0);
	                        //cell.style.textAlign = "right";
	                        //cell.width = "50px";
				cell.setAttribute("class", "table-col1");
	                        cell.innerHTML = recipe.Ingredients[i].Value;
	                        cell = row.insertCell(1);
	                        //cell.style.textAlign = "left";
	                        //cell.width = "40px";
				cell.setAttribute("class", "table-col2");
	                        cell.innerHTML = recipe.Ingredients[i].Unit;
	                        cell = row.insertCell(2);
	                        //cell.style.textAlign = "left";
				cell.setAttribute("class", "table-col3");
	                        cell.innerHTML = recipe.Ingredients[i].Name;
	                }
		}
		} catch (err) {
			ingredientsBody = document.createElement("div");
                        ingredientsBody.innerHTML = "Error fetching ingredients: " + err;
		}
		return ingredientsBody;
	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");

        	// load recipe
		var recipe;
        	if (!this.jsonData) {
			wrapper.innerHTML = "ERROR: Could not read json recipe data from: " + this.config.url;
			return wrapper;
		}
		else {
			recipe = this.jsonData;
        	}

	        // create title
        	var title = document.createElement("div");
        	title.setAttribute("class", "title");
        	title.innerHTML = recipe.Name;

		// create preparation time
                var prepTime = document.createElement("div");
                prepTime.innerHTML = "Zubereitungszeit";

//		var prepTimeBody = document.createElement("div");
//		prepTimeBody.setAttribute("class", "prepTimeBody");
//		prepTimeBody.innerHTML = recipe.Time.Value + "&nbsp;" + recipe.Time.Unit;
// or:
		var prepTimeBody = document.createElement("table");
		prepTimeBody.setAttribute("class", "table");
		var row, cell;
		row = prepTimeBody.insertRow(0);
		cell = row.insertCell(0);
		cell.setAttribute("class", "table-col1");
		cell.innerHTML = recipe.Time.Value;
		cell = row.insertCell(1);
		cell.setAttribute("class", "table-col2");
		cell.innerHTML = recipe.Time.Unit;
		cell = row.insertCell(2);
		cell.setAttribute("class", "table-col3");
		cell.innerHTML = "";

	        // create ingredients
        	var ingredients = document.createElement("div");
        	ingredients.innerHTML = "Zutaten (für " + recipe.Size.Value + "&nbsp;" + recipe.Size.Unit + ")";

	      	// create preparation
	        var preparation = document.createElement("div");
        	preparation.innerHTML = "Zubereitung";

        	var preparationBody = document.createElement("div");
        	preparationBody.setAttribute("class", "preparationBody");
		var prepStr = "";
		for (i=0; i<recipe.Preparation.length; i++){
  			prepStr = prepStr + recipe.Preparation[i].Step + "<br />";
		}
		preparationBody.innerHTML = prepStr;

	        // append child elements
	        wrapper.appendChild(title);
		wrapper.appendChild(prepTime);
		wrapper.appendChild(prepTimeBody);
		wrapper.appendChild(ingredients);
	        wrapper.appendChild(this.getIngredientsBody(recipe));
	        wrapper.appendChild(preparation);
     		wrapper.appendChild(preparationBody);

		return wrapper;
	},

        getHeader: function () {
        return this.data.header;
    },

    // Define styles.
    getStyles: function () {
        return ["MMM-Cookbook.css"];
    },
});
