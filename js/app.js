/* 
let currentQuestionIndex = 0;
let score = 0;
let errors = 0;
let playerName = '';
let level = 0;
let correctAnswersInRow = 0;
let questionsHistory = []; // Historial de preguntas para control de repetición
let skipUsed = false; // Control del uso del comodín

document.getElementById('start-button').onclick = function() {
    playerName = document.getElementById('player-name').value;
    if (playerName) {
        document.getElementById('player-display').textContent = playerName;
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
        loadQuestion();
    } else {
        Swal.fire('Por favor, ingresa tu nombre');
    }
};

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getTableRange(level) {
    if (level < 0) level = 0;
    if (level >= 11) return Array.from({length: 15}, (_, i) => i + 2); // Preguntas mucho más complejas a partir del nivel 11

    const start = Math.max(level, 0);
    const end = start + 3;
    return Array.from({length: end - start + 1}, (_, i) => i + start);
}

function generateQuestion() {
    const tables = getTableRange(level);
    let num1, num2, answer;
    let questionText;

    do {
        num1 = tables[getRandomInt(tables.length)];
        num2 = tables[getRandomInt(tables.length)];
        answer = num1 * num2;
        questionText = `${num1} x ${num2}`;
    } while (isQuestionRepeated(num1, num2, answer));

    // Registrar la pregunta actual
    registerQuestion(num1, num2, answer);

    return {
        question: `Seleccione la respuesta correcta: ¿Cuánto es ${questionText}?`,
        options: generateOptions(answer),
        answer: answer
    };
}

function generateOptions(correctAnswer) {
    const options = new Set([correctAnswer]);

    while (options.size < 4) {
        options.add(getRandomInt(145)); // Números hasta 144 (12*12)
    }

    return Array.from(options).sort(() => Math.random() - 0.5);
}

function isQuestionRepeated(num1, num2, answer) {
    // Repetición dentro del mismo nivel
    if (questionsHistory.filter(q => q.level === level && q.num1 === num1 && q.num2 === num2).length > 0) {
        return true;
    }
    
    // Repetición en dos niveles consecutivos
    if (questionsHistory.filter(q => Math.abs(q.level - level) <= 1 && q.num1 === num1 && q.num2 === num2).length > 2) {
        return true;
    }
    
    // Repetición en tres niveles consecutivos
    if (questionsHistory.filter(q => Math.abs(q.level - level) <= 2 && q.num1 === num1 && q.num2 === num2).length > 3) {
        return true;
    }

    return false;
}

function registerQuestion(num1, num2, answer) {
    questionsHistory.push({ level, num1, num2, answer });
}

function loadQuestion() {
    const questionData = generateQuestion();
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    
    questionElement.textContent = questionData.question;
    optionsElement.innerHTML = '';
    
    questionData.options.forEach(option => {
        const optionButton = document.createElement('button');
        optionButton.textContent = option;
        optionButton.className = 'option';
        optionButton.onclick = () => checkAnswer(option, questionData.answer);
        optionsElement.appendChild(optionButton);
    });

    // Habilitar botón de cambio de pregunta
    document.getElementById('skip-button').disabled = false;
}

function checkAnswer(selectedOption, correctAnswer) {
    if (selectedOption === correctAnswer) {
        score++;
        correctAnswersInRow++;
        document.getElementById('score').textContent = `Puntaje: ${score}`;
        updateProgressBar();
        if (correctAnswersInRow === 10) {
            setTimeout(levelUp, 300);
        } else {
            loadQuestion();
        }
    } else {
        errors++;
        correctAnswersInRow = 0;
        document.getElementById('errors').textContent = `Errores: ${errors}`;
        resetProgressBar();
        if (errors === 3) {
            Swal.fire(`Juego terminado. Puntaje final: ${score}`);
            resetGame();
        } else {
            loadQuestion();
        }
    }
}

function skipQuestion() {
    if (!skipUsed) {
        skipUsed = true;
        document.getElementById('skip-button').disabled = true;
        loadQuestion(); // Cargar una nueva pregunta sin penalización
    } else {
        Swal.fire('Ya has utilizado el comodín de cambio de pregunta.');
    }
}

function levelUp() {
    level++;
    correctAnswersInRow = 0;
    document.getElementById('level').textContent = `Nivel: ${level}`;
    resetProgressBar();
    Swal.fire({
        title: '¡Felicidades!',
        text: `Has sido ascendido al nivel ${level}.`,
        icon: 'success',
        confirmButtonText: 'OK'
    }).then(() => {
        loadQuestion();
    });
}

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const progress = (correctAnswersInRow / 10) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${Math.round(progress)}%`;
}

function resetProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    progressBar.style.width = '0%';
    progressText.textContent = '0%';
}

function resetGame() {
    score = 0;
    errors = 0;
    level = 0;
    correctAnswersInRow = 0;
    questionsHistory = []; // Limpiar historial de preguntas
    skipUsed = false; // Resetear uso del comodín
    document.getElementById('score').textContent = 'Puntaje: 0';
    document.getElementById('errors').textContent = 'Errores: 0';
    document.getElementById('level').textContent = 'Nivel: 0';
    resetProgressBar();
    loadQuestion();
}

window.onload = function() {
    document.getElementById('start-screen').style.display = 'block';
    document.getElementById('game-screen').style.display = 'none';
};

*/

let currentQuestion = null; // Variable para almacenar la pregunta actual
let score = 0;
let errors = 0;
let playerName = '';
let level = 0;
let correctAnswersInRow = 0;
let questionsHistory = []; // Historial de preguntas para control de repetición
let skipUsed = false; // Control del uso del comodín
let hintUsed = false;
let surveyUsed = false; // Control del uso del comodín de encuesta

document.getElementById('start-button').onclick = function() {
    playerName = document.getElementById('player-name').value;
    if (playerName) {
        document.getElementById('player-display').textContent = playerName;
        document.getElementById('start-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
        loadQuestion();
    } else {
        Swal.fire('Por favor, ingresa tu nombre');
    }
};

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getTableRange(level) {
    if (level < 0) level = 0;
    if (level >= 11) return Array.from({length: 15}, (_, i) => i + 2); // Preguntas mucho más complejas a partir del nivel 11

    const start = Math.max(level, 0);
    const end = start + 3;
    return Array.from({length: end - start + 1}, (_, i) => i + start);
}

function generateQuestion() {
    const tables = getTableRange(level);
    let num1, num2, answer;
    let questionText;

    do {
        num1 = tables[getRandomInt(tables.length)];
        num2 = tables[getRandomInt(tables.length)];
        answer = num1 * num2;
        questionText = `${num1} x ${num2}`;
    } while (isQuestionRepeated(num1, num2, answer));

    // Registrar la pregunta actual
    registerQuestion(num1, num2, answer);

    return {
        question: `Seleccione la respuesta correcta: ¿Cuánto es ${questionText}?`,
        options: generateOptions(answer),
        answer: answer
    };
}

function generateOptions(correctAnswer) {
    const options = new Set([correctAnswer]);

    while (options.size < 4) {
        options.add(getRandomInt(145)); // Números hasta 144 (12*12)
    }

    return Array.from(options).sort(() => Math.random() - 0.5);
}

function isQuestionRepeated(num1, num2, answer) {
    // Repetición dentro del mismo nivel
    if (questionsHistory.filter(q => q.level === level && q.num1 === num1 && q.num2 === num2).length > 0) {
        return true;
    }
    
    // Repetición en dos niveles consecutivos
    if (questionsHistory.filter(q => Math.abs(q.level - level) <= 1 && q.num1 === num1 && q.num2 === num2).length > 2) {
        return true;
    }
    
    // Repetición en tres niveles consecutivos
    if (questionsHistory.filter(q => Math.abs(q.level - level) <= 2 && q.num1 === num1 && q.num2 === num2).length > 3) {
        return true;
    }

    return false;
}

function registerQuestion(num1, num2, answer) {
    questionsHistory.push({ level, num1, num2, answer });
}

function loadQuestion() {
    currentQuestion = generateQuestion();
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    
    questionElement.textContent = currentQuestion.question;
    optionsElement.innerHTML = '';
    
    currentQuestion.options.forEach(option => {
        const optionButton = document.createElement('button');
        optionButton.textContent = option;
        optionButton.className = 'option';
        optionButton.onclick = () => checkAnswer(option, currentQuestion.answer);
        optionsElement.appendChild(optionButton);
    });

    // Habilitar botones de comodines
    document.getElementById('skip-button').disabled = skipUsed;
    document.getElementById('hint-button').disabled = hintUsed;
    document.getElementById('survey-button').disabled = surveyUsed;
}

function checkAnswer(selectedOption, correctAnswer) {
    if (selectedOption === correctAnswer) {
        score++;
        correctAnswersInRow++;
        document.getElementById('score').textContent = `Puntaje: ${score}`;
        updateProgressBar();
        if (correctAnswersInRow === 10) {
            setTimeout(levelUp, 300);
        } else {
            loadQuestion();
        }
    } else {
        errors++;
        correctAnswersInRow = 0;
        document.getElementById('errors').textContent = `Errores: ${errors}`;
        resetProgressBar();
        if (errors === 3) {
            Swal.fire(`Juego terminado. Puntaje final: ${score}`);
            resetGame();
        } else {
            loadQuestion();
        }
    }
}

function skipQuestion() {
    if (!skipUsed) {
        skipUsed = true;
        document.getElementById('skip-button').disabled = true;
        loadQuestion(); // Cargar una nueva pregunta sin penalización
    } else {
        Swal.fire('Ya has utilizado el comodín de cambio de pregunta.');
    }
}

function useHint() {
    if (hintUsed) return;

    hintUsed = true;
    document.getElementById('hint-button').disabled = true;

    const correctAnswer = currentQuestion.answer;
    const options = Array.from(document.querySelectorAll('.option'));

    let incorrectOptions = options.filter(option => option.innerText != correctAnswer);
    incorrectOptions = shuffleArray(incorrectOptions).slice(0, 2);
    
    incorrectOptions.forEach(option => option.style.display = 'none');
}

function showSurvey() {
    if (surveyUsed) return;

    surveyUsed = true;
    document.getElementById('survey-button').disabled = true;

    const correctAnswer = currentQuestion.answer;
    const options = Array.from(document.querySelectorAll('.option'));

    let surveyResults = {};
    options.forEach(option => {
        const text = option.innerText;
        surveyResults[text] = Math.floor(Math.random() * 101); // Random results for demonstration
    });

    const totalVotes = Object.values(surveyResults).reduce((acc, val) => acc + val, 0);

    let surveyText = 'Encuesta de la opinión de los jugadores:\n\n';
    for (const [option, votes] of Object.entries(surveyResults)) {
        surveyText += `${option}: ${votes} votos (${Math.round((votes / totalVotes) * 100)}%)\n`;
    }

    Swal.fire({
        title: 'Resultados de la Encuesta',
        text: surveyText,
        icon: 'info',
        confirmButtonText: 'Aceptar'
    });
}

function levelUp() {
    level++;
    correctAnswersInRow = 0;
    Swal.fire(`¡Felicitaciones ${playerName}! Has subido al nivel ${level}`);
    document.getElementById('level').textContent = `Nivel: ${level}`;
    resetProgressBar();
    loadQuestion();
}

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const progress = Math.min((correctAnswersInRow / 10) * 100, 100);
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${Math.round(progress)}%`;
}

function resetProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    progressBar.style.width = '0%';
    progressText.textContent = '0%';
}

function resetGame() {
    score = 0;
    errors = 0;
    level = 0;
    correctAnswersInRow = 0;
    questionsHistory = [];
    skipUsed = false;
    hintUsed = false;
    surveyUsed = false;

    document.getElementById('score').textContent = 'Puntaje: 0';
    document.getElementById('errors').textContent = 'Errores: 0';
    document.getElementById('level').textContent = 'Nivel: 0';
    resetProgressBar();
    document.getElementById('skip-button').disabled = false;
    document.getElementById('hint-button').disabled = false;
    document.getElementById('survey-button').disabled = false;

    loadQuestion();
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}
