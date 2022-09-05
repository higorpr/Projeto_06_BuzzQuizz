const url = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";

let quizzes = [];
let quiz = [];
let userIds = [];

const quiz_row = document.querySelector('.quiz_row');
const quiz_row_2 = document.querySelector('.quiz_row_2');
const quiz_result = document.querySelector('.quiz_result');

function renderQuizzes() {
    quiz_row.innerHTML = "";

    for (let i = 0; i < quizzes.length; i++) {

        quiz_row.innerHTML += `
    <div id="${quizzes[i].id}"  class="quiz_thumbnail" data-identifier="quizz-card">
                    <div class="overlay" onclick="showQuiz(this)"></div>
                    <img src="${quizzes[i].image}" alt="">
                    <p class="quiz_sub">
                        ${quizzes[i].title}
                    </p>
                </div>
    `;
        if (userIds !== null) {
            for (let n = 0; n < userIds.length; n++) {
                if (userIds[n] === quizzes[i].id) {
                    document.getElementById(quizzes[i].id).remove();
                };
            };
        }
    };
    userIds = getUserQuizzes();
    document.querySelector('.load_page').classList.add('hide');
    userKeys = getUserKeys();
};

function getData() {
    document.querySelector('.load_page').classList.remove('hide');
    quizzes = [];
    const promisse = axios.get(url);
    promisse.then(dataArrive);
};

function dataArrive(response) {

    // // resposta completa
    // console.log("Resposta completa do get", response);

    // // pegar apenas a lista com os dados dos quizzes
    // console.log("resposta.data do get", response.data);

    // console.log(response.data[0]);

    // etapa 4: processar a resposta e mostrar na tela (renderizar)

    for (let i = 0; i < response.data.length; i++) {
        quizzes.push(response.data[i]);
    };

    console.log(quizzes);

    renderQuizzes();
    renderUserQuizzes(response.data);
}

function comparator() {
    return Math.random() - 0.5;
};

let hits = 0;
let quantity;
let selected;
const questions = document.querySelector('.questions');

function checkResult(question) {

    quantity = question.parentNode.children.length;
    selected = document.querySelectorAll('.answered').length;

    const percentage = Math.round(Number(hits / quantity) * 100);

    if (selected === quantity) {

        let title;
        let text;
        let img;

        for (let i = (quiz.levels.length - 1); i >= 0; i--) {
            const q = quiz.levels[i];

            if (percentage > q.minValue) {
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
        setTimeout(() => { quiz_result.classList.remove('hide') }, 2000);
    };
};

function nextQuestion() {
    const array = questions.children
    for (let i = 1; i < quantity; i++) {
        if (selected === i) {
            setTimeout(() => { array[i].scrollIntoView({ block: "center", behavior: "smooth" }) }, 2000);
        };
        if (selected === quantity) {
            setTimeout(() => { quiz_result.scrollIntoView({ block: "center", behavior: "smooth" }) }, 2000);
        }
    };
};

function selectAnswer(option) {
    const question_options = option.parentNode;
    console.log(option);
    console.log(question_options);
    const check_answer = option.children[2];

    // inserir class answered para verificação futura
    question_options.parentNode.classList.add('answered');

    for (let i = 0; i < question_options.children.length; i++) {
        if (question_options.children[i] !== option) {
            question_options.children[i].children[0].classList.add('overlay_option');
            question_options.children[i].setAttribute("onclick", "disabled");
        };
        const p_class = question_options.children[i].children[2];

        if (p_class.classList.contains('false_answer')) {
            p_class.classList.add('wrong');
        } else {
            p_class.classList.add('right');
        };

    };

    if (check_answer.classList.contains('true_answer')) {
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

let id;

function renderQuiz(id_element) {
    id = id_element;
    //quiz = quizzes[id_element];
    let filter_quiz = quizzes.filter(dev => dev.id === Number(id_element));
    quiz = filter_quiz[0];
    const number_questions = quiz.questions.length;

    top_image.innerHTML = `
    <div class="overlay_top"></div>
            <img src="${quiz.image}" alt="">
            <p>
                ${quiz.title}
            </p>
    `;

    for (let i = 0; i < number_questions; i++) {
        const number_answers = quiz.questions[i].answers.length;
        let question_options = "";

        quiz.questions[i].answers.sort(comparator);

        for (let n = 0; n < number_answers; n++) {
            question_options += `
            <div class="option" onclick="selectAnswer(this)" data-identifier="answer">
                <div></div>
                <img src="${quiz.questions[i].answers[n].image}" alt="">
                <p class="${quiz.questions[i].answers[n].isCorrectAnswer}_answer">
                ${quiz.questions[i].answers[n].text}
                </p>
            </div>
            `
        };
        questions.innerHTML += `
        <div class="quiz_question" data-identifier="question">
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
    document.querySelector('.load_page').classList.add('hide');
    document.querySelector('.overlay_top').scrollIntoView({ block: "start" });
};

const page1 = document.querySelector('.pagina1');

function showQuiz(element) {
    page1.classList.add('hide');
    //user_quizzes.classList.add('hide');
    //all_quizzes.classList.add('hide');

    top_image.classList.remove('hide');
    quiz_content.classList.remove('hide');

    document.querySelector('.load_page').classList.remove('hide');
    renderQuiz(element.parentNode.id);
    
};

function exitQuiz() {
    page1.classList.remove('hide');
    page3.classList.add("hide");
    //user_quizzes.classList.remove('hide');
    //all_quizzes.classList.remove('hide');    

    top_image.classList.add('hide');
    quiz_content.classList.add('hide');

    top_image.innerHTML = "";
    questions.innerHTML = "";
    quiz_result.classList.add('hide');

    hits = 0;
    quiz = [];

    getData();
};

const page3 = document.querySelector('.page_3');

function hide1Show3() {
    console.log('TESTE')
    page1.classList.add("hide");
    page3.classList.remove("hide");


    for (let i = 0; i < page3.childElementCount; i++) {
        page3.children[i].classList.add('hide');
    }
    document.querySelector('.start_user_quiz').classList.remove('hide');
};

function restartQuiz() {
    //Todo este código abaixo é desnecessário, pois foi feito enxuto lá no fim

    /*const rightAnswerArr = document.querySelectorAll('.right');
    const wrongAnswerArr = document.querySelectorAll('.wrong');
    const overlayArr = document.querySelectorAll('.overlay_option');
    const top = document.querySelector('.top_image');
    const selected_reset = document.querySelectorAll('.answered');
    console.log(rightAnswerArr);

    // Removing overlays
    for (let i = 0; i < overlayArr.length; i++) {
        overlayArr[i].classList.remove('overlay_option');
    }

    // Removing green markings 
    for (let i = 0; i < rightAnswerArr.length; i++) {
        rightAnswerArr[i].classList.remove('right')
    }

    for (let i = 0; i < wrongAnswerArr.length; i++) {
        wrongAnswerArr[i].classList.remove('wrong')
    }

    // Remove class selected for questions
    for( let i =0; i<selected_reset.length; i++){
        selected_reset[i].classList.remove('answered');
    };

    // activated onclick question options
    for( let i = 0; i < questions.childElementCount; i++){
        quantity = questions.children[i].children[1].childElementCount;
        quiz.questions[i].answers.sort(comparator);
        for( let n = 0; n < quantity; n++){
        questions.children[i].children[1].children[n].setAttribute("onclick", "selectAnswer(this)");
        };
    };

    for ( let i = 0; i < quiz.questions.length; i++){
        quiz.questions[i].answers.sort(comparator);
        
        
    };

    quiz_result.innerHTML = "";
    quiz_result.classList.add('hide');
    hits = 0;
    
    // Scrolling Up
    top.scrollIntoView();*/

    top_image.innerHTML = "";
    questions.innerHTML = "";
    quiz_result.innerHTML = "";
    quiz_result.classList.add('hide');
    hits = 0;
    renderQuiz(id);
};

//Quizz creation utilities
function createQuestions(nrQuestions) {
    let questions = document.querySelector(".user_questions_box");

    questions.innerHTML = "";

    for (i = 1; i <= nrQuestions; i++) {
        questions.innerHTML +=
            `<div class="user_question q${i} docked" data-identifier="question-form">
                <div class="user_question_title_box">
                    <p>
                        Pergunta ${i}
                    </p>
                    <img class="edit_icon" src="images/edit_icon.png" alt="" onclick="editQuizzElement(this.parentNode.parentNode)" data-identifier="expand">
                </div>
                <div class="hiden_docked hide">
                    <div>
                    <input class="question_title quiz_input" type="text" placeholder="Texto da Pergunta"><span class="validation-error">O texto deve ter no mínimo 20 caracteres</span>
                    </div>
                    <div><div class="color-input-container quiz_input"><span class="label-color-input">Escolha a cor da pergunta</span><input class="question_color" type="color" name ="color" value="#000000" placeholder="Cor de fundo da pergunta"></div><span class="validation-error">A cor deve ser um código válido do tipo #XXXXXX</span></div>
                    <p>
                        Resposta correta
                    </p>
                    <div class="answer right">
                        <div><input class="txt quiz_input" type="text" placeholder="Resposta Correta"><span class="validation-error">O texto não pode estar vazio</span></div>
                        <div><input class="url right quiz_input" type="text" placeholder="URL da imagem"><span class="validation-error">O texto não é uma URL válida</span></div>
                    </div>
                    <p>
                        Respostas incorretas
                    </p>
                    <div class="answer wrong">
                        <div><input class="txt quiz_input" type="text" placeholder="Resposta incorreta 1"><span class="validation-error">O texto não pode estar vazio</span></div>
                        <div><input class="url quiz_input" type="text" placeholder="URL da imagem 1"><span class="validation-error">O texto não é uma URL válida</span></div>
                    </div>
                    <div class="blank_page3"></div>
                    <div class="answer wrong">
                        <div><input class="txt quiz_input" type="text" placeholder="Resposta incorreta 2"><span class="validation-error">O texto não pode estar vazio</span></div>
                        <div><input class="url  quiz_input" type="text" placeholder="URL da imagem 2"><span class="validation-error">O texto não é uma URL válida</span></div>
                    </div>
                    <div class="blank_page3"></div>
                    <div class="answer wrong">
                        <div><input class="txt quiz_input" type="text" placeholder="Resposta incorreta 3"><span class="validation-error">O texto não pode estar vazio</span></div>
                        <div><input class="url  quiz_input" type="text" placeholder="URL da imagem 3"><span class="validation-error">O texto não é uma URL válida</span></div>
                    </div>
                </div>
            </div>`;
    }

}

function renderQuestionsPage(currentPage) {
    currentPage.classList.add("hide");
    let nrQuestions = document.querySelector(".quiz-nr-questions").value;
    let questionsPage = document.querySelector(".user_quiz_questions");
    questionsPage.classList.remove("hide");
    createQuestions(nrQuestions);

    let questions = document.querySelector(".user_questions_box");
    let firstQuestion = questions.querySelector(".q1");
    editQuizzElement(firstQuestion);

}

function createQuizz(currentPage) {
    let payload = createPayload();
    const createQuizzPromise = axios.post(url, payload);
    createQuizzPromise.then(processResponseAndRenderPage);
    createQuizzPromise.catch();
}
let idNewQuiz;

function processResponseAndRenderPage(response) {
    idNewQuiz = response.data.id;
    storeIdLocally(response.data.id);
    storeKeyLocally(response.data.key);
    // getData();
    renderQuizzCreatedPage();
}

function storeIdLocally(id) {
    /**
     * This function locally stores the id for the created quiz.
     * 
     * Inputs:
     *  - id: quiz id returned by the API after posting the user quiz.
     */
    // console.log(id)
    let strIds = localStorage.getItem('ids');
    // console.log(strIds);
    let idsArr = JSON.parse(strIds);
    if (idsArr === null) {
        idsArr = [];
    }


    idsArr.push(id);
    strIds = JSON.stringify(idsArr);
    localStorage.setItem('ids', strIds);
    console.log('Array of ids:', idsArr)
    console.log('Stringfied array:', strIds)
    // console.log('Array of ids:', idsArr)
    // console.log('Stringfied array:', strIds)
}

function storeKeyLocally(key) {
    /**
     * This function locally stores the key for the created quiz.
     * 
     * Inputs:
     *  - key: quiz key returned by the API after posting the user quiz.
     */
    console.log(key)
    let strKeys = localStorage.getItem('keys');
    console.log(strKeys);
    let keysArr = JSON.parse(strKeys);
    if (keysArr === null) {
        keysArr = [];
    }


    keysArr.push(key);
    strKeys = JSON.stringify(keysArr);
    localStorage.setItem('keys', strKeys);
    console.log('Array of keys:', keysArr)
    console.log('Stringfied keys array:', strKeys)
}

function renderLevelsPage(currentPage) {
    currentPage.classList.add("hide");
    let nrLevels = document.querySelector(".quiz-nr-levels").value;
    let levelsPage = document.querySelector(".user_levels");
    levelsPage.classList.remove("hide");
    createLevels(nrLevels);

    let levels = document.querySelector(".user_levels_box");
    let firstLevel = levels.querySelector(".l1");
    editQuizzElement(firstLevel);
}

function createLevels(nrLevels) {
    const levelsContainer = document.querySelector(".user_levels_box");
    levelsContainer.innerHTML = "";
    for (let i = 1; i <= nrLevels; i++) {
        levelsContainer.innerHTML +=
            `<div class="user_level l${i}" data-identifier="level">
            <div class="user_level_title_box docked">
                <p>
                    Nível ${i}
                </p>
                <img class='edit_icon' src="images/edit_icon.png" alt="" onclick="editQuizzElement(this.parentNode.parentNode)" data-identifier="expand">
            </div>
            <div class="hiden_docked hide">
                <div><input class="level_title quiz_input" type="text" placeholder="Título do Nível"><span class="validation-error">O texto deve ter no mínimo 10 caracteres</span></div>
                <div><input class="min_percentage quiz_input" type="text" placeholder="% de acerto mínima"><span class="validation-error">Deve ser um número entre 0 e 100</span></div>
                <div><input class="url_image quiz_input" type="text" placeholder="URL da imagem do nível"><span class="validation-error">O texto não é uma URL válida</span></div>
                <div><input class="level_description quiz_input" type="text" placeholder="Descrição do nível"><span class="validation-error">A descrição deve ter no mínimo 30 caracteres</span></div>
            </div>
        </div>`;
    }
}

function editQuizzElement(element) {
    let elementOpBox = element.querySelector(".hiden_docked");
    let elementEditBtn = element.querySelector(".edit_icon");
    element.classList.remove("docked");
    elementOpBox.classList.remove("hide");
    elementEditBtn.classList.add("hide");
}

function getQuestionsArr() {
    let questions = document.querySelectorAll(".user_question");
    let questionsArr = [];
    let question;
    console.log(questions);
    questions.forEach(element => {
        console.log(element);
        question = {
            title: element.querySelector(".question_title").value,
            color: element.querySelector(".question_color").value,
            answers: getAnswersArr(element)
        }
        console.log(getAnswersArr(element));
        questionsArr.push(question);
    });
    return questionsArr;
}

function getAnswersArr(question) {
    let answerArr = [];
    let answers = question.querySelectorAll(".answer");
    let answer;
    answers.forEach(element => {
        let answerTxt = element.querySelector(".txt").value;
        let answerImg = element.querySelector(".url").value;

        if (answerTxt.length > 0 && answerImg.length > 0) {
            answer = {
                text: answerTxt,
                image: answerImg,
                isCorrectAnswer: element.classList.contains("right")
            }
            answerArr.push(answer);

        }
    })
    return answerArr;
}

function getLevelsArr() {
    let levelsArr = [];
    let levels = document.querySelectorAll(".user_level");
    let level;
    levels.forEach(element => {
        level = {
            title: element.querySelector(".level_title").value,
            image: element.querySelector(".url_image").value,
            text: element.querySelector(".level_description").value,
            minValue: parseInt(element.querySelector(".min_percentage").value)
        }
        levelsArr.push(level);
    })
    return levelsArr
}

function createPayload() {
    let payload = {
        title: document.querySelector(".quiz-title").value,
        image: document.querySelector(".quiz-img-url").value,
        questions: getQuestionsArr(),
        levels: getLevelsArr()
    }
    let stringjson = JSON.stringify(payload);
    console.log(stringjson);
    return payload;
}

let quizzTitle
let quizzTitleTxt;
let quizzImgUrl

//data vaidation
function verifyBasicInfoAndLoadNext(currentPage) {
    quizzTitle = currentPage.querySelector(".quiz-title").value;
    quizzTitleTxt = currentPage.querySelector(".quiz-title").value.length;
    quizzImgUrl = currentPage.querySelector(".quiz-img-url").value;

    // let quizzTitleIsOk = quizzTitleTxt >= 20 && quizzTitleTxt <= 65;
    // let quizzImgIsOk = isValidUrl(quizzImgUrl);
    // let quizzNrQuestionsIsOk = parseInt(currentPage.querySelector(".quiz-nr-questions").value) > 2;
    // let quizzNrLevelsIsOk = parseInt(currentPage.querySelector(".quiz-nr-levels").value) > 1;

    let quizzTitleIsOk = isValidQuizzTitle(currentPage.querySelector(".quiz-title"));
    let quizzImgIsOk = isValidUrl(currentPage.querySelector(".quiz-img-url"));
    let quizzNrQuestionsIsOk = isValidNrQuestions(currentPage.querySelector(".quiz-nr-questions"));
    let quizzNrLevelsIsOk = isValidNrLevels(currentPage.querySelector(".quiz-nr-levels"));

    if (quizzTitleIsOk && quizzImgIsOk && quizzNrQuestionsIsOk && quizzNrLevelsIsOk) {
        renderQuestionsPage(currentPage);
    } else {
        alert("Por favor, preencha os dados corretamente");
    }

}

function showNewQuiz(idNewQ) {
    page3.classList.add('hide');

    top_image.classList.remove('hide');
    quiz_content.classList.remove('hide');


    renderQuiz(idNewQ);
};

function renderQuizzCreatedPage() {
    let currentPage = document.querySelector(".user_levels");
    currentPage.classList.add("hide");
    const quizzCreatedPage = document.querySelector(".user_quiz_ready");

    quizzCreatedPage.innerHTML = `
        <h1>
            Seu quizz está pronto!  
        </h1>
        <div class="ready_image page_3" onclick="showNewQuiz(${idNewQuiz})">
            <div class="overlay"></div>
            <img src="${quizzImgUrl}" alt="Quiz image">
            <p class="quiz_sub">
                ${quizzTitle}
            </p>
        </div>
        <button class="page3_button page_3" onclick="showNewQuiz(${idNewQuiz})">
            Acessar Quizz
        </button>
        <button class="inv_button page_3" onclick="reload()">
            Voltar para home
        </button>`;

    quizzCreatedPage.classList.remove("hide");
}

function verifyQuestionsAndLoadNext(currentPage) {
    let questions = currentPage.querySelectorAll(".user_question");
    let questionIsOkArr = [];

    // questions.forEach(element => {
    //     let questionTxtIsOk = element.querySelector(".question_title").value.length >= 20;
    //     let questionColorIsOk = isValidColor(element.querySelector(".question_color").value);
    //     let responsesIsOk = verifyResponses(element);

    //     if (questionTxtIsOk && questionColorIsOk && responsesIsOk) {
    //         questionIsOkArr.push(element)
    //     }
    // })

    questions.forEach(element => {
        let questionTxtIsOk = isValidQuestionTitle(element.querySelector(".question_title"));
        let questionColorIsOk = isValidColor(element.querySelector(".question_color"));
        let responsesIsOk = verifyResponses(element);

        if (questionTxtIsOk && questionColorIsOk && responsesIsOk) {
            questionIsOkArr.push(element)
        }
    })

    console.log(questionIsOkArr);
    if (questionIsOkArr.length === questions.length) {
        renderLevelsPage(currentPage);
    } else {
        alert("Por favor, preencha os dados corretamente");
    }

}

function verifyResponses(question) {
    let righResponse = question.querySelector(".right");
    let wrongResponses = question.querySelectorAll(".wrong");

    // let rightResponseTxtIsOK = righResponse.querySelector(".txt").value.length > 0;
    // let rightResponseImgIsOk = isValidUrl(righResponse.querySelector(".url").value);

    // let wrongResponsesOkArr = [];
    // let wrongFilledResponses = [];

    // wrongResponses.forEach(element => {
    //     let wrongResponseTxtIsOk = element.querySelector(".txt").value.length > 0;
    //     let wrongResponseImgIsOk = isValidUrl(element.querySelector(".url").value);
    //     if (wrongResponseImgIsOk || wrongResponseTxtIsOk) {
    //         if (wrongResponseImgIsOk && wrongResponseTxtIsOk) {
    //             wrongResponsesOkArr.push(element);
    //         }
    //         wrongFilledResponses.push(element);
    //     }
    // })

    let rightResponseTxtIsOK = isValidText(righResponse.querySelector(".txt"));
    let rightResponseImgIsOk = isValidUrl(righResponse.querySelector(".url"));

    let wrongResponsesOkArr = [];
    let wrongFilledResponses = [];

    wrongResponses.forEach(element => {
        let wrongResponseTxtIsOk = isValidText(element.querySelector(".txt"));
        let wrongResponseImgIsOk = isValidUrl(element.querySelector(".url"));
        if (wrongResponseImgIsOk || wrongResponseTxtIsOk) {
            if (wrongResponseImgIsOk && wrongResponseTxtIsOk) {
                wrongResponsesOkArr.push(element);
            }
            wrongFilledResponses.push(element);
        }
    })

    let wrongResponseIsOk = (wrongResponsesOkArr.length > 0) && (wrongFilledResponses.length === wrongResponsesOkArr.length);

    return (rightResponseTxtIsOK && rightResponseImgIsOk && wrongResponseIsOk);

}

function verifyLevelsAndLoadNext(currentPage) {
    let levels = currentPage.querySelectorAll(".user_level");
    let levelsIsOkArr = [];
    let levelsWith0Perc = [];

    // levels.forEach(element => {
    //     let levelTxtIsOk = element.querySelector(".level_title").value.length >= 10;
    //     let levelMinPerc = parseInt(element.querySelector(".min_percentage").value);
    //     let levelMinPercIsOk = levelMinPerc >= 0 && levelMinPerc <= 100;
    //     console.log(element);
    //     console.log(element.querySelector(".url_image").value)
    //     let levelImgIsOK = isValidUrl(element.querySelector(".url_image").value);
    //     let levelDescrpIsOk = element.querySelector(".level_description").value.length >= 30;

    //     if (levelImgIsOK && levelDescrpIsOk && levelMinPercIsOk && levelTxtIsOk) {
    //         if (levelMinPerc === 0) {
    //             levelsWith0Perc.push(element);
    //         }
    //         levelsIsOkArr.push(element);
    //     }
    // })

    levels.forEach(element => {
        let levelTxtIsOk = isValidLevelTitle(element.querySelector(".level_title"));
        let levelMinPerc = parseInt(element.querySelector(".min_percentage").value);
        let levelMinPercIsOk = isValidPerc(element.querySelector(".min_percentage"));
        console.log(element);
        console.log(element.querySelector(".url_image").value)
        let levelImgIsOK = isValidUrl(element.querySelector(".url_image"));
        let levelDescrpIsOk = isValidLevelDescrp(element.querySelector(".level_description"));

        if (levelImgIsOK && levelDescrpIsOk && levelMinPercIsOk && levelTxtIsOk) {
            if (levelMinPerc === 0) {
                levelsWith0Perc.push(element);
            }
            levelsIsOkArr.push(element);
        }
    })

    if (levelsIsOkArr.length === levels.length && levelsWith0Perc.length > 0) {
        createQuizz(currentPage);
    } else {
        alert("Por favor, preencha os dados corretamente");
    }

}

function isValidUrl(elem) {
    let container = elem.parentNode;
    let url = elem.value;
    let regex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    if(regex.test(url)){
        container.querySelector(".validation-error").classList.remove("visible");
        elem.classList.remove("invalid");
        return true;
    }else{
        container.querySelector(".validation-error").classList.add("visible");
        elem.classList.add("invalid");
        return false;
    }
}

function isValidColor(elem) {
    let container = elem.parentNode.parentNode;
    let color = elem.value;
    let regex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
    if(regex.test(color)){
        container.querySelector(".validation-error").classList.remove("visible");
        elem.classList.remove("invalid");
        return true;
    }else{
        container.querySelector(".validation-error").classList.add("visible");
        elem.classList.add("invalid");
        return false;
    }
}


function getUserQuizzes() {
    return JSON.parse(localStorage.getItem('ids'));
}

function getUserKeys() {
    return JSON.parse(localStorage.getItem('keys'));
}

function isValidLevelTitle(elem) {
    let container = elem.parentNode;
    if (elem.value.length >= 10) {
        container.querySelector(".validation-error").classList.remove("visible");
        elem.classList.remove("invalid");
        return true;
    }else{
        container.querySelector(".validation-error").classList.add("visible");
        elem.classList.add("invalid");
        return false;
    }
}

function isValidQuestionTitle(elem) {
    let container = elem.parentNode;
    if (elem.value.length >= 20) {
        container.querySelector(".validation-error").classList.remove("visible");
        elem.classList.remove("invalid");
        return true;
    }else{
        container.querySelector(".validation-error").classList.add("visible");
        elem.classList.add("invalid");
        return false;
    }
}

function isValidQuizzTitle(elem) {
    let container = elem.parentNode;
    if (elem.value.length >= 20 && elem.value.length <= 65) {
        container.querySelector(".validation-error").classList.remove("visible");
        elem.classList.remove("invalid");
        return true;
    }else{
        container.querySelector(".validation-error").classList.add("visible");
        elem.classList.add("invalid");
        return false;
    }
}

function isValidLevelDescrp(elem) {
    let container = elem.parentNode;
    if (elem.value.length >= 30) {
        container.querySelector(".validation-error").classList.remove("visible");
        elem.classList.remove("invalid");
        return true;
    }else{
        container.querySelector(".validation-error").classList.add("visible");
        elem.classList.add("invalid");
        return false;
    }
}

function isValidPerc(elem) {
    let container = elem.parentNode;
    if (parseInt(elem.value) >= 0 && parseInt(elem.value) <= 100) {
        container.querySelector(".validation-error").classList.remove("visible");
        elem.classList.remove("invalid");
        return true;
    }else{
        container.querySelector(".validation-error").classList.add("visible");
        elem.classList.add("invalid");
        return false;
    }
}

function isValidNrQuestions(elem) {
    let container = elem.parentNode;
    if (parseInt(elem.value) >= 3) {
        container.querySelector(".validation-error").classList.remove("visible");
        elem.classList.remove("invalid");
        return true;
    }else{
        container.querySelector(".validation-error").classList.add("visible");
        elem.classList.add("invalid");
        return false;
    }
}

function isValidNrLevels(elem) {
    let container = elem.parentNode;
    if (parseInt(elem.value) >= 2) {
        container.querySelector(".validation-error").classList.remove("visible");
        elem.classList.remove("invalid");
        return true;
    }else{
        container.querySelector(".validation-error").classList.add("visible");
        elem.classList.add("invalid");
        return false;
    }
}

function isValidText(elem) {
    let container = elem.parentNode;
    if (elem.value.length > 0) {
        container.querySelector(".validation-error").classList.remove("visible");
        elem.classList.remove("invalid");
        return true;
    }else{
        container.querySelector(".validation-error").classList.add("visible");
        elem.classList.add("invalid");
        return false;
    }
}

userIds = getUserQuizzes();
userKeys = getUserKeys();

function renderUserQuizzes(data) {
    /**
     * This function renders the user quizzes (or not, if they do not exist on the API)
     * on Page 1.
     * 
     * Input:
     *  - data: array of user quizz objects coming from the API.
     */
    const localIds = getUserQuizzes();
    console.log(localIds);
    let userQuizzes = [];

    if (localIds !== null) {
        userQuizzes = data.filter(obj => localIds.includes(obj.id));
    }
    
    const userBox = document.querySelector('.user_row');
    const emptyBox = document.querySelector('.empty_quizzes');
    console.log(userQuizzes);

    userBox.innerHTML = '';
    emptyBox.innerHTML = '';

    if (userQuizzes.length !== 0) {
        // alert('ENTREI COM UQ')
        emptyBox.classList.add('hide');
        for (let i = 0; i < userQuizzes.length; i++) {
            userBox.innerHTML +=
                `
                <div id="${userQuizzes[i].id}" class="quiz_thumbnail" data-identifier="quizz-card">
                    <div class="overlay" onclick="showQuiz(this)"></div>
                    <img src="${userQuizzes[i].image}" alt="">
                    <p class="quiz_sub">
                        ${userQuizzes[i].title}
                    </p>    
                    <div class="edit_delet_quiz">
                    <ion-icon name="create-outline" onclick="editQuiz(this)"></ion-icon>
                    <ion-icon name="trash-outline" onclick="deleteQuiz(this)"></ion-icon>
                    </div>
                </div>
        `;
        }
    } else {
        // alert('ENTREI SEM UQ')
        document.querySelector('.user_quizzes').classList.add('hide')
        emptyBox.innerHTML =
            `
   
                <p>
                    Você não criou nenhum quizz ainda :(
                </p>
                <button onclick="hide1Show3()" data-identifier='create-quizz'>
                    Criar quizz
                </button>
         
        `;
    }

}

function reload() {
    window.location.reload();
    hits = 0;
}

getData();

function deleteQuiz(element){
    let quizSelected = element.parentNode.parentNode;
    let keySelected;
    console.log('entrou na funcao');
    for( i=0; i < userIds.length; i++){
        console.log(userIds.length);
        console.log(userIds[i], quizSelected.id);
        if( userIds[i] == quizSelected.id){
            console.log('entrou no if');
            keySelected = userKeys[i];
            console.log("KEY SELECIONADA", keySelected);
        };
    };
    if(confirm("Você realmente deseja deletar este quiz?")){
        axios.delete(`${url}/${quizSelected.id}`,{
            headers: {
              "Secret-Key": `${keySelected}`,
            },
          })
            .then(() => location.reload());
    } else{
        return;
    };
    
};

function editQuiz(element){
    alert('Desculpe-nos pelos transtornos, esta função ainda será implementada. Estamos trabalhando nisto.');
};

