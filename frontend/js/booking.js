
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    if (!requireAuth()) return;

    const eventId = getQueryParam("event_id");
    const eventInput = document.getElementById("event-id");

    if (eventId && /^\d+$/.test(eventId)) {
        eventInput.value = eventId;
        loadBookingEvent(eventId);
    }

    document.getElementById("booking-form")
        ?.addEventListener("submit", submitBooking);
});


async function loadBookingEvent(eventId) {
    try {
        const event = await API.get(`/api/events/${eventId}`);

        document.getElementById("booking-event-title").textContent =
            event.title || `Event #${eventId}`;

    } catch {
        document.getElementById("booking-event-title").textContent =
            `Event #${eventId}`;
    }
}


async function submitBooking(event) {
    event.preventDefault();

    const button = document.getElementById("booking-button");

    const eventId = Number(
        document.getElementById("event-id").value
    );

    const categoryId = Number(
        document.getElementById("ticket-category").value
    );

    const quantity = Number(
        document.getElementById("ticket-quantity").value
    );

    if (!eventId || !categoryId || quantity < 1 || quantity > 10) {
        showMessage("Please enter valid booking information.", "danger");
        return;
    }

    setButtonLoading(button, true, "Submitting...");

    try {
        const booking = await API.post("/api/bookings/", {
            event_id: eventId,
            ticket_category_id: categoryId,
            quantity
        });

        showMessage(
            `Booking submitted successfully. Reference: ${booking.booking_reference || "Created"}`,
            "success"
        );

        event.target.reset();

    } catch (error) {
        showMessage(error.message, "danger");

    } finally {
        setButtonLoading(button, false);
    }
}
