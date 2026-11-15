
"use strict";

const API = {
    getToken() {
        return localStorage.getItem(CONFIG.TOKEN_KEY);
    },

    getHeaders(customHeaders = {}) {
        const headers = {
            ...customHeaders
        };

        const token = this.getToken();

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        return headers;
    },

    async request(endpoint, options = {}) {
        const controller = new AbortController();

        const timeout = setTimeout(
            () => controller.abort(),
            CONFIG.REQUEST_TIMEOUT
        );

        try {
            const headers = this.getHeaders(options.headers || {});

            const response = await fetch(
                `${CONFIG.API_BASE_URL}${endpoint}`,
                {
                    ...options,
                    headers,
                    signal: controller.signal
                }
            );

            const contentType =
                response.headers.get("content-type") || "";

            let data;

            if (contentType.includes("application/json")) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem(CONFIG.TOKEN_KEY);
                    localStorage.removeItem(CONFIG.USER_KEY);
                }

                let message =
                    data?.detail ||
                    data?.message ||
                    `Request failed (${response.status})`;

                if (Array.isArray(message)) {
                    message = message
                        .map(item => item.msg || "Invalid input")
                        .join(", ");
                }

                throw new Error(message);
            }

            return data;

        } catch (error) {
            if (error.name === "AbortError") {
                throw new Error("The request timed out. Please try again.");
            }

            if (error instanceof TypeError) {
                throw new Error(
                    "Unable to connect to EventSphere. Check whether the backend is running."
                );
            }

            throw error;

        } finally {
            clearTimeout(timeout);
        }
    },

    get(endpoint) {
        return this.request(endpoint, {
            method: "GET"
        });
    },

    post(endpoint, body) {
        return this.request(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
    },

    patch(endpoint, body) {
        return this.request(endpoint, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
    }
};


// Common UI helpers

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}


function showMessage(message, type = "success") {
    const container = document.getElementById("message-container");

    if (!container) {
        alert(message);
        return;
    }

    container.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show"
             role="alert">
            ${escapeHTML(message)}

            <button type="button"
                    class="btn-close"
                    data-bs-dismiss="alert"
                    aria-label="Close">
            </button>
        </div>
    `;

    container.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}


function formatDate(value) {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not available";
    }

    return date.toLocaleString("en-LK", {
        dateStyle: "medium",
        timeStyle: "short"
    });
}


function formatCurrency(value) {
    return new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency: CONFIG.CURRENCY,
        maximumFractionDigits: 2
    }).format(Number(value || 0));
}


function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}


function setButtonLoading(button, loading, loadingText = "Please wait...") {
    if (!button) return;

    if (loading) {
        button.dataset.originalText = button.textContent;
        button.disabled = true;
        button.textContent = loadingText;
    } else {
        button.disabled = false;
        button.textContent =
            button.dataset.originalText || "Submit";
    }
}


function normalizeList(response) {
    if (Array.isArray(response)) return response;

    if (Array.isArray(response?.items)) return response.items;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.results)) return response.results;

    return [];
}


function getCurrentUser() {
    try {
        return JSON.parse(
            localStorage.getItem(CONFIG.USER_KEY)
        );
    } catch {
        return null;
    }
}
