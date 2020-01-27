//state object
var state = {
  questionsData: [],
  totalQuestions: 0,
  pageQuestions: [],
  lastRenderedQuestion: 0,
  feedbackSummary: '',
  allChecked: false,
  totalMarks: 0,
  tempMark: 0,
  startingTime: '',
  endTime: '',
  testTime: '',
  result: '',
  levelText: '',
  wrongAnswersArr: [],
  renderedWrongAnswersArr: []
}

//state modification functions
var addQuestion = function (state, requiredQuestion, requiredChoices, requiredQuestionNumber, reqStateProp) {
  let questionInfo = {
    question: requiredQuestion,
    choices: requiredChoices,
    queNumber: requiredQuestionNumber,
  }
  if (reqStateProp === 'pageQuestions') {
    state.pageQuestions.push(questionInfo);
  }
  else {
    state.renderedWrongAnswersArr.push(questionInfo);
  }
}

var addFeedbackSummary = function (feedback) {
  state.feedbackSummary = feedback;
}

var addResultMessage = function (result) {
  state.result = result;
}

var clearPageQuestions = function () {
  state.pageQuestions = []
}

var addNumberOfQuestions = function (state, total) {
  state.totalQuestions = total;
}

var addWrongAnswerObj = function (question) {
  state.wrongAnswersArr.push(question);
}

var choicesCheck = function (status) {
  state.allChecked = status;
}

var setStartEndTime = function (type) {
  if (type === 'start') {
    state.startingTime = new Date().getTime();
  }
  else {
    state.endTime = new Date().getTime();
  }
}

var setTestTime = function () {
  const endTime = state.endTime;
  const startTime = state.startingTime;
  const diff = Math.abs(endTime - startTime);
  var hours = Math.floor((diff % (1000 * 60 * 60 * 60)) / (1000 * 60 * 60));
  var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((diff % (1000 * 60)) / 1000);

  state.testTime = hours + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
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

var renderMainDetails = function (state) {
  // var perc = state.lastRenderedQuestion - 10;
  var questionsPageRender = `<div id="questions-form" class="js-question-page">
    <h2 class="js-q-header tertiary-color">English Assessment</h2>
    <div class="bar-con">
      <div class="bar-sub-con">
        <span style="width:100%; text-align: left;">Progress:</span>
        <div id="bar1" class="barfiller">
          <div class="tipWrap">
            <span class="tip"></span>
          </div>
          <span class="fill" data-percentage="0"></span>
        </div>
      </div>
    </div>

    <div class="js-questions-content">
    </div>
  </div > `
  $(".js-container").html(questionsPageRender);

}

var renderQuestion = function (state) {
  var checkLastAnswer = function () {
    return `< button type = "submit" ${state.allChecked ? "" : "disabled"} class=\"btn-test js-choice-submit-button\">Next</button>`
  }
  var checkLastAnswer = function () {
    if (state.lastRenderedQuestion >= state.totalQuestions) {
      return `<button type="submit" ${state.allChecked ? "" : "disabled"} class=\"btn-test js-choice-submit-button js-view-result\">Show Result</button>`
    }
    else {
      return `<button type="submit" ${state.allChecked ? "" : "disabled"} class=\"btn-test js-choice-submit-button\">Next</button>`
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
      "<div class=\"js-choices row\">" + item.choices +
      "</div>" +
      "</form>"
    tenQuestionsDOM += singleQuestionDOM;
  })

  var questionsRender = `
    ${tenQuestionsDOM}
    <div class="js-nav-box">
    ${checkLastAnswer()} 
    </div>`
  $(".js-questions-content").html(questionsRender);
  clearPageQuestions();
  // $('#bar1').calculateFill(state.lastRenderedQuestion - 10);

}


var renderCheck = function () {
  $(".js-nav-box").find("button").prop("disabled", state.allChecked ? false : true)
}

var renderResult = function () {
  var result = "";
  var totalMark = state.totalMarks;
  var message = "";
  var percentage = totalMark;
  const levelText = state.levelText;
  const feedbackSummary = state.feedbackSummary;

  if (totalMark >= 83.335 && totalMark <= 100) {
    message = "C2";
    ringColor = "js-excellent-result";
  }
  else if (totalMark >= 66.668 && totalMark <= 83.335) {
    message = "C1";
    ringColor = "js-excellent-result";
  }
  else if (totalMark >= 50.001 && totalMark < 66.668) {
    message = "B2";
    ringColor = "js-verygood-result"
  }
  else if (totalMark >= 33.33 && totalMark < 50.001) {
    message = "B1";
    ringColor = "js-good-result"
  }
  else if (totalMark >= 16.66 && totalMark < 33.33) {
    message = "A2";
    ringColor = "js-average-result";
  }
  else if (totalMark < 16.66 && totalMark >= 0) {
    message = "A1";
    ringColor = "js-weak-result"
  }
  addResultMessage(message);
  // ${ringColor}

  result = `<div class="js-result-page">
    <div class="js-feedback-text-con">
    <span class="js-feedback-header">نتيجتك: ${totalMark}/100</span>
    <div>
      <svg viewBox="0 0 36 36" class="result-ring english-result-ring">
      <path class="ring-bg" d="M18 2.0845
          a 15.9155 15.9155 0 0 1 0 31.831
          a 15.9155 15.9155 0 0 1 0 -31.831" />
      <path class="ring" d="M18 2.0845
      a 15.9155 15.9155 0 0 1 0 31.831
      a 15.9155 15.9155 0 0 1 0 -31.831" ; stroke-dasharray="${percentage}, 100" />
      <text x="18" y="20.35" class="js-result-message js-english-message-result">${message}</text>
      </svg>
    </div>

    <div id="steps"></div>

    <div id="result-level-text" style="text-align:center;margin: 20 0 5px">
      <p style="font-weight: 700;font-size: 1.1em;">${levelText}</p>
    </div>

    <div class="js-feedback-time-con" style="text-align:center;margin-bottom: 30px">
    <span class="js-feedback-time" style="font-size:1.15em;color: #5a5a5a;">مدة الإنهاء: ${state.testTime}</span>
    </div>
    <div class="js-feedback-summary-con">
      <div class="container">
        <div class="js-feedback-box" style="direction: rtl;
        text-align: right">
          <img class="js-feedback-img" src="../wp-content/themes/lookinmena/assets/images/test-grants2.svg" alt="Nasooh lookinmena mascot">
          <h5 class="js-feedback-summary-header">نصائح العم نصوح: </h5>
          <div class="js-feedback-summary-list" style="padding: 20px 30px">${feedbackSummary}
          </div>
        </div>
        <br>
     </div>
    </div>
    <div class="js-wrong-questions" style="text-align:center">
      <div class="container">
        <!-- panel -->
        <div class="panel-group" id="accordion-2">
            <div class="panel" style="background: transparent">
              <div class="panel-heading" style="width: 250px;
              margin: 0 auto;position: relative;
              bottom: -20px;
              z-index: 999;">
                <h4 class="panel-title"> <a style="direction:rtl;    height: 45px;
                background: var(--medium-grey-color);color:white" data-toggle="collapse"
                    href="#collapse1"
                    class="collapsed" aria-expanded="false">الأسئلة الخاطئة</a>
                </h4>
              </div>
              <div id="collapse1" class="panel-collapse collapse"
                aria-expanded="false">
                <div class="panel-body" style="background-color: #fff;
                box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.05);
                border-radius: 25px;">
                  <div class="js-wrong-questions-content"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>`
  // <button class="btn-show-wrong-questions btn-test js-choice-submit-button" style="direction:rtl; width:240px">
  //    عرض الأسئلة الخاطئة <i class="fa fa-caret-down"></i>
  // </button>
  $(".js-container").html(result);
}

var renderMistakes = function () {
  let wrongQuestionsDOM = '';
  const pageQuestions = state.renderedWrongAnswersArr;
  pageQuestions.forEach((item, index) => {
    const formId = 'q-' + (index + 1);
    let singleQuestionDOM = `<form id="${formId}" class="js-q-box">` +
      "<div class=\"js-question-text\">" +
      "<h5>" +
      "<span class=\"js-q-text\">" + item.question + "</span></h5>" +
      "</div>" +
      "<div class=\"js-choices js-disabled-choices row\">" + item.choices +
      "</div>" +
      "</form>"
    wrongQuestionsDOM += singleQuestionDOM;
  });
  var questionsRender = `${wrongQuestionsDOM}`;
  $(".js-wrong-questions-content").html(questionsRender);
}
// src="../wp-content/themes/lookinmena/assets/images/test-grants2.svg"
// 
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
    setStartEndTime('start');
    // var index = state.questionInfo.questionIndex;
    $('.home-container').fadeOut('medium', function () {
      // getQuestionDetails(index)
      getQuestionsDetails('pageQuestions');
      renderMainDetails(state);
      $('#bar1').barfiller();
      renderQuestion(state);
      $('.js-container').css("height", "auto");
      $([document.documentElement, document.body]).animate({
        scrollTop: 0
      }, 1000);
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
    // const numberOfQuestionsInPage = 10;
    const tenQuestionsArr = state.questionsData.slice(state.lastRenderedQuestion - 10, state.lastRenderedQuestion);

    for (let i = 1; i < tenQuestionsArr.length + 1; i++) {
      let formId = '#q-' + i;
      let serialized = $(formId).serialize();
      if (serialized === "choice=1") {
        changeTempMark(1)
      }
      else {
        let selectedChoiceId = $(formId + ' input[type=radio]:checked').attr('id');
        let wrongQuestionObj = tenQuestionsArr[i - 1];
        wrongQuestionObj.answers.forEach(choice => {
          if (choice.id === selectedChoiceId) {
            choice['isSelectedAns'] = true;
          }
          else {
            choice['isSelectedAns'] = false;
          }
        })
        addWrongAnswerObj(wrongQuestionObj)
      }
    }
    incrementTotalMark();
    getQuestionsDetails('pageQuestions');
    renderQuestion(state);

    $('.fill').attr("data-percentage", state.lastRenderedQuestion - 10);
    $('.fill').css("width", state.lastRenderedQuestion - 10 + "%");
    zeroTempMark();
    $('.js-question-text').hide().fadeIn(200);
    $('.js-choices').hide().fadeIn(400).slideDown();
    if (state.lastRenderedQuestion !== 110) {
      $([document.documentElement, document.body]).animate({
        scrollTop: $("#questions-form").offset().top
      }, 1000);
    }
    else {
      $('.js-container').css("height", "420px");
      window.scrollTo(0, 0);
    }
  })
}

function handleChoiceCheck() {
  $('.js-container').on('change', 'input', function () {
    if (!$('.js-choices:not(:has(:radio:checked))').length) {
      choicesCheck(true);
    }
    renderCheck();
    choicesCheck(false);
  });
}

function handleViewResult() {
  $(".js-container").on("click", ".js-view-result", function (event) {
    setStartEndTime('end');
    setTestTime();
    $('.js-question-page').fadeOut('slow', function () {
      generateFeedbackSummary();
      renderResult();
      $('#steps').progressbar({ steps: setResultStep() });
      getQuestionsDetails('wrongQuestions');
      renderMistakes();
      animateResult();
    })

  })
}

function setResultStep() {
  let levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  let resultLevel = state.result;
  levels.forEach((level, index) => {
    if (level === resultLevel) {
      levels[index] = '@' + level
    }
  });
  return levels
}

function handleProgressBar() {
  (function ($) {

    $.fn.barfiller = function (options) {

      var defaults = $.extend({
        barColor: '#006699',
        tooltip: false,
        duration: 1000,
        animateOnResize: false,
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

function handleResultBar() {

  (function ($) {
    $.fn.progressbar = function (options) {

      var opts = $.extend({}, options);

      return this.each(function () {
        var $this = $(this);

        var $ul = $('<ul>').attr('class', 'progressbar');

        var currentIdx = -1

        $.each(opts.steps, function (index, value) {
          var $li = $('<li>').text(value.replace('@', '').replace('~', ''));
          $li.css('width', (100 / opts.steps.length) + '%');



          if (value.indexOf('@') > -1) {
            $li.addClass('current');
            currentIdx = index;
          }

          if (value.indexOf('~') > -1) {
            $li.addClass('fail');
          }

          $ul.append($li);
        });

        for (var i = 0; i < currentIdx; i++) {
          $($ul.find('li')[i]).addClass('done');
        }

        $this.append($ul);
      });
    };
  })(jQuery);

}

// function handleViewResult() {
//   $(".js-container").on("click", ".js-view-result", function (event) {
//     $('.js-question-page').fadeOut('slow', function () {
//       renderResult();
//       animateResult();
//     })

//   })
// }

function animateResult() {
  $(".js-feedback-header").hide()
  $(".result-ring").hide();
  $(".js-feedback-summary-con").hide();
  $(".js-feedback-img").hide();
  $(".js-feedback-time-con").hide();
  $(".js-feedback-summary-header").hide();
  $(".js-feedback-summary-list").hide();
  $("#steps").hide();
  $("#result-level-text").hide();
  $(".js-wrong-questions").hide();
  $(".js-container").animate({
    height: '300px'
  })
  $(".js-feedback-header").fadeIn(800).slideDown();
  setTimeout(() => {
    $(".result-ring").fadeIn(800);

  }, 500);
  setTimeout(() => {
    $(".js-container").animate({
      height: '700px'
    }, 2000, function () {
      $(".js-container").css("height", "auto");
    });
    $("#result-level-text").fadeIn(1000);
    $("#steps").fadeIn(1200);
    $(".js-feedback-time-con").fadeIn(2000);
    $(".js-feedback-summary-con").fadeIn(1000).slideDown(2000, function () {
      $(".js-feedback-img").fadeIn(200, function () {
        $(".js-feedback-summary-header").fadeIn(200, function () {
          $(".js-feedback-summary-list").fadeIn(500).slideDown(500);
          $(".js-wrong-questions").fadeIn(600);
        });

      });

    });

  }, 2000);
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

function getQuestionsDetails(reqStateProp) {
  let requiredStateProp = reqStateProp;
  let questionsArr = [];
  if (reqStateProp === 'pageQuestions') {
    questionsArr = state.questionsData.slice(state.lastRenderedQuestion, state.lastRenderedQuestion + 10);
  }
  else {
    questionsArr = state.wrongAnswersArr;
  }
  questionsArr.forEach((question, index) => {
    const requiredQuestion = question;
    const requiredQuestionAnswers = requiredQuestion.answers;
    const requiredQuestionTitle = requiredQuestion.question.title;
    const requiredQuestionNumber = index + 1 + state.lastRenderedQuestion;
    const requiredChoices = generateQuestionAnswersDOM(requiredQuestionAnswers, requiredStateProp);
    addQuestion(state, requiredQuestionTitle, requiredChoices, requiredQuestionNumber, requiredStateProp)
  })
  incrementLastRenderedQuestion();
}

function generateFeedbackSummary() {
  const totalMark = state.totalMarks;
  let feedbackText = '';
  if (totalMark >= 66.668 && totalMark <= 100) {
    // "excellent-result";
    state.levelText = 'مستواك متقدم'
    feedbackText = `<p>كورسات مستوى متقدم من أهم منصات التعليم الأونلاين:</p>
    <p>Coursera: <a href="https://www.coursera.org/specializations/advanced-grammar-punctuation" target="_blank">https://www.coursera.org/specializations/advanced-grammar-punctuation<br /></a>FutureLearn: <a  href="https://www.futurelearn.com/courses/english-academic-study" target="_blank">https://www.futurelearn.com/courses/english-academic-study<br /><br /></a></p>
    <p>يتيح لك موقع British Council الفرصة لتقوية مهاراتك من خلال الروابط التالية:<br /></p>
    <p>الاستماع <a href="https://learnenglish.britishcouncil.org/skills/listening/beginner-a1" target="_blank">&nbsp;من هنا</a></p>
    <p>القراءة <a href="https://learnenglish.britishcouncil.org/skills/reading/beginner-a1" target="_blank">&nbsp;من هنا</a></p>
    <p>الكتابة <a href="https://learnenglish.britishcouncil.org/skills/writing/beginner-a1" target="_blank">&nbsp;من هنا</a></p>
    <p>المحادثة <a href="https://learnenglish.britishcouncil.org/skills/speaking/a1-beginner-at-the-shop" target="_blank">&nbsp;من هنا</a></p>
    <p><br />وفي الختام نقدم لك <a href="https://lookinmena.com/%d8%a7%d9%84%d8%af%d9%84%d9%8a%d9%84-%d8%a7%d9%84%d8%b4%d8%a7%d9%85%d9%84-%d9%84%d8%aa%d8%b9%d9%84%d9%91%d9%85-%d8%a7%d9%84%d9%84%d8%ba%d8%a9-%d8%a7%d9%84%d8%a7%d9%86%d9%83%d9%84%d9%8a%d8%b2%d9%8a/" target="_blank">دليل لوك أن مين</a>ا لتعلم اللغة الانجليزية لكافة المستويات.</p>`

  }
  else if (totalMark >= 33.33 && totalMark < 66.668) {
    // "good-result"
    state.levelText = 'مستواك متوسط/ جيد';
    feedbackText = `<p>ثلاث كورسات مستوى متوسط/ جيد من أهم منصات التعليم الأونلاين:</p>
    <p>edX: <a href="https://www.edx.org/course/upper-intermediate-english-business" target="_blank"> https://www.edx.org/course/upper-intermediate-english-business</a></p>
    <p>Coursera: <a href="https://www.coursera.org/specializations/intermediate-grammar" target="_blank"> https://www.coursera.org/specializations/intermediate-grammar<br /></a>FutureLearn: <a href=" https://www.futurelearn.com/courses/english-for-study-intermediate" target="_blank">https://www.futurelearn.com/courses/english-for-study-intermediate<br /><br /></a></p>
    <p>يتيح لك موقع British Council الفرصة لتقوية مهاراتك من خلال الروابط التالية:<br /></p>
    <p>الاستماع <a href="https://learnenglish.britishcouncil.org/skills/listening/beginner-a1" target="_blank">&nbsp;من هنا</a></p>
    <p>القراءة <a href="https://learnenglish.britishcouncil.org/skills/reading/beginner-a1" target="_blank">&nbsp;من هنا</a></p>
    <p>الكتابة <a href="https://learnenglish.britishcouncil.org/skills/writing/beginner-a1" target="_blank">&nbsp;من هنا</a></p>
    <p>المحادثة <a href="https://learnenglish.britishcouncil.org/skills/speaking/a1-beginner-at-the-shop" target="_blank">&nbsp;من هنا</a></p>
    <p>&nbsp;المفردات <a href="https://learnenglish.britishcouncil.org/vocabulary/beginner-to-pre-intermediate" target="_blank">&nbsp;من هنا</a>&nbsp;</p>
    <p>القواعد <a href="https://learnenglish.britishcouncil.org/grammar/beginner-to-pre-intermediate" target="_blank">&nbsp;من هنا<br /><br /></a>كما ننصحك بتقوية لغتك من خلال بعض الأمور المسلية مثل: الاستماع إلى <a href="https://learnenglish.britishcouncil.org/general-english/audio-zone" target="_blank">مقاطع صوتية</a> و <a href="https://learnenglish.britishcouncil.org/general-english/video-zone" target="_blank">مقاطع فيديو</a> وقراءة <a href="https://learnenglish.britishcouncil.org/general-english/magazine" target="_blank">المجلات</a> و<a href="https://learnenglish.britishcouncil.org/general-english/stories" target="_blank">القصص</a> و <a href="https://learnenglish.britishcouncil.org/general-english/games" target="_blank">الألعاب</a></p>
    <p><br />وفي الختام نقدم لك <a href="https://lookinmena.com/%d8%a7%d9%84%d8%af%d9%84%d9%8a%d9%84-%d8%a7%d9%84%d8%b4%d8%a7%d9%85%d9%84-%d9%84%d8%aa%d8%b9%d9%84%d9%91%d9%85-%d8%a7%d9%84%d9%84%d8%ba%d8%a9-%d8%a7%d9%84%d8%a7%d9%86%d9%83%d9%84%d9%8a%d8%b2%d9%8a/" target="_blank">دليل لوك أن مين</a>ا لتعلم اللغة الانجليزية لكافة المستويات.</p>`

  }
  else if (totalMark < 33.33 && totalMark >= 0) {
    // "weak-result"
    state.levelText = ' مستواك مبتدئ';
    feedbackText = `<p>ثلاث كورسات مستوى مبتدئ من أهم منصات التعليم الأونلاين:</p>
    <p>edX: <a href="https://www.edx.org/course/english-grammar-and-style" target="_blank">https://www.edx.org/course/english-grammar-and-style</a></p>
    <p>Coursera: <a href="https://www.coursera.org/specializations/learn-english" target="_blank">https://www.coursera.org/specializations/learn-english<br /></a>FutureLearn: <a href="https://www.futurelearn.com/courses/basic-english-elementary" target="_blank">https://www.futurelearn.com/courses/basic-english-elementary<br /><br /></a></p>
    <p>يتيح لك موقع British Council الفرصة لتقوية مهاراتك من خلال الروابط التالية:<br /></p>
    <p>الاستماع <a href="https://learnenglish.britishcouncil.org/skills/listening/beginner-a1" target="_blank">&nbsp;من هنا</a></p>
    <p>القراءة <a href="https://learnenglish.britishcouncil.org/skills/reading/beginner-a1" target="_blank">&nbsp;من هنا</a></p>
    <p>الكتابة <a href="https://learnenglish.britishcouncil.org/skills/writing/beginner-a1" target="_blank">&nbsp;من هنا</a></p>
    <p>المحادثة <a href="https://learnenglish.britishcouncil.org/skills/speaking/a1-beginner-at-the-shop" target="_blank">&nbsp;من هنا</a></p>
    <p>&nbsp;المفردات <a href="https://learnenglish.britishcouncil.org/vocabulary/beginner-to-pre-intermediate" target="_blank">&nbsp;من هنا</a>&nbsp;</p>
    <p>القواعد <a href="https://learnenglish.britishcouncil.org/grammar/beginner-to-pre-intermediate" target="_blank">&nbsp;من هنا<br /><br /></a>كما ننصحك بتقوية لغتك من خلال بعض الأمور المسلية مثل: الاستماع إلى <a href="https://learnenglish.britishcouncil.org/general-english/audio-zone" target="_blank">مقاطع صوتية</a> و <a href="https://learnenglish.britishcouncil.org/general-english/video-zone" target="_blank">مقاطع فيديو</a> وقراءة <a href="https://learnenglish.britishcouncil.org/general-english/magazine" target="_blank">المجلات</a> و<a href="https://learnenglish.britishcouncil.org/general-english/stories" target="_blank">القصص</a> و <a href="https://learnenglish.britishcouncil.org/general-english/games" target="_blank">الألعاب</a></p>
    <p><br />وفي الختام نقدم لك <a href="https://lookinmena.com/%d8%a7%d9%84%d8%af%d9%84%d9%8a%d9%84-%d8%a7%d9%84%d8%b4%d8%a7%d9%85%d9%84-%d9%84%d8%aa%d8%b9%d9%84%d9%91%d9%85-%d8%a7%d9%84%d9%84%d8%ba%d8%a9-%d8%a7%d9%84%d8%a7%d9%86%d9%83%d9%84%d9%8a%d8%b2%d9%8a/" target="_blank">دليل لوك أن مين</a>ا لتعلم اللغة الانجليزية لكافة المستويات.</p>`
  }
  addFeedbackSummary(feedbackText);
}

function generateQuestionAnswersDOM(answersArray, requiredStateProp) {
  let answersDOMArray = [];
  let labelClass = '';
  if (requiredStateProp === 'pageQuestions') {
    labelClass = 'js-enabled-choice'
  }
  else {
    labelClass = 'js-disabled-choice'
  }
  answersArray.forEach(answer => {
    let colSize = '';
    if (answersArray.length === 4) {
      colSize = 'col-md-3'
    }
    else if (answersArray.length === 3) {
      colSize = 'col-md-4'
    }
    let answerHTML = `<div class="${colSize} col-sm-12">
    <div class="js-choice ${labelClass}">
      <input class="js-radio-choice" type="radio" name="choice" id="${answer.id}" value="${answer.isRight}">
      <label class="${(requiredStateProp === 'wrongQuestions' && answer.isRight === '1') ? 'js-right-choice' : ''}
      ${(requiredStateProp === 'wrongQuestions' && answer.isSelectedAns === true) ? 'js-wrong-choice' : ''}
      " for="${answer.id}">
       ${answer.title}</label>
    </div>
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
  // var staticData = [{ "question": { "id": "87", "title": "You ____ wear a suit to work, but you can if you want.", "level": "medium", "mark": null }, "answers": [{ "id": "319", "title": "must", "question_id": "87", "isRight": "0" }, { "id": "320", "title": "mustn\u2019t", "question_id": "87", "isRight": "0" }, { "id": "321", "title": "could", "question_id": "87", "isRight": "0" }, { "id": "322", "title": "don\u2019t have to", "question_id": "87", "isRight": "1" }] }, { "question": { "id": "149", "title": "I can't move the sofa. Could you ____ me a hand with it, please?", "level": "hard", "mark": null }, "answers": [{ "id": "567", "title": "give", "question_id": "149", "isRight": "1" }, { "id": "568", "title": "get", "question_id": "149", "isRight": "0" }, { "id": "569", "title": "take", "question_id": "149", "isRight": "0" }, { "id": "570", "title": "borrow", "question_id": "149", "isRight": "0" }] }]
  var staticData = [
    {
      "question": {
        "id": "145",
        "title": "She ____ the sack last month and is now looking for a new job.",
        "level": "hard",
        "mark": null
      },
      "answers": [
        {
          "id": "552",
          "title": "made",
          "question_id": "145",
          "isRight": "0"
        },
        {
          "id": "554",
          "title": "got",
          "question_id": "145",
          "isRight": "1"
        },
        {
          "id": "553",
          "title": "took",
          "question_id": "145",
          "isRight": "0"
        },
        {
          "id": "551",
          "title": "did",
          "question_id": "145",
          "isRight": "0"
        }
      ]
    },
    {
      "question": {
        "id": "118",
        "title": "____ plans you might have for the holiday, you'll have to change them.",
        "level": "hard",
        "mark": null
      },
      "answers": [
        {
          "id": "444",
          "title": "Whovever",
          "question_id": "118",
          "isRight": "0"
        },
        {
          "id": "443",
          "title": "Wherever",
          "question_id": "118",
          "isRight": "0"
        },
        {
          "id": "445",
          "title": "Whatever",
          "question_id": "118",
          "isRight": "1"
        },
        {
          "id": "446",
          "title": "However",
          "question_id": "118",
          "isRight": "0"
        }
      ]
    },
    {
      "question": {
        "id": "195",
        "title": "What _____________ do after work today?",
        "level": "easy",
        "mark": null
      },
      "answers": [
        {
          "id": "778",
          "title": "do you",
          "question_id": "195",
          "isRight": "0"
        },
        {
          "id": "780",
          "title": "are you going to",
          "question_id": "195",
          "isRight": "1"
        },
        {
          "id": "777",
          "title": "are you",
          "question_id": "195",
          "isRight": "0"
        },
        {
          "id": "779",
          "title": "you",
          "question_id": "195",
          "isRight": "0"
        }
      ]
    },
    {
      "question": {
        "id": "70",
        "title": "The restaurant was _____ dirty. We didn\u2019t eat there.",
        "level": "medium",
        "mark": null
      },
      "answers": [
        {
          "id": "253",
          "title": "bit",
          "question_id": "70",
          "isRight": "0"
        },
        {
          "id": "251",
          "title": "extreme",
          "question_id": "70",
          "isRight": "0"
        },
        {
          "id": "252",
          "title": "extremely",
          "question_id": "70",
          "isRight": "1"
        },
        {
          "id": "254",
          "title": "very much",
          "question_id": "70",
          "isRight": "0"
        }
      ]
    },
    {
      "question": {
        "id": "156",
        "title": "I have a cheese _____________ in the evening.",
        "level": "easy",
        "mark": null
      },
      "answers": [
        {
          "id": "623",
          "title": "cars",
          "question_id": "156",
          "isRight": "0"
        },
        {
          "id": "622",
          "title": "houses",
          "question_id": "156",
          "isRight": "0"
        },
        {
          "id": "624",
          "title": "sandwich",
          "question_id": "156",
          "isRight": "1"
        },
        {
          "id": "621",
          "title": "bags",
          "question_id": "156",
          "isRight": "0"
        }
      ]
    },
    {
      "question": {
        "id": "298",
        "title": "It was a huge _____________ to hear that his mother was seriously ill.",
        "level": "hard",
        "mark": null
      },
      "answers": [
        {
          "id": "1191",
          "title": "adversity",
          "question_id": "298",
          "isRight": "0"
        },
        {
          "id": "1192",
          "title": "get over",
          "question_id": "298",
          "isRight": "0"
        },
        {
          "id": "1190",
          "title": "blow",
          "question_id": "298",
          "isRight": "1"
        },
        {
          "id": "1189",
          "title": "benefit",
          "question_id": "298",
          "isRight": "0"
        }
      ]
    },
    {
      "question": {
        "id": "205",
        "title": "All of the sandwiches _____________ .",
        "level": "medium",
        "mark": null
      },
      "answers": [
        {
          "id": "818",
          "title": "are eating",
          "question_id": "205",
          "isRight": "0"
        },
        {
          "id": "819",
          "title": "were eating",
          "question_id": "205",
          "isRight": "0"
        },
        {
          "id": "817",
          "title": "were eaten",
          "question_id": "205",
          "isRight": "1"
        },
        {
          "id": "820",
          "title": "have eaten",
          "question_id": "205",
          "isRight": "0"
        }
      ]
    },
    {
      "question": {
        "id": "135",
        "title": "She advised him ______ sunblocker.",
        "level": "hard",
        "mark": null
      },
      "answers": [
        {
          "id": "512",
          "title": "put on",
          "question_id": "135",
          "isRight": "0"
        },
        {
          "id": "513",
          "title": "to putting on",
          "question_id": "135",
          "isRight": "0"
        },
        {
          "id": "514",
          "title": "to put on",
          "question_id": "135",
          "isRight": "1"
        },
        {
          "id": "511",
          "title": "putting",
          "question_id": "135",
          "isRight": "0"
        }
      ]
    },
    {
      "question": {
        "id": "51",
        "title": "________ at work yesterday?",
        "level": "medium",
        "mark": null
      },
      "answers": [
        {
          "id": "177",
          "title": "Did you",
          "question_id": "51",
          "isRight": "0"
        },
        {
          "id": "178",
          "title": "Is you",
          "question_id": "51",
          "isRight": "0"
        },
        {
          "id": "175",
          "title": "Was you",
          "question_id": "51",
          "isRight": "0"
        },
        {
          "id": "176",
          "title": "Were you",
          "question_id": "51",
          "isRight": "1"
        }
      ]
    },
    {
      "question": {
        "id": "138",
        "title": "The street was ____ crowded we couldn't pass.",
        "level": "hard",
        "mark": null
      },
      "answers": [
        {
          "id": "525",
          "title": "very",
          "question_id": "138",
          "isRight": "0"
        },
        {
          "id": "523",
          "title": "so",
          "question_id": "138",
          "isRight": "1"
        },
        {
          "id": "526",
          "title": "as",
          "question_id": "138",
          "isRight": "0"
        },
        {
          "id": "524",
          "title": "such",
          "question_id": "138",
          "isRight": "0"
        }
      ]
    },
    {
      "question": {
        "id": "29",
        "title": "I'm from Berlin. ____ is in Germany.",
        "level": "easy",
        "mark": null
      },
      "answers": [
        {
          "id": "91",
          "title": "She",
          "question_id": "29",
          "isRight": "0"
        },
        {
          "id": "88",
          "title": "They",
          "question_id": "29",
          "isRight": "0"
        },
        {
          "id": "90",
          "title": "He",
          "question_id": "29",
          "isRight": "0"
        },
        {
          "id": "89",
          "title": "It",
          "question_id": "29",
          "isRight": "1"
        }
      ]
    },
    {
      "question": {
        "id": "69",
        "title": "I plan to ____ three weeks by the beach.",
        "level": "medium",
        "mark": null
      },
      "answers": [
        {
          "id": "247",
          "title": "bring",
          "question_id": "69",
          "isRight": "0"
        },
        {
          "id": "249",
          "title": "spending",
          "question_id": "69",
          "isRight": "0"
        },
        {
          "id": "250",
          "title": "making",
          "question_id": "69",
          "isRight": "0"
        },
        {
          "id": "248",
          "title": "spend",
          "question_id": "69",
          "isRight": "1"
        }
      ]
    },
    {
      "question": {
        "id": "278",
        "title": "High street shops are under _____________ from online businesses.",
        "level": "hard",
        "mark": null
      },
      "answers": [
        {
          "id": "1110",
          "title": "pressure",
          "question_id": "278",
          "isRight": "1"
        },
        {
          "id": "1111",
          "title": "control",
          "question_id": "278",
          "isRight": "0"
        },
        {
          "id": "1112",
          "title": "the radar",
          "question_id": "278",
          "isRight": "0"
        },
        {
          "id": "1109",
          "title": "the weather",
          "question_id": "278",
          "isRight": "0"
        }
      ]
    },
    {
      "question": {
        "id": "238",
        "title": "Wine _____________ made in Italy for thousands of years.",
        "level": "medium",
        "mark": null
      },
      "answers": [
        {
          "id": "952",
          "title": "are being",
          "question_id": "238",
          "isRight": "0"
        },
        {
          "id": "949",
          "title": "have been",
          "question_id": "238",
          "isRight": "0"
        },
        {
          "id": "951",
          "title": "has been",
          "question_id": "238",
          "isRight": "0"
        },
        {
          "id": "950",
          "title": "is being",
          "question_id": "238",
          "isRight": "0"
        }
      ]
    },
    {
      "question": {
        "id": "172",
        "title": "This building is _____________ I like it very much.",
        "level": "easy",
        "mark": null
      },
      "answers": [
        {
          "id": "685",
          "title": "fantastic",
          "question_id": "172",
          "isRight": "1"
        },
        {
          "id": "688",
          "title": "bad",
          "question_id": "172",
          "isRight": "0"
        },
        {
          "id": "686",
          "title": "awful",
          "question_id": "172",
          "isRight": "0"
        },
        {
          "id": "687",
          "title": "not good",
          "question_id": "172",
          "isRight": "0"
        }
      ]
    },
    {
      "question": {
        "id": "40",
        "title": "____ are the glasses? On the table.",
        "level": "easy",
        "mark": null
      },
      "answers": [
        {
          "id": "132",
          "title": "When",
          "question_id": "40",
          "isRight": "0"
        },
        {
          "id": "134",
          "title": "Who",
          "question_id": "40",
          "isRight": "0"
        },
        {
          "id": "133",
          "title": "Where",
          "question_id": "40",
          "isRight": "1"
        },
        {
          "id": "131",
          "title": "What",
          "question_id": "40",
          "isRight": "0"
        }
      ]
    }
  ]
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
  handleProgressBar();
  handleResultBar()
})

