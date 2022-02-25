/* Magic Mirror
 * Module: MMM-Cookbook
 *
 * By Strifus
 */

Module.register("MMM-Cookbook",{
    // Default module configuration
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
            if (recipe.parts) {
                // advanced json file format
                ingredientsBody = document.createElement("div");
                ingredientsBody.setAttribute("class", "table");
                var row, cell;

                // Loop through Parts
                for (j=0; j<recipe.parts.length; j++) {

                    // Add name of current part (if available)
                    if (recipe.parts[j].name) {
                        var partName = document.createElement("div");
                        partName.innerHTML = recipe.parts[j].name;
                        ingredientsBody.appendChild(partName);
                    }

                    // Add list (table) of ingredients of current part
                    // ToDo: find a way to avoid duplicate code (generation of ingredient table)
                    var partTable = document.createElement("table");
                    for (i=0; i<recipe.parts[j].ingredients.length; i++) {
                        row = partTable.insertRow(i);
                        cell = row.insertCell(0);
                        cell.setAttribute("class", "table-col1");
                        cell.innerHTML = recipe.parts[j].ingredients[i].value;
                        cell = row.insertCell(1);
                        cell.setAttribute("class", "table-col2");
                        cell.innerHTML = recipe.parts[j].ingredients[i].unit;
                        cell = row.insertCell(2);
                        cell.setAttribute("class", "table-col3");
                        cell.innerHTML = recipe.parts[j].ingredients[i].name;
                    }
                    ingredientsBody.appendChild(partTable);
                }
            } else {
                // simple json file format
                // ToDo: find a way to avoid duplicate code (generation of ingredient table)
                ingredientsBody = document.createElement("table");
                ingredientsBody.setAttribute("class", "table");
                var row, cell;
                for (i=0; i<recipe.ingredients.length; i++) {
                    row = ingredientsBody.insertRow(i);
                    cell = row.insertCell(0);
                    cell.setAttribute("class", "table-col1");
                    cell.innerHTML = recipe.ingredients[i].value;
                    cell = row.insertCell(1);
                    cell.setAttribute("class", "table-col2");
                    cell.innerHTML = recipe.ingredients[i].unit;
                    cell = row.insertCell(2);
                    cell.setAttribute("class", "table-col3");
                    cell.innerHTML = recipe.ingredients[i].name;
                }
            }
        } catch (err) {
            ingredientsBody = document.createElement("div");
                        ingredientsBody.innerHTML = "Error fetching ingredients: " + err;
        }
        return ingredientsBody;
    },

    // Override dom generator
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
        title.innerHTML = recipe.name;

        // create preparation time
        var prepTime = document.createElement("div");
        prepTime.innerHTML = this.translate("PREPTIME");

//      var prepTimeBody = document.createElement("div");
//      prepTimeBody.setAttribute("class", "prepTimeBody");
//      prepTimeBody.innerHTML = recipe.time.value + "&nbsp;" + recipe.time.unit;
// or:
        var prepTimeBody = document.createElement("table");
        prepTimeBody.setAttribute("class", "table");
        var row, cell;
        row = prepTimeBody.insertRow(0);
        cell = row.insertCell(0);
        cell.setAttribute("class", "table-col1");
        cell.innerHTML = recipe.time.value;
        cell = row.insertCell(1);
        cell.setAttribute("class", "table-col2");
        cell.innerHTML = recipe.time.unit;
        cell = row.insertCell(2);
        cell.setAttribute("class", "table-col3");
        cell.innerHTML = "";

        // create ingredients
        var ingredients = document.createElement("div");
        ingredients.innerHTML = this.translate("INGREDIENTS") + recipe.size.value + "&nbsp;" + recipe.size.unit + ")";

        // create preparation
        var preparation = document.createElement("div");
        preparation.innerHTML = this.translate("PREP");

        var preparationBody = document.createElement("div");
        preparationBody.setAttribute("class", "preparationBody");
        var prepStr = "";
        for (i=0; i<recipe.preparation.length; i++){
            prepStr = prepStr + recipe.preparation[i].step + "<br />";
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

    // Header
    getHeader: function () {
        return this.data.header;
    },

    // Define styles
    getStyles: function () {
        return ["MMM-Cookbook.css"];
    },
    
    // Translations
    getTranslations: function() {
        return {
            en: "translations/en.json",
            de: "translations/de.json"
        }
    }

});
