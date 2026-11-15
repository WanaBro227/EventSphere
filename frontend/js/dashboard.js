
"use strict";

document.addEventListener("DOMContentLoaded", async () => {
    if (!requireAuth()) return;

    await loadAttendeeDashboard();

    await Notifications.render("notification-list");
});


async function loadAttendeeDashboard() {
    try {
        const [bookingsResponse, ticketsResponse, waitlistResponse] =
            await Promise.all([
                API.get("/api/bookings/me"),
                API.get("/api/tickets/me"),
                API.get("/api/waitlist/me")
            ]);

        const bookings = normalizeList(bookingsResponse);
        const tickets = normalizeList(ticketsResponse);
        const waitlist = normalizeList(waitlistResponse);

        document.getElementById("booking-count").textContent =
            bookings.length;

        document.getElementById("ticket-count").textContent =
            tickets.length;

        document.getElementById("waitlist-count").textContent =
            waitlist.length;

        renderRecentBookings(bookings);

    } catch (error) {
        showMessage(error.message, "danger");
    }
}


function renderRecentBookings(bookings) {
    const tbody = document.getElementById("recent-bookings");

    if (!tbody) return;

    if (!bookings.length) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">
                    No bookings found.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = bookings.slice(0, 5).map(booking => `
        <tr>
            <td>${escapeHTML(booking.booking_reference)}</td>
            <td>Event #${escapeHTML(booking.event_id)}</td>
            <td>${escapeHTML(booking.quantity)}</td>
            <td>
                <span class="badge bg-secondary">
                    ${escapeHTML(booking.status)}
                </span>
            </td>
        </tr>
    `).join("");
}
