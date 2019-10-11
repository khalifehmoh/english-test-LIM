//state object
var state = {
  questionsData: [],
  totalQuestions: 0,
  questionPage: {
    question: "",
    choices: "",
    queNumber: 1,
    questionIndex: 0,
  },
  checked: false,
  totalMarks: 0,
  tempMark: 0
}

//state modification functions
var addQuestion = function (state, requiredQuestion, requiredChoices) {
  state.questionPage.question = requiredQuestion;
  state.questionPage.choices = requiredChoices;
}

var addNumberOfQuestions = function (state, total) {
  state.totalQuestions = total;
}

var choiceCheck = function () {
  state.checked = true;
}

var choiceUncheck = function () {
  state.checked = false;
}

var changeTempMark = function (mark) {
  state.tempMark = mark
}

var zeroTempMark = function () {
  state.tempMark = 0
}

var answerCheckFalse = function () {
  state.answerValue = false;
}

var incrementCorrectAnsCount = function () {
  state.questionPage.correctAns += 1;
}

var incrementpositiveAnsCount = function () {
  state.questionPage.positiveAns += 1;
}

var incrementQueNumberCount = function () {
  state.questionPage.queNumber += 1;
}

var incrementQuestionIndexCount = function () {
  state.questionPage.questionIndex += 1;
}

var incrementTotalMark = function () {
  state.totalMarks += state.tempMark
}
//Render functions

var renderQuestion = function (state) {
  var checkLastAnswer = function () {
    if (state.questionPage.questionIndex === state.totalQuestions - 1) {
      return `<button ${state.checked ? "" : "disabled"} class=\"js-choice-submit-button js-view-result\">Show Result</button>`
    }
    else {
      return `<button ${state.checked ? "" : "disabled"} class=\"js-choice-submit-button\">Next</button>`
    }
  }
  var questionRender = "<div class=\"js-question-page\">" +
    "<h2 class=\"js-q-header\">English Assesment</h2>" +
    "<div class=\"js-q-box\">" +
    "<div class=\"js-question-text\">" +
    "<h5><span class=\"js-q-number\">" + state.questionPage.queNumber + "</span>" +
    "<span>/" + state.totalQuestions + ": </span><span class=\"js-q-text\">" + state.questionPage.question + "</span></h5>" +
    "</div>" +
    "<div class=\"js-choices\">" + state.questionPage.choices +
    "</div>" +
    "</div>" +
    "<div class=\"js-nav-box\">" +
    checkLastAnswer() +
    "</div>" +
    "</div>"
  $(".js-container").html(questionRender);

}


var renderCheck = function () {
  $(".js-nav-box").find("button").prop("disabled", state.checked ? false : true)
}

var renderResult = function () {
  var result = "";
  var totalMark = state.totalMarks;
  var message = "";
  var percentage = totalMark;

  if (totalMark >= 83.335 && totalMark <= 100) {
    message = "A1";
    ringColor = "js-excellent-result";
  }
  else if (totalMark >= 66.668 && totalMark <= 83.335) {
    message = "A2";
    ringColor = "js-excellent-result";
  }
  else if (totalMark >= 50.001 && totalMark < 66.668) {
    message = "B1";
    ringColor = "js-verygood-result"
  }
  else if (totalMark >= 33.33 && totalMark < 50.001) {
    message = "B2";
    ringColor = "js-good-result"
  }
  else if (totalMark >= 16.66 && totalMark < 33.33) {
    message = "C1";
    ringColor = "js-average-result"
  }
  else if (totalMark < 16.66 && totalMark >= 0) {
    message = "C2";
    ringColor = "js-weak-result"
  }

  result = `<div class="js-result-page">
    <div class="js-feedback-text-con">
    <span class="js-feedback-header">Your Result: ${totalMark}/100</span>
    <div>
      <svg viewBox="0 0 36 36" class="result-ring ${ringColor}">
      <path class="ring-bg" d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831" />
      <path class="ring" d="M18 2.0845
      a 15.9155 15.9155 0 0 1 0 31.831
      a 15.9155 15.9155 0 0 1 0 -31.831" ; stroke-dasharray="${percentage}, 100" />
      <text x="18" y="20.35" class="js-result-message">${message}</text>
      </svg>
    </div>`
    ;
  $(".js-container").html(result);
}
//event listeners

function handleMarksDisplay() {
  $(".main").on("click", ".btn-asses-submit", function (event) {
    event.preventDefault();
    var index = state.questionPage.questionIndex;
    getQuestionDetails(index);
    renderQuestion(state)
  })
}


function handleStartQuiz() {
  $(".js-container").on("click", ".btn-asses-submit", function (event) {
    event.preventDefault();
    get_data();
    var index = state.questionPage.questionIndex;
    $('.home-container').fadeOut('medium', function () {
      getQuestionDetails(index);
      renderQuestion(state);
      $('.js-q-header').hide().fadeIn(300);
      $('.js-nav-box').css({ 'margin-top': '-30px', 'opacity': '0' }).animate(
        {
          marginTop: '-50px',
          opacity: 1
        }, 'normal'
      )
      $('.js-question-text').hide().fadeIn(500);
      $('.js-choices').hide().fadeIn(800).slideDown()
    })
  })
}

function handleSubmitAnswer() {
  $(".js-container").on("click", ".js-choice-submit-button", function (event) {
    $('.js-q-box').fadeOut('fast')

    incrementQueNumberCount();
    incrementQuestionIndexCount();
    incrementTotalMark();
    var index = state.questionPage.questionIndex;

    if (index !== state.totalQuestions) {
      getQuestionDetails(index);
      renderQuestion(state);
    }
    zeroTempMark();

    $('.js-question-text').hide().fadeIn(200);
    $('.js-choices').hide().fadeIn(400).slideDown()
  })
}

function handleChoiceCheck() {
  $(".js-container").on("click", "input[type=radio]", function (event) {
    var value = Number($(this).val());
    changeTempMark(value);
    choiceCheck();
    renderCheck();
    choiceUncheck();

  })
}

function handleViewResult() {
  $(".js-container").on("click", ".js-view-result", function (event) {
    $('.js-question-page').fadeOut('slow', function () {
      renderResult();
      animateResult();
    })

  })
}

function animateResult() {
  $(".result-ring").hide();
  $(".js-container").animate({
    height: '300px'
  })
  $(".js-feedback-header").fadeIn(800).slideDown();
  setTimeout(() => {
    $(".result-ring").fadeIn(800);
  }, 500);
  // setTimeout(() => {
  //   $(".js-container").animate({
  //     height: '700px'
  //   }, 2000, function () {
  //     $(".js-container").css("height", "auto");
  //   });
  // }, 2000);
}

//other functions

function getQuestionDetails(index) {
  const requiredQuestion = state.questionsData[index];
  const requiredQuestionAnswers = requiredQuestion.answers;
  const requiredQuestionTitle = requiredQuestion.question.title
  const requiredChoices = generateQuestionAnswersDOM(requiredQuestionAnswers);
  const total = state.questionsData.length;
  addNumberOfQuestions(state, total)
  addQuestion(state, requiredQuestionTitle, requiredChoices);
}

function generateQuestionAnswersDOM(answersArray) {
  let answersDOMArray = [];
  answersArray.forEach(answer => {
    let answerHTML = `<div class="js-choice">
      <input class="js-radio-choice" type="radio" name="choice" id="${answer.id}" value="${answer.isRight}"><br>
      <label for="${answer.id}">${answer.title}</label>
    </div>
    `
    answersDOMArray.push(answerHTML);
  });
  let joinedAnswers = answersDOMArray.join('');
  return `<form>${joinedAnswers}</form>`
}

function addQuestionToQuestionsArray(index, reqQuestionTxt, reqQuestionChoices) {
  questionText.splice(index, 0, reqQuestionTxt);
  questionChoices.splice(index, 0, reqQuestionChoices);
}

// Questions Repo
function get_data() {
  var data = JSON.parse(globalData);
  state.questionsData = data
}

//handlers
$(function () {
  handleStartQuiz();
  handleChoiceCheck();
  handleSubmitAnswer();
  handleViewResult();
})