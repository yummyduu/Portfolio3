/* =====================================
   TRISTAN TEOXON PORTFOLIO
   JAVASCRIPT
   ACADEMIC IMAGE ZOOM + MOBILE MENU
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
   ACADEMIC WORK IMAGE ZOOM
===================================== */

/*
    This selects ALL images inside:

    .academic-card

    So it automatically works for:

    - Laboratories
    - Quizzes
    - Midterms
    - Finals
    - Future academic work
*/

const academicImages = document.querySelectorAll(
    ".academic-card .academic-image img"
);


/* =====================================
   MAKE ACADEMIC PHOTOS CLICKABLE
===================================== */

academicImages.forEach(image => {

    // Make it obvious that the image is clickable
    image.style.cursor = "zoom-in";

    image.setAttribute(
        "title",
        "Click to view and zoom"
    );


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
   IMAGE VIEWER VARIABLES
===================================== */

let currentViewer = null;
let currentImage = null;

let zoomLevel = 1;

let translateX = 0;
let translateY = 0;

let isDragging = false;

let startX = 0;
let startY = 0;

let initialX = 0;
let initialY = 0;


/* =====================================
   OPEN IMAGE VIEWER
===================================== */

function openImageViewer(imageSrc, imageAlt) {

    /*
        Close an existing viewer first.
    */

    if (currentViewer) {
        closeImageViewer();
    }


    /* Reset zoom */

    zoomLevel = 1;

    translateX = 0;
    translateY = 0;

    isDragging = false;


    /* Prevent page scrolling */

    document.body.classList.add("viewer-open");


    /* Create overlay */

    const viewer = document.createElement("div");

    viewer.className = "image-viewer";


    viewer.innerHTML = `

        <button
            class="image-viewer-close"
            type="button"
            aria-label="Close image"
        >
            ×
        </button>


        <div class="image-viewer-toolbar">

            <button
                type="button"
                class="zoom-out"
                aria-label="Zoom out"
            >
                −
            </button>

            <span class="zoom-level">
                100%
            </span>

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
                Reset
            </button>

        </div>


        <div class="image-viewer-content">

            <img
                class="zoomable-image"
                src="${imageSrc}"
                alt="${escapeHTML(imageAlt)}"
                draggable="false"
            >

            <p class="image-viewer-caption">
                ${escapeHTML(imageAlt)}
            </p>

        </div>


        <div class="image-viewer-help">
            Scroll to zoom • Drag to move • ESC to close
        </div>

    `;


    document.body.appendChild(viewer);


    currentViewer = viewer;

    currentImage =
        viewer.querySelector(".zoomable-image");


    /* =================================
       ACTIVATE VIEWER
    ================================= */

    requestAnimationFrame(() => {

        viewer.classList.add("active");

    });


    /* =================================
       CLOSE BUTTON
    ================================= */

    const closeButton =
        viewer.querySelector(".image-viewer-close");

    closeButton.addEventListener(
        "click",
        closeImageViewer
    );


    /* =================================
       ZOOM BUTTONS
    ================================= */

    const zoomInButton =
        viewer.querySelector(".zoom-in");

    const zoomOutButton =
        viewer.querySelector(".zoom-out");

    const resetButton =
        viewer.querySelector(".zoom-reset");


    zoomInButton.addEventListener("click", () => {

        changeZoom(0.25);

    });


    zoomOutButton.addEventListener("click", () => {

        changeZoom(-0.25);

    });


    resetButton.addEventListener("click", () => {

        resetZoom();

    });


    /* =================================
       CLICK BACKGROUND TO CLOSE
    ================================= */

    viewer.addEventListener("click", event => {

        if (
            event.target === viewer ||
            event.target.classList.contains(
                "image-viewer-content"
            )
        ) {

            closeImageViewer();

        }

    });


    /* =================================
       MOUSE WHEEL ZOOM
    ================================= */

    currentImage.addEventListener(
        "wheel",
        handleImageWheel,
        {
            passive: false
        }
    );


    /* =================================
       MOUSE DRAG
    ================================= */

    currentImage.addEventListener(
        "mousedown",
        startDragging
    );

    document.addEventListener(
        "mousemove",
        dragImage
    );

    document.addEventListener(
        "mouseup",
        stopDragging
    );


    /* =================================
       TOUCH SUPPORT
    ================================= */

    currentImage.addEventListener(
        "touchstart",
        startTouchDrag,
        {
            passive: false
        }
    );

    currentImage.addEventListener(
        "touchmove",
        moveTouchDrag,
        {
            passive: false
        }
    );

    currentImage.addEventListener(
        "touchend",
        stopTouchDrag
    );


    /* =================================
       DOUBLE CLICK ZOOM
    ================================= */

    currentImage.addEventListener(
        "dblclick",
        () => {

            if (zoomLevel === 1) {

                zoomLevel = 2;

            } else {

                resetZoom();

                return;

            }

            updateImageTransform();

        }
    );


    /* =================================
       KEYBOARD CONTROLS
    ================================= */

    document.addEventListener(
        "keydown",
        handleViewerKeyboard
    );

}


/* =====================================
   ZOOM IN / OUT
===================================== */

function changeZoom(amount) {

    zoomLevel += amount;


    /*
        Minimum zoom
    */

    if (zoomLevel < 1) {
        zoomLevel = 1;
    }


    /*
        Maximum zoom
    */

    if (zoomLevel > 5) {
        zoomLevel = 5;
    }


    /*
        If returning to normal size,
        reset image position.
    */

    if (zoomLevel === 1) {

        translateX = 0;
        translateY = 0;

    }


    updateImageTransform();

}


/* =====================================
   RESET ZOOM
===================================== */

function resetZoom() {

    zoomLevel = 1;

    translateX = 0;
    translateY = 0;

    updateImageTransform();

}


/* =====================================
   UPDATE IMAGE
===================================== */

function updateImageTransform() {

    if (!currentImage) {
        return;
    }


    currentImage.style.transform =
        `translate(${translateX}px, ${translateY}px)
         scale(${zoomLevel})`;


    const percentage =
        Math.round(zoomLevel * 100);


    if (currentViewer) {

        const zoomText =
            currentViewer.querySelector(
                ".zoom-level"
            );

        if (zoomText) {

            zoomText.textContent =
                `${percentage}%`;

        }

    }


    if (zoomLevel > 1) {

        currentImage.style.cursor =
            "grab";

    } else {

        currentImage.style.cursor =
            "zoom-in";

    }

}


/* =====================================
   MOUSE WHEEL ZOOM
===================================== */

function handleImageWheel(event) {

    event.preventDefault();

    if (event.deltaY < 0) {

        changeZoom(0.15);

    } else {

        changeZoom(-0.15);

    }

}


/* =====================================
   START DRAGGING
===================================== */

function startDragging(event) {

    if (zoomLevel <= 1) {
        return;
    }


    event.preventDefault();


    isDragging = true;


    startX = event.clientX;
    startY = event.clientY;


    initialX = translateX;
    initialY = translateY;


    currentImage.style.cursor =
        "grabbing";

}


/* =====================================
   DRAG IMAGE
===================================== */

function dragImage(event) {

    if (!isDragging) {
        return;
    }


    event.preventDefault();


    const movementX =
        event.clientX - startX;

    const movementY =
        event.clientY - startY;


    translateX =
        initialX + movementX;

    translateY =
        initialY + movementY;


    updateImageTransform();

}


/* =====================================
   STOP DRAGGING
===================================== */

function stopDragging() {

    if (!isDragging) {
        return;
    }


    isDragging = false;


    if (currentImage) {

        currentImage.style.cursor =
            zoomLevel > 1
                ? "grab"
                : "zoom-in";

    }

}


/* =====================================
   TOUCH DRAG
===================================== */

let touchStartX = 0;
let touchStartY = 0;

let touchInitialX = 0;
let touchInitialY = 0;


function startTouchDrag(event) {

    if (zoomLevel <= 1) {
        return;
    }


    if (event.touches.length !== 1) {
        return;
    }


    event.preventDefault();


    const touch =
        event.touches[0];


    touchStartX =
        touch.clientX;

    touchStartY =
        touch.clientY;


    touchInitialX =
        translateX;

    touchInitialY =
        translateY;

}


/* =====================================
   MOVE TOUCH
===================================== */

function moveTouchDrag(event) {

    if (zoomLevel <= 1) {
        return;
    }


    if (event.touches.length !== 1) {
        return;
    }


    event.preventDefault();


    const touch =
        event.touches[0];


    const movementX =
        touch.clientX - touchStartX;

    const movementY =
        touch.clientY - touchStartY;


    translateX =
        touchInitialX + movementX;

    translateY =
        touchInitialY + movementY;


    updateImageTransform();

}


/* =====================================
   STOP TOUCH DRAG
===================================== */

function stopTouchDrag() {

    // Nothing needed here.
}


/* =====================================
   KEYBOARD CONTROLS
===================================== */

function handleViewerKeyboard(event) {

    if (!currentViewer) {
        return;
    }


    /* ESC = close */

    if (event.key === "Escape") {

        closeImageViewer();

        return;

    }


    /* + = zoom in */

    if (
        event.key === "+" ||
        event.key === "="
    ) {

        changeZoom(0.25);

        return;

    }


    /* - = zoom out */

    if (event.key === "-") {

        changeZoom(-0.25);

        return;

    }


    /* 0 = reset */

    if (event.key === "0") {

        resetZoom();

        return;

    }


    /* Arrow keys move zoomed image */

    if (zoomLevel > 1) {

        if (event.key === "ArrowLeft") {

            translateX -= 30;

            updateImageTransform();

        }

        if (event.key === "ArrowRight") {

            translateX += 30;

            updateImageTransform();

        }

        if (event.key === "ArrowUp") {

            translateY -= 30;

            updateImageTransform();

        }

        if (event.key === "ArrowDown") {

            translateY += 30;

            updateImageTransform();

        }

    }

}


/* =====================================
   CLOSE IMAGE VIEWER
===================================== */

function closeImageViewer() {

    if (!currentViewer) {
        return;
    }


    const viewer =
        currentViewer;


    viewer.classList.remove("active");


    document.body.classList.remove(
        "viewer-open"
    );


    document.removeEventListener(
        "mousemove",
        dragImage
    );

    document.removeEventListener(
        "mouseup",
        stopDragging
    );

    document.removeEventListener(
        "keydown",
        handleViewerKeyboard
    );


    setTimeout(() => {

        if (viewer) {
            viewer.remove();
        }

    }, 300);


    currentViewer = null;
    currentImage = null;


    zoomLevel = 1;

    translateX = 0;
    translateY = 0;

    isDragging = false;

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
