
"use strict";

document.addEventListener("DOMContentLoaded", async () => {
    if (!requireAuth()) return;

    document.getElementById("venue-hire-form")
        ?.addEventListener("submit", submitVenueHire);

    await loadMyVenueHireRequests();
});


async function submitVenueHire(event) {
    event.preventDefault();

    const form = event.target;
    const button = form.querySelector("button[type='submit']");

    const startValue =
        document.getElementById("start-datetime").value;

    const endValue =
        document.getElementById("end-datetime").value;

    const startDate = new Date(startValue);
    const endDate = new Date(endValue);

    if (
        !startValue ||
        !endValue ||
        Number.isNaN(startDate.getTime()) ||
        Number.isNaN(endDate.getTime()) ||
        endDate <= startDate
    ) {
        showMessage("Please provide a valid start and end time.", "danger");
        return;
    }

    const payload = {
        venue_id: Number(document.getElementById("venue-id").value),
        event_title: document.getElementById("event-title").value.trim(),
        purpose: document.getElementById("purpose").value.trim(),
        start_datetime: startDate.toISOString(),
        end_datetime: endDate.toISOString(),
        expected_attendees: Number(
            document.getElementById("expected-attendees").value
        )
    };

    if (
        !payload.venue_id ||
        !payload.event_title ||
        !payload.purpose ||
        payload.expected_attendees < 1
    ) {
        showMessage("Please complete all required fields.", "danger");
        return;
    }

    setButtonLoading(button, true, "Submitting...");

    try {
        await API.post("/api/venue-hire/", payload);

        showMessage("Your venue hire request was submitted.", "success");

        form.reset();

        await loadMyVenueHireRequests();

    } catch (error) {
        showMessage(error.message, "danger");

    } finally {
        setButtonLoading(button, false);
    }
}


async function loadMyVenueHireRequests() {
    const container = document.getElementById("my-hire-requests");

    if (!container) return;

    try {
        const response = await API.get("/api/venue-hire/me");
        const requests = normalizeList(response);

        if (!requests.length) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>You have not submitted any venue hire requests.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = requests.map(request => `
            <div class="border-bottom py-3">
                <h6>${escapeHTML(request.event_title)}</h6>
                <p class="small text-muted">
                    Venue #${escapeHTML(request.venue_id)}
                </p>
                <p class="small">
                    ${escapeHTML(formatDate(request.start_datetime))}
                </p>
                <span class="badge bg-warning text-dark">
                    ${escapeHTML(request.status)}
                </span>
                ${
                    request.admin_notes
                        ? `<p class="small mt-2">${escapeHTML(request.admin_notes)}</p>`
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
