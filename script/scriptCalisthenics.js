document.addEventListener("DOMContentLoaded", function () {
    const checklist = document.getElementById("checklist");
    const scrollButton = document.getElementById("scroll-button");
    const clearButton = document.getElementById("clear-button");
    const attributeTable = document.getElementById("attribute-table");

    let attributeCounts = {};

    function loadJSON(callback) {
        fetch("script/checklist.json")
            .then(response => response.json())
            .then(data => callback(data))
            .catch(error => console.error(error));
    }

    function createChecklistItem(item) {
        const listItem = document.createElement("li");
        listItem.className = "checklist-item";
        listItem.dataset.selected = item.checked;

        const exerciseInfo = document.createElement("div");
        exerciseInfo.className = "exercise-info";
        
        const exerciseName = document.createElement("h2");
        exerciseName.textContent = item.name;

        const exerciseAttributes = document.createElement("p");
        exerciseAttributes.textContent = "Attributes: " + item.attributes.join(", ");

        const exerciseDescription = document.createElement("p");
        exerciseDescription.textContent = item.description;

        exerciseInfo.appendChild(exerciseName);
        exerciseInfo.appendChild(exerciseAttributes);
        exerciseInfo.appendChild(exerciseDescription);

        listItem.appendChild(exerciseInfo);
        checklist.appendChild(listItem);

        listItem.addEventListener("click", () => {
            listItem.classList.toggle("selected");
            listItem.dataset.selected = listItem.classList.contains("selected");
            updateAttributeCounts();
        });

        // Initialize attribute counts
        item.attributes.forEach(attribute => {
            if (!attributeCounts[attribute]) {
                attributeCounts[attribute] = 0;
            }
        });
    }

    function updateAttributeCounts() {
        // Reset counts to zero
        Object.keys(attributeCounts).forEach(attribute => {
            attributeCounts[attribute] = 0;
        });

        // Count selected items
        const selectedItems = document.querySelectorAll(".checklist-item.selected");
        selectedItems.forEach(selectedItem => {
            const attributes = selectedItem.querySelector(".exercise-info p").textContent
                .replace("Attributes: ", "")
                .split(", ");
            attributes.forEach(attribute => {
                attributeCounts[attribute]++;
            });
        });

        // Update the attribute table
        updateAttributeTable();
    }

    function getIntensity(count) {
        if (count >= 3) {
            return "Major";
        } else if (count === 2) {
            return "Moderate";
        } else if (count === 1) {
            return "Minor";
        } else {
            return "None";
        }
    }

    function updateAttributeTable() {
        attributeTable.innerHTML = "";
    
        const sortedAttributes = Object.keys(attributeCounts).sort(); // Sort attributes alphabetically
    
        const tableHeader = document.createElement("tr");
        const headerCell1 = document.createElement("th");
        headerCell1.textContent = "Attribute";
        tableHeader.appendChild(headerCell1);
    
        const headerCell2 = document.createElement("th");
        headerCell2.textContent = "Count";
        tableHeader.appendChild(headerCell2);
    
        const headerCell3 = document.createElement("th");
        headerCell3.textContent = "Intensity";
        tableHeader.appendChild(headerCell3);
    
        attributeTable.appendChild(tableHeader);
    
        sortedAttributes.forEach(attribute => {
            const row = document.createElement("tr");
            const cell1 = document.createElement("td");
            cell1.textContent = attribute;
            row.appendChild(cell1);
    
            const cell2 = document.createElement("td");
            cell2.textContent = attributeCounts[attribute];
            row.appendChild(cell2);
    
            const cell3 = document.createElement("td");
            const intensity = getIntensity(attributeCounts[attribute]);
            cell3.textContent = intensity;
            row.appendChild(cell3);
    
            if (intensity === "Major") {
                cell1.classList.add("major-intensity");
            } else if (intensity === "Moderate") {
                cell1.classList.add("moderate-intensity");
            }
    
            attributeTable.appendChild(row);
        });
    }
    const searchBar = document.querySelector(".search_bar input");

    function filterExercises(query) {
        const lowerCaseQuery = query.toLowerCase().replace("-", "");

        const items = document.querySelectorAll(".checklist-item");
        items.forEach(item => {
            const exerciseName = item.querySelector(".exercise-info h2").textContent.toLowerCase().replace("-", "");
            const attributes = item.querySelector(".exercise-info p").textContent.toLowerCase().replace("attributes: ", "").replace("-", "");

            const isVisible = exerciseName.includes(lowerCaseQuery) || attributes.includes(lowerCaseQuery);
            item.style.display = isVisible ? "block" : "none";
        });
    }

    searchBar.addEventListener("input", () => {
        const searchQuery = searchBar.value.trim();
        filterExercises(searchQuery);
    });
    
    
    loadJSON(data => {
        data.forEach(item => createChecklistItem(item));
        updateAttributeCounts();
    });

    scrollButton.addEventListener("click", () => {
        checklist.scrollTop = 0;
    });

    clearButton.addEventListener("click", () => {
        // Clear all selections
        const selectedItems = document.querySelectorAll(".checklist-item.selected");
        selectedItems.forEach(selectedItem => {
            selectedItem.classList.remove("selected");
            selectedItem.dataset.selected = "false";
        });

        // Update attribute counts and table
        updateAttributeCounts();
    });
});
