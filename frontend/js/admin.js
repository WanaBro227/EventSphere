
"use strict";

document.addEventListener("DOMContentLoaded", () => {

    if (!requireRole(["admin"])) return;

    const path = window.location.pathname;


    // ADMIN DASHBOARD
    if (path.endsWith("/admin/dashboard.html")) {
        loadAdminDashboard();
    }


    // VENUE MANAGEMENT
    if (path.endsWith("/admin/venues.html")) {

        loadAdminVenues();

        document.getElementById("admin-venue-form")
            ?.addEventListener("submit", createVenue);
    }


    // EVENT MANAGEMENT
    if (path.endsWith("/admin/events.html")) {

        loadAdminEvents();

        document.getElementById("admin-event-form")
            ?.addEventListener("submit", createEvent);
    }


    // BOOKING MANAGEMENT
    if (path.endsWith("/admin/bookings.html")) {

        loadAdminBookings();

        document.getElementById("refresh-admin-bookings")
            ?.addEventListener("click", loadAdminBookings);
    }


    // VENUE HIRE REQUESTS
    if (path.endsWith("/admin/venue-hire-requests.html")) {
        loadAdminVenueHireRequests();
    }


    // AGENT MONITOR
    if (path.endsWith("/admin/agent-monitor.html")) {

        loadAgentLogs();

        document.getElementById("refresh-agent-logs")
            ?.addEventListener("click", loadAgentLogs);
    }

});


// =========================================================
// ADMIN DASHBOARD
// =========================================================

async function loadAdminDashboard() {

    try {

        const summary = await API.get("/api/admin/summary");

        setStat("total-users", summary.total_users);
        setStat("total-venues", summary.total_venues);
        setStat("total-events", summary.total_events);
        setStat("total-bookings", summary.total_bookings);
        setStat("pending-hire", summary.pending_venue_hire);

    } catch (error) {

        showMessage(error.message, "danger");

    }
}


function setStat(elementId, value) {

    const element = document.getElementById(elementId);

    if (element) {

        element.textContent =
            value === undefined || value === null ? "—" : value;

    }
}


// =========================================================
// VENUE MANAGEMENT
// =========================================================

async function loadAdminVenues() {

    const tbody = document.getElementById("admin-venues-list");

    if (!tbody) return;

    try {

        const response = await API.get("/api/venues/");
        const venues = normalizeList(response);

        if (!venues.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">
                        No venues found.
                    </td>
                </tr>
            `;

            return;
        }


        tbody.innerHTML = venues.map(venue => `

            <tr>

                <td>${escapeHTML(venue.id)}</td>

                <td>${escapeHTML(venue.name)}</td>

                <td>${escapeHTML(venue.city)}</td>

                <td>${escapeHTML(venue.capacity)}</td>

                <td>
                    <span class="badge ${
                        venue.is_active ? "bg-success" : "bg-secondary"
                    }">
                        ${venue.is_active ? "Active" : "Inactive"}
                    </span>
                </td>

            </tr>

        `).join("");


    } catch (error) {

        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-danger">
                    ${escapeHTML(error.message)}
                </td>
            </tr>
        `;

    }

}


async function createVenue(event) {

    event.preventDefault();

    const form = event.target;

    const button = form.querySelector("button[type='submit']");

    const payload = {

        name: document.getElementById("venue-name").value.trim(),

        city: document.getElementById("venue-city").value.trim(),

        address: document.getElementById("venue-address").value.trim(),

        capacity: Number(
            document.getElementById("venue-capacity").value
        ),

        description:
            document.getElementById("venue-description").value.trim() || null,

        image_url:
            document.getElementById("venue-image").value.trim() || null

    };


    if (
        !payload.name ||
        !payload.city ||
        !payload.address ||
        payload.capacity < 1
    ) {

        showMessage(
            "Please enter valid venue details.",
            "danger"
        );

        return;
    }


    setButtonLoading(button, true, "Creating...");


    try {

        await API.post("/api/venues/", payload);

        showMessage(
            "Venue created successfully.",
            "success"
        );

        form.reset();

        await loadAdminVenues();


    } catch (error) {

        showMessage(error.message, "danger");

    } finally {

        setButtonLoading(button, false);

    }

}


// =========================================================
// EVENT MANAGEMENT
// =========================================================

async function loadAdminEvents() {

    const tbody = document.getElementById("admin-events-list");

    if (!tbody) return;

    try {

        const response = await API.get("/api/events/");

        const events = normalizeList(response);


        if (!events.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">
                        No events found.
                    </td>
                </tr>
            `;

            return;
        }


        tbody.innerHTML = events.map(event => `

            <tr>

                <td>${escapeHTML(event.id)}</td>

                <td>${escapeHTML(event.title)}</td>

                <td>${escapeHTML(event.venue_id)}</td>

                <td>${escapeHTML(formatDate(event.start_datetime))}</td>

                <td>${escapeHTML(event.status)}</td>

                <td>

                    ${
                        event.status === "draft"

                            ? `
                                <button
                                    class="btn btn-sm btn-success"
                                    data-publish-event="${escapeHTML(event.id)}"
                                >
                                    Publish
                                </button>
                            `

                            : `<span class="text-muted">No action</span>`
                    }

                </td>

            </tr>

        `).join("");


        tbody.querySelectorAll("[data-publish-event]")
            .forEach(button => {

                button.addEventListener("click", async () => {

                    await publishEvent(button.dataset.publishEvent);

                });

            });


    } catch (error) {

        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-danger">
                    ${escapeHTML(error.message)}
                </td>
            </tr>
        `;

    }

}


async function createEvent(event) {

    event.preventDefault();

    const form = event.target;

    const button = form.querySelector("button[type='submit']");


    const startValue =
        document.getElementById("event-start").value;

    const endValue =
        document.getElementById("event-end").value;


    const startDate = new Date(startValue);

    const endDate = new Date(endValue);


    if (

        !startValue ||
        !endValue ||

        Number.isNaN(startDate.getTime()) ||
        Number.isNaN(endDate.getTime()) ||

        endDate <= startDate

    ) {

        showMessage(
            "Please provide valid event dates.",
            "danger"
        );

        return;
    }


    const payload = {

        title: document.getElementById("event-title").value.trim(),

        venue_id: Number(
            document.getElementById("event-venue-id").value
        ),

        start_datetime: startDate.toISOString(),

        end_datetime: endDate.toISOString(),

        description:
            document.getElementById("event-description").value.trim() || null,

        image_url:
            document.getElementById("event-image").value.trim() || null

    };


    if (!payload.title || !payload.venue_id) {

        showMessage(
            "Please complete the required event details.",
            "danger"
        );

        return;
    }


    setButtonLoading(button, true, "Creating...");


    try {

        await API.post("/api/events/", payload);

        showMessage(
            "Event created successfully.",
            "success"
        );

        form.reset();

        await loadAdminEvents();


    } catch (error) {

        showMessage(error.message, "danger");

    } finally {

        setButtonLoading(button, false);

    }

}


async function publishEvent(eventId) {

    const confirmed = confirm(
        "Are you sure you want to publish this event?"
    );

    if (!confirmed) return;


    try {

        await API.post(
            `/api/events/${eventId}/publish`,
            {}
        );

        showMessage(
            "Event published successfully.",
            "success"
        );

        await loadAdminEvents();


    } catch (error) {

        showMessage(error.message, "danger");

    }

}


// =========================================================
// ADMIN BOOKING MANAGEMENT
// =========================================================

async function loadAdminBookings() {

    const tbody = document.getElementById("admin-bookings-list");

    if (!tbody) return;


    tbody.innerHTML = `
        <tr>
            <td colspan="11" class="text-center">
                Loading booking records...
            </td>
        </tr>
    `;


    try {

        // Get all platform bookings
        const response = await API.get("/api/admin/bookings");

        const bookings = normalizeList(response);


        // Calculate booking statistics
        const totalBookings = bookings.length;

        const completedPayments = bookings.filter(
            booking => booking.payment_status === "completed"
        ).length;

        const pendingPayments = bookings.filter(
            booking => booking.payment_status === "pending"
        ).length;


        setStat("booking-total", totalBookings);

        setStat("booking-paid", completedPayments);

        setStat("booking-pending", pendingPayments);


        // Handle empty booking records
        if (!bookings.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="11" class="text-center text-muted">
                        No booking records found.
                    </td>
                </tr>
            `;

            return;
        }


        // Display all booking records
        tbody.innerHTML = bookings.map(booking => `

            <tr>

                <td>
                    ${escapeHTML(booking.id)}
                </td>

                <td>
                    <strong>
                        ${escapeHTML(booking.booking_reference)}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(booking.user_id)}
                </td>

                <td>
                    ${escapeHTML(booking.event_id)}
                </td>

                <td>
                    ${escapeHTML(booking.ticket_category_id)}
                </td>

                <td>
                    ${escapeHTML(booking.quantity)}
                </td>

                <td>
                    ${escapeHTML(booking.total_amount)}
                </td>

                <td>

                    <span class="badge ${
                        booking.status === "confirmed"
                            ? "bg-success"
                            : booking.status === "cancelled"
                                ? "bg-danger"
                                : "bg-warning text-dark"
                    }">

                        ${escapeHTML(booking.status)}

                    </span>

                </td>

                <td>

                    <span class="badge ${
                        booking.payment_status === "completed"
                            ? "bg-success"
                            : booking.payment_status === "failed"
                                ? "bg-danger"
                                : "bg-warning text-dark"
                    }">

                        ${escapeHTML(booking.payment_status)}

                    </span>

                </td>

                <td>
                    ${escapeHTML(booking.payment_reference || "N/A")}
                </td>

                <td>
                    ${escapeHTML(formatDate(booking.created_at))}
                </td>

            </tr>

        `).join("");


    } catch (error) {

        console.error(
            "Admin booking loading error:",
            error
        );


        setStat("booking-total", "—");

        setStat("booking-paid", "—");

        setStat("booking-pending", "—");


        tbody.innerHTML = `
            <tr>
                <td colspan="11" class="text-center text-danger">
                    Unable to load booking records:
                    ${escapeHTML(error.message)}
                </td>
            </tr>
        `;

    }

}


// =========================================================
// VENUE HIRE REQUESTS
// =========================================================

async function loadAdminVenueHireRequests() {

    const tbody = document.getElementById("admin-hire-list");

    if (!tbody) return;


    try {

        const response = await API.get("/api/venue-hire/");

        const requests = normalizeList(response);


        if (!requests.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">
                        No venue hire requests returned by the API.
                    </td>
                </tr>
            `;

            return;
        }


        tbody.innerHTML = requests.map(request => `

            <tr>

                <td>${escapeHTML(request.id)}</td>

                <td>${escapeHTML(request.event_title)}</td>

                <td>${escapeHTML(request.venue_id)}</td>

                <td>${escapeHTML(formatDate(request.start_datetime))}</td>

                <td>${escapeHTML(request.expected_attendees)}</td>

                <td>${escapeHTML(request.status)}</td>

                <td>

                    ${
                        request.status === "pending"

                            ? `

                                <button
                                    class="btn btn-sm btn-success"
                                    data-review-hire="${escapeHTML(request.id)}"
                                    data-review-status="approved"
                                >
                                    Approve
                                </button>

                                <button
                                    class="btn btn-sm btn-danger"
                                    data-review-hire="${escapeHTML(request.id)}"
                                    data-review-status="rejected"
                                >
                                    Reject
                                </button>

                            `

                            : "Reviewed"
                    }

                </td>

            </tr>

        `).join("");


        tbody.querySelectorAll("[data-review-hire]")
            .forEach(button => {

                button.addEventListener("click", async () => {

                    await reviewVenueHire(
                        button.dataset.reviewHire,
                        button.dataset.reviewStatus
                    );

                });

            });


    } catch (error) {

        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-danger">
                    ${escapeHTML(error.message)}
                </td>
            </tr>
        `;

    }

}


async function reviewVenueHire(requestId, status) {

    const notes = prompt("Enter admin notes (optional):");

    if (notes === null) return;


    try {

        await API.patch(

            `/api/venue-hire/${requestId}`,

            {
                status,
                admin_notes: notes.trim() || null
            }

        );


        showMessage(
            "Venue hire request updated.",
            "success"
        );

        await loadAdminVenueHireRequests();


    } catch (error) {

        showMessage(error.message, "danger");

    }

}


// =========================================================
// AGENT MESSAGE MONITOR
// =========================================================

async function loadAgentLogs() {

    const tbody = document.getElementById("agent-logs-list");

    if (!tbody) return;


    tbody.innerHTML = `
        <tr>
            <td colspan="7" class="text-center">
                Loading agent messages...
            </td>
        </tr>
    `;


    try {

        const response = await API.get("/api/agent-logs/");

        const logs = normalizeList(response);


        if (!logs.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">
                        No agent messages found.
                    </td>
                </tr>
            `;

            return;
        }


        tbody.innerHTML = logs.map(log => `

            <tr>

                <td>${escapeHTML(log.id)}</td>

                <td>${escapeHTML(log.sender)}</td>

                <td>${escapeHTML(log.receiver)}</td>

                <td>

                    <span class="badge bg-primary">
                        ${escapeHTML(log.performative)}
                    </span>

                </td>

                <td>${escapeHTML(log.conversation_id)}</td>

                <td>${escapeHTML(log.status)}</td>

                <td>${escapeHTML(formatDate(log.created_at))}</td>

            </tr>

        `).join("");


    } catch (error) {

        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-danger">
                    ${escapeHTML(error.message)}
                </td>
            </tr>
        `;

    }

}
