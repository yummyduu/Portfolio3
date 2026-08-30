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

}


/* =====================================
   ACADEMIC PHOTO VIEWER
===================================== */

const academicImages = document.querySelectorAll(
    ".academic-card .academic-image img"
);

academicImages.forEach(image => {

    image.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        openImageViewer(
            this.src,
            this.alt
        );

    });

});


/* =====================================
   OPEN IMAGE VIEWER
===================================== */

function openImageViewer(imageSrc, imageAlt) {

    /* Prevent multiple viewers */

    const oldViewer = document.querySelector(".image-viewer");

    if (oldViewer) {
        oldViewer.remove();
    }


    /* Create viewer */

    const viewer = document.createElement("div");

    viewer.className = "image-viewer";


    viewer.innerHTML = `

        <div class="zoom-controls">

            <button
                type="button"
                class="zoom-out"
                aria-label="Zoom out"
            >
                −
            </button>

            <div class="zoom-level">
                100%
            </div>

            <button
                type="button"
                class="zoom-in"
                aria-label="Zoom in"
            >
                +
            </button>

            <button
                type="button"
                class="zoom-reset"
                aria-label="Reset zoom"
            >
                ↺
            </button>

        </div>


        <button
            type="button"
            class="image-viewer-close"
            aria-label="Close image viewer"
        >
            ×
        </button>


        <div class="image-viewer-content">

            <img
                src="${imageSrc}"
                alt="${escapeHTML(imageAlt)}"
                draggable="false"
            >

            <p>
                ${escapeHTML(imageAlt)}
            </p>

        </div>

    `;


    document.body.appendChild(viewer);

    document.body.classList.add("viewer-open");


    /* =================================
       GET ELEMENTS
    ================================= */

    const image =
        viewer.querySelector(
            ".image-viewer-content img"
        );

    const closeButton =
        viewer.querySelector(
            ".image-viewer-close"
        );

    const zoomInButton =
        viewer.querySelector(
            ".zoom-in"
        );

    const zoomOutButton =
        viewer.querySelector(
            ".zoom-out"
        );

    const zoomResetButton =
        viewer.querySelector(
            ".zoom-reset"
        );

    const zoomLevel =
        viewer.querySelector(
            ".zoom-level"
        );

    const content =
        viewer.querySelector(
            ".image-viewer-content"
        );


    /* =================================
       ZOOM VARIABLES
    ================================= */

    let scale = 1;

    const minScale = 1;
    const maxScale = 5;

    let positionX = 0;
    let positionY = 0;


    /* =================================
       APPLY IMAGE TRANSFORM
    ================================= */

    function updateImage() {

        image.style.transform =
            `translate(${positionX}px, ${positionY}px) scale(${scale})`;

        zoomLevel.textContent =
            `${Math.round(scale * 100)}%`;

    }


    /* =================================
       RESET ZOOM
    ================================= */

    function resetZoom() {

        scale = 1;

        positionX = 0;
        positionY = 0;

        updateImage();

    }


    /* =================================
       ZOOM FUNCTION
    ================================= */

    function changeZoom(amount) {

        const oldScale = scale;

        scale += amount;

        scale =
            Math.max(
                minScale,
                Math.min(maxScale, scale)
            );


        /* If returning to normal size,
           center the image */

        if (scale === 1) {

            positionX = 0;
            positionY = 0;

        }


        /* Prevent unused variable warning */

        void oldScale;

        updateImage();

    }


    /* =================================
       OPEN ANIMATION
    ================================= */

    requestAnimationFrame(() => {

        viewer.classList.add("active");

    });


    /* =================================
       BUTTON EVENTS
    ================================= */

    zoomInButton.addEventListener(
        "click",
        () => changeZoom(0.5)
    );


    zoomOutButton.addEventListener(
        "click",
        () => changeZoom(-0.5)
    );


    zoomResetButton.addEventListener(
        "click",
        resetZoom
    );


    /* =================================
       CLOSE VIEWER
    ================================= */

    function closeViewer() {

        viewer.classList.remove("active");

        document.body.classList.remove("viewer-open");

        setTimeout(() => {

            if (viewer.parentNode) {
                viewer.remove();
            }

        }, 250);

    }


    closeButton.addEventListener(
        "click",
        closeViewer
    );


    /* =================================
       CLICK OUTSIDE IMAGE
    ================================= */

    viewer.addEventListener(
        "click",
        event => {

            if (
                event.target === viewer ||
                event.target === content
            ) {

                closeViewer();

            }

        }
    );


    /* =================================
       ESC KEY
    ================================= */

    function escapeKey(event) {

        if (event.key === "Escape") {

            closeViewer();

            document.removeEventListener(
                "keydown",
                escapeKey
            );

        }

    }

    document.addEventListener(
        "keydown",
        escapeKey
    );


    /* =================================
       MOUSE WHEEL ZOOM
    ================================= */

    viewer.addEventListener(
        "wheel",
        event => {

            event.preventDefault();

            if (event.deltaY < 0) {

                changeZoom(0.25);

            } else {

                changeZoom(-0.25);

            }

        },
        {
            passive: false
        }
    );


    /* =================================
       DRAG IMAGE
    ================================= */

    let dragging = false;

    let startX = 0;
    let startY = 0;

    let startPositionX = 0;
    let startPositionY = 0;


    image.addEventListener(
        "mousedown",
        event => {

            if (scale <= 1) {
                return;
            }

            dragging = true;

            image.classList.add("dragging");

            startX = event.clientX;
            startY = event.clientY;

            startPositionX = positionX;
            startPositionY = positionY;

        }
    );


    window.addEventListener(
        "mousemove",
        event => {

            if (!dragging) {
                return;
            }

            positionX =
                startPositionX +
                (event.clientX - startX);

            positionY =
                startPositionY +
                (event.clientY - startY);

            updateImage();

        }
    );


    window.addEventListener(
        "mouseup",
        () => {

            dragging = false;

            image.classList.remove(
                "dragging"
            );

        }
    );


    /* =================================
       TOUCH / MOBILE ZOOM
    ================================= */

    let touchStartDistance = null;

    let touchStartScale = 1;


    function getTouchDistance(touches) {

        const first = touches[0];
        const second = touches[1];

        const x =
            second.clientX -
            first.clientX;

        const y =
            second.clientY -
            first.clientY;

        return Math.sqrt(
            x * x + y * y
        );

    }


    image.addEventListener(
        "touchstart",
        event => {

            if (event.touches.length === 2) {

                touchStartDistance =
                    getTouchDistance(
                        event.touches
                    );

                touchStartScale =
                    scale;

            }

        },
        {
            passive: true
        }
    );


    image.addEventListener(
        "touchmove",
        event => {

            if (
                event.touches.length === 2 &&
                touchStartDistance
            ) {

                event.preventDefault();

                const currentDistance =
                    getTouchDistance(
                        event.touches
                    );

                const ratio =
                    currentDistance /
                    touchStartDistance;

                scale =
                    touchStartScale *
                    ratio;

                scale =
                    Math.max(
                        minScale,
                        Math.min(maxScale, scale)
                    );

                updateImage();

            }

        },
        {
            passive: false
        }
    );


    image.addEventListener(
        "touchend",
        event => {

            if (event.touches.length < 2) {

                touchStartDistance = null;

            }

        }
    );


    /* =================================
       DOUBLE CLICK ZOOM
    ================================= */

    image.addEventListener(
        "dblclick",
        event => {

            event.preventDefault();

            if (scale === 1) {

                scale = 2.5;

            } else {

                resetZoom();

                return;

            }

            updateImage();

        }
    );


    /* =================================
       INITIAL UPDATE
    ================================= */

    updateImage();

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
