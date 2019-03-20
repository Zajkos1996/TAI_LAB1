let next = document.querySelector('.next');
let previous = document.querySelector('.previous');
let question = document.querySelector('.question');
let questionNumber = document.querySelector('.questionNumber');
let answers = document.querySelectorAll('.list-group-item');
let pointsElem = document.querySelector('.score');
let restart = document.querySelector('.restart');

let index = 0;
let points = 0;

let list = document.querySelector('.list');
let results = document.querySelector('.results');
let userScorePoint = document.querySelector('.userScorePoint');
let averageScore = document.querySelector('.average');

let preQuestions = [];
fetch('https://quiztai.herokuapp.com/api/quiz')
    .then(resp => resp.json())
    .then(resp => {
        preQuestions = resp;

        setQuestion(index);
        activateAnswers();

        next.addEventListener('click', function () {

            if(index < preQuestions.length - 1){
                index++;
                setQuestion(index);
                questionNumber.innerHTML = index + 1;
            } else {
                list.style.display = 'none';
                results.style.display = 'block';
                userScorePoint.innerHTML = points;
                saveResult();
            }
            activateAnswers();

        });

        previous.addEventListener('click', function () {
            if(index > 0){
                index--;
                setQuestion(index);
                questionNumber.innerHTML = index + 1;
            }
            activateAnswers();
        });

        restart.addEventListener("click", () => {
            list.style.display = 'block';
            results.style.display = 'none';
            userScorePoint.style.display = 'block';
            index = 0;
            points = 0;
            pointsElem.innerText = points;
            setQuestion(index);
        });

    });



function setQuestion(index) {
    clearClass();
    question.innerHTML = preQuestions[index].question;
    questionNumber.innerHTML = index + 1;
    answers[0].innerHTML = preQuestions[index].answers[0];
    answers[1].innerHTML = preQuestions[index].answers[1];
    answers[2].innerHTML = preQuestions[index].answers[2];
    answers[3].innerHTML = preQuestions[index].answers[3];

    if (preQuestions[index].answers.length === 2) {
        answers[2].style.display = 'none';
        answers[3].style.display = 'none';
    } else {
        answers[2].style.display = 'block';
        answers[3].style.display = 'block';
    }
}



function activateAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].addEventListener('click', doAction);
    }
}


function doAction(event) {

    if (event.target.innerHTML === preQuestions[index].correct_answer) {
        points++;
        pointsElem.innerText = points;
        markCorrect(event.target);
    }
    else {
        markInCorrect(event.target);
    }
    disableAnswers();
}

function markCorrect(elem) {
    elem.classList.add('correct');
}

function markInCorrect(elem) {
    elem.classList.add('incorrect');
}

function disableAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].removeEventListener('click', doAction);
    }
}

function clearClass() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].classList.remove("correct", "incorrect");
    }
}

function saveResult() {

    if (localStorage.getItem("quizScore") != null) {
        let poprzWynik = JSON.parse(localStorage.getItem("quizScore"));
        let nowyWynik = {
            "avgScore": (poprzWynik.avgScore + points) / (poprzWynik.numberOfGames + 1),
            "numberOfGames": JSON.parse(localStorage.getItem("quizScore")).numberOfGames + 1
        };
        localStorage.setItem("quizScore", JSON.stringify(nowyWynik));
    } else {
        let nowyWynik = {
            "avgScore": points,
            "numberOfGames": 1
        };
        localStorage.setItem("quizScore", JSON.stringify(nowyWynik));
    }
    averageScore.innerText = JSON.parse(localStorage.getItem("quizScore")).avgScore;


}



