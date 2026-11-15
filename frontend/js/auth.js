
"use strict";

// ========================================
// AUTHENTICATION OBJECT
// ========================================

const Auth = {

    // Get the currently logged-in user.
    getUser() {
        return getCurrentUser();
    },

    // Get the stored JWT access token.
    getToken() {
        return API.getToken();
    },

    // Check whether the user is authenticated.
    isAuthenticated() {
        return Boolean(this.getToken() && this.getUser());
    },


    // ========================================
    // USER REGISTRATION
    // ========================================

    async register(userData) {

        return await API.post(
            "/api/auth/register",
            userData
        );
    },


    // ========================================
    // USER LOGIN
    // ========================================

    async login(email, password) {

        const response = await API.post(
            "/api/auth/login",
            {
                email,
                password
            }
        );

        const token =
            response?.access_token ||
            response?.token;

        if (!token) {
            throw new Error(
                "The login response did not contain an access token."
            );
        }

        // Store JWT token.
        localStorage.setItem(
            CONFIG.TOKEN_KEY,
            token
        );

        try {

            // Retrieve authenticated user details.
            const user = await API.get("/api/users/me");

            // Store user details.
            localStorage.setItem(
                CONFIG.USER_KEY,
                JSON.stringify(user)
            );

            return user;

        } catch (error) {

            this.clearSession();

            throw error;
        }
    },


    // ========================================
    // REFRESH USER PROFILE
    // ========================================

    async refreshUser() {

        if (!this.getToken()) {
            throw new Error("You are not logged in.");
        }

        const user = await API.get("/api/users/me");

        localStorage.setItem(
            CONFIG.USER_KEY,
            JSON.stringify(user)
        );

        return user;
    },


    // ========================================
    // CLEAR AUTHENTICATION SESSION
    // ========================================

    clearSession() {

        localStorage.removeItem(CONFIG.TOKEN_KEY);

        localStorage.removeItem(CONFIG.USER_KEY);
    },


    // ========================================
    // USER LOGOUT
    // ========================================

    logout() {

        this.clearSession();

        window.location.href = "/login.html";
    },


    // ========================================
    // ROLE-BASED REDIRECTION
    // ========================================

    redirectByRole(user) {

        if (!user) {

            window.location.href = "/login.html";

            return;
        }

        switch (user.role) {

            case "admin":

                window.location.href = "/admin/dashboard.html";

                break;

            case "staff":

                window.location.href = "/staff/scanner.html";

                break;

            default:

                window.location.href = "/dashboard.html";

                break;
        }
    }

};


// ========================================
// REQUIRE AUTHENTICATION
// ========================================

function requireAuth() {

    // Check whether a valid local session exists.
    if (!Auth.isAuthenticated()) {

        // Redirect unauthenticated users to login.
        window.location.href = "/login.html";

        return false;
    }

    return true;
}


// ========================================
// SHARED AUTHENTICATION MESSAGE HELPER
// ========================================

function displayAuthMessage(message, type) {

    if (typeof showMessage === "function") {

        showMessage(message, type);

        return;
    }

    const container = document.getElementById("message-container");

    if (container) {

        const alert = document.createElement("div");

        alert.className = `alert alert-${type}`;
        alert.textContent = message;

        container.replaceChildren(alert);
    }
}


// ========================================
// LOGIN AND REGISTRATION FORM HANDLERS
// ========================================

document.addEventListener("DOMContentLoaded", () => {


    // ========================================
    // LOGIN FORM
    // ========================================

    const loginForm = document.getElementById("login-form");

    if (loginForm) {

        const emailInput = document.getElementById("email");

        const passwordInput = document.getElementById("password");

        const loginButton = document.getElementById("login-button");


        loginForm.addEventListener("submit", async (event) => {

            // Prevent default browser form submission.
            event.preventDefault();

            const email = emailInput.value.trim();

            const password = passwordInput.value;


            // Validate inputs.
            if (!email || !password) {

                displayAuthMessage(
                    "Please enter your email and password.",
                    "warning"
                );

                return;
            }


            try {

                // Show loading state.
                setButtonLoading(
                    loginButton,
                    true,
                    "Signing In..."
                );


                // Authenticate user.
                const user = await Auth.login(email, password);


                displayAuthMessage(
                    "Login successful! Redirecting...",
                    "success"
                );


                // Redirect according to user role.
                Auth.redirectByRole(user);


            } catch (error) {

                console.error("Login Error:", error);

                displayAuthMessage(
                    error.message || "Login failed. Please try again.",
                    "danger"
                );


            } finally {

                setButtonLoading(
                    loginButton,
                    false
                );
            }

        });

    }



    // ========================================
    // REGISTRATION FORM
    // ========================================

    const registerForm = document.getElementById("register-form");

    if (registerForm) {

        const fullNameInput = document.getElementById("full-name");

        const emailInput = document.getElementById("email");

        const passwordInput = document.getElementById("password");

        const confirmPasswordInput = document.getElementById("confirm-password");

        const registerButton = document.getElementById("register-button");


        registerForm.addEventListener("submit", async (event) => {

            // Prevent default browser form submission.
            event.preventDefault();


            // Collect form data.
            const fullName = fullNameInput.value.trim();

            const email = emailInput.value.trim();

            const password = passwordInput.value;

            const confirmPassword = confirmPasswordInput.value;


            // Validate password confirmation.
            if (password !== confirmPassword) {

                displayAuthMessage(
                    "Passwords do not match.",
                    "warning"
                );

                return;
            }


            try {

                // Show loading state.
                setButtonLoading(
                    registerButton,
                    true,
                    "Creating Account..."
                );


                // Send registration request to FastAPI.
                const response = await Auth.register({

                    full_name: fullName,

                    email: email,

                    password: password

                });


                console.log(
                    "Registration Response:",
                    response
                );


                // Display success message.
                displayAuthMessage(
                    "Your account has been created successfully! Redirecting to login...",
                    "success"
                );


                // Clear registration form.
                registerForm.reset();


                // Redirect to login page.
                setTimeout(() => {

                    window.location.href = "login.html";

                }, 1500);


            } catch (error) {

                console.error("Registration Error:", error);

                displayAuthMessage(
                    error.message || "Registration failed. Please try again.",
                    "danger"
                );


            } finally {

                setButtonLoading(
                    registerButton,
                    false
                );
            }

        });

    }

});
