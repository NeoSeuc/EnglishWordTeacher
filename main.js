let showedWords = [];
let options = document.querySelectorAll('.translate_option');

let score = 0;
let lives = 3;

// в зависимости от языка будет меняться индекс по которому будет браться слово из словаря
const jsonIndexFirst = getUrlParam('to') === 'russian' ? 0 : 2;
const jsonIndexSecond = getUrlParam('to') === 'english' ? 0 : 2;

switch (getUrlParam('mode')) {
    case '1':
        setWordAndOptions();
        break;
    case '2':
        lives = 6;
        updateLivesView();
        let currentPosition = 0;
        let word = getRandomWord();
        document.querySelector('.word').innerText = word[2];
        drawLetters(word[0]);
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('word_letter')) {
                if (e.target.innerText.trim().toLowerCase() === word[0][currentPosition].trim().toLowerCase()) {
                    document.querySelector('.word_input').appendChild(e.target);
                    currentPosition++;
                    if (currentPosition >= word[0].length) {
                        setTimeout(() => {
                            word = getRandomWord();
                            document.querySelector('.word').innerText = word[2];
                            drawLetters(word[0]);
                            currentPosition = 0;
                            score++;
                            updateScoreView()
                            document.querySelector('.word_input').innerHTML = '';
                        }, 1000);
                    }
                } else {
                    lives--;
                    updateLivesView();
                    if (lives <= 0) {
                        alert('У Вас закончились жизни!');
                        window.location = 'index.html';
                    }
                }
            }
        });

        break;
    default:
    window.location = 'index.html';
}

function updateLivesView() {
    document.querySelector('.lives').innerText = lives;
}

function updateScoreView() {
    document.querySelector('.score').innerText = score;
}

function drawLetters(w) {
    shuffle(w.split('')).forEach((item, i) => {
        document.querySelector('.available_letter')
            .insertAdjacentHTML('beforeend', `<div class="word_letter animated fadeInUp" style="animation-delay: ${0.1 * i}s">${item}</div>`);
    });
}

options.forEach((element, i) => {
    element.addEventListener('click', (e) => {
        let word = document.querySelector('.word').innerText.trim();
        let translate = e.target.innerText;
        if (checkTranslate(word, translate)) {
            score++;
            updateScoreView();
            e.target.classList.add('true', 'avoid-clicks');
            setTimeout(() => {
                clearOptions();
                fadeOutAll();
                setTimeout(() => {
                    clearOptions();
                    setWordAndOptions();
                    fadeInAll();
                }, 500);
            }, 500);

        } else {
            lives--;
            updateLivesView();
            e.target.classList.add('false', 'avoid-clicks');
            if (lives === 0) {
                alert('Вы проиграли, Ваш счет: ' + score);
                window.location = 'index.html';
            }
        }
    });
});

function fadeOutAll() {
    [...options].map((o) => o.classList.add('zoomOut'));
}

function fadeInAll() {
    [...options].map((o) => {
        o.classList.add('zoomIn');
        o.classList.remove('avoid-clicks');
        return o;
    });
}

function clearOptions() {
    [...options].map(o => o.classList.remove('true', 'false', 'zoomIn', 'zoomOut', 'avoid-clicks'));
}

// функция которая мешает массив
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function setWordAndOptions() {
    let word = getRandomWord();
    document.querySelector('.word').innerText = word[jsonIndexFirst];
    let answerOptions = [word[jsonIndexSecond]];
    for (var i = 0; i < 3; i++) {
        let word = getRandomWord();
        answerOptions.push(word[jsonIndexSecond]);
    }
    shuffle(answerOptions);
    [...options].map((o, i) => o.innerText = answerOptions[i]);

}

function getRandomWord() {
    let randomIndex = 0;
    do {
        randomIndex = Math.ceil(Math.random() * dictionary.length);
    } while (showedWords.includes(randomIndex));
    showedWords.push(randomIndex);
    return dictionary[randomIndex];
}

/** checkTranslate()
 * inputWord - a word that need to translate
 * inputTranslate - a word that maybe is a true translate for inputWord
 * to what language we are translating a word
 */
function checkTranslate(inputWord, inputTranslate) {
    inputWord = inputWord.trim();
    inputTranslate = inputTranslate.trim();
    return dictionary.filter(o => o[jsonIndexFirst] === inputWord)
        .every(o => o[jsonIndexSecond] === inputTranslate);
}

function getUrlParam(key) {
    return getUrlParams().find(p => p.key === key).value;
}

function getUrlParams() {
    var Param = function (key, value) {
        this.key = key;
        this.value = value;
    };
    Object.create(Param);
    return window.location.search.split('&')
        .map(p => p.split('='))
        .map(p => {
            p[0] = p[0].replace('?', '');
            return p;
        })
        .map(p => new Param(p[0], p[1]));
}
