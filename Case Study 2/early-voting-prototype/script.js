
"use strict";

//Fictional demonstration data.
//Do not use these locations or schedules for real voting.

const votingLocations = {
    sample1: {
        name: "Sample Voting Center A",
        address: "100 Example Street, Sample City, IL",
        dates: "October 20 - November 2 (Sample Dates)",
        hours: "Monday - Friday, 9:00 AM - 5:00 PM"
    },

    sample2: {
        name: "Sample Voting Center B",
        address: "200 Example Avenue, Sample Town, IL",
        dates: "October 20 - November 2 (Sample Dates)",
        hours: "Monday - Saturday, 10:00 AM - 4:00 PM"
    },

    sample3: {
        name: "Sample Voting Center C",
        address: "300 Example Road, Sample Village, IL",
        dates: "October 20 - November 2 (Sample Dates)",
        hours: "Monday - Friday, 8:00 AM - 4:00 PM"
    }
};

//DOM references

const form = document.getElementById("votingForm");
const locationSelect = document.getElementById("location");
const locationError = document.getElementById("locationError");

const searchButton = document.getElementById("searchButton");
const resetButton = document.getElementById("resetButton");
const retryButton = document.getElementById("retryButton");

const loadingIndicator = document.getElementById("loadingIndicator");
const statusMessage = document.getElementById("statusMessage");

const results = document.getElementById("results");
const resultsContent = document.getElementById("resultsContent");
const resultsHeading = document.getElementById("resultsHeading");

const searchFailure = document.getElementById("searchFailure");
const failureHeading = document.getElementById("failureHeading");

let isLoading = false;

//Clear validation errors

function clearValidationError() {
    locationError.textContent = "";
    locationError.hidden = true;

    locationSelect.classList.remove("invalid");
    locationSelect.removeAttribute("aria-invalid");
}

//Show validation error

function showValidationError() {
    locationError.textContent =
        "Please select an early voting location before searching.";

    locationError.hidden = false;

    locationSelect.classList.add("invalid");
    locationSelect.setAttribute("aria-invalid", "true");

    statusMessage.textContent =
        "Search could not begin. Please select a location.";

    locationSelect.focus();
}

//Enable or disable interactive controls

function setLoading(loading) {
    isLoading = loading;

    locationSelect.disabled = loading;
    searchButton.disabled = loading;
    resetButton.disabled = loading;

    searchButton.textContent = loading
        ? "Searching..."
        : "Find Information";

    loadingIndicator.hidden = !loading;

    form.setAttribute("aria-busy", String(loading));
}

//Display search results

function showResults(location) {
    resultsContent.replaceChildren();

    const name = document.createElement("h4");
    name.textContent = location.name;

    const address = document.createElement("p");
    address.textContent = "Address: " + location.address;

    const dates = document.createElement("p");
    dates.textContent = "Voting Dates: " + location.dates;

    const hours = document.createElement("p");
    hours.textContent = "Voting Hours: " + location.hours;

    resultsContent.append(name, address, dates, hours);

    results.hidden = false;
    searchFailure.hidden = true;

    statusMessage.textContent =
        "Voting information loaded for " + location.name + ".";

    resultsHeading.focus();
}

//Display simulated server error

function showSearchFailure() {
    results.hidden = true;
    searchFailure.hidden = false;

    statusMessage.textContent =
        "Search failed. Unable to retrieve voting information.";

    failureHeading.focus();
}

//Handle form submission

function handleSearch(event) {
    if (event) {
        event.preventDefault();
    }

    if (isLoading) {
        return;
    }

    clearValidationError();

    const selectedLocation = locationSelect.value;

    if (!selectedLocation) {
        results.hidden = true;
        searchFailure.hidden = true;
        showValidationError();
        return;
    }

    const location = votingLocations[selectedLocation];

    if (!location) {
        showValidationError();
        return;
    }

    //Hide previous results before starting a new search.
    results.hidden = true;
    searchFailure.hidden = true;

    //Immediately provide loading feedback.
    setLoading(true);

    statusMessage.textContent =
        "Searching for early voting information.";

    //Simulate an asynchronous server request.
    setTimeout(() => {
        setLoading(false);

        //Sample C deliberately simulates a server failure.
        if (selectedLocation === "sample3") {
            showSearchFailure();
        } else {
            showResults(location);
        }
    }, 800);
}

//Form submission

form.addEventListener("submit", handleSearch);

//Clear error when location changes

locationSelect.addEventListener("change", () => {
    clearValidationError();

    results.hidden = true;
    searchFailure.hidden = true;
    statusMessage.textContent = "";
});

//Reset button

form.addEventListener("reset", () => {
    if (isLoading) {
        return;
    }

    //Run after the browser resets the native select.
    setTimeout(() => {
        clearValidationError();

        results.hidden = true;
        searchFailure.hidden = true;

        statusMessage.textContent =
            "Selection cleared. Choose a location to search again.";

        locationSelect.focus();
    }, 0);
});

//Retry button

retryButton.addEventListener("click", () => {
    handleSearch();
});
