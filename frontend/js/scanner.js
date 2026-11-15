
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    console.log("[EventSphere] Scanner JavaScript loaded.");

    const form = document.getElementById("scanner-form");
    const input = document.getElementById("ticket-code");
    const button = document.getElementById("scan-button");

    if (!form || !input || !button) {
        console.error("[Scanner] Required HTML elements not found.");
        return;
    }

    // Register the handler before checking the frontend role.
    form.addEventListener("submit", validateTicket);

    console.log("[Scanner] Validate button handler registered.");

    try {
        if (typeof requireRole !== "function") {
            throw new Error("Authentication function requireRole() is unavailable.");
        }

        const authorized = requireRole(["staff", "admin"]);

        if (authorized === false) {
            button.disabled = true;
            input.disabled = true;
            showScannerResult(
                "You are not authorized to access the ticket scanner.",
                false
            );
        }
    } catch (error) {
        console.error("[Scanner] Authentication error:", error);
        showScannerResult(
            "Authentication check failed. Please log in again.",
            false
        );
    }
});


async function validateTicket(event) {
    event.preventDefault();

    console.log("[Scanner] Validate button clicked.");

    const input = document.getElementById("ticket-code");
    const button = document.getElementById("scan-button");

    const ticketCode = input.value.trim();

    if (!ticketCode) {
        showScannerResult("Please enter a ticket code.", false);
        return;
    }

    try {
        setButtonLoading(button, true, "Validating...");

        console.log("[Scanner] Sending validation request:", ticketCode);

        const response = await API.post(
            "/api/tickets/check-in",
            {
                ticket_code: ticketCode
            }
        );

        console.log("[Scanner] Backend response:", response);

        if (!response.success) {
            showScannerResult(
                response.message || "Ticket validation was unsuccessful.",
                false
            );
            return;
        }

        showScannerResult(
            response.message || "Check-in successful.",
            true
        );

        input.value = "";

    } catch (error) {
        console.error("[Scanner] Validation error:", error);

        showScannerResult(
            error.message || "Unable to validate this ticket.",
            false
        );

    } finally {
        setButtonLoading(button, false);
    }
}


function showScannerResult(message, success) {
    const result = document.getElementById("scanner-result");

    if (!result) return;

    result.className = success
        ? "scanner-result success"
        : "scanner-result error";

    result.innerHTML = `
        <h4>${success ? "Ticket Result" : "Check-in Failed"}</h4>
        <p>${escapeHTML(message)}</p>
    `;

    result.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}
