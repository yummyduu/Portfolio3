/* =====================================
   TRISTAN TEOXON PORTFOLIO
   JAVASCRIPT
   DARK DEVELOPER THEME
===================================== */


/* =====================================
   MOBILE MENU
===================================== */

const menuButton = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {

    menuButton.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });

    document
        .querySelectorAll(".nav-links a")
        .forEach(link => {

            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
            });

        });

}


/* =====================================
   SCROLL REVEAL
===================================== */

const revealElements = document.querySelectorAll(
    ".reveal, .reveal-left, .reveal-right"
);

if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(

        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    observer.unobserve(entry.target);

                }

            });

        },

        {
            threshold: 0.12
        }

    );

    revealElements.forEach(element => {
        observer.observe(element);
    });

} else {

    revealElements.forEach(element => {
        element.classList.add("show");
    });

}


/* =====================================
   ACADEMIC IMAGE ZOOM
===================================== */

const academicImages = document.querySelectorAll(
    ".academic-card .academic-image img"
);

academicImages.forEach(image => {

    image.style.cursor = "zoom-in";

    image.setAttribute("tabindex", "0");

    image.setAttribute(
        "aria-label",
        `Open ${image.alt || "academic image"} in full screen`
    );


    /* CLICK IMAGE */

    image.addEventListener("click", () => {

        openImageViewer(
            image.src,
            image.alt
        );

    });


    /* KEYBOARD SUPPORT */

    image.addEventListener("keydown", event => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            openImageViewer(
                image.src,
                image.alt
            );

        }

    });

});


/* =====================================
   IMAGE VIEWER
===================================== */

function openImageViewer(imageSrc, imageAlt) {

    /* Prevent multiple viewers */

    const existingViewer =
        document.querySelector(".image-viewer");

    if (existingViewer) {
        existingViewer.remove();
    }


    /* Create overlay */

    const overlay =
        document.createElement("div");

    overlay.className = "image-viewer";

    overlay.setAttribute(
        "role",
        "dialog"
    );

    overlay.setAttribute(
        "aria-modal",
        "true"
    );

    overlay.setAttribute(
        "aria-label",
        imageAlt || "Academic work preview"
    );


    overlay.innerHTML = `

        <div class="image-viewer-backdrop"></div>

        <div class="image-viewer-content">

            <button
                class="image-viewer-close"
                type="button"
                aria-label="Close image"
            >
                ×
            </button>

            <img
                class="image-viewer-image"
                src="${escapeHTML(imageSrc)}"
                alt="${escapeHTML(imageAlt)}"
            >

            ${
                imageAlt
                    ? `<p class="image-viewer-caption">
                        ${escapeHTML(imageAlt)}
                       </p>`
                    : ""
            }

        </div>

    `;


    /* Add viewer to BODY */

    document.body.appendChild(overlay);


    /* Prevent background scrolling */

    document.body.classList.add(
        "image-viewer-open"
    );


    /* Animate viewer */

    requestAnimationFrame(() => {

        overlay.classList.add("active");

    });


    /* Close button */

    const closeButton =
        overlay.querySelector(
            ".image-viewer-close"
        );

    closeButton.addEventListener(
        "click",
        () => closeImageViewer(overlay)
    );


    /* Close when clicking dark background */

    const backdrop =
        overlay.querySelector(
            ".image-viewer-backdrop"
        );

    backdrop.addEventListener(
        "click",
        () => closeImageViewer(overlay)
    );


    /* Prevent clicking the image from closing */

    const image =
        overlay.querySelector(
            ".image-viewer-image"
        );

    image.addEventListener(
        "click",
        event => {

            event.stopPropagation();

        }
    );


    /* ESC key */

    document.addEventListener(
        "keydown",
        function escapeKey(event) {

            if (event.key === "Escape") {

                closeImageViewer(overlay);

                document.removeEventListener(
                    "keydown",
                    escapeKey
                );

            }

        }
    );


    /* Focus close button */

    setTimeout(() => {

        closeButton.focus();

    }, 100);

}


/* =====================================
   CLOSE IMAGE VIEWER
===================================== */

function closeImageViewer(overlay) {

    if (!overlay) {
        return;
    }


    overlay.classList.remove("active");


    document.body.classList.remove(
        "image-viewer-open"
    );


    setTimeout(() => {

        if (overlay) {
            overlay.remove();
        }

    }, 250);

}


/* =====================================
   ESCAPE HTML
===================================== */

function escapeHTML(text) {

    const element =
        document.createElement("div");

    element.textContent =
        text || "";

    return element.innerHTML;

}
