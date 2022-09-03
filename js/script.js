const url = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";

let quizzes = [];
let quiz;

const quiz_row = document.querySelector('.quiz_row');
const quiz_row_2 = document.querySelector('.quiz_row_2');
const quiz_result = document.querySelector('.quiz_result');

function renderQuizzes(){
    quiz_row.innerHTML = "";    

    for ( let i = 0; i < quizzes.length ; i++){

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
};

function dataArrive(response){

// resposta completa
    console.log("Resposta completa do get", response);

    // pegar apenas a lista com os dados dos quizzes
    console.log("resposta.data do get", response.data);

    console.log(response.data[0]);

    // etapa 4: processar a resposta e mostrar na tela (renderizar)
    
    for( let i = 0; i < response.data.length; i++){
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

function comparator() { 
	return Math.random() - 0.5; 
};

let hits = 0;
let quantity;
let selected;
const questions = document.querySelector('.questions');

function checkResult(question){       
    
    quantity = question.parentNode.children.length;
    selected = document.querySelectorAll('.answered').length;    
    
    const percentage = Math.round(Number(hits/quantity)*100);    

    if( selected === quantity){
        
        let title;
        let text;
        let img;

        for( let i = (quiz.levels.length - 1); i>= 0; i--){
            const q = quiz.levels[i];

            if( percentage > q.minValue){                            
                title = q.title;                
                text = q.text;    
                img = q.image;        
                break;        
            };            
        };
        
        quiz_result.innerHTML = `
            <div class="result_perc">
                <p>
                     ${percentage}% de acerto: ${title}!
                </p>
            </div>
            <div class="result_description">
                <img src="${img}" alt="meme result">
                <p>
                    ${text}
                </p>
            </div>
        `;
        quiz_result.classList.remove('hide');
    };
};

function nextQuestion(){
    const array = questions.children
    for ( let i = 1; i < quantity; i++){
        if( selected === i){
            setTimeout(() => {array[i].scrollIntoView({block: "center", behavior: "smooth"})}, 2000);
        };
        if( selected === quantity){
            setTimeout(() => {quiz_result.scrollIntoView({block: "center", behavior: "smooth"})}, 2000);
        }
    };
};

function selectAnswer(option){
    const question_options = option.parentNode;
    console.log(option);
    console.log(question_options);
    const check_answer = option.children[2];

    // inserir class answered para verificação futura
    question_options.parentNode.classList.add('answered');    

    for ( let i = 0; i < question_options.children.length; i++){
        if(question_options.children[i] !== option){
            question_options.children[i].children[0].classList.add('overlay_option');
            question_options.children[i].removeAttribute("onclick");
        };
        const p_class = question_options.children[i].children[2];

        if( p_class.classList.contains('false_answer')){
            p_class.classList.add('wrong');
        }else{
            p_class.classList.add('right');
        };
        
    };

    if( check_answer.classList.contains('true_answer')){
        hits++;
    };
    checkResult(question_options.parentNode);
    //código para rolar pra prox pergunta aqui
    nextQuestion();
};

const user_quizzes = document.querySelector('.user_quizzes.page_1');
const all_quizzes = document.querySelector('.all_quizzes.page_1');

const top_image = document.querySelector('.top_image.page_2');
const quiz_content = document.querySelector('.quiz_content.page_2');


function renderQuiz(id_element){

    quiz = quizzes[id_element];
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

        quiz.questions[i].answers.sort(comparator);
        
        for ( let n = 0; n < number_answers; n++){
            question_options +=`
            <div class="option" onclick="selectAnswer(this)">
                <div></div>
                <img src="${quiz.questions[i].answers[n].image}" alt="">
                <p class="${quiz.questions[i].answers[n].isCorrectAnswer}_answer">
                ${quiz.questions[i].answers[n].text}
                </p>
            </div>
            `
        };        
        questions.innerHTML += `
        <div class="quiz_question">
                <div class="question_head">
                    <p>
                        ${quiz.questions[i].title}
                    </p>
                </div>
                <div class="question_options">
                    ${question_options}
                </div>
            </div>`;
            questions.children[i].children[0].style.backgroundColor = `${quiz.questions[i].color}`;
            console.log(questions.children[i]);
            console.log(quiz.questions[i].color);
    };
    document.querySelector('.overlay_top').scrollIntoView({block: "start"});
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
    quiz_result.classList.add('hide');

    hits = 0;
    
    getData();
};