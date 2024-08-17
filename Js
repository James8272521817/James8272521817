let timerInterval;
let timeLeft;
let difficultySettings = {
    easy: 20,    // 20 seconds per question for Easy
    average: 10, // 10 seconds per question for Average
    hard: 8      // 8 seconds per question for Hard
};

let currentQuestionIndex = 0;
let currentDifficulty = null;
let resultsHistory = []; // Store the results history
let totalQuizTime = 0; // Track total time consumed per quiz
let animationInterval; // For pausing the loader animation
let pastResults = []; // Initialize pastResults array to store quiz histories

let questions = {
    easy: [
        {
            question: "What is the name of the eon where the first multicellular life appeared?",
            options: {
                A: "Hadean",
                B: "Archean",
                C: "Proterozoic",
                D: "Phanerozoic"
            },
            answer: "C",
            explanation: "The Proterozoic eon is known for the appearance of the first multicellular life."
        },
        {
            question: "Which era is known as the 'Age of Fishes'?",
            options: {
                A: "Paleozoic",
                B: "Mesozoic",
                C: "Cenozoic",
                D: "Precambrian"
            },
            answer: "A",
            explanation: "The Paleozoic era is often called the 'Age of Fishes' due to the vast diversity of fish that evolved during this time."
        },
        {
            question: "During which period did dinosaurs first appear?",
            options: {
                A: "Cambrian",
                B: "Triassic",
                C: "Jurassic",
                D: "Cretaceous"
            },
            answer: "B",
            explanation: "Dinosaurs first appeared during the Triassic period."
        },
        {
            question: "Which period is known for the extinction of the dinosaurs?",
            options: {
                A: "Triassic",
                B: "Jurassic",
                C: "Cretaceous",
                D: "Paleogene"
            },
            answer: "C",
            explanation: "The Cretaceous period ended with a mass extinction event that wiped out the dinosaurs."
        },
        {
            question: "What is the current geological epoch?",
            options: {
                A: "Holocene",
                B: "Pleistocene",
                C: "Anthropocene",
                D: "Miocene"
            },
            answer: "A",
            explanation: "The Holocene epoch is the current geological epoch, which began around 11,700 years ago after the last major ice age."
        }
    ],
    average: [
        {
            question: "Which era is known as the 'Age of Reptiles'?",
            options: {
                A: "Paleozoic",
                B: "Mesozoic",
                C: "Cenozoic",
                D: "Precambrian"
            },
            answer: "B",
            explanation: "The Mesozoic era is known as the 'Age of Reptiles' due to the dominance of dinosaurs and other reptiles during this time."
        },
        {
            question: "During which period did the first mammals appear?",
            options: {
                A: "Triassic",
                B: "Jurassic",
                C: "Cretaceous",
                D: "Permian"
            },
            answer: "A",
            explanation: "The first mammals appeared during the Triassic period."
        },
        {
            question: "Which eon spans the longest duration in Earth's history?",
            options: {
                A: "Phanerozoic",
                B: "Proterozoic",
                C: "Archean",
                D: "Hadean"
            },
            answer: "B",
            explanation: "The Proterozoic eon spans the longest duration in Earth's history, lasting nearly 2 billion years."
        },
        {
            question: "What significant event marks the end of the Precambrian time?",
            options: {
                A: "First appearance of dinosaurs",
                B: "Formation of the moon",
                C: "Cambrian explosion",
                D: "Ice age"
            },
            answer: "C",
            explanation: "The Cambrian explosion marks the end of the Precambrian time and the start of the Paleozoic era."
        },
        {
            question: "Which geological period is known for the first appearance of land plants?",
            options: {
                A: "Cambrian",
                B: "Silurian",
                C: "Devonian",
                D: "Carboniferous"
            },
            answer: "B",
            explanation: "Land plants first appeared during the Silurian period."
        }
    ],
    hard: [
        {
            question: "What is the name of the supercontinent that existed during the late Paleozoic and early Mesozoic eras?",
            options: {
                A: "Rodinia",
                B: "Laurasia",
                C: "Gondwana",
                D: "Pangaea"
            },
            answer: "D",
            explanation: "Pangaea was the supercontinent that existed during the late Paleozoic and early Mesozoic eras."
        },
        {
            question: "Which era is known for the rise of birds from theropod dinosaurs?",
            options: {
                A: "Paleozoic",
                B: "Mesozoic",
                C: "Cenozoic",
                D: "Neogene"
            },
            answer: "B",
            explanation: "Birds evolved from theropod dinosaurs during the Mesozoic era."
        },
        {
            question: "During which period did the first flowering plants appear?",
            options: {
                A: "Triassic",
                B: "Jurassic",
                C: "Cretaceous",
                D: "Carboniferous"
            },
            answer: "C",
            explanation: "The first flowering plants appeared during the Cretaceous period."
        },
        {
            question: "Which era is referred to as the 'Age of Mammals'?",
            options: {
                A: "Paleozoic",
                B: "Mesozoic",
                C: "Cenozoic",
                D: "Precambrian"
            },
            answer: "C",
            explanation: "The Cenozoic era is referred to as the 'Age of Mammals' due to the dominance of mammals after the extinction of dinosaurs."
        },
        {
            question: "Which period is known for extensive glaciations and the formation of large ice sheets?",
            options: {
                A: "Carboniferous",
                B: "Quaternary",
                C: "Ordovician",
                D: "Silurian"
            },
            answer: "B",
            explanation: "The Quaternary period is known for extensive glaciations and the formation of large ice sheets."
        }
    ]
};

function startQuiz(difficulty) {
    currentDifficulty = difficulty;
    currentQuestionIndex = 0;
    resultsHistory = []; // Reset results history
    totalQuizTime = 0; // Reset total quiz time

    document.getElementById('resultsHistory').innerText = ''; // Clear the results history display
    document.getElementById('difficulty-selection').style.display = 'none';
    document.getElementById('quiz-section').style.display = 'block';

    loadQuestion();
}

function loadQuestion() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    if (animationInterval) {
        clearInterval(animationInterval);
    }

    // Ensure that the currentQuestionIndex is within the bounds of the questions array
    if (currentQuestionIndex >= questions[currentDifficulty].length) {
        alert('No more questions available for this difficulty.');
        moveToNextQuestion();
        return;
    }

    document.querySelectorAll('.option').forEach(button => {
        button.classList.remove('correct', 'incorrect');
        button.disabled = false;
    });

    document.getElementById('skipButton').style.display = 'none';

    const loader = document.getElementById('loader');
    loader.style.width = '100%'; // Full width
    loader.style.transition = 'none'; // Disable transition temporarily

    let questionData = questions[currentDifficulty][currentQuestionIndex];
    document.getElementById('question').innerText = questionData.question;
    document.getElementById('options').innerHTML = `
        <button class="option" onclick="answer('A')" id="optionA">${questionData.options.A}</button>
        <button class="option" onclick="answer('B')" id="optionB">${questionData.options.B}</button>
        <button class="option" onclick="answer('C')" id="optionC">${questionData.options.C}</button>
        <button class="option" onclick="answer('D')" id="optionD">${questionData.options.D}</button>
    `;

    // Sort options if the content is long
    if (questionData.options.A.length > 20 || questionData.options.B.length > 20 ||
        questionData.options.C.length > 20 || questionData.options.D.length > 20) {
        document.getElementById('options').style.flexDirection = 'column';
    } else {
        document.getElementById('options').style.flexDirection = 'row';
    }

    timeLeft = difficultySettings[currentDifficulty];
    document.getElementById('remainingTime').innerText = `Time Left: ${timeLeft}s`;

    setTimeout(() => {
        loader.style.transition = `width ${timeLeft}s linear`; 
        startTimer();
    }, 100); 
}

function startTimer() {
    const loader = document.getElementById('loader');
    loader.style.width = '0%'; 

    animationInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('remainingTime').innerText = `Time Left: ${timeLeft}s`;
        totalQuizTime++; 
    }, 1000);

    timerInterval = setTimeout(() => {
        clearInterval(animationInterval);
        clearTimeout(timerInterval);
        moveToNextQuestion();
    }, timeLeft * 1000);
}

function answer(selectedOption) {
    clearInterval(timerInterval); 
    clearInterval(animationInterval); 

    let correctAnswer = questions[currentDifficulty][currentQuestionIndex].answer;

    document.getElementById(`option${correctAnswer}`).classList.add('correct');

    if (selectedOption !== correctAnswer) {
        document.getElementById(`option${selectedOption}`).classList.add('incorrect');
        resultsHistory.push({ result: '❌', questionIndex: currentQuestionIndex, correctAnswer, explanation: questions[currentDifficulty][currentQuestionIndex].explanation });
    } else {
        resultsHistory.push({ result: '✅', questionIndex: currentQuestionIndex, correctAnswer, explanation: questions[currentDifficulty][currentQuestionIndex].explanation });
    }

    document.querySelectorAll('.option').forEach(button => button.disabled = true);

    updateResultsHistory();

    document.getElementById('skipButton').style.display = 'block';
    timerInterval = setTimeout(moveToNextQuestion, 3000); 
}

function updateResultsHistory() {
    const historyList = document.getElementById('resultsHistory');
    historyList.innerHTML = resultsHistory.map((item, index) => `<li onclick="reviewQuestion(${index})">${index + 1}. ${item.result}</li>`).join('');
}

function reviewQuestion(index) {
    const item = resultsHistory[index];
    alert(`Question: ${questions[currentDifficulty][item.questionIndex].question}\n\nYour Answer: ${item.result}\n\nCorrect Answer: ${item.correctAnswer}\n\nExplanation: ${item.explanation}`);
}

function skipTimer() {
    clearInterval(timerInterval); 
    moveToNextQuestion(); 
}

function moveToNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions[currentDifficulty].length) {
        loadQuestion();
    } else {
        alert('You have completed all the questions for this difficulty!');
        saveQuizHistory();
        document.getElementById('quiz-section').style.display = 'none';
        document.getElementById('history-section').style.display = 'block';
    }
}

function saveQuizHistory() {
    const score = resultsHistory.filter(item => item.result === '✅').length;
    const time = new Date().toLocaleTimeString();
    const date = new Date().toLocaleDateString();

    pastResults.push({
        difficulty: currentDifficulty,
        date: date,
        time: time,
        score: `${score}/5`,
        totalTime: totalQuizTime,
        results: resultsHistory
    });

    if (pastResults.length > 3) {
        pastResults.shift(); 
    }

    displayQuizSummary();
}

function displayQuizSummary() {
    const lastResult = pastResults[pastResults.length - 1];
    const summary = document.getElementById('quizSummary');

    summary.innerHTML = `
        <p>Difficulty: ${lastResult.difficulty.charAt(0).toUpperCase() + lastResult.difficulty.slice(1)}</p>
        <p>Correct Answers: ${lastResult.score}</p>
        <p>Time Consumed: ${lastResult.totalTime} seconds</p>
        <ul>
            ${lastResult.results.map((item, index) => `<li>${index + 1}. ${item.result} - ${questions[currentDifficulty][item.questionIndex].explanation}</li>`).join('')}
        </ul>
    `;
}

function goBackToSelection() {
    clearInterval(timerInterval); 
    clearInterval(animationInterval); 
    document.getElementById('quiz-section').style.display = 'none';
    document.getElementById('history-section').style.display = 'none';
    document.getElementById('difficulty-selection').style.display = 'block';
}

function showReviewHistory() {
    // Display the past quiz results
    alert("Feature to review past quiz history coming soon!");
}
