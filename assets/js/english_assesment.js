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
  var checkLastAnswer = function () {
    if (state.lastRenderedQuestion >= state.totalQuestions) {
      return `<button type="submit" ${state.allChecked ? "" : "disabled"} class=\"js-choice-submit-button js-view-result\">Show Result</button>`
    }
    else {
      return `<button type="submit" ${state.allChecked ? "" : "disabled"} class=\"js-choice-submit-button\">Next</button>`
    }
  }
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
    `<div id="bar1" class="barfiller">
  <div class="tipWrap">
    <span class="tip"></span>
  </div>
  <span class="fill" data-percentage="50"></span>
</div>`+
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
      $('#bar1').barfiller();

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
    $('.js-q-box').fadeOut('fast');

    for (let i = 1; i < 11; i++) {
      let formId = '#q-' + i;
      let serialized = $(formId).serialize();
      if (serialized === "choice=1") {
        changeTempMark(1)
      }
    }
    incrementTotalMark();
    getTenQuestionsDetails();
    renderQuestion(state);
    zeroTempMark();
    $('.js-question-text').hide().fadeIn(200);
    $('.js-choices').hide().fadeIn(400).slideDown()
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

function handleProgressBar() {
  (function ($) {

    $.fn.barfiller = function (options) {

      var defaults = $.extend({
        barColor: '#40abab',
        tooltip: true,
        duration: 1000,
        animateOnResize: true,
        symbol: "%"
      }, options);


      /******************************
      Private Variables
      *******************************/

      var object = $(this);
      var settings = $.extend(defaults, options);
      var barWidth = object.width();
      var fill = object.find('.fill');
      var toolTip = object.find('.tip');
      var fillPercentage = fill.attr('data-percentage');
      var resizeTimeout;
      var transitionSupport = false;
      var transitionPrefix;

      /******************************
      Public Methods
      *******************************/

      var methods = {

        init: function () {
          return this.each(function () {
            if (methods.getTransitionSupport()) {
              transitionSupport = true;
              transitionPrefix = methods.getTransitionPrefix();
            }

            methods.appendHTML();
            methods.setEventHandlers();
            methods.initializeItems();
          });
        },

        /******************************
        Append HTML
        *******************************/

        appendHTML: function () {
          fill.css('background', settings.barColor);

          if (!settings.tooltip) {
            toolTip.css('display', 'none');
          }
          toolTip.text(fillPercentage + settings.symbol);
        },


        /******************************
        Set Event Handlers
        *******************************/
        setEventHandlers: function () {
          if (settings.animateOnResize) {
            $(window).on("resize", function (event) {
              clearTimeout(resizeTimeout);
              resizeTimeout = setTimeout(function () {
                methods.refill();
              }, 300);
            });
          }
        },

        /******************************
        Initialize
        *******************************/

        initializeItems: function () {
          var pctWidth = methods.calculateFill(fillPercentage);
          object.find('.tipWrap').css({ display: 'inline' });

          if (transitionSupport)
            methods.transitionFill(pctWidth);
          else
            methods.animateFill(pctWidth);
        },

        getTransitionSupport: function () {

          var thisBody = document.body || document.documentElement,
            thisStyle = thisBody.style;
          var support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined;
          return support;
        },

        getTransitionPrefix: function () {
          if (/mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase())) {
            return '-moz-transition';
          }
          if (/webkit/.test(navigator.userAgent.toLowerCase())) {
            return '-webkit-transition';
          }
          if (/opera/.test(navigator.userAgent.toLowerCase())) {
            return '-o-transition';
          }
          if (/msie/.test(navigator.userAgent.toLowerCase())) {
            return '-ms-transition';
          }
          else {
            return 'transition';
          }
        },

        getTransition: function (val, time, type) {

          var CSSObj;
          if (type === 'width') {
            CSSObj = { width: val };
          }
          else if (type === 'left') {
            CSSObj = { left: val };
          }

          time = time / 1000;
          CSSObj[transitionPrefix] = type + ' ' + time + 's ease-in-out';
          return CSSObj;

        },

        refill: function () {
          fill.css('width', 0);
          toolTip.css('left', 0);
          barWidth = object.width();
          methods.initializeItems();
        },

        calculateFill: function (percentage) {
          percentage = percentage * 0.01;
          var finalWidth = barWidth * percentage;
          return finalWidth;
        },

        transitionFill: function (barWidth) {

          var toolTipOffset = barWidth - toolTip.width();
          fill.css(methods.getTransition(barWidth, settings.duration, 'width'));
          toolTip.css(methods.getTransition(toolTipOffset, settings.duration, 'left'));

        },

        animateFill: function (barWidth) {
          var toolTipOffset = barWidth - toolTip.width();
          fill.stop().animate({ width: '+=' + barWidth }, settings.duration);
          toolTip.stop().animate({ left: '+=' + toolTipOffset }, settings.duration);
        }

      };

      if (methods[options]) { 	// $("#element").pluginName('methodName', 'arg1', 'arg2');
        return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof options === 'object' || !options) { 	// $("#element").pluginName({ option: 1, option:2 });
        return methods.init.apply(this);
      } else {
        $.error('Method "' + method + '" does not exist in barfiller plugin!');
      }
    };

  })(jQuery);
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
  return joinedAnswers
}

function addQuestionToQuestionsArray(index, reqQuestionTxt, reqQuestionChoices) {
  questionText.splice(index, 0, reqQuestionTxt);
  questionChoices.splice(index, 0, reqQuestionChoices);
}

// Questions Repo
function get_data() {
  // var data = JSON.parse(globalData);
  var staticData = [{ "question": { "id": "54", "title": "____ do you have dinner?", "level": "medium", "mark": null }, "answers": [{ "id": "187", "title": "When time", "question_id": "54", "isRight": "0" }, { "id": "188", "title": "What time", "question_id": "54", "isRight": "1" }, { "id": "189", "title": "What kind of", "question_id": "54", "isRight": "0" }, { "id": "190", "title": "What for", "question_id": "54", "isRight": "0" }] }, { "question": { "id": "118", "title": "____ plans you might have for the weekend, you'll have to change them.", "level": "hard", "mark": null }, "answers": [{ "id": "443", "title": "Wherever", "question_id": "118", "isRight": "0" }, { "id": "444", "title": "Whovever", "question_id": "118", "isRight": "0" }, { "id": "445", "title": "Whatever", "question_id": "118", "isRight": "1" }, { "id": "446", "title": "However", "question_id": "118", "isRight": "0" }] }, { "question": { "id": "122", "title": "The party was so boring I wish I ____ there at all.", "level": "hard", "mark": null }, "answers": [{ "id": "459", "title": "hadn't gone", "question_id": "122", "isRight": "1" }, { "id": "460", "title": "wouldn't go", "question_id": "122", "isRight": "0" }, { "id": "461", "title": "haven't gone", "question_id": "122", "isRight": "0" }, { "id": "462", "title": "didn't go", "question_id": "122", "isRight": "0" }] }, { "question": { "id": "15", "title": "I didn't know you wanted _________________ Robert to your party.", "level": "easy", "mark": null }, "answers": [{ "id": "43", "title": "that I invite", "question_id": "15", "isRight": "0" }, { "id": "44", "title": "me to invite", "question_id": "15", "isRight": "1" }, { "id": "45", "title": "that I invited", "question_id": "15", "isRight": "0" }] }, { "question": { "id": "83", "title": "Her horse is lovely. She _____ it since she was a teenager.", "level": "medium", "mark": null }, "answers": [{ "id": "303", "title": "had", "question_id": "83", "isRight": "0" }, { "id": "304", "title": "has had", "question_id": "83", "isRight": "1" }, { "id": "305", "title": "had", "question_id": "83", "isRight": "0" }, { "id": "306", "title": "is had", "question_id": "83", "isRight": "0" }] }, { "question": { "id": "87", "title": "You ____ wear a suit to work, but you can if you want.", "level": "medium", "mark": null }, "answers": [{ "id": "319", "title": "must", "question_id": "87", "isRight": "0" }, { "id": "320", "title": "mustn\u2019t", "question_id": "87", "isRight": "0" }, { "id": "321", "title": "could", "question_id": "87", "isRight": "0" }, { "id": "322", "title": "don\u2019t have to", "question_id": "87", "isRight": "1" }] }, { "question": { "id": "149", "title": "I can't move the sofa. Could you ____ me a hand with it, please?", "level": "hard", "mark": null }, "answers": [{ "id": "567", "title": "give", "question_id": "149", "isRight": "1" }, { "id": "568", "title": "get", "question_id": "149", "isRight": "0" }, { "id": "569", "title": "take", "question_id": "149", "isRight": "0" }, { "id": "570", "title": "borrow", "question_id": "149", "isRight": "0" }] }, { "question": { "id": "46", "title": "When do you play tennis? ____ Mondays.", "level": "easy", "mark": null }, "answers": [{ "id": "155", "title": "On", "question_id": "46", "isRight": "1" }, { "id": "156", "title": "In", "question_id": "46", "isRight": "0" }, { "id": "157", "title": "At", "question_id": "46", "isRight": "0" }, { "id": "158", "title": "By", "question_id": "46", "isRight": "0" }] }, { "question": { "id": "48", "title": "____ two airports in the city.", "level": "easy", "mark": null }, "answers": [{ "id": "163", "title": "It is", "question_id": "48", "isRight": "0" }, { "id": "164", "title": "There is", "question_id": "48", "isRight": "0" }, { "id": "165", "title": "There are", "question_id": "48", "isRight": "1" }, { "id": "166", "title": "This is", "question_id": "48", "isRight": "0" }] }, { "question": { "id": "9", "title": "You _________________ write the report today. The deadline is May 26th", "level": "easy", "mark": null }, "answers": [{ "id": "25", "title": "mustn\u2019t", "question_id": "9", "isRight": "0" }, { "id": "26", "title": "haven\u2019t to", "question_id": "9", "isRight": "0" }, { "id": "27", "title": "don\u2019t have to", "question_id": "9", "isRight": "1" }] }, { "question": { "id": "69", "title": "I plan to ____ two weeks by the beach.", "level": "medium", "mark": null }, "answers": [{ "id": "247", "title": "bring", "question_id": "69", "isRight": "0" }, { "id": "248", "title": "spend", "question_id": "69", "isRight": "1" }, { "id": "249", "title": "spending", "question_id": "69", "isRight": "0" }, { "id": "250", "title": "making", "question_id": "69", "isRight": "0" }] }, { "question": { "id": "24", "title": "They've had this house _________________ twenty years", "level": "easy", "mark": null }, "answers": [{ "id": "70", "title": "from", "question_id": "24", "isRight": "0" }, { "id": "71", "title": "for", "question_id": "24", "isRight": "1" }, { "id": "72", "title": "since", "question_id": "24", "isRight": "0" }] }, { "question": { "id": "77", "title": "In the future there ____ cures to the world's worst diseases.", "level": "medium", "mark": null }, "answers": [{ "id": "279", "title": "might be", "question_id": "77", "isRight": "1" }, { "id": "280", "title": "is going to being", "question_id": "77", "isRight": "0" }, { "id": "281", "title": "will being", "question_id": "77", "isRight": "0" }, { "id": "282", "title": "might have", "question_id": "77", "isRight": "0" }] }, { "question": { "id": "140", "title": "I'll need to have the stairs ____.", "level": "hard", "mark": null }, "answers": [{ "id": "531", "title": "renovate", "question_id": "140", "isRight": "0" }, { "id": "532", "title": "renovating", "question_id": "140", "isRight": "0" }, { "id": "533", "title": "to renovate", "question_id": "140", "isRight": "0" }, { "id": "534", "title": "renovated", "question_id": "140", "isRight": "1" }] }, { "question": { "id": "78", "title": "The space tourists ___ certainly need to be very fit.", "level": "medium", "mark": null }, "answers": [{ "id": "283", "title": "won\u2019t", "question_id": "78", "isRight": "0" }, { "id": "284", "title": "will", "question_id": "78", "isRight": "1" }, { "id": "285", "title": "?", "question_id": "78", "isRight": "0" }, { "id": "286", "title": "going to", "question_id": "78", "isRight": "0" }] }, { "question": { "id": "76", "title": "I don't think you ____ them.", "level": "medium", "mark": null }, "answers": [{ "id": "275", "title": "should to email", "question_id": "76", "isRight": "0" }, { "id": "276", "title": "should email", "question_id": "76", "isRight": "1" }, { "id": "277", "title": "should emailing", "question_id": "76", "isRight": "0" }, { "id": "278", "title": "?", "question_id": "76", "isRight": "0" }] }, { "question": { "id": "54", "title": "____ do you have dinner?", "level": "medium", "mark": null }, "answers": [{ "id": "187", "title": "When time", "question_id": "54", "isRight": "0" }, { "id": "188", "title": "What time", "question_id": "54", "isRight": "1" }, { "id": "189", "title": "What kind of", "question_id": "54", "isRight": "0" }, { "id": "190", "title": "What for", "question_id": "54", "isRight": "0" }] }, { "question": { "id": "118", "title": "____ plans you might have for the weekend, you'll have to change them.", "level": "hard", "mark": null }, "answers": [{ "id": "443", "title": "Wherever", "question_id": "118", "isRight": "0" }, { "id": "444", "title": "Whovever", "question_id": "118", "isRight": "0" }, { "id": "445", "title": "Whatever", "question_id": "118", "isRight": "1" }, { "id": "446", "title": "However", "question_id": "118", "isRight": "0" }] }, { "question": { "id": "122", "title": "The party was so boring I wish I ____ there at all.", "level": "hard", "mark": null }, "answers": [{ "id": "459", "title": "hadn't gone", "question_id": "122", "isRight": "1" }, { "id": "460", "title": "wouldn't go", "question_id": "122", "isRight": "0" }, { "id": "461", "title": "haven't gone", "question_id": "122", "isRight": "0" }, { "id": "462", "title": "didn't go", "question_id": "122", "isRight": "0" }] }, { "question": { "id": "15", "title": "I didn't know you wanted _________________ Robert to your party.", "level": "easy", "mark": null }, "answers": [{ "id": "43", "title": "that I invite", "question_id": "15", "isRight": "0" }, { "id": "44", "title": "me to invite", "question_id": "15", "isRight": "1" }, { "id": "45", "title": "that I invited", "question_id": "15", "isRight": "0" }] }, { "question": { "id": "83", "title": "Her horse is lovely. She _____ it since she was a teenager.", "level": "medium", "mark": null }, "answers": [{ "id": "303", "title": "had", "question_id": "83", "isRight": "0" }, { "id": "304", "title": "has had", "question_id": "83", "isRight": "1" }, { "id": "305", "title": "had", "question_id": "83", "isRight": "0" }, { "id": "306", "title": "is had", "question_id": "83", "isRight": "0" }] }, { "question": { "id": "87", "title": "You ____ wear a suit to work, but you can if you want.", "level": "medium", "mark": null }, "answers": [{ "id": "319", "title": "must", "question_id": "87", "isRight": "0" }, { "id": "320", "title": "mustn\u2019t", "question_id": "87", "isRight": "0" }, { "id": "321", "title": "could", "question_id": "87", "isRight": "0" }, { "id": "322", "title": "don\u2019t have to", "question_id": "87", "isRight": "1" }] }, { "question": { "id": "149", "title": "I can't move the sofa. Could you ____ me a hand with it, please?", "level": "hard", "mark": null }, "answers": [{ "id": "567", "title": "give", "question_id": "149", "isRight": "1" }, { "id": "568", "title": "get", "question_id": "149", "isRight": "0" }, { "id": "569", "title": "take", "question_id": "149", "isRight": "0" }, { "id": "570", "title": "borrow", "question_id": "149", "isRight": "0" }] }]
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
  handleProgressBar()
})

