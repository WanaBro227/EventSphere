
"use strict";

let allEvents = [];

document.addEventListener("DOMContentLoaded", () => {
    const featuredContainer = document.getElementById("featured-events");
    const eventsContainer = document.getElementById("events-list");

    if (featuredContainer || eventsContainer) {
        loadEvents();
    }

    document.getElementById("event-search-form")
        ?.addEventListener("submit", event => {
            event.preventDefault();
            filterEvents();
        });

    document.getElementById("clear-search")
        ?.addEventListener("click", () => {
            const search = document.getElementById("event-search");

            if (search) search.value = "";

            renderEvents(allEvents);
        });
});


async function loadEvents() {
    const featuredContainer =
        document.getElementById("featured-events");

    const eventsContainer =
        document.getElementById("events-list");

    try {
        const response = await API.get("/api/events/");
        allEvents = normalizeList(response);

        renderEvents(allEvents, eventsContainer);

        if (featuredContainer) {
            renderEvents(allEvents.slice(0, 3), featuredContainer);
        }

    } catch (error) {
        const message = `
            <div class="col-12">
                <div class="alert alert-danger">
                    ${escapeHTML(error.message)}
                </div>
            </div>
        `;

        if (featuredContainer) featuredContainer.innerHTML = message;
        if (eventsContainer) eventsContainer.innerHTML = message;
    }
}


function filterEvents() {
    const search = document
        .getElementById("event-search")
        ?.value.trim()
        .toLowerCase() || "";

    const filtered = allEvents.filter(event => {
        const title = String(event.title || "").toLowerCase();
        const description = String(event.description || "").toLowerCase();

        return title.includes(search) || description.includes(search);
    });

    renderEvents(
        filtered,
        document.getElementById("events-list")
    );
}


function renderEvents(events, container) {
    if (!container) return;

    if (!events.length) {
        container.innerHTML = `
            <div class="col-12">
                <div class="empty-state">
                    <h5>No events found</h5>
                    <p>Try another search or check back later.</p>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = events.map(event => {
        const image = event.image_url ||
            "https://placehold.co/800x450?text=EventSphere";

        const venue = event.venue?.name ||
            (event.venue_id ? `Venue #${event.venue_id}` : "Venue to be announced");

        return `
            <div class="col-md-6 col-lg-4">
                <div class="custom-card event-card">
                    <img class="event-image"
                         src="${escapeHTML(image)}"
                         alt="${escapeHTML(event.title)}"
                         onerror="this.src='https://placehold.co/800x450?text=EventSphere'">

                    <div class="event-card-body">
                        <span class="badge bg-primary-subtle text-primary">
                            ${escapeHTML(event.status || "Event")}
                        </span>

                        <h5 class="mt-3">${escapeHTML(event.title)}</h5>

                        <p class="event-meta">
                            ${escapeHTML(venue)}
                        </p>

                        <p class="event-meta">
                            ${escapeHTML(formatDate(event.start_datetime))}
                        </p>

                        <p class="text-muted-custom">
                            ${escapeHTML((event.description || "").slice(0, 110))}
                        </p>

                        <a href="event-details.html?id=${encodeURIComponent(event.id)}"
                           class="btn btn-primary w-100">
                            View Details
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}
