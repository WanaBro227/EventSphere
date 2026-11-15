
"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const user = Auth.getUser();

    document.querySelectorAll("[data-auth-required]")
        .forEach(element => {
            element.hidden = !user;
        });

    document.querySelectorAll("[data-guest-only]")
        .forEach(element => {
            element.hidden = Boolean(user);
        });

    document.querySelectorAll("[data-user-name]")
        .forEach(element => {
            element.textContent =
                user?.full_name || "Guest";
        });

    document.querySelectorAll("[data-user-role]")
        .forEach(element => {
            element.textContent =
                user?.role || "Guest";
        });

    document.querySelectorAll("[data-logout]")
        .forEach(element => {
            element.addEventListener("click", () => {
                Auth.logout();
            });
        });

    document.querySelectorAll("[data-current-year]")
        .forEach(element => {
            element.textContent = new Date().getFullYear();
        });
});


function requireAuth() {
    if (!Auth.isAuthenticated()) {
        window.location.href = "/login.html";
        return false;
    }

    return true;
}


function requireRole(allowedRoles) {
    if (!requireAuth()) return false;

    const user = Auth.getUser();

    if (!allowedRoles.includes(user?.role)) {
        window.location.href = "/dashboard.html";
        return false;
    }

    return true;
}
