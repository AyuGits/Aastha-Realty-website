// ===============================
// AASTHA REALTY - SCRIPT.JS
// Part 1
// ===============================

// Mobile Menu
const mobileMenuButton = document.getElementById("mobileMenuButton");
const mobileMenu = document.getElementById("mobileMenu");

if (mobileMenuButton) {

    mobileMenuButton.addEventListener("click", () => {

        mobileMenu.classList.toggle("hidden");

        mobileMenuButton.innerHTML = mobileMenu.classList.contains("hidden")
            ? '<i class="fas fa-bars text-2xl"></i>'
            : '<i class="fas fa-times text-2xl"></i>';

    });

}


// Smooth Scrolling

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {

            window.scrollTo({

                top: target.offsetTop - 80,

                behavior: "smooth"

            });

        }

        if (mobileMenu && !mobileMenu.classList.contains("hidden")) {

            mobileMenu.classList.add("hidden");

            mobileMenuButton.innerHTML =
                '<i class="fas fa-bars text-2xl"></i>';

        }

    });

});



// FAQ

document.querySelectorAll(".faq-question").forEach(button => {

    button.addEventListener("click", function () {

        const answer = this.nextElementSibling;

        const icon = this.querySelector("i");

        answer.classList.toggle("hidden");

        icon.classList.toggle("fa-chevron-down");

        icon.classList.toggle("fa-chevron-up");

        document.querySelectorAll(".faq-question").forEach(other => {

            if (other !== this) {

                other.nextElementSibling.classList.add("hidden");

                other.querySelector("i").classList.remove("fa-chevron-up");

                other.querySelector("i").classList.add("fa-chevron-down");

            }

        });

    });

});




// =============================
// Validation
// =============================

const enquiryForm = document.getElementById("enquiryForm");

const submitButton =
    enquiryForm.querySelector('button[type="submit"]');

const submitText =
    document.getElementById("submitText");

const successMessage =
    document.getElementById("successMessage");

const errorMessage =
    document.getElementById("errorMessage");



function showError(id, message) {

    const error =
        document.getElementById(id + "Error");

    if (!error) return;

    error.innerText = message;

    error.classList.remove("hidden");

}


function clearError(id) {

    const error =
        document.getElementById(id + "Error");

    if (!error) return;

    error.classList.add("hidden");

}



function validateName() {

    const value =
        document.getElementById("fullName").value.trim();

    if (value.length < 2) {

        showError("name", "Enter valid name");

        return false;

    }

    clearError("name");

    return true;

}



function validateEmail() {

    const value =
        document.getElementById("email").value.trim();

    const regex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(value)) {

        showError("email", "Invalid Email");

        return false;

    }

    clearError("email");

    return true;

}



function validatePhone() {

    const value =
        document.getElementById("phone").value.trim();

    if (!/^[0-9]{10}$/.test(value)) {

        showError("phone", "Enter 10 digit number");

        return false;

    }

    clearError("phone");

    return true;

}



function validateService() {

    const value =
        document.getElementById("service").value;

    if (value === "") {

        showError("service", "Select service");

        return false;

    }

    clearError("service");

    return true;

}


document
.getElementById("fullName")
.addEventListener("blur", validateName);

document
.getElementById("email")
.addEventListener("blur", validateEmail);

document
.getElementById("phone")
.addEventListener("blur", validatePhone);

document
.getElementById("service")
.addEventListener("change", validateService);
// ===============================
// FORM SUBMISSION
// ===============================

enquiryForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const valid =
        validateName() &&
        validateEmail() &&
        validatePhone() &&
        validateService();

    if (!valid) return;

    const formData = {

        fullName: document.getElementById("fullName").value.trim(),

        email: document.getElementById("email").value.trim(),

        phone: document.getElementById("phone").value.trim(),

        service: document.getElementById("service").value,

        message: document.getElementById("message").value.trim()

    };

    submitButton.disabled = true;

    submitText.innerText = "Submitting...";

    try {

        const response = await fetch("http://localhost:5000/api/enquiry", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(formData)

        });

        const result = await response.json();

        if (result.success) {

            successMessage.classList.remove("hidden");

            errorMessage.classList.add("hidden");

            enquiryForm.reset();

            successMessage.scrollIntoView({

                behavior: "smooth",

                block: "nearest"

            });

        } else {

            successMessage.classList.add("hidden");

            errorMessage.classList.remove("hidden");

        }

    } catch (err) {

        console.error(err);

        successMessage.classList.add("hidden");

        errorMessage.classList.remove("hidden");

    } finally {

        submitButton.disabled = false;

        submitText.innerText = "Submit Enquiry";

        setTimeout(() => {

            successMessage.classList.add("hidden");

            errorMessage.classList.add("hidden");

        }, 5000);

    }

});


// ===============================
// SCROLL ANIMATIONS
// ===============================

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("animate-fade-in");

            observer.unobserve(entry.target);

        }

    });

}, {

    threshold: 0.1,

    rootMargin: "0px 0px -50px 0px"

});

document.querySelectorAll(".animate-slide-up").forEach(el => {

    observer.observe(el);

});


// ===============================
// PAGE LOAD ANIMATION
// ===============================

window.addEventListener("load", () => {

    document.querySelectorAll(".animate-fade-in").forEach((el, index) => {

        el.style.animationDelay = `${index * 0.1}s`;

    });

});

console.log("✅ Aastha Realty Script Loaded");