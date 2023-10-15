
let countSpan = document.querySelector(".count span");
let bulletsSpnsContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let resultsContanier = document.querySelector(".results");
let coutndownElement = document.querySelector(".countdown");

let currentIndex = 0 ;
let rightAnswers = 0 ;
let countdownInterval;

function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200){
            let questionsObject = JSON.parse(this.responseText);
            let qCount = questionsObject.length;
            createBulltes(qCount);


            addData(questionsObject[currentIndex],qCount);

            countDown(3,qCount);

            submitButton.onclick = () =>{
                let theRightAnswer = questionsObject[currentIndex].Right_answer;

                currentIndex++;

                cheakAnswer(theRightAnswer,qCount);

                quizArea.innerHTML= "";
                answersArea.innerHTML= "";

                addData(questionsObject[currentIndex],qCount);

                handleBullets();

                clearInterval(countdownInterval);
                countDown(3,qCount);

                showResults(qCount);

            };
        }
    };

    myRequest.open("GET","html-questions.json",true);
    myRequest.send();
}
getQuestions();

function createBulltes(num) {
    countSpan.innerHTML = num;

    for( i=0 ; i<num ; i++){
        let theBullet = document.createElement("span");

        if(i === 0){
            theBullet.className = "on";
        }

        bulletsSpnsContainer.appendChild(theBullet);
    }
} 

function addData(obj,count){
    if(currentIndex < count){
        let questionTitle = document.createElement("h2");

    let questionText = document.createTextNode(obj['title']);

    questionTitle.appendChild(questionText);

    quizArea.appendChild(questionTitle);

    for(i=1; i<=4 ; i++){
        let mainDiv = document.createElement("div");

        mainDiv.className = 'answer';

        let radioInput = document.createElement("input");

        radioInput.name = 'question';
        radioInput.type = 'radio';
        radioInput.id = `answer_${i}`;
        radioInput.dataset.answer =obj[`answer_${i}`]; 

        if(i === 1){
            radioInput.checked = true;
        }

        let theLable = document.createElement("label");

        theLable.htmlFor = `answer_${i}`

        let theLableText = document.createTextNode(obj[`answer_${i}`]);

        theLable.appendChild(theLableText);

        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLable);

        answersArea.appendChild(mainDiv);
    }
    }
}

function cheakAnswer(rAnswer, count){
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for(let i=0; i<answers.length ; i++){
        if(answers[i].checked){
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    if(rAnswer === theChoosenAnswer){
        rightAnswers++;
        console.log("Good Answer");
    }
}

function handleBullets(){
    let bulletsSpans =document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span,index)=>{
        if(currentIndex === index){
            span.className = "on";
        }
    })
};

function showResults(count){
    let theResults;
    if(currentIndex === count){
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

        if(rightAnswers > count / 2 && rightAnswers < count){
            theResults = `<span class=good>Good</span>, ${rightAnswers} From ${count}.`;
        }else if(rightAnswers === count){
            theResults =`<span class=perfect>Perfect</span>, All Answers Is Good.`;
        }else{
            theResults = `<span class=bad>Bad</span>, ${rightAnswers} From ${count}.`;
        }

        resultsContanier.innerHTML = theResults;
        resultsContanier.style.padding = "10px";
        resultsContanier.style.marginTop = "10px";
        resultsContanier.style.backgroundColor = "white";
    }
}

function countDown(duration,count){
    if(currentIndex<count){
        let minutes,seconds;
        countdownInterval = setInterval(function(){
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes<10 ? `0${minutes}`:`${minutes}`;
            seconds = seconds<10 ? `0${seconds}`:`${seconds}`;

            coutndownElement.innerHTML = `${minutes} : ${seconds}`;

            if(--duration < 0){
                clearInterval(countdownInterval);
                submitButton.click();            }

        },1000);
    }
}