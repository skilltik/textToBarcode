var code;
var localCookie;

chrome.cookies.get({
    "name": "barcode",
    "url": "http://developer.chrome.com/extensions/popup.html",    
}, function (cookie) {
    localCookie = JSON.stringify(cookie);
	localCookie = JSON.parse(localCookie);
	if (localCookie == undefined){
		setCookie("");
	}
});

function drawBarcode(id, string){
	if (string.length == 8 && $("#mask")[0].checked){
		string = "ZT" + string;
	}
	JsBarcode("#" + id, string, {
		width: 4,
		height: 150
	});
	$("#"+id).attr("value", string);
}

function setCookie(list){
	var newList;
	if	(list!= undefined){
		newList = list;
	}else{
		newList = localCookie.value;
	}
	chrome.cookies.set({
		"name": "barcode",
		"url": "http://developer.chrome.com/extensions/popup.html",
		"value": newList
	}, function (cookie) {
		localCookie = JSON.stringify(cookie);
		localCookie = JSON.parse(localCookie);
	});
}

function drawList(){
	
	$("#barcodeList").html("");
	var list = localCookie.value.split(",");
	for (var i = 0; i < list.length ; i++){
		$("#barcodeList").prepend("<svg class='barcode borrar' id='barcode-"+ i +"'></svg>");
		drawBarcode("barcode-"+i, list[i]);
	}	
}

$( document ).ready(function() {
	chrome.tabs.executeScript( {
		code: "window.getSelection().toString();"
	}, function(selection) {
		if (selection[0].length != 0){
			code = selection[0];
			drawBarcode("barcode", code);
		}				  
	});	    	
	drawList();	
});

$(document).on("input", "#input",function(){
	drawBarcode("barcode", $("#input").val());	
});

$(document).on("change", "#mask",function(){
	if ($("#input").val() != ""){
		drawBarcode("barcode", $("#input").val());		
	}else{
		drawBarcode("barcode" + code);
	}	
});

$(document).on("click", "#guardar",function(){
	if (localCookie.value.length == 0){
		localCookie.value = $("#barcode").attr("value");			
	}else{
		localCookie.value = localCookie.value + "," + $("#barcode").attr("value");	
	}	
	setCookie();	
	drawList();	
	$("#barcode").html("");
	$("#input").val("");
});

$(document).on("click", ".borrar",function(e){	
	var list = localCookie.value.split(",");
	var index = list.lastIndexOf($("#" + e.currentTarget.id).attr("value"));
	if (index != -1){
		list.splice(index, 1);
	}
	$("#" + e.currentTarget.id).remove();
	setCookie(list.toString());
});

$(document).on("click", "#barcode",function(e){	
	$("#barcode").html("");
	$("#input").val("");
});