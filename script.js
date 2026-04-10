// ==================== CONFIGURAÇÕES - EDITE AQUI ====================

// Pergunta 1: Múltipla escolha
const question1 = {
    type: 'multiple',
    text: "Como você me apelidou?",
    options: ["A) Luz²", "B) Chines", "C) Maconheiro", "D) Oliveira"]
};

// Pergunta 2: Múltipla escolha
const question2 = {
    type: 'multiple',
    text: "Qual é o meu jogo favorito?",
    options: ["A) War Thunder", "B) Forza Horizon 4", "C) Minecraft", "D) Dead Cells"]
};

// Pergunta 3: Múltipla escolha
const question3 = {
    type: 'multiple',
    text: "Qual é meu hobby favorito?",
    options: ["A) Jogar", "B) Ler", "C) Estudar", "D) Dormir"]
};

// Pergunta 4: Data
const question4 = {
    type: 'date',
    text: "Quando é meu aniversário?",
    placeholder: "DD/MM/AAAA"
};

// Pergunta 5 (última): Sim/Não com botão que não funciona
const question5 = {
    type: 'yesno',
    text: "Você gosta de mim?",
    password: "ZZUJ",
    hint: "Dica: É algo que fiz para você (escreva em letra maiuscula)", // DICA DA SENHA
    successMessage: "DQXE GUH YZI OBDVNSIEHBL QL NXR YOLXDOYPL XHRMSIE XÓ ZHWBA RWP DHRJYYPP CRE UEJÊ ZÁ XSKE... XKZ UV FÃX ?" // MENSAGEM FINAL
};

// Array com todas as perguntas
const allQuestions = [question1, question2, question3, question4, question5];

// Mensagens engraçadas para o botão NÃO
const funnyMessages = [
    "Essa opção não existe! 😜",
    "Errou! Tente de novo... ou não! 🤭",
    "Não permitido! Só aceito SIM! 💁‍♀️",
    "Ops! Botão quebrado! 🔧",
    "NÃO não está disponível no momento! 📵",
    "Erro 404: Opção NÃO não encontrada! 💻",
    "Você não pode clicar aqui! 🚫",
    "Tentativa fracassada! Tente SIM! 😎",
    "NÃO foi cancelado pelo administrador! 👮‍♂️",
    "Essa opção foi para o espaço! 🚀"
];

// ==================== ESTADO DO QUIZ ====================

let currentQuestionIndex = 0;
let userAnswers = []; // Ainda salva, mas não mostra
let isLastQuestion = false;
let messageIndex = 0;

// ==================== FUNÇÕES ====================

function startQuiz() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('quizScreen').style.display = 'block';
    document.getElementById('quizScreen').classList.add('fade-in');
    showQuestion();
}

function showQuestion() {
    const question = allQuestions[currentQuestionIndex];
    const totalQuestions = allQuestions.length;
    
    document.getElementById('questionCounter').textContent = `${currentQuestionIndex + 1} de ${totalQuestions}`;
    updateProgress(totalQuestions);
    
    const container = document.getElementById('answersContainer');
    container.innerHTML = '';
    container.className = 'answers-container';
    
    document.getElementById('questionText').textContent = question.text;
    
    if (question.type === 'multiple') {
        renderMultipleChoice(question, container);
        isLastQuestion = false;
    } else if (question.type === 'date') {
        renderDateInput(question, container);
        isLastQuestion = false;
    } else if (question.type === 'yesno') {
        // Última pergunta - mostra tela de senha primeiro
        document.getElementById('quizScreen').style.display = 'none';
        document.getElementById('passwordScreen').style.display = 'block';
        document.getElementById('passwordScreen').classList.add('fade-in');
        
        // Mostra a dica da senha
        const hintElement = document.getElementById('passwordHint');
        if (hintElement) {
            hintElement.textContent = question5.hint;
        }
        
        document.getElementById('passwordInput').focus();
    }
}

function renderMultipleChoice(question, container) {
    const grid = document.createElement('div');
    grid.className = 'options-grid';
    
    question.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'btn-option';
        btn.textContent = option;
        btn.onclick = function() {
            saveAnswer(option);
            nextQuestion();
        };
        grid.appendChild(btn);
    });
    
    container.appendChild(grid);
}

function renderDateInput(question, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'date-wrapper';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'date-input';
    input.placeholder = question.placeholder;
    input.id = 'dateInput';
    input.maxLength = 10;
    
    // Máscara DD/MM/AAAA
    input.addEventListener('input', function(e) {
        let value = e.target.value;
        value = value.replace(/[^0-9]/g, '');
        if (value.length > 8) value = value.slice(0, 8);
        
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        if (value.length >= 5) {
            value = value.slice(0, 5) + '/' + value.slice(5);
        }
        
        e.target.value = value;
    });
    
    input.addEventListener('keypress', function(e) {
        if (!/[0-9]/.test(e.key)) e.preventDefault();
    });
    
    const btn = document.createElement('button');
    btn.className = 'btn-confirm';
    btn.textContent = 'Confirmar';
    btn.onclick = function() {
        const value = input.value;
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        
        if (dateRegex.test(value)) {
            saveAnswer(value);
            nextQuestion();
        } else {
            input.style.animation = 'shake 0.5s';
            setTimeout(() => input.style.animation = '', 500);
        }
    };
    
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') btn.click();
    });
    
    wrapper.appendChild(input);
    wrapper.appendChild(btn);
    container.appendChild(wrapper);
    
    input.focus();
}

function renderYesNoButtons(container) {
    container.innerHTML = '';
    container.className = 'buttons-container-yesno';
    
    // Botão SIM (funciona normal)
    const btnSim = document.createElement('button');
    btnSim.className = 'btn-answer-sim';
    btnSim.textContent = 'SIM';
    btnSim.onclick = function() {
        saveAnswer('sim');
        showResult();
    };
    
    // Botão NÃO (não funciona - mostra mensagem engraçada)
    const btnNao = document.createElement('button');
    btnNao.className = 'btn-answer-nao-broken';
    btnNao.id = 'btnNaoBroken';
    btnNao.textContent = 'NÃO';
    
    // Cria elemento para mensagem de erro
    const errorMsg = document.createElement('div');
    errorMsg.id = 'errorMessageNao';
    errorMsg.className = 'error-message-nao';
    errorMsg.style.display = 'none';
    
    // Eventos que mostram mensagem engraçada - SEM ANIMAÇÃO BUGADA
    btnNao.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        showFunnyMessage(errorMsg);
        return false;
    };
    
    btnNao.onmousedown = function(e) {
        e.preventDefault();
        showFunnyMessage(errorMsg);
    };
    
    // Efeitos visuais de "botão quebrado"
    btnNao.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(0.95)';
        this.style.opacity = '0.7';
        this.style.cursor = 'not-allowed';
    });
    
    btnNao.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.opacity = '1';
    });
    
    container.appendChild(btnSim);
    container.appendChild(btnNao);
    container.appendChild(errorMsg);
}

function showFunnyMessage(errorElement) {
    // Pega mensagem aleatória
    const msg = funnyMessages[messageIndex % funnyMessages.length];
    messageIndex++;
    
    errorElement.textContent = msg;
    errorElement.style.display = 'block';
    
    // Só aplica animação shake, SEM popIn que estava bugando
    errorElement.style.animation = 'none';
    void errorElement.offsetWidth; // Força reflow
    errorElement.style.animation = 'shake 0.5s';
    
    // Esconde após 2 segundos SEM fadeOut
    setTimeout(() => {
        errorElement.style.display = 'none';
        errorElement.style.animation = 'none';
    }, 2000);
}

function saveAnswer(answer) {
    userAnswers.push({
        questionIndex: currentQuestionIndex,
        question: allQuestions[currentQuestionIndex].text,
        answer: answer
    });
    console.log('Resposta salva:', answer);
}

function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < allQuestions.length) {
        showQuestion();
    } else {
        showResult();
    }
}

function updateProgress(total) {
    const progress = ((currentQuestionIndex + 1) / total) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
}

function checkPassword() {
    const input = document.getElementById('passwordInput').value;
    
    if (input === question5.password) {
        document.getElementById('passwordScreen').style.display = 'none';
        document.getElementById('quizScreen').style.display = 'block';
        document.getElementById('quizScreen').classList.add('fade-in');
        
        document.getElementById('questionText').textContent = question5.text;
        document.getElementById('questionCounter').textContent = `5 de 5`;
        updateProgress(5);
        
        isLastQuestion = true;
        renderYesNoButtons(document.getElementById('answersContainer'));
    } else {
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordInput').focus();
        
        document.getElementById('passwordInput').style.animation = 'shake 0.5s';
        setTimeout(() => {
            document.getElementById('passwordInput').style.animation = '';
        }, 500);
    }
}

document.getElementById('passwordInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkPassword();
});

function showResult() {
    document.getElementById('quizScreen').style.display = 'none';
    document.getElementById('resultScreen').style.display = 'block';
    document.getElementById('resultScreen').classList.add('fade-in');
    
    // Mostra apenas a mensagem de sucesso, SEM as respostas
    document.getElementById('resultMessage').innerHTML = `<p class="success-text">${question5.successMessage}</p>`;
    document.getElementById('scoreDisplay').textContent = '🎉';
    document.getElementById('scoreDisplay').style.fontSize = '4rem';
}

function restartQuiz() {
    currentQuestionIndex = 0;
    userAnswers = [];
    isLastQuestion = false;
    messageIndex = 0;
    
    document.getElementById('resultScreen').style.display = 'none';
    document.getElementById('passwordScreen').style.display = 'none';
    document.getElementById('quizScreen').style.display = 'none';
    document.getElementById('welcomeScreen').style.display = 'block';
    document.getElementById('welcomeScreen').classList.add('fade-in');
    
    document.getElementById('passwordInput').value = '';
    document.getElementById('errorMessage').style.display = 'none';
    
    document.getElementById('answersContainer').innerHTML = '';
    document.getElementById('answersContainer').className = '';
}

window.getSavedAnswers = function() {
    console.table(userAnswers);
    return userAnswers;
};
