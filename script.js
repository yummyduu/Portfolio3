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


/* =====================================
   ACADEMIC IMAGE VIEWER
===================================== */

const academicImages =
    document.querySelectorAll(".academic-card img");


academicImages.forEach(image => {

    image.style.cursor = "zoom-in";


    image.addEventListener("click", () => {

        openImageViewer(
            image.src,
            image.alt
        );

    });

});


/* =====================================
   IMAGE VIEWER
===================================== */

function openImageViewer(imageSrc, imageAlt) {

    const overlay =
        document.createElement("div");


    overlay.className =
        "image-viewer";


    overlay.innerHTML = `

        <button
            class="image-viewer-close"
            aria-label="Close image"
        >
            ×
        </button>

        <div class="image-viewer-content">

            <img
                src="${imageSrc}"
                alt="${escapeHTML(imageAlt)}"
            >

            <p>
                ${escapeHTML(imageAlt)}
            </p>

        </div>

    `;


    document.body.appendChild(overlay);


    requestAnimationFrame(() => {

        overlay.classList.add("active");

    });


    const closeButton =
        overlay.querySelector(
            ".image-viewer-close"
        );


    closeButton.addEventListener(
        "click",
        () => closeImageViewer(overlay)
    );


    overlay.addEventListener(
        "click",
        event => {

            if (event.target === overlay) {

                closeImageViewer(overlay);

            }

        }
    );


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

}


/* =====================================
   CLOSE IMAGE VIEWER
===================================== */

function closeImageViewer(overlay) {

    overlay.classList.remove("active");

    setTimeout(() => {

        overlay.remove();

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
