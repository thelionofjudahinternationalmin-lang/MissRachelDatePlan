/*
  A Special Date for My Love ❤️

  To receive email notifications:
  1. Set up Web3Forms.
  2. Obtain your access key.
  3. Paste the key into ACCESS_KEY below.
*/

const ACCESS_KEY = "47d80c20-ae6f-4396-8d78-d4941bb20e52";

let selectedDateType = "";

const dinnerLocations = [
    "Restaurant",
    "Beachside Restaurant",
    "Hotel Restaurant",
    "Outdoor Dining",
    "Another Location"
];

const picnicLocations = [
    "Beach",
    "Garden",
    "Park",
    "Quiet Outdoor Location",
    "Another Location"
];

function showPage(id) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function openForm(type) {
    selectedDateType = type;

    document.getElementById("dateType").value = type;

    document.getElementById("formTitle").textContent =
        type === "Dinner"
            ? "Let's Plan Our Dinner Date 🍷"
            : "Let's Plan Our Love Picnic 🌷";

    const locationSelect = document.getElementById("location");

    locationSelect.innerHTML =
        '<option value="">Choose a location</option>';

    const locations =
        type === "Dinner" ? dinnerLocations : picnicLocations;

    locations.forEach(location => {
        const option = document.createElement("option");

        option.value = location;
        option.textContent = location;

        locationSelect.appendChild(option);
    });

    showPage("formPage");
}

// Prevent choosing a date in the past.
const dateInput = document.getElementById("date");

const today = new Date();
const localToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
).toISOString().split("T")[0];

dateInput.min = localToday;

// Collect form information.
function getFormData() {
    const form = document.getElementById("dateForm");
    const data = new FormData(form);

    const result = {};

    data.forEach((value, key) => {
        if (String(value).trim() !== "") {
            result[key] = value;
        }
    });

    result["Date Type"] = selectedDateType;

    return result;
}

// Display the information for review.
document.getElementById("dateForm").addEventListener(
    "submit",
    function(event) {
        event.preventDefault();

        if (!this.reportValidity()) {
            return;
        }

        const details = getFormData();
        const summary = document.getElementById("summary");

        summary.replaceChildren();

        Object.entries(details).forEach(([key, value]) => {
            const paragraph = document.createElement("p");
            const strong = document.createElement("strong");

            strong.textContent = key + ": ";
            paragraph.appendChild(strong);
            paragraph.appendChild(document.createTextNode(value));

            summary.appendChild(paragraph);
        });

        document.getElementById("status").textContent = "";

        showPage("review");
    }
);

// Send the date plan using Web3Forms.
async function sendDatePlan() {
    const status = document.getElementById("status");

    if (!ACCESS_KEY.trim()) {
        status.textContent =
            "Email is not connected yet. Add your Web3Forms access key in script.js before sending.";
        return;
    }

    const button = document.querySelector("#review button");

    button.disabled = true;
    button.textContent = "Sending with love...";

    status.textContent = "";

    try {
        const details = getFormData();

        const payload = {
            access_key: ACCESS_KEY,
            subject: "New romantic " + selectedDateType + " date plan",
            from_name: "A Special Date for My Love",
            ...details
        };

        const response = await fetch(
            "https://api.web3forms.com/submit",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(payload)
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error("The submission could not be completed.");
        }

        showPage("success");

    } catch (error) {
        status.textContent =
            "We couldn't send your choices. Check your internet connection and email setup, then try again.";

        console.error(error);

    } finally {
        button.disabled = false;
        button.textContent = "Send My Date Plan ❤️";
    }
}