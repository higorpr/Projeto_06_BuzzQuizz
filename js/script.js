const url = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";

let quizzes = [];
const n = 6;

function renderQuizzes(){
    const quiz_row = document.querySelector('.quiz_row');
    const quiz_row_2 = document.querySelector('.quiz_row_2');

    for ( let i = 0; i < n/2 ; i++){

    quiz_row.innerHTML += `
    <div class="quiz_thumbnail">
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
        <div class="quiz_thumbnail">
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
