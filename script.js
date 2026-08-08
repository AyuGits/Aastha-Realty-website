// ==========================================================
// AASTHA REALTY - FINAL SCRIPT.JS
// ==========================================================

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwAwAddyT6fJEaikb1T3ajnIKb_GaAbioD9NxA7dC2yXkkJ8sO7c7zS-UI3gY_59RQAoA/exec";


// ==========================================================
// SAFE HELPERS
// ==========================================================

function $(id) {
    return document.getElementById(id);
}

function escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = value ?? "";
    return div.innerHTML;
}

function getImageUrl(url) {

    if (!url) {
        return "";
    }

    url = String(url).trim();

    // Google Drive file URL
    const driveMatch = url.match(/\/file\/d\/([^/]+)/);

    if (driveMatch && driveMatch[1]) {
        return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w1200`;
    }

    // Google Drive open URL
    const idMatch = url.match(/[?&]id=([^&]+)/);

    if (
        url.includes("drive.google.com") &&
        idMatch &&
        idMatch[1]
    ) {
        return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w1200`;
    }

    return url;
}


// ==========================================================
// MOBILE MENU
// ==========================================================

document.addEventListener("DOMContentLoaded", function () {

    const mobileMenuButton = $("mobileMenuButton");
    const mobileMenu = $("mobileMenu");

    if (!mobileMenuButton || !mobileMenu) {
        return;
    }

    mobileMenuButton.addEventListener("click", function () {

        mobileMenu.classList.toggle("hidden");

        mobileMenuButton.innerHTML =
            mobileMenu.classList.contains("hidden")
                ? '<i class="fas fa-bars text-2xl"></i>'
                : '<i class="fas fa-times text-2xl"></i>';

    });

});


// ==========================================================
// SMOOTH SCROLLING
// ==========================================================

document.addEventListener("DOMContentLoaded", function () {

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(function (anchor) {

            anchor.addEventListener("click", function (event) {

                const href =
                    this.getAttribute("href");

                if (
                    !href ||
                    href === "#" ||
                    !href.startsWith("#")
                ) {
                    return;
                }

                const target =
                    document.querySelector(href);

                if (!target) {
                    return;
                }

                event.preventDefault();

                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: "smooth"
                });

                const mobileMenu =
                    $("mobileMenu");

                const mobileMenuButton =
                    $("mobileMenuButton");

                if (
                    mobileMenu &&
                    !mobileMenu.classList.contains("hidden")
                ) {

                    mobileMenu.classList.add("hidden");

                    if (mobileMenuButton) {
                        mobileMenuButton.innerHTML =
                            '<i class="fas fa-bars text-2xl"></i>';
                    }

                }

            });

        });

});


// ==========================================================
// FAQ
// ==========================================================

document.addEventListener("DOMContentLoaded", function () {

    document
        .querySelectorAll(".faq-question")
        .forEach(function (button) {

            button.addEventListener("click", function () {

                const answer =
                    this.nextElementSibling;

                const icon =
                    this.querySelector("i");

                if (!answer) {
                    return;
                }

                answer.classList.toggle("hidden");

                if (icon) {
                    icon.classList.toggle("fa-chevron-down");
                    icon.classList.toggle("fa-chevron-up");
                }

                document
                    .querySelectorAll(".faq-question")
                    .forEach(function (other) {

                        if (other !== button) {

                            if (other.nextElementSibling) {
                                other.nextElementSibling.classList.add("hidden");
                            }

                            const otherIcon =
                                other.querySelector("i");

                            if (otherIcon) {
                                otherIcon.classList.remove("fa-chevron-up");
                                otherIcon.classList.add("fa-chevron-down");
                            }

                        }

                    });

            });

        });

});


// ==========================================================
// PROPERTY DATA
// ==========================================================

let allProperties = [];


// ==========================================================
// LOAD PROPERTIES
// ==========================================================

async function loadProperties() {

    const container =
        $("propertiesContainer");

    if (!container) {
        return;
    }

    const status =
        $("propertyStatus");

    try {

        if (status) {
            status.classList.remove("hidden");
            status.className =
                "mb-6 text-center text-cool-grey";
            status.textContent =
                "Loading properties...";
        }

        const response =
            await fetch(
                GOOGLE_SCRIPT_URL + "?action=properties"
            );

        if (!response.ok) {
            throw new Error("Unable to connect to property database.");
        }

        const data =
            await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Invalid property data received.");
        }

        allProperties =
            data.map(normalizeProperty);

        renderProperties(allProperties);

        if (status) {
            status.classList.add("hidden");
        }

    } catch (error) {

        console.error(
            "Property loading error:",
            error
        );

        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-red-500 text-lg mb-2">
                    Unable to load properties.
                </div>
                <p class="text-cool-grey">
                    Please try again later.
                </p>
            </div>
        `;

        if (status) {
            status.classList.add("hidden");
        }

    }

}


// ==========================================================
// NORMALIZE PROPERTY
// ==========================================================

function normalizeProperty(property) {

    return {

        id:
            property.id ||
            property.propertyId ||
            "",

        property:
            property.property ||
            property.propertyName ||
            property.name ||
            "",

        type:
            property.type ||
            property.propertyType ||
            "",

        purpose:
            property.purpose ||
            property.propertyPurpose ||
            "",

        bhk:
            property.bhk ||
            property.propertyBHK ||
            "",

        area:
            property.area ||
            property.propertyArea ||
            property.location ||
            property.propertyLocation ||
            "",

        size:
            property.size ||
            property.propertySize ||
            "",

        price:
            property.price ||
            property.propertyPrice ||
            "",

        description:
            property.description ||
            property.propertyDescription ||
            "",

        image:
            property.image ||
            property.propertyImage ||
            "",

        ownerName:
            property.ownerName ||
            "",

        ownerPhone:
            property.ownerPhone ||
            "",

        ownerEmail:
            property.ownerEmail ||
            "",

        source:
            property.source ||
            "",

        status:
            property.status ||
            "Approved",

        featured:
            property.featured ||
            "No"

    };

}


// ==========================================================
// RENDER PROPERTIES
// ==========================================================

function renderProperties(properties) {

    const container =
        $("propertiesContainer");

    const empty =
        $("propertyEmpty");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (!properties || properties.length === 0) {

        if (empty) {
            empty.classList.remove("hidden");
        }

        return;
    }

    if (empty) {
        empty.classList.add("hidden");
    }

    properties.forEach(function (property) {

        const card =
            document.createElement("div");

        card.className =
            "bg-white rounded-3xl shadow-premium overflow-hidden hover:shadow-gold-glow transition-all duration-300 transform hover:-translate-y-1";

        const image =
            getImageUrl(property.image);

        const propertyType =
            formatPropertyType(property.type);

        const purpose =
            formatPurpose(property.purpose);

        const featured =
            String(property.featured)
                .toLowerCase() === "yes";

        card.innerHTML = `

            <div class="relative h-64 overflow-hidden bg-gray-100">

                ${
                    image
                    ?
                    `
                    <img
                        src="${escapeHTML(image)}"
                        alt="${escapeHTML(property.property)}"
                        class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        onerror="this.src='https://via.placeholder.com/800x500?text=Aastha+Realty'"
                    >
                    `
                    :
                    `
                    <div class="w-full h-full flex items-center justify-center bg-deep-blue/5">
                        <i class="fas fa-building text-5xl text-elegant-gold"></i>
                    </div>
                    `
                }

                ${
                    featured
                    ?
                    `
                    <span class="absolute top-4 left-4 bg-elegant-gold text-deep-blue px-3 py-1.5 rounded-full text-xs font-bold">
                        <i class="fas fa-star mr-1"></i>
                        Featured
                    </span>
                    `
                    :
                    ""
                }

            </div>


            <div class="p-6">

                <div class="flex items-center justify-between gap-3 mb-3">

                    <span class="text-xs font-semibold tracking-wider uppercase text-elegant-gold">
                        ${escapeHTML(property.id)}
                    </span>

                    ${
                        purpose
                        ?
                        `
                        <span class="px-3 py-1 rounded-full bg-light-gold text-deep-blue text-xs font-semibold">
                            ${escapeHTML(purpose)}
                        </span>
                        `
                        :
                        ""
                    }

                </div>


                <h3 class="font-serif text-2xl font-bold text-deep-blue mb-4">
                    ${escapeHTML(property.property || "Property")}
                </h3>


                <div class="space-y-2 text-sm text-cool-grey mb-4">

                    ${
                        propertyType
                        ?
                        `
                        <p>
                            <i class="fas fa-building w-5 text-elegant-gold"></i>
                            ${escapeHTML(propertyType)}
                        </p>
                        `
                        :
                        ""
                    }


                    ${
                        property.bhk
                        ?
                        `
                        <p>
                            <i class="fas fa-bed w-5 text-elegant-gold"></i>
                            ${escapeHTML(property.bhk)} BHK
                        </p>
                        `
                        :
                        ""
                    }


                    ${
                        property.area
                        ?
                        `
                        <p>
                            <i class="fas fa-location-dot w-5 text-elegant-gold"></i>
                            ${escapeHTML(property.area)}
                        </p>
                        `
                        :
                        ""
                    }


                    ${
                        property.size
                        ?
                        `
                        <p>
                            <i class="fas fa-ruler-combined w-5 text-elegant-gold"></i>
                            ${escapeHTML(property.size)} sq.ft
                        </p>
                        `
                        :
                        ""
                    }


                    ${
                        property.price
                        ?
                        `
                        <p class="font-semibold text-deep-blue">
                            <i class="fas fa-indian-rupee-sign w-5 text-elegant-gold"></i>
                            ${escapeHTML(property.price)}
                        </p>
                        `
                        :
                        ""
                    }

                </div>


                ${
                    property.description
                    ?
                    `
                    <p class="text-cool-grey leading-relaxed text-sm line-clamp-3">
                        ${escapeHTML(property.description)}
                    </p>
                    `
                    :
                    ""
                }


                <a
                    href="#enquiry"
                    class="inline-flex items-center mt-6 bg-deep-blue text-white px-6 py-3 rounded-full font-semibold hover:bg-dark-gold transition"
                >
                    Enquire About Property
                    <i class="fas fa-arrow-right ml-2"></i>
                </a>

            </div>

        `;

        container.appendChild(card);

    });

}


// ==========================================================
// FORMAT PROPERTY TYPE
// ==========================================================

function formatPropertyType(type) {

    const value =
        String(type || "")
            .trim()
            .toLowerCase();

    const map = {

        flat: "Flat / Apartment",
        apartment: "Flat / Apartment",

        house: "House / Villa",
        villa: "House / Villa",

        land: "Land / Plot",
        plot: "Land / Plot",

        showroom: "Showroom",
        shop: "Shop",

        office: "Office Space",

        warehouse: "Warehouse / Godown",
        godown: "Warehouse / Godown"

    };

    return map[value] || type || "";

}


// ==========================================================
// FORMAT PURPOSE
// ==========================================================

function formatPurpose(purpose) {

    const value =
        String(purpose || "")
            .trim()
            .toLowerCase();

    if (value === "buy") {
        return "For Buy";
    }

    if (
        value === "sale" ||
        value === "sell"
    ) {
        return "For Sale";
    }

    if (value === "rent") {
        return "For Rent";
    }

    return purpose || "";

}


// ==========================================================
// PROPERTY FILTERS
// ==========================================================

function applyPropertyFilters() {

    const search =
        ($("propertySearch")?.value || "")
            .trim()
            .toLowerCase();

    const purpose =
        ($("propertyPurpose")?.value || "")
            .trim()
            .toLowerCase();

    const category =
        ($("propertyCategory")?.value || "")
            .trim()
            .toLowerCase();

    const bhk =
        ($("propertyBHK")?.value || "")
            .trim()
            .toLowerCase();

    const location =
        ($("propertyLocation")?.value || "")
            .trim()
            .toLowerCase();

    const minPrice =
        parseFloat(
            $("propertyMinPrice")?.value || ""
        );

    const maxPrice =
        parseFloat(
            $("propertyMaxPrice")?.value || ""
        );


    const filtered =
        allProperties.filter(function (property) {

            const combinedText = [

                property.id,
                property.property,
                property.type,
                property.purpose,
                property.bhk,
                property.area,
                property.description

            ]
                .join(" ")
                .toLowerCase();


            if (
                search &&
                !combinedText.includes(search)
            ) {
                return false;
            }


            if (purpose) {

                const propertyPurpose =
                    String(property.purpose)
                        .toLowerCase();

                const purposeMatches =
                    propertyPurpose.includes(purpose) ||
                    (
                        purpose === "sell" &&
                        propertyPurpose.includes("sale")
                    ) ||
                    (
                        purpose === "buy" &&
                        propertyPurpose.includes("buy")
                    );

                if (!purposeMatches) {
                    return false;
                }

            }


            if (category) {

                const propertyType =
                    String(property.type)
                        .toLowerCase();

                if (
                    !propertyType.includes(category)
                ) {
                    return false;
                }

            }


            if (bhk) {

                const propertyBHK =
                    String(property.bhk)
                        .toLowerCase();

                if (
                    !propertyBHK.startsWith(bhk)
                ) {
                    return false;
                }

            }


            if (location) {

                const propertyLocation =
                    String(property.area)
                        .toLowerCase();

                if (
                    !propertyLocation.includes(location)
                ) {
                    return false;
                }

            }


            const numericPrice =
                extractPriceInLakhs(property.price);


            if (
                !Number.isNaN(minPrice) &&
                numericPrice !== null &&
                numericPrice < minPrice
            ) {
                return false;
            }


            if (
                !Number.isNaN(maxPrice) &&
                numericPrice !== null &&
                numericPrice > maxPrice
            ) {
                return false;
            }


            return true;

        });


    renderProperties(filtered);

}


// ==========================================================
// EXTRACT PRICE
// ==========================================================

function extractPriceInLakhs(value) {

    if (!value) {
        return null;
    }

    let text =
        String(value)
            .toLowerCase()
            .replace(/,/g, "")
            .trim();


    const croreMatch =
        text.match(
            /([\d.]+)\s*(cr|crore)/
        );

    if (croreMatch) {

        return (
            parseFloat(croreMatch[1]) * 100
        );

    }


    const lakhMatch =
        text.match(
            /([\d.]+)\s*(lakh|lakhs|lac|lacs)/
        );

    if (lakhMatch) {

        return parseFloat(
            lakhMatch[1]
        );

    }


    const numeric =
        parseFloat(
            text.replace(/[^\d.]/g, "")
        );

    if (
        Number.isNaN(numeric)
    ) {
        return null;
    }

    return numeric;

}


// ==========================================================
// FILTER EVENT LISTENERS
// ==========================================================

document.addEventListener("DOMContentLoaded", function () {

    const filterIds = [

        "propertySearch",
        "propertyPurpose",
        "propertyCategory",
        "propertyBHK",
        "propertyLocation",
        "propertyMinPrice",
        "propertyMaxPrice"

    ];


    filterIds.forEach(function (id) {

        const element = $(id);

        if (!element) {
            return;
        }

        element.addEventListener(
            "input",
            applyPropertyFilters
        );

        element.addEventListener(
            "change",
            applyPropertyFilters
        );

    });


    const searchButton =
        $("searchProperties");

    if (searchButton) {

        searchButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                applyPropertyFilters();

                const section =
                    $("properties");

                if (section) {
                    section.scrollIntoView({
                        behavior: "smooth"
                    });
                }

            }
        );

    }

});


// ==========================================================
// REVIEWS
// ==========================================================

async function loadReviews() {

    const container =
        $("reviewsContainer");

    if (!container) {
        return;
    }

    try {

        const response =
            await fetch(
                GOOGLE_SCRIPT_URL + "?action=reviews"
            );

        if (!response.ok) {
            throw new Error("Unable to load reviews.");
        }

        const reviews =
            await response.json();

        container.innerHTML = "";

        if (
            !Array.isArray(reviews) ||
            reviews.length === 0
        ) {

            container.innerHTML = `
                <div class="md:col-span-3 text-center">
                    <p class="text-light-gold">
                        Be the first to share your experience.
                    </p>
                </div>
            `;

            return;
        }


        reviews.forEach(function (review, index) {

            const card =
                document.createElement("div");

            const rating =
                Math.min(
                    5,
                    Math.max(
                        1,
                        Number(review.rating || 5)
                    )
                );

            const stars =
                "★".repeat(rating);


            card.className =
                "bg-white/10 backdrop-blur rounded-2xl p-8 animate-slide-up";

            card.style.animationDelay =
                `${index * 0.1}s`;


            const name =
                escapeHTML(
                    review.name || "Client"
                );

            const designation =
                escapeHTML(
                    review.designation || ""
                );

            const company =
                review.company
                    ? " • " +
                      escapeHTML(review.company)
                    : "";


            card.innerHTML = `

                <div class="flex items-center mb-6">

                    <div class="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mr-4">

                        <span class="text-deep-blue font-bold text-xl">
                            ${name.charAt(0).toUpperCase()}
                        </span>

                    </div>

                    <div>

                        <h4 class="font-bold text-lg">
                            ${name}
                        </h4>

                        <p class="text-light-gold text-sm">
                            ${designation}${company}
                        </p>

                    </div>

                </div>


                <p class="italic text-light-gold">
                    "${escapeHTML(review.review || "")}"
                </p>


                <div class="flex text-elegant-gold mt-4">
                    ${stars}
                </div>

            `;

            container.appendChild(card);

        });

    } catch (error) {

        console.error(
            "Review loading error:",
            error
        );

        container.innerHTML = `
            <div class="md:col-span-3 text-center">
                <p class="text-light-gold">
                    Reviews will appear here soon.
                </p>
            </div>
        `;

    }

}


// ==========================================================
// REVIEW SUBMISSION
// ==========================================================

document.addEventListener("DOMContentLoaded", function () {

    const reviewForm =
        $("reviewForm");

    if (!reviewForm) {
        return;
    }


    reviewForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const button =
                $("reviewSubmitButton");

            const buttonText =
                $("reviewSubmitText");

            const success =
                $("reviewSuccess");

            const error =
                $("reviewError");


            if (success) {
                success.classList.add("hidden");
            }

            if (error) {
                error.classList.add("hidden");
            }


            if (button) {
                button.disabled = true;
            }

            if (buttonText) {
                buttonText.textContent =
                    "Submitting...";
            }


            try {

                const formData =
                    new FormData(reviewForm);

                formData.set(
                    "type",
                    "review"
                );


                const response =
                    await fetch(
                        GOOGLE_SCRIPT_URL,
                        {
                            method: "POST",
                            body:
                                new URLSearchParams(formData)
                        }
                    );


                const result =
                    await response.json();


                if (!result.success) {
                    throw new Error(
                        result.message ||
                        "Review submission failed."
                    );
                }


                if (success) {
                    success.classList.remove("hidden");
                }

                reviewForm.reset();

            } catch (err) {

                console.error(
                    "Review submission error:",
                    err
                );

                if (error) {
                    error.textContent =
                        err.message ||
                        "Unable to submit review.";

                    error.classList.remove("hidden");
                }

            } finally {

                if (button) {
                    button.disabled = false;
                }

                if (buttonText) {
                    buttonText.textContent =
                        "Submit Review";
                }

            }

        }
    );

});


// ==========================================================
// ENQUIRY FORM
// ==========================================================

document.addEventListener("DOMContentLoaded", function () {

    const enquiryForm =
        $("enquiryForm");

    if (!enquiryForm) {
        return;
    }


    enquiryForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const button =
                enquiryForm.querySelector(
                    'button[type="submit"]'
                );

            const submitText =
                $("submitText");


            const originalText =
                submitText
                    ? submitText.textContent
                    : "Submit Enquiry";


            if (button) {
                button.disabled = true;
            }

            if (submitText) {
                submitText.textContent =
                    "Submitting...";
            }


            try {

                const formData =
                    new FormData(enquiryForm);

                formData.set(
                    "type",
                    "enquiry"
                );


                const response =
                    await fetch(
                        GOOGLE_SCRIPT_URL,
                        {
                            method: "POST",
                            body:
                                new URLSearchParams(formData)
                        }
                    );


                const result =
                    await response.json();


                if (!result.success) {
                    throw new Error(
                        result.message ||
                        "Enquiry submission failed."
                    );
                }


                enquiryForm.reset();


                showTemporaryMessage(
                    enquiryForm,
                    "success",
                    "Thank you! Your enquiry has been submitted successfully."
                );


            } catch (error) {

                console.error(
                    "Enquiry submission error:",
                    error
                );

                showTemporaryMessage(
                    enquiryForm,
                    "error",
                    error.message ||
                    "Unable to submit your enquiry. Please try again."
                );

            } finally {

                if (button) {
                    button.disabled = false;
                }

                if (submitText) {
                    submitText.textContent =
                        originalText;
                }

            }

        }
    );

});


// ==========================================================
// TEMPORARY MESSAGE
// ==========================================================

function showTemporaryMessage(
    form,
    type,
    message
) {

    const oldMessage =
        form.querySelector(
            ".dynamic-form-message"
        );

    if (oldMessage) {
        oldMessage.remove();
    }


    const messageBox =
        document.createElement("div");

    messageBox.className =
        "dynamic-form-message mt-4 p-4 rounded-xl border text-sm";


    if (type === "success") {

        messageBox.classList.add(
            "bg-green-50",
            "border-green-200",
            "text-green-700"
        );

    } else {

        messageBox.classList.add(
            "bg-red-50",
            "border-red-200",
            "text-red-700"
        );

    }


    messageBox.innerHTML =
        escapeHTML(message);


    form.appendChild(messageBox);


    setTimeout(function () {

        if (messageBox.parentNode) {
            messageBox.remove();
        }

    }, 6000);

}


// ==========================================================
// SCROLL ANIMATIONS
// ==========================================================

document.addEventListener("DOMContentLoaded", function () {

    if (
        !("IntersectionObserver" in window)
    ) {
        return;
    }


    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "animate-fade-in"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.1,
                rootMargin:
                    "0px 0px -50px 0px"
            }
        );


    document
        .querySelectorAll(".animate-slide-up")
        .forEach(function (element) {

            observer.observe(element);

        });

});


// ==========================================================
// CURRENT YEAR
// ==========================================================

document.addEventListener("DOMContentLoaded", function () {

    const year =
        $("currentYear");

    if (year) {
        year.textContent =
            new Date().getFullYear();
    }

});


// ==========================================================
// INITIALIZE
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadProperties();
        loadReviews();

        console.log(
            "✅ Aastha Realty Script Loaded"
        );

    }
);