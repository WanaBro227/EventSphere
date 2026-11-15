
"use strict";

/* =========================================
   EVENTSPHERE - TICKET SCANNER
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log("[EventSphere] Scanner initialized.");

    const form = document.getElementById("scanner-form");
    const input = document.getElementById("ticket-code");
    const button = document.getElementById("scan-button");
    const logoutButton = document.getElementById("logout-button");

    // Register logout event.
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {

            if (typeof Auth !== "undefined") {
                Auth.logout();
            } else {
                console.error("[Scanner] Auth object unavailable.");
            }

        });
    }

    if (!form || !input || !button) {
        console.error("[Scanner] Required HTML elements are missing.");
        return;
    }

    form.addEventListener("submit", validateTicket);

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            form.requestSubmit();
        }
    });

    console.log("[Scanner] Validation and logout handlers registered.");

});


/* =========================================
   VALIDATE TICKET
========================================= */

async function validateTicket(event) {

    event.preventDefault();

    const input = document.getElementById("ticket-code");
    const button = document.getElementById("scan-button");

    if (!input || !button) {
        console.error("[Scanner] Input or button not found.");
        return;
    }

    const ticketCode = input.value.trim();

    if (!ticketCode) {
        showScannerResult("Please enter a ticket code.", false);
        input.focus();
        return;
    }

    if (typeof API === "undefined" || typeof API.post !== "function") {
        showScannerResult(
            "API configuration is unavailable. Please refresh the page.",
            false
        );
        return;
    }

    setButtonLoading(button, true, "Validating...");

    try {

        console.log("[Scanner] Validating ticket:", ticketCode);

        const response = await API.post(
            "/api/tickets/check-in",
            {
                ticket_code: ticketCode
            }
        );

        console.log("[Scanner] Validation response:", response);

        if (response && response.success === true) {

            showScannerResult(
                response.message || "Check-in successful.",
                true
            );

            input.value = "";
            input.focus();

        } else {

            showScannerResult(
                response?.message || "Ticket validation failed.",
                false
            );

        }

    } catch (error) {

        console.error("[Scanner] Validation error:", error);

        let message = error.message || "Unable to validate ticket.";

        if (message.includes("401")) {
            message = "Your session has expired. Please log in again.";
        }

        if (message.includes("403")) {
            message = "Access denied. Only staff and administrators can validate tickets.";
        }

        showScannerResult(message, false);

    } finally {

        setButtonLoading(button, false);

    }

}


/* =========================================
   DISPLAY VALIDATION RESULT
========================================= */

function showScannerResult(message, success) {

    const result = document.getElementById("scanner-result");

    if (!result) return;

    result.className = success
        ? "scanner-result success"
        : "scanner-result error";

    const heading = document.createElement("h4");

    heading.textContent = success
        ? "Ticket Validated"
        : "Check-in Failed";

    const paragraph = document.createElement("p");
    paragraph.textContent = message;

    result.replaceChildren(heading, paragraph);

    result.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

}


/* =========================================
   BUTTON LOADING STATE
========================================= */

function setButtonLoading(button, loading, loadingText = "Please wait...") {

    if (!button) return;

    if (loading) {

        button.dataset.originalText = button.textContent;
        button.disabled = true;
        button.textContent = loadingText;

    } else {

        button.disabled = false;

        button.textContent =
            button.dataset.originalText || "Validate Ticket";

        delete button.dataset.originalText;

    }

}
