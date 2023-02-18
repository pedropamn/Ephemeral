let interstitial;


document.addEventListener("deviceready", async () => {
	//OneSignal
	function OneSignalInit() {
		// Uncomment to set OneSignal device logging to VERBOSE  
		// window.plugins.OneSignal.setLogLevel(6, 0);
		
		// NOTE: Update the setAppId value below with your OneSignal AppId.
		window.plugins.OneSignal.setAppId("ONESIGNALAPPID");
		window.plugins.OneSignal.setNotificationOpenedHandler(function(jsonData) {
			console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
		});
		
		//Prompts the user for notification permissions.
		//    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 6) to better communicate to your users what notifications they will get.
		window.plugins.OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
			console.log("User accepted notifications: " + accepted);
		});
	}
	
	OneSignalInit();
	
	var $ = Dom7;
	
	//Backbutton	
	document.addEventListener("backbutton", onBackKeyDown, false);

	function onBackKeyDown() {
		//Check what is opened to handle correct behauvior
		var currentPage = app.views.main.router.currentRoute.url;
		console.log("Current Page: "+currentPage);
		switch(currentPage){
			case '/contact/':
				console.log('contact');
				app.views.main.router.back();
				break;
			case '/mylinks/':
				console.log('mylinks');
				app.views.main.router.back();
				break;
			case '/index.html':
				console.log('home');
				//Check if popup is opened, so close it
				if($('.configs-popup').hasClass('modal-in') == true){
						app.popup.close('.configs-popup')
				}
				break;
		}
	}

	//Admob
	  interstitial = new admob.InterstitialAd({
		adUnitId: 'ca-app-pub-1111111111111111111111' //Prod
	})
	
	interstitial.load(); 
	
	
	var app = new Framework7({
	  name: 'Ephemeral', // App name
	  theme: 'md', // Automatic theme detection
	  el: '#app', // App root element


	  // App store
	  store: store,
	  // App routes
	  routes: routes,
	  panel: {
		swipe: true,
	  },
	  /*on:{
		 pageBeforeIn: function (page) {
			 
			
			
		  if(page.name == 'home'){
			var langJson = get_lang_file(localStorage.language);
			console.log(langJson);
		  }
		  
		 },
		},*/  
	});

	var appVersion = '1.0.2';

	 /***************************
		  FIRST EXECUTION
	***************************/

	//Check if its the first execution
	if(localStorage.already_did_the_fistexec != 'true'){
		
		//First exec runs here
		localStorage.already_did_the_fistexec = 'true';
		localStorage.mylinks = '[]';
		localStorage.language = 'pt-BR';
	}



	/***************************
		  INITIAL ROUTINES
	***************************/
	



	

	//Get lang json file content
	function get_lang_file(lang){
		var json;
		
		app.request({
			url: 'lang/'+lang+'.json',
			method: "POST",
			cache: false,
			async: false,
			//contentType: "application/x-www-form-urlencoded",
			dataType: "json",
			processData: true,			
			success:function (data, status, xhr){
				
				json = data;
				
				
			},
			error: function (xhr, status, message){
						
			}
			
		});	
		
		return json;
	}

	var langFileContent = get_lang_file(localStorage.language);


	//Get sessionStorage
	max_downloads = sessionStorage.max_downloads = 1;
	duration = sessionStorage.duration = '1d';
	converted_duration = sessionStorage.converted_duration = '1 '+langFileContent.DAYS;

	//Render max downloads and duration
	$('.max_downloads').html(max_downloads);
	$('.duration').html(converted_duration);

	//Get the Gauge
	var gauge = app.gauge.get('.gauge');


	//Click on Gauge trigger hidden file field
	$('.gauge').click(function(){	
		$('.input-file').click();
	})

	//Associate lang with a var
	var lang = localStorage.language;




	/***************************
			FUNCTIONS
	***************************/


	//Make id for each item
	function makeid(length) {
		var result           = '';
		var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) {
		  result += characters.charAt(Math.floor(Math.random() * 
	 charactersLength));
	   }
	   return result;
	}

	//Diff between dates
	function parseDate(str) {
		var mdy = str.split('/');
		return new Date(mdy[2], mdy[1], mdy[0]);
	}

	//Diff between dates
	function datediff(first, second) {
		// Take the difference between the dates and divide by milliseconds per day.
		// Round to nearest whole number to deal with DST.
		return Math.round((second-first)/(1000*60*60*24));
	}
	//datediff(parseDate('01/01/2022'), parseDate('03/01/2022'));


	//ISO (2022-08-07T17:00:52.268Z) to dd/mm/aaaa
	function isotodate(isoformat){
		var date = new Date(isoformat);

		return date.toLocaleDateString('pt-BR'); 'dd/mm/aaaa'
	}

	/*
	function getip(){
		var thereturn = '';
		app.request({
			url: 'https://api.ipify.org?format=text',
			method: "GET",
			cache: false,
			async: false,
			contentType: "application/x-www-form-urlencoded",
			//dataType: "json",
			processData: true,			
			success:function (data, status, xhr){
				console.log("OK");
				//console.log(data);
				console.log(status);
				console.log(xhr);			
				thereturn = data;

			},
			error: function (xhr, status, message){
				thereturn = 'failed_to_get_ip';
				console.log("Fail");
				console.log(xhr);
				console.log(status);
				console.log(message);			
			}
			
		});
				
		return thereturn;	
	}*/



	//Convert d to day, m to months. etc
	function render_text_from_carac(last_carac){	
		
		var langFileContent = get_lang_file(localStorage.language);
		
		var days = langFileContent.DAYS;
		var weeks = langFileContent.WEEKS;
		var months = langFileContent.MONTHS;
		
		
		if(last_carac == 'd'){
			return days;
		}
		else if(last_carac == 'w'){
			return weeks;
		}
		else if(last_carac == 'M'){
			return months;
		}
		else{
			return "---";
		}
	}






	/***************************
	  SUCCESS UPLOAD POPUP
	***************************/

	//Share button
	$('.share_success_upload_popup').click(function(){
		var langFileContent = get_lang_file(localStorage.language);
		
		var thelink = $('.generated_link').val();
		
		/*
		var options = {
			  message: 'This link was generated with Ephemeral App', // not supported on some apps (Facebook, Instagram)
			  subject: 'Ephemeral Link', // fi. for email
			  url: thelink,
			  chooserTitle: 'Pick an app', // Android only, you can override the default share sheet title
			  //appPackageName: 'com.apple.social.facebook', // Android only, you can provide id of the App you want to share with
			};

			var onSuccess = function(result) {
			  console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
			  console.log("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
			};

			var onError = function(msg) {
			  console.log("Sharing failed with message: " + msg);
			};

			window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);*/
			

			var jsonLangFileContent = get_lang_file(localStorage.language);	
			navigator.share({
				title: jsonLangFileContent.SHARE_LINK_TITLE,
				text: jsonLangFileContent.SHARE_LINK_TEXT,
				url: thelink
			}).then((packageNames) => {
				if (packageNames.length > 0) {
					console.log("Shared successfully with activity", packageNames[0]);
				} else {
					console.log("Share was aborted");
				}
			}).catch((err) => {
				console.error("Share failed:", err.message);
			});
	})

	//Copy button
	$('.copy_success_upload_popup').click(function(){
		var langFileContent = get_lang_file(localStorage.language);
		var thelink = $('.generated_link').val();
		
		cordova.plugins.clipboard.copy(thelink);
		console.log(thelink);
		var toastBottom = app.toast.create({
			text: langFileContent.LINK_COPIED,
			closeTimeout: 2000,
		});
		toastBottom.open();
	})


	/***************************
		   MAIN PAGE
	***************************/

	function update_texts_in_home(){
		var jsonLangFileContent = get_lang_file(localStorage.language);
		$('.intro').text(jsonLangFileContent.HOME_INTRO_MESSAGE);
		$('.file_duration_explain_p1').text(jsonLangFileContent.FILE_DURATION_EXPLAIN_P1);
		$('.file_duration_explain_p2').text(jsonLangFileContent.FILE_DURATION_EXPLAIN_P2);
		$('.file_duration_explain_p3').text(jsonLangFileContent.FILE_DURATION_EXPLAIN_P3);
		$('.mainmenu_mylinks').text(jsonLangFileContent.MY_LINKS);
		$('.mainmenu_settings').text(jsonLangFileContent.SETTINGS);
		$('.mainmenu_rate').text(jsonLangFileContent.RATE);
		$('.mainmenu_contact').text(jsonLangFileContent.CONTACT);
		$('.settingsButtonOnHomeTxt, .chip-label-settings').html('<i class="fa-solid fa-gear"></i> &nbsp'+jsonLangFileContent.SETTINGS);
		$('.settingsDurationLabel').text('🕑  '+jsonLangFileContent.DURATION);
		$('.settingsLanguageLabel').text('🗣️  '+jsonLangFileContent.LANGUAGE);
		$('.settingsDaysLabel').text(jsonLangFileContent.DAYS);
		$('.settingsWeeksLabel').text(jsonLangFileContent.WEEKS);
		$('.settingsMonthsLabel').text(jsonLangFileContent.MONTHS);
		$('.settingssavebtn').html('<i class="fa-solid fa-floppy-disk"></i> &nbsp'+jsonLangFileContent.SAVE);
		$('.cancelUploadButtonLabel').html('<i class="fa-solid fa-gear"></i> &nbsp'+jsonLangFileContent.CANCEL);
		$('.hereIsYourLinkLabel').text(jsonLangFileContent.HERE_IS_YOUR_LINK);
		$('.hereIsYourLinkSubP1').text(jsonLangFileContent.HERE_IS_YOUR_LINK_TEXT_P1);
		$('.hereIsYourLinkSubP2').text(jsonLangFileContent.HERE_IS_YOUR_LINK_TEXT_P2);
		$('.hereIsYourLinkSubP3').text(jsonLangFileContent.HERE_IS_YOUR_LINK_TEXT_P3);
		$('.success-popup-close-btn').html('<i class="fa-solid fa-x"></i> &nbsp'+jsonLangFileContent.CLOSE);
		$('.mainmenu_about').text(jsonLangFileContent.ABOUT);
		$('.mainmenu_privacy').text(jsonLangFileContent.PRIVACY);
		$('.mainmenu_terms').text(jsonLangFileContent.TERMS);
		$('.optionstxt').text(jsonLangFileContent.OPTIONS);
		$('.abouttxt').text(jsonLangFileContent.ABOUT);

	}

		
	//It will run always that we go back to home
	$(document).on('page:beforein', '.page[data-name="home"]', function (e) {	
		update_texts_in_home()
	})

	//Starting here to down: Only when first page is loaded for the first time
	update_texts_in_home()


	//When file is choosed...
	$('.input-file').on('change', function(){
		var gauge = app.gauge.get('.gauge');
		var jsonLangFileContent = get_lang_file(localStorage.language);
		var filesize = this.files[0].size / 1024 / 1024 /1024; //"In GB"
		if(filesize > 2){
			app.dialog.alert(jsonLangFileContent.MAX_FILE_SIZE_LIMIT + filesize.toFixed(2)+' GB');
		}
		else{
			var uploadAbortController = app.request.abortController();
			
			//Unbind click event eventually active
			$('.cancelUploadButton').off('click');
			$('.gauge').off('click');
			
			//Click on Cancel Button
			$('.cancelUploadButton').click(function(){
				
				app.dialog.confirm(jsonLangFileContent.SURE_TO_CANCEL_UPLOAD, function () {
						
						//Confirm if some upload is happening
						var isuploading = $('.gauge').attr('data-isuploading');
						if(isuploading == 'true') {

								//Abort
								uploadAbortController.abort();
							
								//Reset Gauge
								gauge.update({
									value: 0,
									valueText: "Upload"
								})
								
								//Run Toast
								var toast = app.toast.create({
									text: jsonLangFileContent.ACTION_CANCELLED,
									closeButton: true,
									closeButtonText: jsonLangFileContent.CLOSE,
									closeButtonColor: 'red'
								})			
								toast.open();
								
								$('.cancelUploadButton').hide();
								$('.settingsButtonOnHome').show();
								
								//Bring back the gauge click event
								$('.gauge').click(function(){	
									$('.input-file').click();
								})
								
						}
					});

			})
			
			
			//Update Gauge	
			gauge.update({
				valueText: jsonLangFileContent.WAIT
			});
			
			//Hide Settings Section on Home
			$('.cancelUploadButton').show();
			$('.settingsButtonOnHome').hide();
			
			//Set isuploading to true
			$('.gauge').attr('data-isuploading','true');

			//Get max downloads and period from sessionStorage
			var max_downloads = sessionStorage.max_downloads; //Numeric
			var duration = sessionStorage.duration;// 1d, 1w, 1m, etc
			console.log("duration enviada: "+duration);

						
			//FormData
			var formData = new FormData();
			
			//Get the file
			var file = this.files[0];
			
			//Put more fields on FormData
			formData.append('file',file);
			formData.append('expires',duration);
			formData.append('maxDownloads',max_downloads);
			formData.append('autoDelete',true);
			
			
			
			//Request	
			app.request({
				url: 'https://file.io',
				method: "POST",
				data: formData,
				cache: false,
				contentType: "multipart/form-data",
				processData: true,
				crossDomain: true,
				abortController: uploadAbortController,
				beforeOpen:function(xhr){
					xhr.upload.onprogress = function(e) {
						var percentComplete = parseFloat(e.loaded / e.total).toFixed(2);
						console.log(percentComplete);
						
						gauge.update({
							value: percentComplete,
							valueText: percentComplete*100 + "%"
						})
						
						if(percentComplete == 1){
							gauge.update({
								valueText: jsonLangFileContent.WAIT
							})
						}
						
						
					}
				},
				/* Also works:
				
				beforeOpen(xhr) {
					xhr.upload.onprogress = (event) => {
						let progressUpload = parseInt((event.loaded / event.total)* 100)
						console.log(progressUpload);			
					}
				},*/
				success:function (data, status, xhr){
					
					//Reset file field
					$('.input-file')[0].value = '';
					
					//Bring back the gauge click event
					$('.gauge').click(function(){	
						$('.input-file').click();
					})
					
					//Set isuploading to true
					$('.gauge').attr('data-isuploading','false');
					
					//Hide and show Cancel and Settings Section
					$('.cancelUploadButton').hide();
					$('.settingsButtonOnHome').show();
					
					parsed = JSON.parse(data);
					
					//Fill data on success popup
					var returned_file_name = parsed.name;
					var returned_download_link = parsed.link;
					var returned_max_downloads = parsed.maxDownloads;
					var returned_exp_date = parsed.expires;
					
					$('.generated_link').attr('value', returned_download_link);
					$('.returned_max_downloads').html(returned_max_downloads);
					$('.returned_exp_date').html(isotodate(returned_exp_date));
					
					/*** Save to My Links	***/	
				
					//Add element into array
					var obj_to_save = {
						itemid:	makeid(10),
						link: returned_download_link,
						filename: returned_file_name,
						expdate: returned_exp_date,
					};
					
					addElementToLocalstorageJSON(localStorage.mylinks, 'mylinks', obj_to_save)
					
			
					//Show Sucess Popup
					app.popup.open('.success-upload-popup');					
					
					
					$('.check').html('<lottie-player src="img/check.json" background="transparent" speed="1"  style="width: 300px; height: 300px; margin: auto;"  autoplay></lottie-player>');
				
					//Reset Gauge
					gauge.update({
						value: 0,
						valueText: "Upload"
					})
					
					//Show Ad
					interstitial.show();
					
					
					//$('.bottom-text').html(parsed.link);
					console.log("OK");
					console.log(data);
					console.log(status);
					console.log(xhr);
				},
				error: function (xhr, status, message){
					
					//Reset file field
					$('.input-file')[0].value = '';
					
					//Bring back the gauge click event
					$('.gauge').click(function(){	
						$('.input-file').click();
					})
					
					$('.cancelUploadButton').hide();
					$('.settingsButtonOnHome').show();
					
					gauge.update({
						value: 0,
						valueText: "Upload"
					})
					
					//Set isuploading to true
					$('.gauge').attr('data-isuploading','false');
						
					var toast = app.toast.create({
						text: jsonLangFileContent.UPLOAD_ERROR,
						closeButton: true,
						closeButtonText: 'Close',
						closeButtonColor: 'red'
					})			
					toast.open();
					
					var responseText = xhr.responseText;
					var statuscode = xhr.status;
					
					console.log("Fail");
					console.log(xhr);
					console.log(status);
					console.log(message);			
				}
			});
		
		}
	});





	/***************************
		  SETTINGS POPUP
	***************************/

	//Click on Save button on Settings
	$('.settingssavebtn').click(function(){
		
		//Get and store the language
		var language = $('.language').val();
		localStorage.language = language;
		update_texts_in_home();
		
		//Get fileds values
		//var max_downloads = $('input').eq(2).val();   //Numeric	
		var max_downloads = 1;   //Numeric	
		var duration_number = $('input').eq(2).val(); //Numeric
		var duration_period = $('.duration_period').val(); //d, w, m, etc
		var converted_duration_period = duration_number + " " + render_text_from_carac(duration_period); //1 day, 1 months, etc
		
		console.log(max_downloads);
		console.log(duration_number);
		console.log(duration_period);
		
		
		//Update sessionStorage	
		sessionStorage.max_downloads = max_downloads;
		sessionStorage.duration = duration_number + duration_period;
		sessionStorage.converted_duration = converted_duration_period;
		
		//Update Dom
		$('.max_downloads').html(sessionStorage.max_downloads);
		$('.duration').html(sessionStorage.converted_duration);
		
		
		app.popup.close('.configs-popup');

	})

	//Click on close button on Settings page
	$('.success-popup-close-btn').click(function(){
		app.popup.close('.success-upload-popup');
	})

	/***************************
			MYLINKS PAGE 
	***************************/

	$(document).on('page:init', '.page[data-name="mylinks"]', function (e) {
		
		var jsonLangFileContent = get_lang_file(localStorage.language);
		
		if(localStorage.mylinks != '[]'){
			if(localStorage.already_was_on_my_links != 'true'){

				var toastSwipe = app.toast.create({
					text: jsonLangFileContent.TOAST_SWIPE_TEXT,
					closeTimeout: 5000,
				  });
				  toastSwipe.open();
			
				//First exec runs here
				localStorage.already_was_on_my_links = 'true';

			}	
		}
		
		
	  
	  
	  var links = localStorage.mylinks;
	  var array = JSON.parse(links);
	  $('.mylinksTitle').text(jsonLangFileContent.MY_LINKS_TITLE);
	  if(array.length < 1){
		  $('.loadlinks').html('<lottie-player style="margin-top: -67px;" src="img/notfound.json" background="transparent" speed="1"  style="width: 100px; height: 100px;" loop autoplay></lottie-player> <p style="margin-top:-257px; text-align:center; font-size: 18px;">'+jsonLangFileContent.MY_LINKS_NO_FILES+'?</p> ');
	  }
	  else{
			//Rendering saved items
			for(var i=0; i< array.length; i++){
				
				var expdate_dma = isotodate(array[i]['expdate']); //dd/mm/aaaa
				
				var dateobj= new Date();
				var today = dateobj.getDate()+'/'+(dateobj.getMonth()+1)+'/'+dateobj.getFullYear();
				
				var days_left = datediff(parseDate(today), parseDate(expdate_dma));
				if(days_left < 0){
					days_left =  jsonLangFileContent.EXPIRED;
				}
				else if(days_left == 0){
					days_left = jsonLangFileContent.EXPIRES_TODAY;
				}
				else if(days_left == 1){
					days_left =  days_left + jsonLangFileContent.DAY_LEFT;
				}
				else{
					days_left = days_left + jsonLangFileContent.DAYS_LEFT;
				}
				console.log(today);
				console.log(expdate_dma);
				
				//Get file format
				var filename = array[i]['filename']
				var fileformat = filename.split('.').pop();
				//var fileformat = filename.substring(filename.length - 3);
				
				var imagesformat = ['png', 'jpg','bmp','jpeg', 'svg', 'webp'];
				var videoformat = ['avi', 'mp4', 'mpeg', 'flv','mov','wmv','mkv','webm'];
				var audioformat = ['mp3', 'm4a', 'flac', 'wav','aac','ogg','wma'];
				var zipformat = ['zip', 'rar', '7zip', 'tar'];
				var txtformat = ['txt', 'csv'];
				var wordformat = ['doc', 'docx','ocx'];
				var excelformat = ['xls', 'xlsx','lsx'];
				var pptformat = ['ppt', 'pptx','ptx'];
				var pdfformat = ['pdf'];
				
				if(imagesformat.includes(fileformat) == true){
					var icon = '<i style="color:#ff7c1f;" class="fa-solid fa-image"></i>'
				}
				else if(videoformat.includes(fileformat) == true){
					var icon = '<i style="font-size: 19px; color:#0d24c7;" class="fa-solid fa-file-video"></i>'
				}
				else if(zipformat.includes(fileformat) == true){
					var icon = '<i style="font-size: 19px; color: #6e6161;" class="fa-solid fa-file-zipper"></i>'
				}
				else if(txtformat.includes(fileformat) == true){
					var icon = '<i style="font-size: 19px; color: black;" class="fa-solid fa-file-lines"></i>'
				}
				else if(wordformat.includes(fileformat) == true){
					var icon = '<i style="font-size: 19px; color: blue;" class="fa-solid fa-file-word"></i>'
				}
				else if(excelformat.includes(fileformat) == true){
					var icon = '<i style="font-size: 19px; color: green;" class="fa-solid fa-file-excel"></i>'
				}
				else if(pptformat.includes(fileformat) == true){
					var icon = '<i style="font-size: 19px; color: #d5450e;" class="fa-solid fa-file-powerpoint"></i>'
				}
				else if(pdfformat.includes(fileformat) == true){
					var icon = '<i style="font-size: 19px; color: #d5450e;" class="fa-solid fa-file-pdf"></i>'
				}
				else if(audioformat.includes(fileformat) == true){
					var icon = '<i style="font-size: 19px; color: #207ad7;" class="fa-solid fa-file-audio"></i>'
				}
				else{
					var icon = '<i style="color: black;" class="fa-solid fa-gear"></i>'
				}
				
				var li = '<li style="list-style: none;" data-itemlink='+array[i]['link']+' data-itemid='+array[i]['itemid']+' class="swipeout saveditem" @swipeout:deleted=${onDeleted}>'+
						'<div class="item-content swipeout-content">'+
						  '<div class="item-media">'+icon+'</div>'+
						  '<div class="item-inner">'+
							'<div class="item-title" style="max-width: 60%;">'+array[i]['filename']+'</div>'+
							 //'<div class="item-subtitle itemlink">'+array[i]['link']+'</div>'+
							 '<br><div class="item-text">'+days_left+'</div>'+
						  '</div>'+
						'</div>'+
						'<div class="swipeout-actions-right" data-itemid='+array[i]['itemid']+'>'+
						  '<a '+array[i]['itemid']+'href="#" class="swipeout-delete delete" data-confirm="'+jsonLangFileContent.DELETE_LINK+'" data-confirm-title="Delete?">'+jsonLangFileContent.DELETE+'</a>'+
						  '<a href="#" class="color-blue copy">'+jsonLangFileContent.COPY+'</a>'+
						  '<a href="#" class="color-green share">'+jsonLangFileContent.SHARE+'</a>'+
						'</div>'+
					  '</li>';
					  
			  /*var li = '<li data-itemlink='+array[i]['link']+' data-itemid='+array[i]['itemid']+' class="swipeout saveditem" @swipeout:deleted=${onDeleted}>'+
						'<div class="item-content swipeout-content">'+
						  '<div class="item-inner">'+
							'<div class="item-title">'+array[i]['filename']+'</div>'+
							 //'<div class="item-subtitle itemlink">'+array[i]['link']+'</div>'+
							 '<br><div class="item-text">'+array[i]['expdate']+'</div>'+
						  '</div>'+
						'</div>'+
						'<div class="swipeout-actions-right" data-itemid='+array[i]['itemid']+'>'+
						  '<a '+array[i]['itemid']+'href="#" class="swipeout-delete delete" data-confirm="Are you sure want to delete this item?" data-confirm-title="Delete?">Delete</a>'+
						  '<a href="#" class="color-blue copy">Copy</a>'+
						  '<a href="#" class="color-green share">Share</a>'+
						'</div>'+
					  '</li>';*/
					  
			  $('.loadlinks').append(li);
		  }
		  
		  /*//Delete item
		  $('.delete').click(function(){
			  var li = $(this).parents('.saveditem'); //li elements
			  var itemid = li.attr('data-itemid');
			  removeElementToLocalStorageJSON(localStorage.mylinks, 'mylinks', 'itemid', itemid);
		  })*/
		  
		  //Listen for 'deleted' event
		  $('.swipeout').on('swipeout:deleted', function (a) {
			  var itemid = $(this).attr('data-itemid'); 
			  removeElementToLocalStorageJSON(localStorage.mylinks, 'mylinks', 'itemid', itemid);
			  
			  //Check if it was the last one and localStorage is empty
			  if(localStorage.mylinks == '[]'){
				   $('.loadlinks').html('<lottie-player style="margin-top: -67px;" src="img/notfound.json" background="transparent" speed="1"  style="width: 100px; height: 100px;" loop autoplay></lottie-player> <p style="margin-top:-257px; text-align:center; font-size: 18px;">'+jsonLangFileContent.MY_LINKS_NO_FILES+'</p> ');
			  }
			});
		  
		  //Copy link
		  $('.copy').click(function(){
			  var itemlink = $(this).parents('.saveditem');
			  var thelink = itemlink.attr('data-itemlink');
			  cordova.plugins.clipboard.copy(thelink);
			  console.log(thelink);
			  var toastBottom = app.toast.create({
				text: jsonLangFileContent.LINK_COPIED,
				closeTimeout: 2000,
			  });
			  toastBottom.open();	  
		  
			  
		  })
		  
		  //Open Share dialog
		  $('.share').click(function(){
			  
			  var itemlink = $(this).parents('.saveditem');
			  var thelink = itemlink.attr('data-itemlink');
			  
			  console.log(thelink);
			  /*
			// this is the complete list of currently supported params you can pass to the plugin (all optional)
			var options = {
			  message: 'This link was generated with Ephemeral App ', // not supported on some apps (Facebook, Instagram)
			  subject: 'Ephemeral Link', // fi. for email
			  url: thelink,
			  chooserTitle: 'Pick an app', // Android only, you can override the default share sheet title
			  //appPackageName: 'com.apple.social.facebook', // Android only, you can provide id of the App you want to share with
			};

			var onSuccess = function(result) {
			  console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
			  console.log("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
			};

			var onError = function(msg) {
			  console.log("Sharing failed with message: " + msg);
			};

			window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);*/
			var jsonLangFileContent = get_lang_file(localStorage.language);	
			navigator.share({
				title: jsonLangFileContent.SHARE_LINK_TITLE,
				text: jsonLangFileContent.SHARE_LINK_TEXT,
				url: thelink
			}).then((packageNames) => {
				if (packageNames.length > 0) {
					console.log("Shared successfully with activity", packageNames[0]);
				} else {
					console.log("Share was aborted");
				}
			}).catch((err) => {
				console.error("Share failed:", err.message);
			});
		  })
	  }
	  
				  

	  
	})


	/***************************
			CONTACT PAGE
	***************************/
	$(document).on('page:init', '.page[data-name="contact"]', function (e) {
		
		var jsonLangFileContent = get_lang_file(localStorage.language);	
		$('.contact_page_text').text(jsonLangFileContent.CONTACT_PAGE_TEXT)
		$('.sendmailbtn').text(jsonLangFileContent.SEND_EMAIL_BUTTON)
		$('.contact_title').text(jsonLangFileContent.TITLE_CONTACT)
		
		
	})



	$(document).on('page:init', '.page[data-name="about"]', function (e) {
		var jsonLangFileContent = get_lang_file(localStorage.language);
		$('.abouTitle').text(jsonLangFileContent.ABOUT);
		$('.version').text(appVersion);
		
	})
});

document.addEventListener('admob.ad.dismiss', async () => {
  // Once a interstitial ad is shown, it cannot be shown again.
  // Starts loading the next interstitial ad as soon as it is dismissed.
  await interstitial.load()
}) 