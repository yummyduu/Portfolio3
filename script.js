/* =====================================
   TRISTAN TEOXON PORTFOLIO
   JAVASCRIPT
===================================== */


/* =====================================
   MOBILE MENU
===================================== */

const menuButton =
    document.querySelector(".menu-btn");

const navLinks =
    document.querySelector(".nav-links");


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


/* =====================================
   SMOOTH SCROLL REVEAL
===================================== */

const revealElements =
    document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right"
    );


const observer =
    new IntersectionObserver(

        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    observer.unobserve(
                        entry.target
                    );

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
   QUIZ SYSTEM
===================================== */

const quizUpload =
    document.getElementById("quizUpload");

const quizList =
    document.getElementById("quizList");

const emptyQuiz =
    document.getElementById("emptyQuiz");


let quizzes = [];


/* =====================================
   LOAD SAVED QUIZZES
===================================== */

window.addEventListener("load", () => {

    const saved =
        localStorage.getItem(
            "tristanPortfolioQuizzes"
        );


    if (saved) {

        quizzes = JSON.parse(saved);

        renderQuizzes();

    }

});


/* =====================================
   UPLOAD QUIZ
===================================== */

quizUpload.addEventListener(
    "change",
    function () {

        const file = this.files[0];


        if (!file) {
            return;
        }


        const reader =
            new FileReader();


        reader.onload = function (event) {

            const quiz = {

                id: Date.now(),

                name: file.name,

                type: file.type,

                size: formatSize(file.size),

                data: event.target.result

            };


            quizzes.push(quiz);

            saveQuizzes();

            renderQuizzes();

        };


        reader.readAsDataURL(file);


        this.value = "";

    }
);


/* =====================================
   DISPLAY QUIZZES
===================================== */

function renderQuizzes() {

    quizList.innerHTML = "";


    if (quizzes.length === 0) {

        quizList.appendChild(emptyQuiz);

        return;

    }


    quizzes.forEach(quiz => {

        const card =
            document.createElement("div");


        card.className =
            "quiz-card reveal";


        let icon = "📄";


        if (quiz.type.includes("image")) {

            icon = "🖼️";

        }

        else if (quiz.type.includes("pdf")) {

            icon = "📕";

        }

        else if (
            quiz.name.endsWith(".doc") ||
            quiz.name.endsWith(".docx")
        ) {

            icon = "📘";

        }


        card.innerHTML = `

            <div class="quiz-file-icon">
                ${icon}
            </div>

            <h3>
                ${escapeHTML(quiz.name)}
            </h3>

            <p>
                ${quiz.size}
            </p>

            <div class="quiz-actions">

                <button
                    onclick="openQuiz(${quiz.id})"
                >
                    Open
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteQuiz(${quiz.id})"
                >
                    Delete
                </button>

            </div>

        `;


        quizList.appendChild(card);


        setTimeout(() => {

            card.classList.add("show");

        }, 50);

    });

}


/* =====================================
   OPEN QUIZ
===================================== */

function openQuiz(id) {

    const quiz =
        quizzes.find(
            item => item.id === id
        );


    if (!quiz) {
        return;
    }


    const newWindow =
        window.open();


    if (!newWindow) {

        alert(
            "Please allow pop-ups to open your quiz."
        );

        return;

    }


    if (quiz.type.includes("image")) {

        newWindow.document.write(`

            <!DOCTYPE html>

            <html>

            <head>

                <title>
                    ${escapeHTML(quiz.name)}
                </title>

                <style>

                    body {

                        margin: 0;

                        min-height: 100vh;

                        background: #070a0d;

                        display: flex;

                        justify-content: center;

                        align-items: center;

                    }

                    img {

                        max-width: 95%;

                        max-height: 95vh;

                        object-fit: contain;

                    }

                </style>

            </head>

            <body>

                <img src="${quiz.data}">

            </body>

            </html>

        `);

    }

    else {

        newWindow.location.href =
            quiz.data;

    }

}


/* =====================================
   DELETE QUIZ
===================================== */

function deleteQuiz(id) {

    if (
        !confirm(
            "Remove this quiz from your portfolio?"
        )
    ) {

        return;

    }


    quizzes =
        quizzes.filter(
            quiz => quiz.id !== id
        );


    saveQuizzes();

    renderQuizzes();

}


/* =====================================
   SAVE
===================================== */

function saveQuizzes() {

    try {

        localStorage.setItem(

            "tristanPortfolioQuizzes",

            JSON.stringify(quizzes)

        );

    }

    catch (error) {

        alert(
            "Storage is full. Please remove some quizzes."
        );

    }

}


/* =====================================
   FILE SIZE
===================================== */

function formatSize(bytes) {

    if (bytes === 0) {

        return "0 Bytes";

    }


    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];


    const index =
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );


    return (
        Math.round(
            bytes /
            Math.pow(1024, index) *
            100
        ) / 100
    )
    + " "
    + units[index];

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


