fetch('https://quiztai.herokuapp.com/api/quiz')
    .then(resp => resp.json())
    .then(resp => {
        preQuestions = resp;

        setQuestion(0);
        previous.addEventListener('click', function () {
            if (index > 0) {
                index--;
                setQuestion(index);
                activateAnswers();
            }
        });

        next.addEventListener('click', function () {
            index++;
            if (index >= preQuestions.length) {
                list.style.display = 'none';
                results.style.display = 'block';
                userScorePoint.innerHTML = points;

                previousScore = JSON.parse(localStorage.getItem("previousScore"));
                games = JSON.parse(localStorage.getItem("games"));
                if(previousScore === null && games === null){
                    avg = points;
                    games = 0;
                }else{
                    avg = ((previousScore * games) + points) / (games + 1);
                }

                average.innerHTML = avg;
                localStorage.setItem("previousScore", JSON.stringify(avg));
                localStorage.setItem("games", JSON.stringify(games + 1));

            } else {
                setQuestion(index);
                activateAnswers();
            }
        });

        restart.addEventListener('click', function (event) {
            event.preventDefault();

            index = 0;
            points = 0;
            let userScorePoint = document.querySelector('.score');
            userScorePoint.innerHTML = points;
            setQuestion(index);
            activateAnswers();
            list.style.display = 'block';
            results.style.display = 'none';
        });

        function setQuestion(index) {
            clearClass();
            number.innerHTML = (index + 1);
            question.innerHTML = preQuestions[index].question;

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
    });

let next = document.querySelector('.next');
let previous = document.querySelector('.previous');

let number = document.querySelector('.number');
let question = document.querySelector('.question');
let answers = document.querySelectorAll('.list-group-item');

let pointsElem = document.querySelector('.score');
let restart = document.querySelector('.restart');

let list = document.querySelector('.list');
let results = document.querySelector('.results');
let userScorePoint = document.querySelector('.userScorePoint');

let average = document.querySelector('.average');

let index = 0;
let points = 0;

for (let i = 0; i < answers.length; i++) {
    answers[i].addEventListener('click', doAction);
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

function doAction(event) {
    if (event.target.innerHTML === preQuestions[index].correct_answer) {
        points++;
        pointsElem.innerText = points;
        markCorrect(event.target);

    } else {
        markInCorrect(event.target);
    }
    disableAnswers();
}

function activateAnswers() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].addEventListener('click', doAction);
    }
}
activateAnswers();

function clearClass() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].classList.remove('correct', 'incorrect');
    }
}

