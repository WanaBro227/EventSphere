
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    if (!requireRole(["staff", "admin"])) return;

    document.getElementById("scanner-form")
        ?.addEventListener("submit", validateTicket);
});


async function validateTicket(event) {
    event.preventDefault();

    const input = document.getElementById("ticket-code");
    const button = document.getElementById("scan-button");
    const result = document.getElementById("scanner-result");

    const ticketCode = input.value.trim();

    if (!ticketCode) {
        showScannerResult("Please enter a ticket code.", false);
        return;
    }

    setButtonLoading(button, true, "Validating...");

    try {
        const response = await API.post(
            "/api/tickets/check-in",
            {
                ticket_code: ticketCode
            }
        );

        showScannerResult(
            response.message || "Ticket check-in completed.",
            true
        );

        input.value = "";

    } catch (error) {
        showScannerResult(error.message, false);

    } finally {
        setButtonLoading(button, false);
    }
}


function showScannerResult(message, success) {
    const result = document.getElementById("scanner-result");

    result.className = success
        ? "scanner-result success"
        : "scanner-result error";

    result.innerHTML = `
        <h4>${success ? "Ticket Result" : "Check-in Failed"}</h4>
        <p>${escapeHTML(message)}</p>
    `;
}
