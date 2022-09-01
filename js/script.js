const url = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";

let quizzes = [];
const n = 6;

const quiz_row = document.querySelector('.quiz_row');
const quiz_row_2 = document.querySelector('.quiz_row_2');

function renderQuizzes(){
    quiz_row.innerHTML = "";
    quiz_row_2.innerHTML = "";

    for ( let i = 0; i < n/2 ; i++){

    quiz_row.innerHTML += `
    <div id="${i}" onclick="showQuiz(this)" class="quiz_thumbnail">
                    <div class="overlay"></div>
                    <img src="${quizzes[i].image}" alt="">
                    <p class="quiz_sub">
                        ${quizzes[i].title}
                    </p>
                </div>
    `;
    };

    for ( let i = n/2; i < n ; i++){

        quiz_row_2.innerHTML += `
        <div id="${i}" onclick="showQuiz(this)" class="quiz_thumbnail">
                        <div class="overlay"></div>
                        <img src="${quizzes[i].image}" alt="">
                        <p class="quiz_sub">
                            ${quizzes[i].title}
                        </p>
                    </div>
        `;
        };
};

function dataArrive(response){

// resposta completa
    console.log("Resposta completa do get", response);

    // pegar apenas a lista com os dados dos quizzes
    console.log("resposta.data do get", response.data);

    console.log(response.data[0]);

    // etapa 4: processar a resposta e mostrar na tela (renderizar)
    
    for( let i = 0; i < n; i++){
        quizzes.push(response.data[i]);        
    };

    console.log(quizzes);

    renderQuizzes();
};

function getData(){

    const promisse = axios.get(url);
    promisse.then(dataArrive);
};
getData();

const user_quizzes = document.querySelector('.user_quizzes.page_1');
const all_quizzes = document.querySelector('.all_quizzes.page_1');

const top_image = document.querySelector('.top_image.page_2');
const quiz_content = document.querySelector('.quiz_content.page_2');
const questions = document.querySelector('.questions');

function renderQuiz(id_element){

    const quiz = quizzes[id_element];    
    const number_questions = quiz.questions.length;    

    console.log(quiz);
    
    top_image.innerHTML += `
    <div class="overlay_top"></div>
            <img src="${quiz.image}" alt="">
            <p>
                ${quiz.title}
            </p>
    `;

    for ( let i = 0; i < number_questions; i++){
        const number_answers = quiz.questions[i].answers.length;
        let question_options = "";

        for ( let n = 0; n < number_answers; n++){
            question_options +=`
            <div class="option">
                <div class="overlay_option"></div>
                <img src="${quiz.questions[i].answers[n].image}" alt="">
                <p class="${quiz.questions[i].answers[n].isCorrectAnswer}_answer">
                ${quiz.questions[i].answers[n].text}
                </p>
            </div>
            `
        };
        questions.innerHTML += `
        <div class="quiz_question">
                <div class="question_head teal">
                    <p>
                        ${quiz.questions[i].title}
                    </p>
                </div>
                <div class="question_options">
                    ${question_options}
                </div>
            </div>`;
    };
    
};

function showQuiz(element){    
    
    user_quizzes.classList.add('hide');
    all_quizzes.classList.add('hide');    

    top_image.classList.remove('hide');
    quiz_content.classList.remove('hide');    
            
   renderQuiz(element.id);
};

function exitQuiz(){
    user_quizzes.classList.remove('hide');
    all_quizzes.classList.remove('hide');    

    top_image.classList.add('hide');
    quiz_content.classList.add('hide');

    top_image.innerHTML = "";
    questions.innerHTML = "";
    
    getData();
};