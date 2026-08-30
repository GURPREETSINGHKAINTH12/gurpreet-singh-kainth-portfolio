// ==========================================
// GURPREET SINGH KAINTH PORTFOLIO
// ==========================================

// Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");

    const icon = menuToggle.querySelector("i");

    if (navLinks.classList.contains("open")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
    } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }
});

// Close menu after clicking a navigation link
document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");

        const icon = menuToggle.querySelector("i");
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    });
});

// Typing effect
const typingText = document.getElementById("typingText");

const words = [
    "Code",
    "Algorithms",
    "Artificial Intelligence",
    "Machine Learning",
    "Software"
];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {
    const word = words[wordIndex];

    if (!deleting) {
        typingText.textContent = word.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === word.length) {
            deleting = true;
            setTimeout(typeEffect, 1300);
            return;
        }
    } else {
        typingText.textContent = word.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }
    }

    setTimeout(typeEffect, deleting ? 55 : 85);
}

typeEffect();

// Active section in navigation
const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-link");

function updateActiveNav() {
    let current = "home";

    sections.forEach((section) => {
        const top = section.offsetTop - 180;

        if (window.scrollY >= top) {
            current = section.id;
        }
    });

    navItems.forEach((link) => {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${current}`
        );
    });
}

window.addEventListener("scroll", updateActiveNav);

// Back to top
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    backToTop.classList.toggle("show", window.scrollY > 550);
});

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// Reveal animations
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12
    }
);

revealElements.forEach((element) => revealObserver.observe(element));

// Contact form
const contactForm = document.getElementById("contactForm");
const toast = document.getElementById("toast");

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
        showToast("Please fill in all fields.");
        return;
    }

    // This is a front-end demo form.
    // No message is actually sent until a backend/email service is connected.
    showToast(`Thanks, ${name}! The demo form is working.`);
    contactForm.reset();
});

// Current year
document.getElementById("currentYear").textContent =
    new Date().getFullYear();

/* =========================================================
   LIVE CERTIFICATES FROM GOOGLE DRIVE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    loadCertificates();
});

let allCertificates = [];

async function loadCertificates() {
    const grid = document.getElementById("certificatesGrid");
    const count = document.getElementById("certificateCount");

    if (!grid) return;

    try {
        const response = await fetch("/api/certificates");

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success || !Array.isArray(data.certificates)) {
            throw new Error("Invalid certificate data received.");
        }

        /*
         * Keep only actual files.
         * Google Drive folders are excluded.
         */
        allCertificates = data.certificates
            .filter(file => file.mimeType !== "application/vnd.google-apps.folder")
            .sort((a, b) => {
                return new Date(b.createdTime) - new Date(a.createdTime);
            });

        renderCertificates(allCertificates);

        if (count) {
            count.textContent = `${allCertificates.length} certificate${allCertificates.length === 1 ? "" : "s"}`;
        }

    } catch (error) {
        console.error("Certificate loading error:", error);

        grid.innerHTML = `
            <div class="certificate-error">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <h3>Certificates couldn't be loaded</h3>
                <p>Please try refreshing the page.</p>
            </div>
        `;

        if (count) {
            count.textContent = "Unable to load certificates";
        }
    }
}


/* ---------------------------------------------------------
   RENDER CERTIFICATES
   --------------------------------------------------------- */

function renderCertificates(certificates) {
    const grid = document.getElementById("certificatesGrid");
    const emptyState = document.getElementById("certificateEmpty");
    const count = document.getElementById("certificateCount");

    if (!grid) return;

    grid.innerHTML = "";

    if (count) {
        count.textContent =
            `${certificates.length} certificate${certificates.length === 1 ? "" : "s"}`;
    }

    if (certificates.length === 0) {
        if (emptyState) {
            emptyState.hidden = false;
        }

        return;
    }

    if (emptyState) {
        emptyState.hidden = true;
    }

    certificates.forEach((certificate, index) => {
        const card = createCertificateCard(certificate, index);
        grid.appendChild(card);
    });
}


/* ---------------------------------------------------------
   CREATE CERTIFICATE CARD
   --------------------------------------------------------- */

function createCertificateCard(certificate, index) {

    const card = document.createElement("article");

    card.className = "certificate-card glass-card reveal";

    const title = certificate.name || "Certificate";

    const date = certificate.createdTime
        ? formatCertificateDate(certificate.createdTime)
        : "Date unavailable";

    const viewLink = certificate.webViewLink || "#";

    const thumbnail = certificate.thumbnailLink;

    let previewHTML = "";

    if (thumbnail) {
        previewHTML = `
            <div class="certificate-preview">
                <img
                    src="${thumbnail}"
                    alt="${escapeHTML(title)}"
                    loading="lazy"
                >

                <div class="certificate-preview-overlay">
                    <span>
                        <i class="fa-solid fa-eye"></i>
                        Preview
                    </span>
                </div>
            </div>
        `;
    } else {
        previewHTML = `
            <div class="certificate-preview">
                <div class="certificate-preview-overlay" style="opacity: 1;">
                    <span>
                        <i class="fa-solid fa-file-pdf"></i>
                        PDF Certificate
                    </span>
                </div>
            </div>
        `;
    }

    card.innerHTML = `
        ${previewHTML}

        <div class="certificate-body">

            <span class="certificate-type">
                <i class="fa-solid fa-certificate"></i>
                Certificate
            </span>

            <h3>${escapeHTML(title)}</h3>

            <div class="certificate-date">
                <i class="fa-regular fa-calendar"></i>
                ${date}
            </div>

            <div class="certificate-actions">

                <a
                    href="${viewLink}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="certificate-view"
                >
                    View Certificate
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>

                <a
                    href="${viewLink}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="certificate-drive"
                    aria-label="Open certificate in Google Drive"
                    title="Open in Google Drive"
                >
                    <i class="fa-brands fa-google-drive"></i>
                </a>

            </div>

        </div>
    `;

    return card;
}


/* ---------------------------------------------------------
   FORMAT DATE
   --------------------------------------------------------- */

function formatCertificateDate(dateString) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}


/* ---------------------------------------------------------
   SEARCH CERTIFICATES
   --------------------------------------------------------- */

const certificateSearch = document.getElementById("certificateSearch");

if (certificateSearch) {
    certificateSearch.addEventListener("input", (event) => {

        const searchTerm = event.target.value
            .trim()
            .toLowerCase();

        const filteredCertificates = allCertificates.filter(certificate =>
            (certificate.name || "")
                .toLowerCase()
                .includes(searchTerm)
        );

        renderCertificates(filteredCertificates);
    });
}


/* ---------------------------------------------------------
   ESCAPE HTML
   --------------------------------------------------------- */

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}