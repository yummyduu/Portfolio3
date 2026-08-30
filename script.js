/* =====================================
   TRISTAN TEOXON PORTFOLIO
   JAVASCRIPT
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

    document.querySelectorAll(".nav-links a").forEach(link => {

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

/*
   This works for images inside:

   - Laboratories
   - Quizzes
   - Midterm Exams
   - Final Exams

   It also works for images added dynamically
   by JavaScript.
*/


document.addEventListener("click", function (event) {

    const image = event.target.closest(
        ".quiz-card img, .academic-card img, .academic-image"
    );

    if (!image) {
        return;
    }

    openImageViewer(
        image.src,
        image.alt || "Academic Work"
    );

});


/* =====================================
   IMAGE VIEWER
===================================== */

function openImageViewer(imageSrc, imageAlt) {

    // Prevent multiple viewers
    const existingViewer =
        document.querySelector(".image-viewer");

    if (existingViewer) {
        existingViewer.remove();
    }


    const overlay =
        document.createElement("div");

    overlay.className = "image-viewer";


    overlay.innerHTML = `

        <button
            class="image-viewer-close"
            aria-label="Close image"
        >
            ×
        </button>

        <div class="image-viewer-content">

            <img
                src="${escapeHTML(imageSrc)}"
                alt="${escapeHTML(imageAlt)}"
            >

            <p>
                ${escapeHTML(imageAlt)}
            </p>

        </div>

    `;


    document.body.appendChild(overlay);


    // Prevent body from scrolling
    document.body.classList.add("viewer-open");


    // Animate viewer
    requestAnimationFrame(() => {

        overlay.classList.add("active");

    });


    const closeButton =
        overlay.querySelector(
            ".image-viewer-close"
        );


    closeButton.addEventListener("click", () => {

        closeImageViewer(overlay);

    });


    // Click outside image to close
    overlay.addEventListener("click", (event) => {

        if (
            event.target === overlay ||
            event.target.classList.contains(
                "image-viewer-content"
            )
        ) {

            closeImageViewer(overlay);

        }

    });


    // ESC key closes viewer
    const escapeKey = (event) => {

        if (event.key === "Escape") {

            closeImageViewer(overlay);

            document.removeEventListener(
                "keydown",
                escapeKey
            );

        }

    };


    document.addEventListener(
        "keydown",
        escapeKey
    );

}


/* =====================================
   CLOSE IMAGE VIEWER
===================================== */

function closeImageViewer(overlay) {

    if (!overlay) {
        return;
    }


    overlay.classList.remove("active");

    document.body.classList.remove("viewer-open");


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

    element.textContent = text;

    return element.innerHTML;

}
