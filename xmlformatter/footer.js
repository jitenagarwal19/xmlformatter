$(document).ready(function() {
	$(".jsoneditor").css('height', 'auto');
	setDefaultData();
	conditionalCode();
	$("#me").click();
	
	if($("#viewName").val() == "lorem-ipsum"){
		addCopyPreviewButtonToLoremPage();
	}
	if($("#file2").length != 0) {
		var zone = new FileDrop('file2Div', {input: false});
		  
		zone.event('upload', function (e) {
		  zone.eventFiles(e).each(function (file) {
			  if(file.size != undefined && file.size != null &&  file.size > 1000000){
					openErrorDialog("File size is not supported more 1MB");
					return false;
				}
		    file.readData(
		      function (str) {
		    	  setFileName(2, file.name);
				  setToEditor2(str);
		      },
		      function () { alert('Problem reading this file.'); },
		      'text'
		    );
		  });
		});
	}
	else if($("#file1").length != 0) {
		var zone = new FileDrop('file1Div', {input: false});
		  
		zone.event('upload', function (e) {
		  zone.eventFiles(e).each(function (file) {
			  if(file.size != undefined && file.size != null &&  file.size > 1000000){
					openErrorDialog("File size is not supported more 1MB");
					return false;
				}
		    file.readData(
		      function (str) {
		    	  setFileName(1, file.name);
				  setToEditor(str);
		      },
		      function () { alert('Problem reading this file.'); },
		      'text'
		    );
		  });
		});
	}
	else{
		var zone = new FileDrop('cbBody', {input: false});
		  
		zone.event('upload', function (e) {
		  zone.eventFiles(e).each(function (file) {
			  if(file.size != undefined && file.size != null &&  file.size > 1000000){
					openErrorDialog("File size is not supported more 1MB");
					return false;
				}
		    file.readData(
		      function (str) {
		    		 setToEditor(str);	
		      },
		      function () { openErrorDialog('Problem reading this file.'); },
		      'text'
		    );
		  });
		});
	}
	 
});

function loadNewView() {
	window.location.href = "/" + $("#viewName").val().trim();
}

function getSampleData() {
	var viewname = $("#viewName").val().trim();

	if(viewname=="jsonviewer" || viewname=="json-escape-unescape" || viewname=="jsontoxml" || viewname=="json-to-csv" || viewname=="online-json-editor" 
		|| viewname=="json-to-yaml" || viewname=="json-to-html-converter" || viewname=="json-to-tsv-converter"){
		getJsonSampleData();
		return;
	}
	
	if(viewname == "un-google-link"){
		setToEditor("https://www.google.co.in/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&cad=rja&uact=8&ved=0ahUKEwjB7JO54LDJAhULV44KHQQYB1cQFggbMAA&url=http%3A%2F%2Fcodebeautify.org%2F&usg=AFQjCNG_DKhs4g3mbjzuEWxEa2aHGfqYgw&sig2=a54qV321O8wYGpJ2kbfCNg&bvm=bv.108194040,d.c2E");
		return;
	}
	
	if(viewname=="xmlviewer" || viewname=="xml-to-tsv-converter" || viewname=="online-xml-editor" || viewname=="xmltojson" || viewname=="xml-to-yaml" || viewname=="xml-to-csv-converter" || viewname=="xml-to-html-converter"){
		getXMLSampleData();
		return;
	}
	
	if(viewname=="text-to-html-converter")
	{
		setToEditor("The five-paragraph essay is a format of essay having five paragraphs: one introductory paragraph, three body paragraphs with support and development, and one concluding paragraph");
		return false;
	}
	if(viewname=="sql-escape-unescape"){
		setToEditor("select * from table where value = 'in single quote '' is offensive'");
		return false;
	}
	
	if (viewname != "rssviewer") {
		$.ajax({
			type : "post",
			url : globalurl + "service/sampleData",
			dataType : "text",
			data : {
				viewname : viewname
			},
			success : function(response) {
				response = response.trim();

				if (viewname == 'Xpath-Tester') {
					$("#xmlString").val(response);

				} 
				else if(viewname == "base64-to-image-converter"){
					$("#base64string").val(response);
					setBase64ToImage();
				}
				else
				{
					setToEditor(response);
				}
			},
			error : function(e, s, a) {
				openErrorDialog("Failed to load data=" + s);

			}
		});
	} else {
		var path = 'http://rss.cnn.com/rss/edition_world.rss';
		$("#result1").rssfeed(path);
		$.ajax({
			type : "post",
			url : "http://codebeautify.com/URLService",
			dataType : "text",
			data : {
				path : path
			},
			success : function(response) {

				response = response.trim();

				try {
					// var xml=$.parseXML( response );
					// openErrorDialog(response);
					editorAce.setValue(response);
					editorAce.getSession().setUseWrapMode(true);
					FormatXML();
					editorAce.clearSelection();
				} catch (e) {
					openErrorDialog("invalid XML");
				}
			},
			error : function(e) {
				openErrorDialog("Failed to load data");
			}
		});
	}

	$(".sharelinkurl").attr("st_url", window.location);
	$(".sharelinkurl").attr("st_title", $("#save_link_title").val());
}

function getCopyText() {

	var content = "";

	content = editorResult.getValue();

	if ($("#json").is(':visible')) {
		content = editor.getText();
	}

	return content;

}

function setDefaultData() {

	var content = $("#fContent").val().trim();
	var url = $("#fUrl").val().trim();
	var inputvalue = $("#inputvalue").val().trim();
	var title = $("#fTitle").val();
	var viewname = $("#viewName").val().trim();
	var value = $("#fValue").val().trim();

	if(inputvalue != null && inputvalue.trim().length != 0){
		setToEditor(inputvalue);
	}
	else if (content != null && content.trim().length != 0 || url != null && url.length != 0) {
		if(url.length != 0){
			loadUrl(url,viewname);
		}
		else if (content == "sampleData") {
			getSampleData();
		} else if (viewname != "screenfly" && viewname != "send-snap-message") {
			getDataFromUrlId(content);
		}

		$("#subTitle").find('h4').remove();
		$("#subTitle").append(
				"<h4 style='padding-left:10px'>" + title + "</h4>");
		$("#plinkBtn")
				.parent()
				.append(
						'<input type="button" value="New" class="btn btn-inverse span11" onclick="loadNewView()" style="width: 19% !important; padding: 6px;float:right;margin-right:2%">');
		$("#plinkBtn").val('Fork');
		$("#plinkBtn").parent().show();
		// $("#permalink").parent().show();
	} else {

		if (value == null || value.length == 0) {

			clearEditorInput();
		} else {
			// this method onliny for js/css validator when value is not empty
			FormatCSS_JS();

		}
	}

}

function conditionalCode() {

	var viewname = $("#viewName").val().trim();

	if (typeof editorAce != 'undefined') {
		editorAce.clearSelection();
		editorAce.getSession().setUseWorker(false);
	}
	if (typeof editorResult != 'undefined') {
		editorResult.clearSelection();
		editorResult.getSession().setUseWorker(false);
	}
	
	var copyCss = getCopyImgByBrowser();

	$("#fs").text("");
	$("#fs")
			.html(
					"<img id='fsimg' src='/img/fsin.png' width='20px' height='20px' title='Full Screen'>");
	$("#fs").css({
		'margin-left' : '5px'
	});

	$("#fs1").text("");
	$("#fs1")
			.html(
					"<img id='fs1img' src='/img/fsin.png' width='20px' height='20px' title='Full Screen'>");

	$("#clearImg")
			.html(
					"<a href='#' id='sampleDataBtn' style='margin-right: 5px;' onclick='getSampleData()'>sample</a> <b onclick='clearEditorInput()' style='color: red;'>&#x2716;</b>");

	$(".btn").addClass("span11");

	// for string functions
	$("#temp").removeClass("span11");
	$("#clearImg")
			.parent()
			.append(
					"<a href='#copy1' id='copy-dynamic1' style='float: right;  margin-right: 7px;' title='Copy'><img id='"+copyCss+"'/></a>");
	$("#fs1")
			.parent()
			.append(
					"<a href='#copy' id='copy-dynamic' style='float: right;  margin-right: 7px;' title='Copy'><img id='"+copyCss+"'/></a>");

	$("#editor").css({
		'font-size' : 'small'
	});
	$("#result").css({
		'font-size' : 'small'
	});
	$("#result1").css({
		'font-size' : 'small'
	});

	$(".stButton").css({
		'display' : 'none!important'
	});

	$("#me").val("Browse");

	if (viewname == 'alleditor') {
		$("#plinkBtn")
				.parent()
				.append(
						"<a href='#copy' id='copy-dynamic1' class='btn allEditorpermalinkButton btn-inverse'style='float: right;  margin-right: 2%;width:19%;position:relative;padding:6px;' title='copy to clipborad'>Copy</a>");
		$("#savebtn").show();
	}
	// hide save button and permalink
	if (viewname == "excel-to-html" || viewname == "lorem-ipsum") {
		$("#sampleDataBtn").hide();
		$("#savebtn").hide();
		$("#permalinkDiv").hide();
	}

	if (viewname == "send-html-email") {

		tinymce
				.init({
					selector : "textarea",
					theme : "modern",
					plugins : [
							"advlist autolink lists link image charmap print preview hr anchor pagebreak",
							"searchreplace wordcount visualblocks visualchars code fullscreen",
							"insertdatetime media nonbreaking save table contextmenu directionality",
							"emoticons template paste textcolor colorpicker textpattern" ],
					toolbar1 : "insertfile undo redo | styleselect formatselect fontselect fontsizeselect| bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview | forecolor backcolor emoticons",
					image_advtab : true,

				});

		var loginProvider = $("#loginWith").val();

		if (loginProvider == null || loginProvider.trim().length == 0
				|| loginProvider == "Facebook") {
			openGmailLoginDialog();
		}
	}

	if (viewname != "code" && viewname != "file-difference"
			&& viewname != "encrypt-decrypt"
			&& viewname != "credit-card-validate"
			&& viewname != "image-to-base64-converter"
			&& viewname != "date-time-calculater"
			&& viewname != "credit-card-fake-number-generator"
			&& viewname != "api-test") {
		// content=editor.getText();
		$("a#copy-dynamic").zclip({
			path : "/js/Zeroclipboard.swf",
			copy : getCopyText
		// $('#mainRightDiv
		// textarea').val();}//editorResult.getValue();}
		// //$('.ace_content').val();}//$("#editor").val();}
		});

		$("a#copy-dynamic1").zclip({
			path : "/js/Zeroclipboard.swf",
			copy : function() {
				return editorAce.getValue();
			}// $("#editor").val();}
		});

	}
}

function getCopyImgByBrowser(){
	var copyImgCSS = "copyimg";
	if (getBrowser() != "chrome") {
		copyImgCSS = "copyimg1";
	}
	
	return copyImgCSS;
}

function getPreviewImgByBrowser(){
	var copyImgCSS = "previewimg";
	if (getBrowser() != "chrome") {
		copyImgCSS = "previewimg1";
	}
	
	return copyImgCSS;
}

//browser detection
function getBrowser(){
	
	var browserName = '';
	
	var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
	// Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
	var isFirefox = typeof InstallTrigger !== 'undefined'; // Firefox 1.0+
	var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf(
			'Constructor') > 0;
	// At least Safari 3+: "[object HTMLElementConstructor]"
	var isChrome = !!window.chrome && !isOpera; // Chrome 1+
	var isIE = /* @cc_on!@ */false || !!document.documentMode; // At least IE6
	
	if(isOpera){
		browserName = "opera";
	}else if(isFirefox){
		browserName = "firefox";
	}else if(isSafari){
		browserName = "safari";
	}else if(isChrome){
		browserName = "chrome";
	}else if(isIE){
		browserName = "ie";
	}
	
	return browserName;
}

// end

function addCopyPreviewButtonToLoremPage(){
	
	var copyCss = getCopyImgByBrowser();
	var preCss = getPreviewImgByBrowser();
	
	$("legend").each(function( index ) {
		
		var id = "legendCopy"+index;
		var prev = "prev"+index;
		var legend = $(this).text().replace(/ /g,"_")+"|"+index;
		
		$(this).addClass("legendMargine");
		$( this ).append("<a href='#Preview' style='float: right'; id='"+prev+"' onclick=showPreview('"+legend+"') title='Preview'><img id='"+preCss+"'/></a><a href='#Copy' id='"+id+"' style='float: right'; title='Copy'><img id='"+copyCss+"' width='20px' height='20px'/></a>");
		 
		 $("#"+id).zclip({
				path : "/js/Zeroclipboard.swf",
				copy : function() {
					return $("#lpt"+(index+1)).val();
				}
		});
		 
	});
	
}

function showPreview(legend){
	
	
    var data = legend.split('|');
	
	$("#loremTitle").html(data[0].replace("/_/g"," "));
	$("#loremContent").html($("#lpt"+(parseInt(data[1])+1)).val());
	
    $( "#loremIpsumPreviewDiv" ).dialog({
        resizable: true,
        title : 'Preview',
        height:400,
        width : 400,
        modal: true,
        buttons: {
          Close: function() {
            $( this ).dialog( "close" );
          }
        }
      });
	 
}
 

function openGmailLoginDialog() {
	$("#gmailLogin").dialog({
		modal : true,
		width : "auto",
		draggable : false,
		height : "auto",
		title : "LOGIN",
		autoOpen : true,
		resizable : false,
	});
	$(".ui-dialog-titlebar-close").hide();
	$(".ui-dialog .ui-dialog-titlebar").hide();
}

//hmac generator
function generateHMAC(){
	var text = $("#text").val();
	$("#result_ed").val('');

	if (validateInput("text")) {
		var key = $("#key").val();
		var alg = $("#alg").val();
		if(!validateInput("key")){
			openErrorDialog("Please Enter Key");
			return false;
		}
		var output = "";
		switch (alg) {
		case 'aes':	output = CryptoJS.AES.encrypt(text,key);	break;
		case 'hmac-md5': output = CryptoJS.HmacMD5(text,key);	break;
		case 'hmac-ripemd160': output =	CryptoJS.HmacRIPEMD160(text,key);	break;
		case 'hmac-sha1': output = CryptoJS.HmacSHA1(text,key);	break;
		case 'hmac-sha224': output = CryptoJS.HmacSHA224(text,key);	break;
		case 'hmac-sha256': output = CryptoJS.HmacSHA256(text,key);	break;
		case 'hmac-sha3': output =	CryptoJS.HmacSHA3(text,key);	break;
		case 'hmac-sha384': output = CryptoJS.HmacSHA384(text,key);	break;
		case 'hmac-sha512': output = CryptoJS.HmacSHA512(text,key);	break;
		case 'md5': output =	CryptoJS.MD5(text);	break;
		case 'ripemd160': output =	CryptoJS.RIPEMD160(text);	break;
		case 'sha1': output =	CryptoJS.SHA1(text);	break;
		case 'sha224': output =	CryptoJS.SHA224(text);	break;
		case 'sha256': output =	CryptoJS.SHA256(text);	break;
		case 'sha3': output = CryptoJS.SHA3(text);	break;
		case 'sha384': output =	CryptoJS.SHA384(text);	break;
		case 'sha512': output =	CryptoJS.SHA512(text);	break;
		case 'pbkdf2': output =	CryptoJS.PBKDF2(text,key);	break;
		case 'rabbit-legacy': output =	CryptoJS.RabbitLegacy.encrypt(text,key);	break;
		case 'rabbit': output =	CryptoJS.Rabbit.encrypt(text,key);	break;
		case 'rc4': output = CryptoJS.RC4Drop.encrypt(text,key);	break;
		case 'tripledes': output = CryptoJS.TripleDES.encrypt(text,key);	break;
		default:
			break;
		}
		
		$("#result_ed").val(output);
	}
	else{
		openErrorDialog("Please Enter Plain Text");
	}
}
function validateInput(fieldName){
	var flag = true;
	if($("#"+fieldName).val().trim().length == 0){
		flag = false;
	}
	return flag;
}