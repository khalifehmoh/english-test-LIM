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
  testTime: ''
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

var addFeedbackSummary = function (feedback) {
  state.feedbackSummary = feedback;
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

  result = `<div class="js-result-page">
    <div class="js-feedback-text-con">
    <span class="js-feedback-header">نتيجتك: ${totalMark}/100</span>
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
    </div>
    <div class="js-feedback-time-con" style="text-align:center">
    <span class="js-feedback-time">مدة الإنهاء: ${state.testTime}</span>
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
    </div>`
    ;
  $(".js-container").html(result);
}
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
      getTenQuestionsDetails();
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

      $([document.documentElement, document.body]).animate({
        scrollTop: 0
      }, 1000);
    }
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
    setStartEndTime('end');
    setTestTime();
    $('.js-question-page').fadeOut('slow', function () {
      generateFeedbackSummary();
      renderResult();
      animateResult();
    })

  })
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
  $(".js-container").animate({
    height: '300px'
  })
  $(".js-feedback-header").fadeIn(800).slideDown();
  setTimeout(() => {
    $(".result-ring").fadeIn(800);
    $(".js-feedback-time-con").fadeIn(1200);

  }, 500);
  setTimeout(() => {
    $(".js-container").animate({
      height: '700px'
    }, 2000, function () {
      $(".js-container").css("height", "auto");
    });
    $(".js-feedback-summary-con").fadeIn(500).slideDown(1000, function () {
      $(".js-feedback-img").fadeIn(200, function () {
        $(".js-feedback-summary-header").fadeIn(200, function () {
          $(".js-feedback-summary-list").fadeIn(500).slideDown(500)
        });

      });

    });

  }, 2000);
  // $(".result-ring").hide();
  // $(".js-container").animate({
  //   height: '300px'
  // })
  // $(".js-feedback-header").fadeIn(800).slideDown();
  // setTimeout(() => {
  //   $(".result-ring").fadeIn(800);
  // }, 500);



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

function generateFeedbackSummary() {
  const totalMark = state.totalMarks;
  let feedbackText = '';
  if (totalMark >= 66.668 && totalMark <= 100) {
    // "excellent-result";
    feedbackText = `<p>إذا كان مستواك متقدم، سنقدم لك عدة نصائح لتقوية لغتك الانجليزية.</p></br>
    <p>كورسات مستوى متقدم من أهم منصات التعليم الأونلاين:</p>
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
    feedbackText = `<p>إذا كان مستواك متوسط/ جيد، سنقدم لك عدة نصائح لتقوية لغتك الانجليزية.</p></br>
    <p>ثلاث كورسات مستوى متوسط/ جيد من أهم منصات التعليم الأونلاين:</p>
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
    feedbackText = `<p>إذا كان مستواك مبتدئ، سنقدم لك عدة نصائح لتقوية لغتك الانجليزية. </p></br>
    <p>ثلاث كورسات مستوى مبتدئ من أهم منصات التعليم الأونلاين:</p>
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

function generateQuestionAnswersDOM(answersArray) {
  let answersDOMArray = [];
  answersArray.forEach(answer => {
    let colSize = '';
    if (answersArray.length === 4) {
      colSize = 'col-md-3'
    }
    else if (answersArray.length === 3) {
      colSize = 'col-md-4'
    }
    let answerHTML = `<div class="${colSize} col-sm-12">
    <div class="js-choice">
    <input class="js-radio-choice" type="radio" name="choice" id="${answer.id}" value="${answer.isRight}">
      <label for="${answer.id}">
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
  var staticData = [{ "question": { "id": "87", "title": "You ____ wear a suit to work, but you can if you want.", "level": "medium", "mark": null }, "answers": [{ "id": "319", "title": "must", "question_id": "87", "isRight": "0" }, { "id": "320", "title": "mustn\u2019t", "question_id": "87", "isRight": "0" }, { "id": "321", "title": "could", "question_id": "87", "isRight": "0" }, { "id": "322", "title": "don\u2019t have to", "question_id": "87", "isRight": "1" }] }, { "question": { "id": "149", "title": "I can't move the sofa. Could you ____ me a hand with it, please?", "level": "hard", "mark": null }, "answers": [{ "id": "567", "title": "give", "question_id": "149", "isRight": "1" }, { "id": "568", "title": "get", "question_id": "149", "isRight": "0" }, { "id": "569", "title": "take", "question_id": "149", "isRight": "0" }, { "id": "570", "title": "borrow", "question_id": "149", "isRight": "0" }] }]
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

