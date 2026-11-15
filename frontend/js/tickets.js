
"use strict";

// ========================================
// MY TICKETS PAGE INITIALIZATION
// ========================================

document.addEventListener("DOMContentLoaded", async () => {

    // Check user authentication.
    if (!requireAuth()) {
        return;
    }

    // Load the user's tickets.
    await loadMyTickets();

});


// ========================================
// LOAD MY TICKETS
// ========================================

async function loadMyTickets() {

    const container = document.getElementById("tickets-list");

    // Check whether the tickets container exists.
    if (!container) {
        console.error("Tickets container (#tickets-list) not found.");
        return;
    }

    // Display loading state.
    container.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted">Loading your tickets...</p>
        </div>
    `;

    try {

        // Request authenticated user's tickets.
        const response = await API.get("/api/tickets/me");

        // Normalize API response into an array.
        const tickets = normalizeList(response);


        // ========================================
        // EMPTY TICKETS STATE
        // ========================================

        if (!tickets.length) {

            container.innerHTML = `
                <div class="col-12">
                    <div class="empty-state text-center p-5">

                        <div class="mb-3">
                            <i class="bi bi-ticket-perforated"
                               style="font-size: 3rem;"></i>
                        </div>

                        <h5>No tickets yet</h5>

                        <p class="text-muted">
                            Your tickets will appear here after a successful booking.
                        </p>

                        <a href="events.html" class="btn btn-primary">
                            Explore Events
                        </a>

                    </div>
                </div>
            `;

            return;
        }


        // ========================================
        // DISPLAY TICKETS
        // ========================================

        container.innerHTML = tickets.map(ticket => {

            // Get QR code path.
            const qrPath = ticket.qr_code_path || "";


            // Build QR code URL.
            const qrUrl = qrPath
                ? (
                    qrPath.startsWith("http")
                        ? qrPath
                        : `${CONFIG.API_BASE_URL}${qrPath.startsWith("/") ? "" : "/"}${qrPath}`
                )
                : "";


            // Determine ticket status.
            const ticketStatus = ticket.status || "Unknown";

            const statusClass = getTicketStatusClass(ticketStatus);


            // Return ticket card.
            return `
                <div class="col-md-6 col-lg-4">

                    <div class="custom-card p-4 h-100">

                        <div class="d-flex justify-content-between align-items-start mb-3">

                            <h5 class="mb-0">
                                <i class="bi bi-ticket-perforated"></i>
                                Ticket
                            </h5>

                            <span class="badge ${statusClass}">
                                ${escapeHTML(ticketStatus)}
                            </span>

                        </div>


                        <div class="mb-3">

                            <p class="text-muted-custom mb-1">
                                Ticket Code
                            </p>

                            <h6>
                                ${escapeHTML(ticket.ticket_code || "N/A")}
                            </h6>

                        </div>


                        <div class="mb-3">

                            <p class="text-muted-custom mb-1">
                                Event ID
                            </p>

                            <p class="mb-0">
                                ${escapeHTML(ticket.event_id ?? "N/A")}
                            </p>

                        </div>


                        <!-- QR CODE -->

                        <div class="text-center my-4">

                            ${
                                qrUrl
                                    ? `
                                        <img
                                            src="${escapeHTML(qrUrl)}"
                                            class="ticket-qr"
                                            alt="Ticket QR code"
                                            loading="lazy"
                                            onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                                        >

                                        <p class="qr-error text-muted small"
                                           style="display:none;">
                                            QR code could not be loaded.
                                        </p>
                                    `
                                    : `
                                        <p class="text-muted small">
                                            QR code is not available.
                                        </p>
                                    `
                            }

                        </div>


                        <!-- TICKET INFORMATION -->

                        <div class="border-top pt-3">

                            <p class="small text-muted mb-1">
                                <i class="bi bi-calendar3"></i>
                                Created
                            </p>

                            <p class="small mb-0">
                                ${escapeHTML(formatDate(ticket.created_at))}
                            </p>

                        </div>

                    </div>

                </div>
            `;

        }).join("");


    } catch (error) {

        console.error("Load Tickets Error:", error);


        // Handle authentication errors.
        if (
            error.status === 401 ||
            error.status === 403
        ) {

            Auth.clearSession();

            window.location.href = "/login.html";

            return;
        }


        // Display error message.
        container.innerHTML = `
            <div class="col-12">

                <div class="alert alert-danger">

                    <h5>Unable to Load Tickets</h5>

                    <p class="mb-0">
                        ${escapeHTML(error.message || "Something went wrong while loading your tickets.")}
                    </p>

                    <button
                        class="btn btn-outline-danger btn-sm mt-3"
                        onclick="loadMyTickets()"
                    >
                        Try Again
                    </button>

                </div>

            </div>
        `;

    }

}


// ========================================
// TICKET STATUS BADGE
// ========================================

function getTicketStatusClass(status) {

    switch (String(status).toLowerCase()) {

        case "valid":
            return "bg-success";

        case "used":
        case "checked_in":
        case "checked-in":
            return "bg-secondary";

        case "cancelled":
        case "canceled":
            return "bg-danger";

        case "expired":
            return "bg-warning text-dark";

        default:
            return "bg-secondary";
    }

}
