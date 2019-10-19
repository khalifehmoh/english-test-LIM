<?php /* Template Name: English Test*/ ?>

			
<?php get_header(); ?>
<script charset="UTF-8">
	var globalData = [];

	function get_data(){
		$.ajax({
    url: "<?php echo admin_url('admin-ajax.php'); ?>",
    data: {
      'action': 'get_questions_answers'
    },
    type: 'POST', // POST
    success: function (data) {
	  globalData = data;
	  $('.btn-english-start').prop("disabled", true);
    $('.btn-english-start').removeAttr("disabled");
	  $('.btn-english-start').html('Start')
    }
  });
	}
	window.onload = get_data()

</script>
<script type="text/javascript" charset="UTF-8" src="<?php bloginfo('template_directory'); ?>/assets/js/english_assesment.js"></script>
<style type="text/css">
			.story {
				height: auto;
			}

			.js-container {
				background: rgba(255, 255, 255, 0.75);
			}

			input[type=radio] {
				margin: -4px 0 0;
				margin-top: 1px\9;
				line-height: normal;
			}

			.js-radio-choice {
				margin-right: 10px !important;
			}

			button:hover,
			input[type="reset"]:hover,
			input[type="submit"]:hover,
			input[type="button"]:hover {
				background-color: #429393;
			}

			a {
				color: #429393;
				text-decoration: underline
			}

			body {
				background: url(../wp-content/themes/lookinmena/assets/images/back-english.png) repeat 0 0;
				animation: slide 45s linear infinite;
			}

			.home-container {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100%
			}

			.home-sub-con {
				padding: 0 25px;
			}

			.btn-asses-submit,
			.js-choice-submit-button {
				width: 150px;
				border-radius: 5px;
			}

			.js-question-page {
				align-items: flex-start;
			}

			.js-question-text {
				text-align: left;
			}

			.btn-english-start {
				width: 100%
			}

			.js-nav-box {
				width: 100%;
			}

			p {
				margin: 0px;
			}

			h1,
			h2 {
				color: #429393;
				margin-top: 25px;
				line-height: 40px;
			}

			button {
				margin-top: 50px;
			}
		</style>

		<!-- test -->

		<div class="body_view english_view">
			<!-- PAGE CONTENT -->
			<div id="page-search" ng-controller="profiles_uni_controller">
				<div class="js-container english-main-con">

					<!--home page-->
					<div class="home-container">
						<div class="home-sub-con">
							<div class="bar">
								<h1 class="home-header">English Proficiency Assesment</h1>
							</div>
							<!-- <div class="bar">
								<p> بإجابتك على بعض الأسئلة، سنساعدك على معرفة مدى قدرتك على الحصول على منحة دراسية. !
								</p>
							</div> -->
							<!-- <div class="bar">
								<p> وما هي النصائح التي يجب عليك اتباعها لزيادة فرصتك </p>
							</div> -->
							<div class="bar">
								<button type="submit" class="btn-asses-submit btn-english-start" disabled>
									<span class="questions-loading">
										<div class="lds-facebook">
											<div></div>
											<div></div>
											<div></div>
										</div>
										Please wait until we get your questions ready...
									</span>
									<!-- Start -->
								</button>

							</div>
							<!-- <span class="questions-loading">
								<div class="lds-facebook">
									<div></div>
									<div></div>
									<div></div>
								</div>
								Please wait until we get your questions ready...
							</span> -->

						</div>
					</div>
				</div>
			</div>
		</div>


	</div>
	<?php get_footer(); ?>