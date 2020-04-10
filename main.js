let showedWords = [];
const queryString = window.location.search;
let options = document.querySelectorAll('.translate_option');

let score = 0;
let lives = 3;
const jsonIndexFirst = getUrlParam('to') === 'russian' ? 0 : 2;
const jsonIndexSecond = getUrlParam('to') === 'english' ? 0 : 2;

switch (getUrlParam('mode')) {
  case '1':
    setWordAndOptions();
    break;
  case '2':
  lives = 6;
  updateLivesView();
  var currentPosition = 0;
  var word = getRandomWord();
  document.querySelector('.word').innerText = word[2];
  drawLetters(word[0]);
  let letters = document.querySelectorAll('.word_letter');

      document.addEventListener('click', (e)=>{
        if (e.target.classList.contains('word_letter')) {
          if (e.target.innerText.trim().toLowerCase() === word[0][currentPosition].trim().toLowerCase()) {
            document.querySelector('.word_input').appendChild(e.target);
            currentPosition++;
            if (currentPosition >= word[0].length) {
              setTimeout(()=>{
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
              window.location = '/english/';
            }
          }
        }
      });

    break;
  default:
  //window.location = '/';
}

function updateLivesView() {
  document.querySelector('.lives').innerText = lives;
}

function updateScoreView() {
  document.querySelector('.score').innerText = score;
}

function drawLetters(w) {
  let shuffleWord = Shuffle(w.split(''));
  for (var i = 0; i < shuffleWord.length; i++) {
    let html = `<div class="word_letter animated fadeInUp" style="animation-delay: ${0.1*i}s">${shuffleWord[i]}</div>`;
    document.querySelector('.available_letter').insertAdjacentHTML( 'beforeend', html );
  }
}
for (var i = 0; i < options.length; i++) {
  options[i].addEventListener('click', (e)=>{
    let word = document.querySelector('.word').innerText.trim();
    let translate = e.target.innerText;
    if (checkTranslate(word, translate)) {
      score++;
      updateScoreView();
      e.target.classList.add('true', 'avoid-clicks');
      setTimeout(()=>{
        clearOptions();
        fadeOutAll();
        setTimeout(()=>{
          clearOptions();
          setWordAndOptions();
          fadeInAll();
        },500);
      }, 500);

    } else {
      lives--;
      updateLivesView();
      e.target.classList.add('false', 'avoid-clicks');
      if (lives === 0) {
        alert('Вы проиграли, Ваш счет: ' + score);
        window.location = '/english/';
      }
    }
  });
}
function fadeOutAll() {
  for (var i = 0; i < options.length; i++) {
    options[i].classList.add('zoomOut');
  }
}

function fadeInAll() {
  for (var i = 0; i < options.length; i++) {
    options[i].classList.add('zoomIn');
    options[i].classList.remove('avoid-clicks');
  }
}

function clearOptions() {
  for (var i = 0; i < options.length; i++) {
    options[i].classList.remove('true', 'false', 'zoomIn', 'zoomOut', 'avoid-clicks');
  }
}

// функция которая мешает массив
function Shuffle(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
}

function setWordAndOptions() {
  let word = getRandomWord();
  document.querySelector('.word').innerText = word[jsonIndexFirst];
  let answerOptions = [word[jsonIndexSecond]];
  for (var i = 0; i < 3; i++) {
    let word = getRandomWord();
    answerOptions.push(word[jsonIndexSecond]);
  }
  answerOptions = Shuffle(answerOptions);
  for (var i = 0; i < options.length; i++) {
    options[i].innerText = answerOptions[i];
  }
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
  let isTrue = false;
  for (var i = 0; i < dictionary.length; i++) {
    if (dictionary[i][jsonIndexFirst] === inputWord) {
      if (dictionary[i][jsonIndexSecond] === inputTranslate) {
        isTrue = true;
      }
      break;
    }
  }

  return isTrue;
}

function getUrlParam(key) {
  let params = getUrlParams();
  for (var i = 0; i < params.length; i++) {
    if (params[i].key === key) {
      return params[i].value;
    }
  }

  return false;
}

function getUrlParams() {
  let res = [];
  var Param = function(key, value) {
    this.key = key;
    this.value = value;
  };
  Object.create(Param);
  const queryString = window.location.search;
  let notFormatedParams = queryString.split('&');
  for (let i = 0; i < notFormatedParams.length; i++) {
    let parsedParam = notFormatedParams[i].split('=');
    for (let j = 0; j < parsedParam.length; j++) {
      parsedParam[i] = parsedParam[i].replace('?', '');
    }
    let p = new Param(parsedParam[0], parsedParam[1]);
    res.push(p);
  }
  return res;
}
