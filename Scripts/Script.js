/* =========================================
   Search Suggestions
========================================= */

const input = document.getElementById("q");
const suggestionsBox = document.getElementById("suggestions");

let selectedIndex = -1;
let currentSuggestions = [];

/* Fetch Google Suggestions */
function fetchSuggestions(query) {

    if (!query.trim()) {

        suggestionsBox.style.display = "none";
        return;
    }

    // Remove previous JSONP request
    const oldScript =
        document.getElementById("jsonpScript");

    if (oldScript) {
        oldScript.remove();
    }

    // Create new JSONP request
    const script =
        document.createElement("script");

    script.id = "jsonpScript";

    script.src =
        "https://suggestqueries.google.com/complete/search" +
        "?client=firefox" +
        "&q=" + encodeURIComponent(query) +
        "&callback=handleSuggestions";

    document.body.appendChild(script);
}

/* JSONP Callback */
function handleSuggestions(data) {

    currentSuggestions = data[1];

    renderSuggestions(currentSuggestions);
}

/* Render Suggestion List */
function renderSuggestions(suggestions) {

    suggestionsBox.innerHTML = "";

    if (!suggestions.length) {

        suggestionsBox.style.display = "none";
        return;
    }

    suggestions.forEach((text, index) => {

        const item =
            document.createElement("div");

        item.className = "suggestion-item";

        item.textContent = text;

        item.addEventListener("mousedown", () => {

            input.value = text;

            suggestionsBox.style.display = "none";
        });

        suggestionsBox.appendChild(item);
    });

    selectedIndex = -1;

    suggestionsBox.style.display = "block";
}

/* Keyboard Navigation */
function updateSelection(items) {

    items.forEach(item => {

        item.classList.remove("active");
    });

    if (selectedIndex >= 0) {

        items[selectedIndex]
            .classList.add("active");

        input.value =
            currentSuggestions[selectedIndex];
    }
}

/* Input Event */
input.addEventListener("input", () => {

    fetchSuggestions(input.value);
});

/* Keyboard Controls */
input.addEventListener("keydown", (e) => {

    const items =
        document.querySelectorAll(".suggestion-item");

    if (!items.length) return;

    if (e.key === "ArrowDown") {

        e.preventDefault();

        selectedIndex++;

        if (selectedIndex >= items.length) {
            selectedIndex = 0;
        }

        updateSelection(items);
    }

    else if (e.key === "ArrowUp") {

        e.preventDefault();

        selectedIndex--;

        if (selectedIndex < 0) {
            selectedIndex = items.length - 1;
        }

        updateSelection(items);
    }

    else if (e.key === "Enter") {

        if (selectedIndex >= 0) {

            input.value =
                currentSuggestions[selectedIndex];
        }

        suggestionsBox.style.display = "none";
    }

    else if (e.key === "Escape") {

        suggestionsBox.style.display = "none";
    }
});

/* Hide Suggestions When Clicking Away */
document.addEventListener("click", (e) => {

    if (
        !suggestionsBox.contains(e.target) &&
        e.target !== input
    ) {

        suggestionsBox.style.display = "none";
    }
});


/* =========================================
   Theme Menu
========================================= */

const themeButton =
    document.getElementById("themeButton");

const themeMenu =
    document.getElementById("themeMenu");

/* Open / Close Theme Menu */
themeButton.addEventListener("click", (e) => {

    e.preventDefault();

    if (themeMenu.style.display === "block") {

        themeMenu.style.display = "none";
    }

    else {

        themeMenu.style.display = "block";
    }
});


/* =========================================
   Theme System
========================================= */

/* Available Themes */
const themes = {

    classic: {
        className: ""
    },

    dark: {
        className: "dark-theme"
    }

};

/* Apply Theme */
function applyTheme(themeName) {

    // Remove all theme classes first
    document.body.classList.remove(
        "dark-theme"
    );

    // Apply selected theme
    const theme = themes[themeName];

    if (theme && theme.className) {

        document.body.classList.add(
            theme.className
        );
    }

    // Save theme
    localStorage.setItem(
        "theme",
        themeName
    );
}

/* Theme Menu Clicks */
document.querySelectorAll(".theme-item")
    .forEach(item => {

        item.addEventListener("click", () => {

            const themeName =
                item.dataset.theme;

            applyTheme(themeName);

            themeMenu.style.display = "none";
        });
    });

/* Load Saved Theme */
const savedTheme =
    localStorage.getItem("theme");

if (savedTheme) {

    applyTheme(savedTheme);
}

/* Close Theme Menu When Clicking Away */
document.addEventListener("click", (e) => {

    if (
        !themeMenu.contains(e.target) &&
        e.target !== themeButton
    ) {

        themeMenu.style.display = "none";
    }
});