
"use strict";

document.addEventListener("DOMContentLoaded", async () => {
    if (!requireAuth()) return;

    const eventId = getQueryParam("event_id");

    if (eventId && /^\d+$/.test(eventId)) {
        document.getElementById("waitlist-event-id").value = eventId;
    }

    document.getElementById("waitlist-form")
        ?.addEventListener("submit", submitWaitlist);

    await loadWaitlist();
});


async function submitWaitlist(event) {
    event.preventDefault();

    const button = event.target.querySelector("button[type='submit']");

    const eventId = Number(
        document.getElementById("waitlist-event-id").value
    );

    const categoryId = Number(
        document.getElementById("waitlist-category-id").value
    );

    const quantity = Number(
        document.getElementById("waitlist-quantity").value
    );

    if (!eventId || !categoryId || quantity < 1 || quantity > 10) {
        showMessage("Please enter valid waitlist details.", "danger");
        return;
    }

    setButtonLoading(button, true, "Joining...");

    try {
        await API.post("/api/waitlist/", {
            event_id: eventId,
            ticket_category_id: categoryId,
            quantity
        });

        showMessage("You have joined the waitlist.", "success");

        event.target.reset();

        await loadWaitlist();

    } catch (error) {
        showMessage(error.message, "danger");

    } finally {
        setButtonLoading(button, false);
    }
}


async function loadWaitlist() {
    const container = document.getElementById("waitlist-list");

    if (!container) return;

    try {
        const response = await API.get("/api/waitlist/me");
        const entries = normalizeList(response);

        if (!entries.length) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>You have no waitlist entries.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = entries.map(entry => `
            <div class="border-bottom py-3">
                <h6>Event #${escapeHTML(entry.event_id)}</h6>
                <p class="mb-1">
                    Category: ${escapeHTML(entry.ticket_category_id)}
                </p>
                <p class="mb-1">
                    Quantity: ${escapeHTML(entry.quantity)}
                </p>
                <p class="mb-1">
                    Position: ${escapeHTML(entry.position ?? "Not available")}
                </p>
                <span class="badge bg-warning text-dark">
                    ${escapeHTML(entry.status)}
                </span>
                ${
                    entry.offer_expires_at
                        ? `<p class="small text-muted mt-2">
                            Offer expires: ${escapeHTML(formatDate(entry.offer_expires_at))}
                           </p>`
                        : ""
                }
            </div>
        `).join("");

    } catch (error) {
        container.innerHTML = `
            <div class="alert alert-danger">
                ${escapeHTML(error.message)}
            </div>
        `;
    }
}
