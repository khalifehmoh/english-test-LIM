//state object
var state = {
  questionsData: [],
  totalQuestions: 0,
  pageQuestions: [],
  lastRenderedQuestion: 0,
  allChecked: false,
  totalMarks: 0,
  tempMark: 0
}

//state modification functions
var addQuestion = function (state, requiredQuestion, requiredChoices, requiredQuestionNumber) {
  let questionInfo = {
    question: requiredQuestion,
    choices: requiredChoices,
    queNumber: requiredQuestionNumber,
    // questionIndex: 0,
  }
  state.pageQuestions.push(questionInfo);
}

var clearPageQuestions = function () {
  state.pageQuestions = []
}

var addNumberOfQuestions = function (state, total) {
  state.totalQuestions = total;
}

var choicesCheck = function (status) {
  state.allChecked = status;
}

var changeTempMark = function (mark) {
  state.tempMark += mark
}

var zeroTempMark = function () {
  state.tempMark = 0
}

var answerCheckFalse = function () {
  state.answerValue = false;
}

var incrementLastRenderedQuestion = function () {
  state.lastRenderedQuestion += 10
}

var incrementCorrectAnsCount = function () {
  state.questionInfo.correctAns += 1;
}

var incrementpositiveAnsCount = function () {
  state.questionInfo.positiveAns += 1;
}

var incrementQueNumberCount = function () {
  state.questionInfo.queNumber += 1;
}

var incrementQuestionIndexCount = function () {
  state.questionInfo.questionIndex += 1;
}

var incrementTotalMark = function () {
  state.totalMarks += state.tempMark
}
//Render functions

var renderQuestion = function (state) {
  var checkLastAnswer = function () {
    return `<button type="submit" ${state.allChecked ? "" : "disabled"} class=\"js-choice-submit-button\">Next</button>`
  }
  // var checkLastAnswer = function () {
  //   if (state.questionInfo.questionIndex === state.totalQuestions - 1) {
  //     return `<button type="submit" ${state.allChecked ? "" : "disabled"} class=\"js-choice-submit-button js-view-result\">Show Result</button>`
  //   }
  //   else {
  //     return `<button type="submit" ${state.allChecked ? "" : "disabled"} class=\"js-choice-submit-button\">Next</button>`
  //   }
  // }
  let tenQuestionsDOM = '';
  const pageQuestions = state.pageQuestions;
  pageQuestions.forEach((item, index) => {
    const formId = 'q-' + (index + 1);
    let singleQuestionDOM = `<form id="${formId}" class="js-q-box">` +
      "<div class=\"js-question-text\">" +
      "<h5><span class=\"js-q-number\">" + item.queNumber + ": </span>" +
      "<span class=\"js-q-text\">" + item.question + "</span></h5>" +
      "</div>" +
      "<div class=\"js-choices\">" + item.choices +
      "</div>" +
      "</form>"
    tenQuestionsDOM += singleQuestionDOM;
  })


  var questionsPageRender = "<div id=\"questions-form\" class=\"js-question-page\">" +
    "<h2 class=\"js-q-header\">English Assesment</h2>" +
    tenQuestionsDOM +
    "<div class=\"js-nav-box\">" +
    checkLastAnswer() +
    "</div>" +
    "</div>"
  $(".js-container").html(questionsPageRender);
  clearPageQuestions();
}


var renderCheck = function () {
  $(".js-nav-box").find("button").prop("disabled", state.allChecked ? false : true)
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
    var index = state.questionInfo.questionIndex;
    getQuestionDetails(index);
    renderQuestion(state)
  })
}


function handleStartQuiz() {
  $(".js-container").on("click", ".btn-asses-submit", function (event) {
    event.preventDefault();
    get_data();

    // var index = state.questionInfo.questionIndex;
    $('.home-container').fadeOut('medium', function () {
      // getQuestionDetails(index)
      getTenQuestionsDetails();
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

function handleSubmitAnswers() {
  $(".js-container").on("click", ".js-choice-submit-button", function (event) {
    for (let i = 1; i < 11; i++) {
      let formId = '#q-' + i;
      let serialized = $(formId).serialize();
      if (serialized === "choice=1") {
        changeTempMark(1)
      }
    }
    incrementTotalMark();
    // if (index !== state.totalQuestions) {
    //   getQuestionDetails(index);
    //   renderQuestion(state);
    // }
    getTenQuestionsDetails();
    renderQuestion(state);
    zeroTempMark();
    // $('.js-q-box').fadeOut('fast')

    // incrementQueNumberCount();
    // incrementQuestionIndexCount();
    // incrementTotalMark();
    // var index = state.questionInfo.questionIndex;


    // zeroTempMark();

    // $('.js-question-text').hide().fadeIn(200);
    // $('.js-choices').hide().fadeIn(400).slideDown()
  })
}

function handleChoiceCheck() {
  $('.js-container').on('change', 'input', function () {
    if (!$('.js-choices:not(:has(:radio:checked))').length) {
      choicesCheck(true)
    }
    renderCheck();
    choicesCheck(false)
  });
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

// function getQuestionDetails(index) {
//   const requiredQuestion = state.questionsData[index];
//   const requiredQuestionAnswers = requiredQuestion.answers;
//   const requiredQuestionTitle = requiredQuestion.question.title
//   const requiredChoices = generateQuestionAnswersDOM(requiredQuestionAnswers);
//   const total = state.questionsData.length;
//   addNumberOfQuestions(state, total)
//   addQuestion(state, requiredQuestionTitle, requiredChoices);
// }

function getTenQuestionsDetails() {
  let tenQuestionsArr = [];
  tenQuestionsArr = state.questionsData.slice(state.lastRenderedQuestion, state.lastRenderedQuestion + 10);
  tenQuestionsArr.forEach((question, index) => {
    const requiredQuestion = question;
    const requiredQuestionAnswers = requiredQuestion.answers;
    const requiredQuestionTitle = requiredQuestion.question.title;
    const requiredQuestionNumber = index + 1 + state.lastRenderedQuestion;
    const requiredChoices = generateQuestionAnswersDOM(requiredQuestionAnswers);
    addQuestion(state, requiredQuestionTitle, requiredChoices, requiredQuestionNumber)
  })
  incrementLastRenderedQuestion();
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
  return `<div>${joinedAnswers}</div>`
}

function addQuestionToQuestionsArray(index, reqQuestionTxt, reqQuestionChoices) {
  questionText.splice(index, 0, reqQuestionTxt);
  questionChoices.splice(index, 0, reqQuestionChoices);
}

// Questions Repo
function get_data() {
  // var data = JSON.parse(globalData);
  var staticData = [{ "question": { "id": "54", "title": "____ do you have dinner?", "level": "medium", "mark": null }, "answers": [{ "id": "187", "title": "When time", "question_id": "54", "isRight": "0" }, { "id": "188", "title": "What time", "question_id": "54", "isRight": "1" }, { "id": "189", "title": "What kind of", "question_id": "54", "isRight": "0" }, { "id": "190", "title": "What for", "question_id": "54", "isRight": "0" }] }, { "question": { "id": "118", "title": "____ plans you might have for the weekend, you'll have to change them.", "level": "hard", "mark": null }, "answers": [{ "id": "443", "title": "Wherever", "question_id": "118", "isRight": "0" }, { "id": "444", "title": "Whovever", "question_id": "118", "isRight": "0" }, { "id": "445", "title": "Whatever", "question_id": "118", "isRight": "1" }, { "id": "446", "title": "However", "question_id": "118", "isRight": "0" }] }, { "question": { "id": "122", "title": "The party was so boring I wish I ____ there at all.", "level": "hard", "mark": null }, "answers": [{ "id": "459", "title": "hadn't gone", "question_id": "122", "isRight": "1" }, { "id": "460", "title": "wouldn't go", "question_id": "122", "isRight": "0" }, { "id": "461", "title": "haven't gone", "question_id": "122", "isRight": "0" }, { "id": "462", "title": "didn't go", "question_id": "122", "isRight": "0" }] }, { "question": { "id": "15", "title": "I didn't know you wanted _________________ Robert to your party.", "level": "easy", "mark": null }, "answers": [{ "id": "43", "title": "that I invite", "question_id": "15", "isRight": "0" }, { "id": "44", "title": "me to invite", "question_id": "15", "isRight": "1" }, { "id": "45", "title": "that I invited", "question_id": "15", "isRight": "0" }] }, { "question": { "id": "83", "title": "Her horse is lovely. She _____ it since she was a teenager.", "level": "medium", "mark": null }, "answers": [{ "id": "303", "title": "had", "question_id": "83", "isRight": "0" }, { "id": "304", "title": "has had", "question_id": "83", "isRight": "1" }, { "id": "305", "title": "had", "question_id": "83", "isRight": "0" }, { "id": "306", "title": "is had", "question_id": "83", "isRight": "0" }] }, { "question": { "id": "87", "title": "You ____ wear a suit to work, but you can if you want.", "level": "medium", "mark": null }, "answers": [{ "id": "319", "title": "must", "question_id": "87", "isRight": "0" }, { "id": "320", "title": "mustn\u2019t", "question_id": "87", "isRight": "0" }, { "id": "321", "title": "could", "question_id": "87", "isRight": "0" }, { "id": "322", "title": "don\u2019t have to", "question_id": "87", "isRight": "1" }] }, { "question": { "id": "149", "title": "I can't move the sofa. Could you ____ me a hand with it, please?", "level": "hard", "mark": null }, "answers": [{ "id": "567", "title": "give", "question_id": "149", "isRight": "1" }, { "id": "568", "title": "get", "question_id": "149", "isRight": "0" }, { "id": "569", "title": "take", "question_id": "149", "isRight": "0" }, { "id": "570", "title": "borrow", "question_id": "149", "isRight": "0" }] }, { "question": { "id": "46", "title": "When do you play tennis? ____ Mondays.", "level": "easy", "mark": null }, "answers": [{ "id": "155", "title": "On", "question_id": "46", "isRight": "1" }, { "id": "156", "title": "In", "question_id": "46", "isRight": "0" }, { "id": "157", "title": "At", "question_id": "46", "isRight": "0" }, { "id": "158", "title": "By", "question_id": "46", "isRight": "0" }] }, { "question": { "id": "48", "title": "____ two airports in the city.", "level": "easy", "mark": null }, "answers": [{ "id": "163", "title": "It is", "question_id": "48", "isRight": "0" }, { "id": "164", "title": "There is", "question_id": "48", "isRight": "0" }, { "id": "165", "title": "There are", "question_id": "48", "isRight": "1" }, { "id": "166", "title": "This is", "question_id": "48", "isRight": "0" }] }, { "question": { "id": "9", "title": "You _________________ write the report today. The deadline is May 26th", "level": "easy", "mark": null }, "answers": [{ "id": "25", "title": "mustn\u2019t", "question_id": "9", "isRight": "0" }, { "id": "26", "title": "haven\u2019t to", "question_id": "9", "isRight": "0" }, { "id": "27", "title": "don\u2019t have to", "question_id": "9", "isRight": "1" }] }, { "question": { "id": "69", "title": "I plan to ____ two weeks by the beach.", "level": "medium", "mark": null }, "answers": [{ "id": "247", "title": "bring", "question_id": "69", "isRight": "0" }, { "id": "248", "title": "spend", "question_id": "69", "isRight": "1" }, { "id": "249", "title": "spending", "question_id": "69", "isRight": "0" }, { "id": "250", "title": "making", "question_id": "69", "isRight": "0" }] }, { "question": { "id": "24", "title": "They've had this house _________________ twenty years", "level": "easy", "mark": null }, "answers": [{ "id": "70", "title": "from", "question_id": "24", "isRight": "0" }, { "id": "71", "title": "for", "question_id": "24", "isRight": "1" }, { "id": "72", "title": "since", "question_id": "24", "isRight": "0" }] }, { "question": { "id": "77", "title": "In the future there ____ cures to the world's worst diseases.", "level": "medium", "mark": null }, "answers": [{ "id": "279", "title": "might be", "question_id": "77", "isRight": "1" }, { "id": "280", "title": "is going to being", "question_id": "77", "isRight": "0" }, { "id": "281", "title": "will being", "question_id": "77", "isRight": "0" }, { "id": "282", "title": "might have", "question_id": "77", "isRight": "0" }] }, { "question": { "id": "140", "title": "I'll need to have the stairs ____.", "level": "hard", "mark": null }, "answers": [{ "id": "531", "title": "renovate", "question_id": "140", "isRight": "0" }, { "id": "532", "title": "renovating", "question_id": "140", "isRight": "0" }, { "id": "533", "title": "to renovate", "question_id": "140", "isRight": "0" }, { "id": "534", "title": "renovated", "question_id": "140", "isRight": "1" }] }, { "question": { "id": "78", "title": "The space tourists ___ certainly need to be very fit.", "level": "medium", "mark": null }, "answers": [{ "id": "283", "title": "won\u2019t", "question_id": "78", "isRight": "0" }, { "id": "284", "title": "will", "question_id": "78", "isRight": "1" }, { "id": "285", "title": "?", "question_id": "78", "isRight": "0" }, { "id": "286", "title": "going to", "question_id": "78", "isRight": "0" }] }, { "question": { "id": "76", "title": "I don't think you ____ them.", "level": "medium", "mark": null }, "answers": [{ "id": "275", "title": "should to email", "question_id": "76", "isRight": "0" }, { "id": "276", "title": "should email", "question_id": "76", "isRight": "1" }, { "id": "277", "title": "should emailing", "question_id": "76", "isRight": "0" }, { "id": "278", "title": "?", "question_id": "76", "isRight": "0" }] }, { "question": { "id": "18", "title": "The weather wasn't _________________ to go for a walk so they decided to stay at home.", "level": "easy", "mark": null }, "answers": [{ "id": "52", "title": "too good", "question_id": "18", "isRight": "0" }, { "id": "53", "title": "good enough", "question_id": "18", "isRight": "1" }, { "id": "54", "title": "enough good", "question_id": "18", "isRight": "0" }] }, { "question": { "id": "129", "title": "Admission was free so we ____ any tickets", "level": "hard", "mark": null }, "answers": [{ "id": "487", "title": "needn't buy", "question_id": "129", "isRight": "0" }, { "id": "488", "title": "mustn't buy", "question_id": "129", "isRight": "0" }, { "id": "489", "title": "didn't need to buy", "question_id": "129", "isRight": "1" }, { "id": "490", "title": "mustn't have bought", "question_id": "129", "isRight": "0" }] }, { "question": { "id": "26", "title": "____'s your name? Thomas\t\t", "level": "easy", "mark": null }, "answers": [{ "id": "76", "title": "How", "question_id": "26", "isRight": "0" }, { "id": "77", "title": "Who", "question_id": "26", "isRight": "0" }, { "id": "78", "title": "What", "question_id": "26", "isRight": "1" }, { "id": "79", "title": "Where", "question_id": "26", "isRight": "0" }] }, { "question": { "id": "72", "title": "My coffee was ____ yours. I almost burned by mouth.", "level": "medium", "mark": null }, "answers": [{ "id": "259", "title": "hotter than", "question_id": "72", "isRight": "1" }, { "id": "260", "title": "more hot than", "question_id": "72", "isRight": "0" }, { "id": "261", "title": "hotter as", "question_id": "72", "isRight": "0" }, { "id": "262", "title": "as hot", "question_id": "72", "isRight": "0" }] }, { "question": { "id": "33", "title": "And here is your ____.", "level": "easy", "mark": null }, "answers": [{ "id": "103", "title": "desk", "question_id": "33", "isRight": "1" }, { "id": "104", "title": "desks", "question_id": "33", "isRight": "0" }, { "id": "105", "title": "a desk", "question_id": "33", "isRight": "0" }, { "id": "106", "title": "an desk", "question_id": "33", "isRight": "0" }] }, { "question": { "id": "111", "title": "People __________ from the illness find it difficult to relax.", "level": "hard", "mark": null }, "answers": [{ "id": "415", "title": "suffered", "question_id": "111", "isRight": "0" }, { "id": "416", "title": "suffering", "question_id": "111", "isRight": "1" }, { "id": "417", "title": "who suffering", "question_id": "111", "isRight": "0" }, { "id": "418", "title": "were suffering", "question_id": "111", "isRight": "0" }] }, { "question": { "id": "115", "title": "She ____ much better since she left the hospital last week.", "level": "hard", "mark": null }, "answers": [{ "id": "431", "title": "is feeling", "question_id": "115", "isRight": "0" }, { "id": "432", "title": "feels", "question_id": "115", "isRight": "0" }, { "id": "433", "title": "felt", "question_id": "115", "isRight": "0" }, { "id": "434", "title": "has been feeling", "question_id": "115", "isRight": "1" }] }, { "question": { "id": "30", "title": "Excuse me, how ____ your last name? R-I-L-E-Y", "level": "easy", "mark": null }, "answers": [{ "id": "92", "title": "spell", "question_id": "30", "isRight": "0" }, { "id": "93", "title": "you spell", "question_id": "30", "isRight": "0" }, { "id": "94", "title": "do you spell", "question_id": "30", "isRight": "1" }, { "id": "95", "title": "spell you", "question_id": "30", "isRight": "0" }] }, { "question": { "id": "96", "title": "I am very ___ in old cars.", "level": "medium", "mark": null }, "answers": [{ "id": "355", "title": "keen", "question_id": "96", "isRight": "0" }, { "id": "356", "title": "interesting", "question_id": "96", "isRight": "0" }, { "id": "357", "title": "interested", "question_id": "96", "isRight": "1" }, { "id": "358", "title": "fond", "question_id": "96", "isRight": "0" }] }, { "question": { "id": "113", "title": "She did a course in confidence building ____ overcome her phobia", "level": "hard", "mark": null }, "answers": [{ "id": "423", "title": "so that", "question_id": "113", "isRight": "0" }, { "id": "424", "title": "in order to", "question_id": "113", "isRight": "1" }, { "id": "425", "title": "although", "question_id": "113", "isRight": "0" }, { "id": "426", "title": "in case", "question_id": "113", "isRight": "0" }] }, { "question": { "id": "97", "title": "He ___ his exam because he didn't study.", "level": "medium", "mark": null }, "answers": [{ "id": "359", "title": "failed", "question_id": "97", "isRight": "1" }, { "id": "360", "title": "passed", "question_id": "97", "isRight": "0" }, { "id": "361", "title": "missed", "question_id": "97", "isRight": "0" }, { "id": "362", "title": "fell", "question_id": "97", "isRight": "0" }] }, { "question": { "id": "84", "title": "I've received 33 emails ____ .", "level": "medium", "mark": null }, "answers": [{ "id": "307", "title": "on Friday", "question_id": "84", "isRight": "0" }, { "id": "308", "title": "yesterday", "question_id": "84", "isRight": "0" }, { "id": "309", "title": "two days ago", "question_id": "84", "isRight": "0" }, { "id": "310", "title": "this week", "question_id": "84", "isRight": "1" }] }, { "question": { "id": "3", "title": "Look at _________________ ! Why are they so dirty?", "level": "easy", "mark": null }, "answers": [{ "id": "7", "title": "themselves", "question_id": "3", "isRight": "0" }, { "id": "8", "title": "them", "question_id": "3", "isRight": "1" }, { "id": "9", "title": "their", "question_id": "3", "isRight": "0" }] }, { "question": { "id": "65", "title": "Would you like ____ to the theatre tonight?", "level": "medium", "mark": null }, "answers": [{ "id": "231", "title": "go", "question_id": "65", "isRight": "0" }, { "id": "232", "title": "to go", "question_id": "65", "isRight": "1" }, { "id": "233", "title": "going", "question_id": "65", "isRight": "0" }, { "id": "234", "title": "to going", "question_id": "65", "isRight": "0" }] }, { "question": { "id": "38", "title": "What is ____?", "level": "easy", "mark": null }, "answers": [{ "id": "123", "title": "job Mary", "question_id": "38", "isRight": "0" }, { "id": "124", "title": "Mary job", "question_id": "38", "isRight": "0" }, { "id": "125", "title": "Mary's job", "question_id": "38", "isRight": "1" }, { "id": "126", "title": "job's Mary", "question_id": "38", "isRight": "0" }] }, { "question": { "id": "79", "title": "If my new company is successful, I ____ employ people to help me.", "level": "medium", "mark": null }, "answers": [{ "id": "287", "title": "will", "question_id": "79", "isRight": "0" }, { "id": "288", "title": "be able to", "question_id": "79", "isRight": "0" }, { "id": "289", "title": "will be able to", "question_id": "79", "isRight": "1" }, { "id": "290", "title": "will able to", "question_id": "79", "isRight": "0" }] }, { "question": { "id": "41", "title": "I go to work ____ train.", "level": "easy", "mark": null }, "answers": [{ "id": "135", "title": "with", "question_id": "41", "isRight": "0" }, { "id": "136", "title": "by", "question_id": "41", "isRight": "1" }, { "id": "137", "title": "for", "question_id": "41", "isRight": "0" }, { "id": "138", "title": "in", "question_id": "41", "isRight": "0" }] }, { "question": { "id": "21", "title": "We are _________________ into our new flat next month.", "level": "easy", "mark": null }, "answers": [{ "id": "61", "title": "arriving", "question_id": "21", "isRight": "0" }, { "id": "62", "title": "entering", "question_id": "21", "isRight": "0" }, { "id": "63", "title": "moving", "question_id": "21", "isRight": "1" }] }, { "question": { "id": "51", "title": "________ at school yesterday. ", "level": "medium", "mark": null }, "answers": [{ "id": "175", "title": "Was you", "question_id": "51", "isRight": "0" }, { "id": "176", "title": "Were you", "question_id": "51", "isRight": "1" }, { "id": "177", "title": "Did you", "question_id": "51", "isRight": "0" }, { "id": "178", "title": "Is you", "question_id": "51", "isRight": "0" }] }, { "question": { "id": "95", "title": "She's very successful. Her ___ has risen a lot in the past few years.", "level": "medium", "mark": null }, "answers": [{ "id": "351", "title": "money", "question_id": "95", "isRight": "0" }, { "id": "352", "title": "salary", "question_id": "95", "isRight": "1" }, { "id": "353", "title": "job", "question_id": "95", "isRight": "0" }, { "id": "354", "title": "earnings", "question_id": "95", "isRight": "0" }] }, { "question": { "id": "22", "title": "John _________________ every day after school.", "level": "easy", "mark": null }, "answers": [{ "id": "64", "title": "gets riding", "question_id": "22", "isRight": "0" }, { "id": "65", "title": "goes on a bike", "question_id": "22", "isRight": "0" }, { "id": "66", "title": "goes cycling", "question_id": "22", "isRight": "1" }] }, { "question": { "id": "81", "title": "The film Avatar was directed ____ James Cameron", "level": "medium", "mark": null }, "answers": [{ "id": "295", "title": "by", "question_id": "81", "isRight": "1" }, { "id": "296", "title": "from", "question_id": "81", "isRight": "0" }, { "id": "297", "title": "for", "question_id": "81", "isRight": "0" }, { "id": "298", "title": "with", "question_id": "81", "isRight": "0" }] }, { "question": { "id": "62", "title": "She ____ with her friends on Facebook\u2122 everyday", "level": "medium", "mark": null }, "answers": [{ "id": "219", "title": "is communicating", "question_id": "62", "isRight": "0" }, { "id": "220", "title": "communicates", "question_id": "62", "isRight": "1" }, { "id": "221", "title": "will communicating", "question_id": "62", "isRight": "0" }, { "id": "222", "title": "?", "question_id": "62", "isRight": "0" }] }, { "question": { "id": "88", "title": "I had to ____ a uniform to school when I was younger.", "level": "medium", "mark": null }, "answers": [{ "id": "323", "title": "have", "question_id": "88", "isRight": "0" }, { "id": "324", "title": "wearing", "question_id": "88", "isRight": "0" }, { "id": "325", "title": "wear", "question_id": "88", "isRight": "1" }, { "id": "326", "title": "having", "question_id": "88", "isRight": "0" }] }, { "question": { "id": "142", "title": "Jane is always poking her nose in other people's business. She's so ____!", "level": "hard", "mark": null }, "answers": [{ "id": "539", "title": "inquisitive", "question_id": "142", "isRight": "1" }, { "id": "540", "title": "obedient", "question_id": "142", "isRight": "0" }, { "id": "541", "title": "playful", "question_id": "142", "isRight": "0" }, { "id": "542", "title": "unreliable", "question_id": "142", "isRight": "0" }] }, { "question": { "id": "44", "title": "____ they live in London?", "level": "easy", "mark": null }, "answers": [{ "id": "147", "title": "Are", "question_id": "44", "isRight": "0" }, { "id": "148", "title": "Is", "question_id": "44", "isRight": "0" }, { "id": "149", "title": "Do", "question_id": "44", "isRight": "1" }, { "id": "150", "title": "Does", "question_id": "44", "isRight": "0" }] }, { "question": { "id": "139", "title": "Two climbers are reported to ____ during the storm last night.", "level": "hard", "mark": null }, "answers": [{ "id": "527", "title": "die", "question_id": "139", "isRight": "0" }, { "id": "528", "title": "have died", "question_id": "139", "isRight": "1" }, { "id": "529", "title": "had died", "question_id": "139", "isRight": "0" }, { "id": "530", "title": "died", "question_id": "139", "isRight": "0" }] }, { "question": { "id": "119", "title": "They ____ out for a few years before they decided to get married.", "level": "hard", "mark": null }, "answers": [{ "id": "447", "title": "had gone", "question_id": "119", "isRight": "0" }, { "id": "448", "title": "have been going", "question_id": "119", "isRight": "0" }, { "id": "449", "title": "were going", "question_id": "119", "isRight": "0" }, { "id": "450", "title": "had been going", "question_id": "119", "isRight": "1" }] }, { "question": { "id": "124", "title": "Oh, you're busy? I ____ you later, OK?", "level": "hard", "mark": null }, "answers": [{ "id": "467", "title": "am calling", "question_id": "124", "isRight": "0" }, { "id": "468", "title": "call", "question_id": "124", "isRight": "0" }, { "id": "469", "title": "have called", "question_id": "124", "isRight": "0" }, { "id": "470", "title": "will call", "question_id": "124", "isRight": "1" }] }, { "question": { "id": "89", "title": "Cecilia knows someone ____ went to the carnival in Rio de Janeiro.", "level": "medium", "mark": null }, "answers": [{ "id": "327", "title": "who", "question_id": "89", "isRight": "1" }, { "id": "328", "title": "which", "question_id": "89", "isRight": "0" }, { "id": "329", "title": "she", "question_id": "89", "isRight": "0" }, { "id": "330", "title": "where", "question_id": "89", "isRight": "0" }] }, { "question": { "id": "102", "title": "He's not a stamp collector, ___?", "level": "hard", "mark": null }, "answers": [{ "id": "379", "title": "was he", "question_id": "102", "isRight": "0" }, { "id": "380", "title": "wasn\u2019t he", "question_id": "102", "isRight": "0" }, { "id": "381", "title": "is he", "question_id": "102", "isRight": "1" }, { "id": "382", "title": "isn\u2019t he", "question_id": "102", "isRight": "0" }] }, { "question": { "id": "137", "title": "Your leg could be broken so you must have ____ X-ray.", "level": "hard", "mark": null }, "answers": [{ "id": "519", "title": "a", "question_id": "137", "isRight": "0" }, { "id": "520", "title": "an", "question_id": "137", "isRight": "1" }, { "id": "521", "title": "the", "question_id": "137", "isRight": "0" }, { "id": "522", "title": "?", "question_id": "137", "isRight": "0" }] }, { "question": { "id": "109", "title": "My new PC, ____ I bought last week, has already broken down.", "level": "hard", "mark": null }, "answers": [{ "id": "407", "title": "that", "question_id": "109", "isRight": "0" }, { "id": "408", "title": "which", "question_id": "109", "isRight": "1" }, { "id": "409", "title": "whose", "question_id": "109", "isRight": "0" }, { "id": "410", "title": "?", "question_id": "109", "isRight": "0" }] }, { "question": { "id": "59", "title": "There ____ milk for my breakfast.", "level": "medium", "mark": null }, "answers": [{ "id": "207", "title": "isn\u2019t some", "question_id": "59", "isRight": "0" }, { "id": "208", "title": "isn\u2019t any", "question_id": "59", "isRight": "1" }, { "id": "209", "title": "any", "question_id": "59", "isRight": "0" }, { "id": "210", "title": "?", "question_id": "59", "isRight": "0" }] }, { "question": { "id": "103", "title": "How long ____ you had this car?", "level": "hard", "mark": null }, "answers": [{ "id": "383", "title": "did", "question_id": "103", "isRight": "0" }, { "id": "384", "title": "do", "question_id": "103", "isRight": "0" }, { "id": "385", "title": "have", "question_id": "103", "isRight": "1" }, { "id": "386", "title": "were", "question_id": "103", "isRight": "0" }] }, { "question": { "id": "98", "title": "The house will look cleaner when you have finished the ____.", "level": "medium", "mark": null }, "answers": [{ "id": "363", "title": "home", "question_id": "98", "isRight": "0" }, { "id": "364", "title": "housewife", "question_id": "98", "isRight": "0" }, { "id": "365", "title": "housework", "question_id": "98", "isRight": "1" }, { "id": "366", "title": "homework", "question_id": "98", "isRight": "0" }] }, { "question": { "id": "131", "title": "The horror movie wasn't just frightening! It was ____ terrifying!", "level": "hard", "mark": null }, "answers": [{ "id": "495", "title": "extremely", "question_id": "131", "isRight": "0" }, { "id": "496", "title": "absolutely", "question_id": "131", "isRight": "1" }, { "id": "497", "title": "very", "question_id": "131", "isRight": "0" }, { "id": "498", "title": "fairly", "question_id": "131", "isRight": "0" }] }, { "question": { "id": "40", "title": "____ are the keys? On the table.", "level": "easy", "mark": null }, "answers": [{ "id": "131", "title": "What", "question_id": "40", "isRight": "0" }, { "id": "132", "title": "When", "question_id": "40", "isRight": "0" }, { "id": "133", "title": "Where", "question_id": "40", "isRight": "1" }, { "id": "134", "title": "Who", "question_id": "40", "isRight": "0" }] }, { "question": { "id": "34", "title": "My name's Pete and this is Sylvia. ____ doctors from France.", "level": "easy", "mark": null }, "answers": [{ "id": "107", "title": "I'm", "question_id": "34", "isRight": "0" }, { "id": "108", "title": "We're", "question_id": "34", "isRight": "1" }, { "id": "109", "title": "She's", "question_id": "34", "isRight": "0" }, { "id": "110", "title": "They're", "question_id": "34", "isRight": "0" }] }, { "question": { "id": "108", "title": "At first I ____ starting work so early but this has changed.", "level": "hard", "mark": null }, "answers": [{ "id": "403", "title": "didn't use to", "question_id": "108", "isRight": "0" }, { "id": "404", "title": "wouldn't", "question_id": "108", "isRight": "0" }, { "id": "405", "title": "didn't have to", "question_id": "108", "isRight": "0" }, { "id": "406", "title": "wasn't used to", "question_id": "108", "isRight": "1" }] }, { "question": { "id": "147", "title": "During his stay in Indonesia he went ____ with malaria.", "level": "hard", "mark": null }, "answers": [{ "id": "559", "title": "up", "question_id": "147", "isRight": "0" }, { "id": "560", "title": "off", "question_id": "147", "isRight": "0" }, { "id": "561", "title": "down", "question_id": "147", "isRight": "1" }, { "id": "562", "title": "over", "question_id": "147", "isRight": "0" }] }, { "question": { "id": "145", "title": "She ____ the sack last week and is now looking for a new job.", "level": "hard", "mark": null }, "answers": [{ "id": "551", "title": "did", "question_id": "145", "isRight": "0" }, { "id": "552", "title": "made", "question_id": "145", "isRight": "0" }, { "id": "553", "title": "took", "question_id": "145", "isRight": "0" }, { "id": "554", "title": "got", "question_id": "145", "isRight": "1" }] }, { "question": { "id": "32", "title": "I'd like ____ omelette, please.", "level": "easy", "mark": null }, "answers": [{ "id": "100", "title": "a ", "question_id": "32", "isRight": "0" }, { "id": "101", "title": "an", "question_id": "32", "isRight": "1" }, { "id": "102", "title": "two", "question_id": "32", "isRight": "0" }] }, { "question": { "id": "99", "title": "Stress is not an illness, but it can ___ to many illnesses.", "level": "medium", "mark": null }, "answers": [{ "id": "367", "title": "get", "question_id": "99", "isRight": "0" }, { "id": "368", "title": "celebrate", "question_id": "99", "isRight": "0" }, { "id": "369", "title": "contribute", "question_id": "99", "isRight": "1" }, { "id": "370", "title": "affect", "question_id": "99", "isRight": "0" }] }, { "question": { "id": "101", "title": "She ____ obsessed with rock climbing at a young age.", "level": "hard", "mark": null }, "answers": [{ "id": "375", "title": "becomes", "question_id": "101", "isRight": "0" }, { "id": "376", "title": "became", "question_id": "101", "isRight": "1" }, { "id": "377", "title": "has become", "question_id": "101", "isRight": "0" }, { "id": "378", "title": "would become", "question_id": "101", "isRight": "0" }] }, { "question": { "id": "1", "title": "We were all very _________________ when we saw her new boyfriend.", "level": "easy", "mark": null }, "answers": [{ "id": "1", "title": "surprised", "question_id": "1", "isRight": "1" }, { "id": "2", "title": "surprising", "question_id": "1", "isRight": "0" }, { "id": "3", "title": "surprise", "question_id": "1", "isRight": "0" }] }, { "question": { "id": "66", "title": "I ____ to Peru on holiday next month.", "level": "medium", "mark": null }, "answers": [{ "id": "235", "title": "am flying", "question_id": "66", "isRight": "1" }, { "id": "236", "title": "flying", "question_id": "66", "isRight": "0" }, { "id": "237", "title": "am go flying", "question_id": "66", "isRight": "0" }, { "id": "238", "title": "will flying", "question_id": "66", "isRight": "0" }] }, { "question": { "id": "148", "title": "When the customs officers found some illegal goods hidden in the car, he was arrested for ____.", "level": "hard", "mark": null }, "answers": [{ "id": "563", "title": "assault", "question_id": "148", "isRight": "0" }, { "id": "564", "title": "mugging", "question_id": "148", "isRight": "0" }, { "id": "565", "title": "hijacking", "question_id": "148", "isRight": "0" }, { "id": "566", "title": "smuggling", "question_id": "148", "isRight": "1" }] }, { "question": { "id": "63", "title": "More and more people ____ divorced every year.", "level": "medium", "mark": null }, "answers": [{ "id": "223", "title": "are wanting", "question_id": "63", "isRight": "0" }, { "id": "224", "title": "wanting", "question_id": "63", "isRight": "0" }, { "id": "225", "title": "getting", "question_id": "63", "isRight": "0" }, { "id": "226", "title": "are getting", "question_id": "63", "isRight": "1" }] }, { "question": { "id": "138", "title": "The square was ____ crowded we couldn't pass.", "level": "hard", "mark": null }, "answers": [{ "id": "523", "title": "so", "question_id": "138", "isRight": "1" }, { "id": "524", "title": "such", "question_id": "138", "isRight": "0" }, { "id": "525", "title": "very", "question_id": "138", "isRight": "0" }, { "id": "526", "title": "as", "question_id": "138", "isRight": "0" }] }, { "question": { "id": "135", "title": "She advised him ______ sun cream.", "level": "hard", "mark": null }, "answers": [{ "id": "511", "title": "putting", "question_id": "135", "isRight": "0" }, { "id": "512", "title": "put on", "question_id": "135", "isRight": "0" }, { "id": "513", "title": "to putting on", "question_id": "135", "isRight": "0" }, { "id": "514", "title": "to put on", "question_id": "135", "isRight": "1" }] }, { "question": { "id": "50", "title": "I'm afraid it's ____.", "level": "easy", "mark": null }, "answers": [{ "id": "171", "title": "a hotel expensive", "question_id": "50", "isRight": "0" }, { "id": "172", "title": "expensive hotel", "question_id": "50", "isRight": "0" }, { "id": "173", "title": "expensive a hotel", "question_id": "50", "isRight": "0" }, { "id": "174", "title": "an expensive hotel", "question_id": "50", "isRight": "1" }] }, { "question": { "id": "4", "title": "Could you buy _________________ bread on the way home?", "level": "easy", "mark": null }, "answers": [{ "id": "10", "title": "a", "question_id": "4", "isRight": "0" }, { "id": "11", "title": "any", "question_id": "4", "isRight": "0" }, { "id": "12", "title": "some", "question_id": "4", "isRight": "1" }] }, { "question": { "id": "105", "title": "He ____ about birds. It drives me mad!", "level": "hard", "mark": null }, "answers": [{ "id": "391", "title": "forever talk", "question_id": "105", "isRight": "0" }, { "id": "392", "title": "is forever talking", "question_id": "105", "isRight": "1" }, { "id": "393", "title": "will forever be talking", "question_id": "105", "isRight": "0" }, { "id": "394", "title": "has forever been talking", "question_id": "105", "isRight": "0" }] }, { "question": { "id": "2", "title": "Don't give the waiter a _________________. The service was very slow.", "level": "easy", "mark": null }, "answers": [{ "id": "4", "title": "bill", "question_id": "2", "isRight": "0" }, { "id": "5", "title": "money", "question_id": "2", "isRight": "0" }, { "id": "6", "title": "tip", "question_id": "2", "isRight": "1" }] }, { "question": { "id": "141", "title": "I only paid ?20 for this jacket! It was a real ____.", "level": "hard", "mark": null }, "answers": [{ "id": "535", "title": "buy", "question_id": "141", "isRight": "0" }, { "id": "536", "title": "price", "question_id": "141", "isRight": "0" }, { "id": "537", "title": "bargain", "question_id": "141", "isRight": "1" }, { "id": "538", "title": "sale", "question_id": "141", "isRight": "0" }] }, { "question": { "id": "127", "title": "I can't find my keys. I ____ them.", "level": "hard", "mark": null }, "answers": [{ "id": "479", "title": "may lose", "question_id": "127", "isRight": "0" }, { "id": "480", "title": "must lost", "question_id": "127", "isRight": "0" }, { "id": "481", "title": "might have lost", "question_id": "127", "isRight": "1" }, { "id": "482", "title": "should have lost", "question_id": "127", "isRight": "0" }] }, { "question": { "id": "64", "title": "Many, but not all, people ____ get married in a church.", "level": "medium", "mark": null }, "answers": [{ "id": "227", "title": "want to", "question_id": "64", "isRight": "1" }, { "id": "228", "title": "are wanting to", "question_id": "64", "isRight": "0" }, { "id": "229", "title": "wanting to", "question_id": "64", "isRight": "0" }, { "id": "230", "title": "used to want", "question_id": "64", "isRight": "0" }] }, { "question": { "id": "120", "title": "You won't pass the exam ____ you start revising immediately.", "level": "hard", "mark": null }, "answers": [{ "id": "451", "title": "as long as", "question_id": "120", "isRight": "0" }, { "id": "452", "title": "provided", "question_id": "120", "isRight": "0" }, { "id": "453", "title": "unless", "question_id": "120", "isRight": "1" }, { "id": "454", "title": "if", "question_id": "120", "isRight": "0" }] }, { "question": { "id": "146", "title": "She doesn't ____ of my decision.", "level": "hard", "mark": null }, "answers": [{ "id": "555", "title": "agree", "question_id": "146", "isRight": "0" }, { "id": "556", "title": "approve", "question_id": "146", "isRight": "1" }, { "id": "557", "title": "accept", "question_id": "146", "isRight": "0" }, { "id": "558", "title": "support", "question_id": "146", "isRight": "0" }] }, { "question": { "id": "28", "title": "____? I'm from Italy.", "level": "easy", "mark": null }, "answers": [{ "id": "84", "title": "Where are you from?", "question_id": "28", "isRight": "1" }, { "id": "85", "title": "Where you are from?", "question_id": "28", "isRight": "0" }, { "id": "86", "title": "Where from you are?", "question_id": "28", "isRight": "0" }, { "id": "87", "title": "From where you are?", "question_id": "28", "isRight": "0" }] }, { "question": { "id": "55", "title": "He ____ to go home.", "level": "medium", "mark": null }, "answers": [{ "id": "191", "title": "want", "question_id": "55", "isRight": "0" }, { "id": "192", "title": "did", "question_id": "55", "isRight": "0" }, { "id": "193", "title": "didn\u2019t want", "question_id": "55", "isRight": "0" }, { "id": "194", "title": "didn\u2019t wanted", "question_id": "55", "isRight": "1" }] }, { "question": { "id": "43", "title": "Stephen ____ in our company.", "level": "easy", "mark": null }, "answers": [{ "id": "143", "title": "work", "question_id": "43", "isRight": "0" }, { "id": "144", "title": "works", "question_id": "43", "isRight": "1" }, { "id": "145", "title": "is work", "question_id": "43", "isRight": "0" }, { "id": "146", "title": "working", "question_id": "43", "isRight": "0" }] }, { "question": { "id": "8", "title": "She is really _________________ on ballet.", "level": "easy", "mark": null }, "answers": [{ "id": "22", "title": "keen", "question_id": "8", "isRight": "1" }, { "id": "23", "title": "fond", "question_id": "8", "isRight": "0" }, { "id": "24", "title": "interested", "question_id": "8", "isRight": "0" }] }, { "question": { "id": "23", "title": "I'm sure the book _________________ into Polish soon.", "level": "easy", "mark": null }, "answers": [{ "id": "67", "title": "will be translated", "question_id": "23", "isRight": "1" }, { "id": "68", "title": "will translate", "question_id": "23", "isRight": "0" }, { "id": "69", "title": "was translated", "question_id": "23", "isRight": "0" }] }, { "question": { "id": "10", "title": "This is not my car. It's my _________________ ; they bought it last week.", "level": "easy", "mark": null }, "answers": [{ "id": "28", "title": "parents\u2019", "question_id": "10", "isRight": "1" }, { "id": "29", "title": "parents", "question_id": "10", "isRight": "0" }, { "id": "30", "title": "parent\u2019s", "question_id": "10", "isRight": "0" }] }, { "question": { "id": "117", "title": "We couldn't fall asleep because our neighbours ____ a lot of noise.", "level": "hard", "mark": null }, "answers": [{ "id": "439", "title": "made", "question_id": "117", "isRight": "0" }, { "id": "440", "title": "had made", "question_id": "117", "isRight": "0" }, { "id": "441", "title": "have made", "question_id": "117", "isRight": "0" }, { "id": "442", "title": "were making", "question_id": "117", "isRight": "1" }] }, { "question": { "id": "27", "title": "This is Lucy and her brother, Dan. ____ my friends", "level": "easy", "mark": null }, "answers": [{ "id": "80", "title": "We're", "question_id": "27", "isRight": "0" }, { "id": "81", "title": "I'm", "question_id": "27", "isRight": "0" }, { "id": "82", "title": "You're", "question_id": "27", "isRight": "0" }, { "id": "83", "title": "They're", "question_id": "27", "isRight": "1" }] }, { "question": { "id": "13", "title": "I've lent him some money. He must _________________ by next Saturday.", "level": "easy", "mark": null }, "answers": [{ "id": "37", "title": "pay back it", "question_id": "13", "isRight": "0" }, { "id": "38", "title": "pay it back", "question_id": "13", "isRight": "1" }, { "id": "39", "title": "pay it back me", "question_id": "13", "isRight": "0" }] }, { "question": { "id": "92", "title": "There was a nice meal and a band at the wedding ____", "level": "medium", "mark": null }, "answers": [{ "id": "339", "title": "ceremony", "question_id": "92", "isRight": "0" }, { "id": "340", "title": "reception", "question_id": "92", "isRight": "1" }, { "id": "341", "title": "speech", "question_id": "92", "isRight": "0" }, { "id": "342", "title": "group", "question_id": "92", "isRight": "0" }] }, { "question": { "id": "71", "title": "This restaurant is ____ the one over there.", "level": "medium", "mark": null }, "answers": [{ "id": "255", "title": "traditional", "question_id": "71", "isRight": "0" }, { "id": "256", "title": "traditionaler", "question_id": "71", "isRight": "0" }, { "id": "257", "title": "more traditional than", "question_id": "71", "isRight": "1" }, { "id": "258", "title": "traditionaler than", "question_id": "71", "isRight": "0" }] }, { "question": { "id": "39", "title": "Your bag is next ____ the table.", "level": "easy", "mark": null }, "answers": [{ "id": "127", "title": "on", "question_id": "39", "isRight": "0" }, { "id": "128", "title": "to", "question_id": "39", "isRight": "1" }, { "id": "129", "title": "in", "question_id": "39", "isRight": "0" }, { "id": "130", "title": "of", "question_id": "39", "isRight": "0" }] }, { "question": { "id": "116", "title": "He realized that he ____ his car keys in the office.", "level": "hard", "mark": null }, "answers": [{ "id": "435", "title": "left", "question_id": "116", "isRight": "0" }, { "id": "436", "title": "has left", "question_id": "116", "isRight": "0" }, { "id": "437", "title": "had left", "question_id": "116", "isRight": "1" }, { "id": "438", "title": "was leaving", "question_id": "116", "isRight": "0" }] }, { "question": { "id": "67", "title": "Oh! It ____. I'll take an umbrella with me.", "level": "medium", "mark": null }, "answers": [{ "id": "239", "title": "raining", "question_id": "67", "isRight": "0" }, { "id": "240", "title": "will raining", "question_id": "67", "isRight": "0" }, { "id": "241", "title": "rains", "question_id": "67", "isRight": "0" }, { "id": "242", "title": "\u2019s raining", "question_id": "67", "isRight": "1" }] }, { "question": { "id": "61", "title": "There are __________ French speakers in Montreal.", "level": "medium", "mark": null }, "answers": [{ "id": "215", "title": "too much", "question_id": "61", "isRight": "0" }, { "id": "216", "title": "a lot of", "question_id": "61", "isRight": "1" }, { "id": "217", "title": "a little", "question_id": "61", "isRight": "0" }, { "id": "218", "title": "not much", "question_id": "61", "isRight": "0" }] }, { "question": { "id": "35", "title": "Sorry, ____ Paul. My name's Eric.\t", "level": "easy", "mark": null }, "answers": [{ "id": "111", "title": "I isn't", "question_id": "35", "isRight": "0" }, { "id": "112", "title": "I is not", "question_id": "35", "isRight": "0" }, { "id": "113", "title": "I aren't", "question_id": "35", "isRight": "0" }, { "id": "114", "title": "I'm not", "question_id": "35", "isRight": "1" }] }, { "question": { "id": "133", "title": "We should remind _____ to be thankful for all that we have.", "level": "hard", "mark": null }, "answers": [{ "id": "503", "title": "us", "question_id": "133", "isRight": "0" }, { "id": "504", "title": "?", "question_id": "133", "isRight": "0" }, { "id": "505", "title": "ourselves", "question_id": "133", "isRight": "1" }, { "id": "506", "title": "we", "question_id": "133", "isRight": "0" }] }, { "question": { "id": "74", "title": "I ____ sushi.", "level": "medium", "mark": null }, "answers": [{ "id": "267", "title": "eaten", "question_id": "74", "isRight": "0" }, { "id": "268", "title": "have eat", "question_id": "74", "isRight": "0" }, { "id": "269", "title": "have ever eaten", "question_id": "74", "isRight": "0" }, { "id": "270", "title": "have never eaten", "question_id": "74", "isRight": "1" }] }, { "question": { "id": "110", "title": "I'd like to see the photos ____ you took on holiday.", "level": "hard", "mark": null }, "answers": [{ "id": "411", "title": "who", "question_id": "110", "isRight": "0" }, { "id": "412", "title": "whose", "question_id": "110", "isRight": "0" }, { "id": "413", "title": "where", "question_id": "110", "isRight": "0" }, { "id": "414", "title": "?", "question_id": "110", "isRight": "1" }] }, { "question": { "id": "58", "title": "The boy ____ cake when his mother came into the room.", "level": "medium", "mark": null }, "answers": [{ "id": "203", "title": "was eat", "question_id": "58", "isRight": "0" }, { "id": "204", "title": "eats", "question_id": "58", "isRight": "0" }, { "id": "205", "title": "was eating", "question_id": "58", "isRight": "1" }, { "id": "206", "title": "has eating", "question_id": "58", "isRight": "0" }] }, { "question": { "id": "94", "title": "Bob has had a very interesting ___ . He has had jobs in many countries and industries. ", "level": "medium", "mark": null }, "answers": [{ "id": "347", "title": "carrier", "question_id": "94", "isRight": "0" }, { "id": "348", "title": "job", "question_id": "94", "isRight": "0" }, { "id": "349", "title": "career", "question_id": "94", "isRight": "1" }, { "id": "350", "title": "work", "question_id": "94", "isRight": "0" }] }, { "question": { "id": "25", "title": "Let me _________________ what happened.", "level": "easy", "mark": null }, "answers": [{ "id": "73", "title": "to explain", "question_id": "25", "isRight": "0" }, { "id": "74", "title": "that I explain", "question_id": "25", "isRight": "0" }, { "id": "75", "title": "explain", "question_id": "25", "isRight": "1" }] }, { "question": { "id": "106", "title": "She keeps ____ her things all around the place which is so annoying.", "level": "hard", "mark": null }, "answers": [{ "id": "395", "title": "to leave", "question_id": "106", "isRight": "0" }, { "id": "396", "title": "leaves", "question_id": "106", "isRight": "0" }, { "id": "397", "title": "leave", "question_id": "106", "isRight": "0" }, { "id": "398", "title": "leaving", "question_id": "106", "isRight": "1" }] }, { "question": { "id": "6", "title": "She won the world championship _________________ she was just 18.", "level": "easy", "mark": null }, "answers": [{ "id": "16", "title": "despite", "question_id": "6", "isRight": "0" }, { "id": "17", "title": "although", "question_id": "6", "isRight": "1" }, { "id": "18", "title": "in spite", "question_id": "6", "isRight": "0" }] }]
  state.questionsData = staticData;
  const total = state.questionsData.length;
  addNumberOfQuestions(state, total)
}

//handlers
$(function () {
  handleStartQuiz();
  handleChoiceCheck();
  handleSubmitAnswers();
  handleViewResult();
})