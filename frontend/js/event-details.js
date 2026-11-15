
"use strict";

document.addEventListener("DOMContentLoaded", loadEventDetails);

async function loadEventDetails() {
    const container = document.getElementById("event-details");
    const eventId = getQueryParam("id");

    if (!eventId || !/^\d+$/.test(eventId)) {
        container.innerHTML = `
            <div class="alert alert-danger">
                Invalid event ID.
            </div>
        `;
        return;
    }

    try {
        const event = await API.get(`/api/events/${eventId}`);

        const image = event.image_url ||
            "https://placehold.co/1200x600?text=EventSphere";

        container.innerHTML = `
            <div class="row g-4">
                <div class="col-lg-8">
                    <img src="${escapeHTML(image)}"
                         class="event-detail-image"
                         alt="${escapeHTML(event.title)}">

                    <div class="mt-4">
                        <span class="badge bg-primary-subtle text-primary">
                            ${escapeHTML(event.status || "Event")}
                        </span>

                        <h1 class="mt-3">${escapeHTML(event.title)}</h1>

                        <p class="text-muted-custom">
                            ${escapeHTML(event.description || "No description available.")}
                        </p>

                        <h4 class="mt-4">About this event</h4>
                        <p>${escapeHTML(event.description || "Details will be announced soon.")}</p>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="custom-card event-detail-card">
                        <h4>Event Information</h4>

                        <hr>

                        <p><strong>Venue</strong><br>
                            ${escapeHTML(event.venue?.name || `Venue #${event.venue_id}`)}
                        </p>

                        <p><strong>Starts</strong><br>
                            ${escapeHTML(formatDate(event.start_datetime))}
                        </p>

                        <p><strong>Ends</strong><br>
                            ${escapeHTML(formatDate(event.end_datetime))}
                        </p>

                        <p><strong>Status</strong><br>
                            ${escapeHTML(event.status || "Not specified")}
                        </p>

                        <a href="booking.html?event_id=${encodeURIComponent(event.id)}"
                           class="btn btn-primary w-100 mt-3">
                            Book Tickets
                        </a>

                        <a href="waitlist.html?event_id=${encodeURIComponent(event.id)}"
                           class="btn btn-outline-primary w-100 mt-2">
                            Join Waitlist
                        </a>
                    </div>
                </div>
            </div>
        `;

    } catch (error) {
        container.innerHTML = `
            <div class="alert alert-danger">
                ${escapeHTML(error.message)}
            </div>
        `;
    }
}
