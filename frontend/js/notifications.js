
"use strict";

const Notifications = {
    async load() {
        if (!Auth.isAuthenticated()) return [];

        return await API.get("/api/notifications/me");
    },

    async markAsRead(notificationId) {
        return await API.patch(
            `/api/notifications/${notificationId}/read`,
            {}
        );
    },

    async render(containerId = "notification-list") {
        const container = document.getElementById(containerId);

        if (!container) return;

        container.innerHTML =
            `<p class="loading">Loading notifications...</p>`;

        try {
            const response = await this.load();
            const notifications = normalizeList(response);

            if (!notifications.length) {
                container.innerHTML = `
                    <div class="empty-state">
                        <h5>No notifications</h5>
                        <p>You are all caught up.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = notifications.map(item => `
                <div class="notification-item ${item.is_read ? "" : "unread"}">
                    <div class="notification-content">
                        <h6>${escapeHTML(item.title)}</h6>
                        <p>${escapeHTML(item.message)}</p>
                        <small>${formatDate(item.created_at)}</small>
                    </div>

                    ${
                        item.is_read
                            ? ""
                            : `<button class="btn btn-sm btn-outline-primary"
                                       data-read-notification="${item.id}">
                                    Mark as read
                               </button>`
                    }
                </div>
            `).join("");

            container.querySelectorAll("[data-read-notification]")
                .forEach(button => {
                    button.addEventListener("click", async () => {
                        try {
                            await this.markAsRead(
                                button.dataset.readNotification
                            );

                            await this.render(containerId);

                        } catch (error) {
                            showMessage(error.message, "danger");
                        }
                    });
                });

        } catch (error) {
            container.innerHTML = `
                <p class="text-danger">
                    ${escapeHTML(error.message)}
                </p>
            `;
        }
    }
};
