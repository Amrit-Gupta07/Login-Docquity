document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("signup-form");

    // Real-time validation for Confirm Password field
    const passwordField = document.getElementById("password");
    const confirmPasswordField = document.getElementById("confirm-password");

    confirmPasswordField.addEventListener("input", function () {
        const password = passwordField.value;
        const confirmPassword = confirmPasswordField.value;
        const confirmPasswordError = document.getElementById("confirm-password-error");

        if (password !== confirmPassword) {
            confirmPasswordField.style.borderColor = "red";
            confirmPasswordError.textContent = "Passwords do not match.";
        } else {
            confirmPasswordField.style.borderColor = "green";
            confirmPasswordError.textContent = "";
        }
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault(); 

        
        clearErrors();

        let isValid = true;

        // Validate Username
        const username = document.getElementById("username").value.trim();
        const usernameError = document.getElementById("username-error");
        if (username.length < 4) {
            usernameError.textContent = "Username must be at least 4 characters long.";
            isValid = false;
        }

        // Validate Email
        const email = document.getElementById("email").value.trim();
        const emailError = document.getElementById("email-error");
        const emailRegex = /^[a-zA-Z0-9._%+-]+@docquity\.com$/;
        if (!emailRegex.test(email)) {
            emailError.textContent = "Email must be a valid @docquity.com address.";
            isValid = false;
        }

        // Validate Password
        const password = document.getElementById("password").value;
        const passwordError = document.getElementById("password-error");
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (!passwordRegex.test(password)) {
            passwordError.textContent =
                "Password must contain at least 8 characters, including 1 uppercase letter and 1 number.";
            isValid = false;
        }

        if (isValid) {
            const formData = {
                firstname: document.getElementById("firstname").value.trim(),
                lastname: document.getElementById("lastname").value.trim(),
                email: email,
                username: username,
                password: password,
                country_code: document.getElementById("country-code").value,
                mobile_number: document.getElementById("mobile").value.trim(),
            };

            sendDataToBackend(formData);
        }
    });

    // Function to send data to backend
    function sendDataToBackend(formData) {
        fetch("http://localhost:4000/api/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    
                    showToast("Signup successful!");
                    setTimeout(() => {
                        window.location.href = "/"; 
                    }, 2000);
                } else if (data.message === "User already exists") {
                    
                    showToast("User already exists. Please log in.");
                } else {
                    
                    showToast("Error: " + data.message);
                }
            })
            .catch((error) => {
                console.error("Error submitting the form:", error);
                showToast("An error occurred while submitting the form.");
            });
    }

    // Function to show toast notification
    function showToast(message) {
        const toast = document.getElementById("toast");
        toast.textContent = message;
        toast.classList.add("show");

        
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }

    
    function clearErrors() {
        document.querySelectorAll(".error").forEach((error) => (error.textContent = ""));
    }
});
