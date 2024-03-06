
// ----------------------------------------------
// thermoline.js - v1.6 - Jan-2024 [BioBee Backups, Responsive, En]
// Copyright (c) Thermoline
// http://www.thermoline.co.il
// ----------------------------------------------


// ----------------------------------------------
// Login:
// ----------------------------------------------


/* login function: the user will be logged on both user site and control panel */
function LoginEn()
{
	if (magcheck_login($("#user").val(), $("#pass").val()) == true)
	{
		/* if the check returns true, the user and password match */
		/* here we put a redirect to the main page after the login */
		window.location.replace("/index_main.html");
	}
	else
	{
		/* if the check returns false, the user and password missmatch */
		/* here we put an error message in case of wrong login */
		$("#errMsg").text("Login error");
		$("#user").val("");
		$("#pass").val("");
	}
}


/* get active user function: used to check which user is logged in. Return the username of the user */
function getUser()
{
	var user = magcheck_user();

	$("#user").text(" " + user);

	$("#loginLink").hide();
	$("#logoutLink").hide();

	if ( !user ) { // check for empty strings (""), null, undefined, false
		$("#loginLink").show();
	} else {
		$("#logoutLink").show();
	}

  // tmplUpdate();
}


function GetActiveUser()
{
	var activeUser = magcheck_user();
}


/* logout function: logs out the current user. It works coupled with the function LogoutRedirect that must be called as Body onunload event.*/
function LogoutEn()
{
	/* logout for the current user */
	magcheck_logout();
	/* clean up the login cookie if still exists */
	if (readCookie("dixe_pass") != null)
	{
		eraseCookie("dixe_pass");
		dixe_forget();
	}
	/* redirect to the homepage/login page */
	window.location.replace("/index.html");
}


function isUserLoggedIn() {
	var user = magcheck_user();
 	if ( !user ) { // check for empty strings (""), null, undefined, false
 		return false;
 	} else {
 		return true;
 	}
}


// ----------------------------------------------
// Read Data:
// ----------------------------------------------


var AJAX_CGI_URL = "/cgi-bin/xjgetvar.cgi";

var AjaxResult;

function getAjaxData(AJAX_PARAMS, fCallBack) {
  // Use a new jQuery XMLHttpRequest (jqXHR) for each ajax call:
  var jqxhr = $.ajax({
		type: "GET",
		url: AJAX_CGI_URL,
		dataType : 'json',
		cache: false,
		data: { name: AJAX_PARAMS }
		})
		.done(function( obj ) {
			//updateData(obj);
			fCallBack(obj);
		})
		.fail(function( obj ) {
			// dbg // console.log("fail:" + obj); // did not get here.
		})
		.always(function( obj ) {
		});
}

function getUpdatedData(AJAX_PARAMS, TimeOut, fCallBack) {
	getAjaxData(AJAX_PARAMS, fCallBack);
	window.setTimeout(function(){ getUpdatedData(AJAX_PARAMS, TimeOut, fCallBack);}, TimeOut);
}

function getDataOnce(AJAX_PARAMS, fCallBack) {
	getAjaxData(AJAX_PARAMS, fCallBack);
}

function toDec10(strVal) { // usefull for calculations
  var val10 = parseInt(strVal, 10) / 10;
  return val10;
}

function toDec10str(strVal) { // usefull for display
  var val10 = parseInt(strVal, 10) / 10;
  var strNum = val10.toFixed(1);  // .toFixed(n) => n digit after the decimal point
  return strNum;
}

function toDec1000str(strVal) { // usefull for display
  var val10 = parseInt(strVal, 10) / 1000;
  var strNum = val10.toFixed(3);  // .toFixed(n) => n digit after the decimal point
  return strNum;
}

function toIntStr(strVal) { // usefull for display
  var strNum = parseInt(strVal, 10);
  return strNum;
}

function toBool(strVal) {
  if (strVal == "1")
    return true;
  else
    return false;
}

function toBoolStrOnOff(strVal) {
  if (strVal == "1")
    return "On";
  else
    return "Off";
}

function toDesc2(strVal, var1, val1, var2, val2) {
  if (strVal == var1)
    return val1;
  else if (strVal == var2)
    return val2;
  return "?";
}

function toDesc3(strVal, var1, val1, var2, val2, var3, val3) {
  if (strVal == var1)
    return val1;
  else if (strVal == var2)
    return val2;
  else if (strVal == var3)
    return val3;
  return "?";
}

function toDescHour(hVal) {

  var hh = Math.floor( hVal / 60);
  var mm = hVal % 60;

  if (String(hh).length == 1) {
    hh = "0" + hh;
  }
  if (String(mm).length == 1) {
    mm = "0" + mm;
  }

  var retTime = String(hh) + ":" + String(mm);
  return retTime;
}

function toDescDay(dVal) {
  switch (dVal){
    case 0 : return "Sunday"; break;
    case 1 : return "Monday"; break;
    case 2 : return "Tuesday"; break;
    case 3 : return "Wednesday"; break;
    case 4 : return "Thursday"; break;
    case 5 : return "Friday"; break;
    case 6 : return "Saturday"; break;
    default : return "day???"; break;  // should not get here!
  }
}


function toPrbMainType(pVal, isLongFormat) {
  // [0=Temperature, 1=Pression ,2=RH,3=EC,4=PH,5=CO2]
  if (typeof(isLongFormat)==='undefined') isLongFormat = true;
  switch (pVal){
    case 0 : return ( (isLongFormat) ? "Temperature" : "Temp"); break;
    case 1 : return "Pressure"; break;
    case 2 : return "RH"; break;
    case 3 : return "EC"; break;
    case 4 : return "PH"; break;
    case 5 : return "CO2"; break;
    default : return "type???"; break;  // should not get here!
  }
}


function toPrbHysMax_byMainType(pVal, factor) {
  // [0=Temperature, 1=Pression ,2=RH,3=EC,4=PH,5=CO2]
  if (typeof(isLongFormat)==='undefined') isLongFormat = true;
  switch (pVal){
    case 0 : return 20 * factor; break;   //  "Temp";
    case 1 : return 20 * factor; break;   //  "pressure";
    case 2 : return 20 * factor; break;   //  "RH";
    case 3 : return 20 * factor; break;   //  "EC";
    case 4 : return 20 * factor; break;   //  "PH";
    case 5 : return 200 * factor; break;  //  "CO2";
    default : return 20 * factor; break;  //  "type???";    // should not get here!
  }
}


function toPrbSubType(pVal) {
  switch (pVal){
    case 0 : return "NTC"; break;
    case 1 : return "PTC"; break;
    case 2 : return "2..20mA"; break;
    case 3 : return "4..20mA"; break;
    case 4 : return "0..10V"; break;
    case 5 : return "0..1V"; break;
    case 6 : return "0..5V"; break;
    default : return "type???"; break;  // should not get here!
  }
}


function toPrbUnit(pVal) {
  // [0=C,1=F,2=bar,3=psi,4=%,5=ppm,6=us/cm,7=ms/cm,8=pH)
  switch (pVal){
    case 0 : return String.fromCharCode(176) + "C"; break;
    case 1 : return String.fromCharCode(176) + "F"; break;
    case 2 : return "bar"; break;
    case 3 : return "psi"; break;
    case 4 : return "%"; break;
    case 5 : return "ppm"; break;
    case 6 : return "us/cm"; break;
    case 7 : return "ms/cm"; break;
    case 8 : return "pH"; break;
    default : return "unit???"; break;  // should not get here!
  }
}


function toLogCycle(pVal) {
  switch (pVal){
    case 1 : return 10; break;            //  "10s"
    case 2 : return 20; break;            //  "20s"
    case 3 : return 30; break;            //  "30s"
    case 4 : return 1 * 60; break;        //  "1m"
    case 5 : return 2 * 60; break;        //  "2m"
    case 6 : return 5 * 60; break;        //  "5m"
    case 7 : return 10 * 60; break;       //  "10m"
    case 8 : return 15 * 60; break;       //  "15m"
    case 9 : return 30 * 60; break;       //  "30m"
    case 10 : return 1 * 60 * 60; break;  //  "1h"
    default : return "cycle???"; break;  // should not get here!
  }
}


function fGetArrIndex(varNamePLC) {
  // e.g. varNamePLC == "ALARM_LINK_1[5]"
  // => arrIndexPLC := 5;
  var idx1 = varNamePLC.indexOf("[", 0);
  var idx2 = varNamePLC.indexOf("]", idx1);
  var strArrIndex = varNamePLC.substring(idx1 + 1, idx2);
  var arrIndexPLC = parseInt(strArrIndex, 10);
  return arrIndexPLC;
}


function fGetArrName(varNamePLC) {
  // e.g. varNamePLC == "ALARM_LINK[5]"
  // => arrName := "ALARM_LINK";
  var idx1 = varNamePLC.indexOf("[", 0);
  var arrName = varNamePLC.substring(0, idx1);
  return arrName;
}


// ----------------------------------------------
// Page template:
// ----------------------------------------------

function doTemplate(selectedMenu, selectedSubMenu) {
  buildHeaderLogo();
  buildMainMenu(selectedMenu);
  buildSubMenu(selectedMenu, selectedSubMenu);
  buildResponsiveMenu(selectedMenu, selectedSubMenu);
  buildFooter();
  getUser();
  tmplUpdate();
  
        $('#selectnav').on('change', function () {
          var url = $(this).val(); // get selected value
          if (url) { // require a URL
              // window.location = url; // redirect
              window.location.href = url; // redirect
          }
          return false;
      });
}


function buildHeaderLogo() {

  var h = "";
  // h += "    <td align='left' ><a href='http://www.dixell.co.il' target='_blank'><img src='/p_data/images/logo_dixell.gif' alt='Logo' /></a></td>";
  // h += "    <td align='center' ><img src='/p_data/images/logo1.gif' alt='Logo' /></td>";
  // h += "    <td align='right' ><img src='/p_data/images/logo_emerson.gif' alt='Logo' /></td>";

  h += "<div class='five columns'>";
  // h += "  <a href='http://www.dixell.co.il' target='_blank'><img class='imgL' src='/p_data/images/logo_dixell.png' alt='Logo' /></a> "; 
  h += "  <img class='imgL' src='/p_data/images/logo_biobee.jpg' alt='Logo' />"; 
  h += "</div>";

  h += "<div class='six columns'>";
  // h += "  <span id='SiteName'>SiteName . . .</span> ";
  // h += "  <img class='imgC' src='/p_data/images/logo1.png' alt='Logo' /></a> "; 
  h += "</div>";
  h += "<div class='five columns'>";
  // h += "  <img class='imgR' src='/p_data/images/logo_emerson_transparent.gif' alt='Logo' style='xmax-width:165px' />";
  h += "</div>";

  $("#c_header_logo").append(h);

}

function buildMainMenu(selectedMenu) {

  var isNotLimited = (selectedMenu != "Limited");
  
  var m = "";
  m += "<div class='twelve columns'>";

  m += "<ul class='c_linksMenu menuLtr' >";
  m += "  <li id='cm1'><a href='/index_main.html'>Home</a></li>";

  if (isNotLimited) {
    m += "  <li id='cm2'><a href='/inputs1/inputs1.html'>Shizaf</a></li>";
    m += "  <li id='cm3'><a href='/inputs2/inputs2.html'>Swirsky</a></li>";
    m += "  <li id='cm4'><a href='/parameters/parameters.html'>Alarms</a></li>";
    m += "  <li id='cm5'><a href='/users/users.html'>Users</a></li>";
    m += "  <li id='cm6'><a href='/log/alarms_log.html'>History</a></li>";
  }
  m += "</ul>";
  m += "</div>";
  
  m += "<select id='selectnav' class='selectnav'>";
  m += "</select>";
  
  m += "<div class='four columns tdUser tdUserLTR'>";
  // m += "  <span id='cSiteName'>SiteName . . .</span>";
  // m += "  <br />";
  // m += "&nbsp;";
  m += "  User:<b><span id='user' >???</span></b>";
  m += "  <br />";
  m += "  <a id='loginLink' href='/index.html'>Login</a>";
  m += "  <a id='logoutLink' href='#' onclick='LogoutEn(); return false;'>Logout</a>";
  // m += "  <br />";
  // m += "  Status: <span id='onOff' >???</span>";
  m += "</div>";
 
  $("#c_header_main_menu").append(m);

  if (isNotLimited) {
    // each page need to set [class='linksMenuActive'] manually:
    $("#c" + selectedMenu).addClass("linksMenuActive");
    $("#c" + selectedMenu + " a").contents().unwrap(); // remove <a>
  }

}

function buildSubMenu(selectedMenu, selectedSubMenu) {
  
  var m = "";

  switch (selectedMenu) {
	
    case "m2":
    break;
	
    case "m3":
    break;
	
    case "m4":
    break;

    case "m9":
    break;
	
  }

  $("#menu").append(m);

  if ( selectedSubMenu.trim().length > 0 ) {
    $("#" + selectedSubMenu).addClass("btn_selected");
  }
}

function buildResponsiveMenu(selectedMenu, selectedSubMenu) {
  var isNotLimited = (selectedMenu != "Limited");
  var strSelected = " selected='selected' ";
  var m = "";
    // m += "  <option>(ניווט)</option>"; // menu

    s = (selectedMenu == "m1") ? strSelected : "";  m += "  <option value='/index_main.html'" + s + ">Home</option>";

    if (isNotLimited) {
      s = (selectedMenu == "m2") ? strSelected : "";  m += "  <option value='/inputs1/inputs1.html' " + s + ">Shizaf</option>";
    }
    if (isNotLimited) {
      s = (selectedMenu == "m3") ? strSelected : "";  m += "  <option value='/inputs2/inputs2.html' " + s + ">Swirsky</option>";
    }
    if (isNotLimited) {
      s = (selectedMenu == "m4") ? strSelected : "";  m += "  <option value='/parameters/parameters.html' " + s + ">Alarms</option>";
    }
    if (isNotLimited) {
      s = (selectedMenu == "m5") ? strSelected : "";  m += "  <option value='/users/users.html' " + s + ">Users</option>";
    }
    if (isNotLimited) {
      s = (selectedMenu == "m6") ? strSelected : "";  m += "  <option value='/log/alarms_log.html' " + s + ">History</option>";
    }

  $("#selectnav").append(m);
}

function buildFooter() {

  var f = "";
  f += "  <div class='eight columns'><a href='/panel/index.html'><span id='appRelease'>ApplicationRelease</span></a></div>";
  f += "  <div class='eight columns'><span id='my_ipro_date'>date...</span> <span id='dayInWeek'>day...</span></div>";

  $("#c_footer").append(f);  
}

function tmplDay(dayInWeek) {
  switch (dayInWeek) {  // 0..6
    case 0: $("#dayInWeek").text("Sunday"); break;
    case 1: $("#dayInWeek").text("Monday"); break;
    case 2: $("#dayInWeek").text("Tuesday"); break;
    case 3: $("#dayInWeek").text("Wednesday"); break;
    case 4: $("#dayInWeek").text("Thursday"); break;
    case 5: $("#dayInWeek").text("Friday"); break;
    case 6: $("#dayInWeek").text("Saturday"); break;
    // case 0: $("#dayInWeek").text("יום ראשון"); break;   // Sunday
    // case 1: $("#dayInWeek").text("יום שני"); break;   // Monday
    // case 2: $("#dayInWeek").text("יום שלישי"); break;   // Tuesday
    // case 3: $("#dayInWeek").text("יום רביעי"); break;   // Wednesday
    // case 4: $("#dayInWeek").text("יום חמישי"); break;   // Thursday
    // case 5: $("#dayInWeek").text("יום שישי"); break;   //  Friday
    // case 6: $("#dayInWeek").text("שבת"); break;   // Saturday
  }  // switch
}


function tmplHolyday(holidayName) {
  $("#strHoliday").text(holidayName); // get str val from array item
  var h = $("#strHoliday").text();    // actual string. not array containing string.
  if (h.length > 0) {
    $("#strHoliday").css("border","1px solid #ffffff");
    $("#strHoliday").css("padding","0 5px");
  } else {
    $("#strHoliday").css("border","none");
  }
}


function tmplUpdate() {
    var paramOnce = "";
    paramOnce += "ApplicationRelease|";
    paramOnce += "SiteName|";

    var paramOften = "";
    paramOften += "MyDayWeek|";
    paramOften += "Time_Date_Footer|"; // new iPro //
    // paramOften += "HOLIDAY_NAME|"; // might contain holiday-eve.name

    // var paramVeryOften = "";
    // paramVeryOften += "SYSTEM_ONOFF|";

    paramOnce = paramOnce.toUpperCase(); getDataOnce(paramOnce, tmplUpdateData);

    // var timer = 1000 * 60;  // 60 seconds - 1 minute.
    // disabledOnNewiPro_getUpdatedStatus(timer);

    var timer = 1000 * 60 * 60;  // 1 hour.
    paramOften = paramOften.toUpperCase(); getUpdatedData(paramOften, timer, tmplUpdateData);

    // timer = 1000 * 20;  // 20 seconds.
    // paramVeryOften = paramVeryOften.toUpperCase(); getUpdatedData(paramVeryOften, timer, tmplUpdateData);
}


function tmplUpdateData(obj) {

    var varName, varVal;
    for(var i = 0; i < obj.values.length; i++) {
      varName = obj.values[i].name;
      varVal = obj.values[i].value;
      switch (varName) {

        case "APPLICATIONRELEASE": $("#appRelease").text(varVal); break;

        case "MYDAYWEEK": var dayInWeek = parseInt(varVal, 10); tmplDay(dayInWeek); break; // 0..6
        case "TIME_DATE_FOOTER" : $("#my_ipro_date").text(varVal); break; // new iPro
        // case "HOLIDAY_NAME": tmplHolyday(varVal); break;

        // case "START": var isStart = toBool(varVal); tmplStart(isStart); break;
        // case "SITENAME": $("#SiteName").text(varVal); $("#cSiteName").text(varVal); break;
        // case "SYSTEM_ONOFF": var onOff = toBoolStrOnOff(varVal); $("#onOff").text(onOff); break;

        default:
          // dbg // console.log(" * * *  case ??? *" + varName + "* ? ? ? "); // should not get here!
          break;
      }  // switch
    }  // for
  }


  function updateWidget(objWidgetId, newVal) {
    if (typeof hmiMgr != 'undefined') {
      var objWidget = hmiMgr.getWidget(objWidgetId);
      if (objWidget) {
        objWidget.setValue('value', newVal);
        // dbg // console.log("updateWidget: " + objWidgetId + " := " + newVal + " !");
      } else {
       // dbg // console.log("updateWidget: " + objWidgetId + " := " + newVal + " not found !");
      }
    }
  }



  function updateWidgetVar(objWidgetId, newVal, newDxlVar) {
    if (typeof hmiMgr != 'undefined') {
      var objWidget = hmiMgr.getWidget(objWidgetId);
      if (objWidget) {
        objWidget.setValue('value', newVal);
        objWidget.dxlVar = newDxlVar;
        // dbg // console.log("updateWidgetVar: " + objWidgetId + " := " + newVal + " !");
      } else {
       // dbg // console.log("updateWidgetVar: " + objWidgetId + " := " + newVal + " not found !");
      }
    }
  }


  function updateWidgetUnit(objWidgetId, newVal) {
    if (typeof hmiMgr != 'undefined') {
      var objWidget = hmiMgr.getWidget(objWidgetId);
      if (objWidget) {
        objWidget.setUnits(newVal);
        // dbg // console.log("updateWidget: " + objWidgetId + " := " + newVal + " !");
      } else {
       // dbg // console.log("updateWidget: " + objWidgetId + " := " + newVal + " not found !");
      }
    }
  }


  function updateWidgetMin(objWidgetId, newVal) {
    if (typeof hmiMgr != 'undefined') {
      var objWidget = hmiMgr.getWidget(objWidgetId);
      if (objWidget) {
        objWidget.min = newVal;
        // dbg // console.log("updateWidget: " + objWidgetId + " := " + newVal + " !");
      } else {
       // dbg // console.log("updateWidget: " + objWidgetId + " := " + newVal + " not found !");
      }
    }
  }


  function updateWidgetMax(objWidgetId, newVal) {
    if (typeof hmiMgr != 'undefined') {
      var objWidget = hmiMgr.getWidget(objWidgetId);
      if (objWidget) {
        objWidget.max = newVal;
        // dbg // console.log("updateWidget: " + objWidgetId + " := " + newVal + " !");
      } else {
       // dbg // console.log("updateWidget: " + objWidgetId + " := " + newVal + " not found !");
      }
    }
  }


// ----------------------------------------------
// PLC Status:
// ----------------------------------------------


function disabledOnNewiPro_dixe_do_my_update_status(arrData) { // based on dixe_do_update_status()

  // sample response:
  // ["2013111998",           //  0 - firmware_ver - BIOS release
  //  "32",                   //  1 - total_memory (MB)
  //  "ok",                   //  2 - symbol_table - ISaGraf status
  //  "109872",               //  3 - free_disk (KB)
  //  "192.168.11.153",       //  4 - ip_addr
  //  "00:0a:f6:81:ff:a8",    //  5 - home_mac
  //  "2013/11/26 - 10.58",   //  6 - ipro_date
  //  "on",                   //  7 - Watchdog
  //  1,                      //  8 - ?
  //  0,                      //  9 - min_bios
  //  1]                      // 10 - architecture

  // dbg: // console.log("dixe_do_my_update_status: " + arrData);

  // $.each([[0,"my_firmware_ver"], [4,"my_ip_addr"], [6,"my_ipro_date"]],

  var strBios = arrData[0];          // "2015080400" => "2015.08.0400"
  var s1 = strBios.substring(0, 4);  // extracts the characters between "start" and "end", not including "end" itself.
  var s2 = strBios.substring(4, 6);
  var s3 = strBios.substring(6);
	updateWidget("my_ipro_bios", s1 + "." + s2 + "." + s3);

  updateWidget("my_ipro_ip", arrData[4]);

  var strDate = arrData[6];
	strDate = strDate.replace("-", " ");  //  "2013/11/26 - 10.58" => "2013/11/26  10.58"
	strDate = strDate.replace(".", ":");  //  "2013/11/26 - 10.58" => "2013/11/26  10:58"
	$("#" + "my_ipro_date").html(strDate);  // $("#"+d[1]).html(a[d[0]]); // for <textarea> objects, use val() // for <DIV> objects, use html()

}


function disabledOnNewiPro_my_status_reload() {  // based on status_reload()
  var myShortUrl = "/cgi-bin/jstatus.cgi";

  // add "method: 'GET'" to avoid chrome bug ???

  $.ajax({
        url: myShortUrl,
        cache: false,
        dataType: "json",
        type:"get",
        success: disabledOnNewiPro_dixe_do_my_update_status,
        error: function() {
          // console.log("error: " + $.makeArray(arguments));
        },
        complete: function() {
          // console.log("complete: " + $.makeArray(arguments));
        }
  });
}


function disabledOnNewiPro_getUpdatedStatus(TimeOut) {
	disabledOnNewiPro_my_status_reload();
	window.setTimeout(function(){ disabledOnNewiPro_getUpdatedStatus(TimeOut);}, TimeOut);
}


function disabledOnNewiPro_getStatusOnce() {
	disabledOnNewiPro_my_status_reload();
}


// ----------------------------------------------
// PLC Configuration:
// ----------------------------------------------


function dixe_do_my_update_miniconf(a){ // based on dixe_do_update_miniconf()
  // sample response:
  // ["10.1.2.100",          //  0 - ip               // network
  //  "familiar",            //  1 -
  //  "10.1.2.250",          //  2 - dns              // network
  //  "uucp",                //  3 -
  //  "1",                   //  4 - modslave
  //  "255.255.255.0",       //  5 - netmask          // network
  //  "10.1.2.0",            //  6 - network          // network
  //  "10.1.2.250",          //  7 - gateway          // network
  //  "100",                 //  8 -
  //  "9600,N,8,1",          //  9 - modslave_p
  //  "38400",               //  10 - tastiera_baud
  //  "on",                  //  11 -
  //  "none",                //  12 -
  //  "80",                  //  13 - web_http        // port
  //  "443",                 //  14 - web_https		  // port
  //  "502",                 //  15 - modslave_port	  // port
  //  "1131",                //  16 - isa1_port		  // port
  //  "1113",                //  17 - isa2_port		  // port
  //  "6666",                //  18 - visio_port	  // port
  //  "22",                  //  19 - ssh_port		  // port
  //  "Israel",              //  20 - timezone        // time
  //  "C8:BE:19:D3:74:DA",   //  21 -
  //  "8.8.8.8",             //  22 - dns2            // network
  //  "1",                   //  23 - ntp_interval    // time
  //  "193.204.114.232",     //  24 - ntp_server      // time
  //  "_none",               //  25 - modslave485_port
  //  "yes",                 //  26 -
  //  "0",                   //  27 -
  //  "0",                   //  28 -
  //  "none",                //  29 -
  //  "none",                //  30 -
  //  "none",                //  31 -
  //  "none",                //  32 -
  //  "10.1.1.1",            //  33 -
  //  "255.255.255.0",       //  34 -
  //  "0",                   //  35 -
  //  "0",                   //  36 -
  //  "0",                   //  37 -
  //  "0",                   //  38 -
  //  "65535"]               //  39 -

	updateWidget("my_cfg_ip", a[0]);
	updateWidget("my_cfg_dns", a[2]);
	updateWidget("my_cfg_modslave", a[4]);
	updateWidget("my_cfg_netmask", a[5]);
	updateWidget("my_cfg_network", a[6]);
	updateWidget("my_cfg_gateway", a[7]);
	updateWidget("my_cfg_modslave_p", a[9]);
	updateWidget("my_cfg_tastiera_baud", a[10]);
	updateWidget("my_cfg_web_http", a[13]);         // port
	updateWidget("my_cfg_web_https", a[14]);        // port
	updateWidget("my_cfg_modslave_port", a[15]);    // port
	updateWidget("my_cfg_isa1_port", a[16]);        // port
	updateWidget("my_cfg_isa2_port", a[17]);        // port
	updateWidget("my_cfg_visio_port", a[18]);       // port
	updateWidget("my_cfg_ssh_port", a[19]);         // port
	updateWidget("my_cfg_timezone", a[20]);         // time
	updateWidget("my_cfg_dns2", a[22]);
	updateWidget("my_cfg_ntp_interval", a[23]);     // time
	updateWidget("my_cfg_ntp_server", a[24]);       // time

	//updateWidget("modslave485_port", a[25]);

	// if(a[25][0]=="_"){
	// 	$("#modslave485_port option[value='yes']").text("Enabled");
    //     $("#modslave485_port option[value='rs232']").remove();
    //     $("#modslave485_port").val(a[25].substring(1))
    // }else{
	// 	$("#modslave485_port").val(a[25])
	// }

	// !! // timezone=a[20];
	// !! // dixe_refresh_tz()
}

function disabledOnNewiPro_dixe_my_refresh_miniconf() { // based on dixe_refresh_miniconf()
  var myShortUrl = "/cgi-bin/jconf.cgi";

	$.ajax({
		url: myShortUrl,
		cache: false,
		dataType: "json",
		type:"get",
		success:disabledOnNewiPro_dixe_do_my_update_miniconf,
		error:function(b,a){
			// console.log("Update Failed: " + a + " " + b.status + " - " + b.statusText);
		}
	});
}

function disabledOnNewiPro_getConfigOnce() {
	disabledOnNewiPro_dixe_my_refresh_miniconf();
}


function disabledOnNewiPro_getConfigPermission() { // based on dixe_refresh_miniconf()
  var myShortUrl = "/cgi-bin/jconf.cgi";

	$.ajax({
		url: myShortUrl,
		cache: false,
		dataType: "json",
		type:"get",
		success:function(arrData) {
			// console.log("Update Failed: " + a + " " + b.status + " - " + b.statusText);
      var isOk = false;
      if (arrData == null)
        isOk = false;
      else if (arrData.length == null)
        isOk = false;
      else if (arrData.length == 0)
        isOk = false;
      else if (arrData.length > 0)
        isOk = true;

      if (isOk) {
        $(".configNoPermission").removeClass("configNoPermission");
      }
		},
		error:function(b,a) {
			// console.log("Update Failed: " + a + " " + b.status + " - " + b.statusText);
		}
	});
}

function disabledOnNewiPro_getConfigPermissionOnce() {
	disabledOnNewiPro_getConfigPermission();
}


// ----------------------------------------------
// Form Accessories:
// ----------------------------------------------

/* function doMySubmit(myBtnId) {
  // set_status_msg("msg_" + myBtnId, "Submitting " + myBtnId.substr(2) + ", Please wait . . .", 5000);
  // set_status_msg("msg_" + myBtnId, "Saving new values, Please wait . . .", 5000);
  set_status_msg("msg_" + myBtnId, "שמירת נתונים, אנא המתן", 3000);
  $("#" + "btn_" + myBtnId).click();
  return false;
} */


function doSetVar(varName, varValue) {
  var strURL = set_cgi + "?name=" + varName + "&value=" + varValue;

  request = $.ajax({
    url: strURL,
    cache: false,
    complete: function(data) {
    // dbg // console.log("complete: " + data);
    },
    success: function(data) {  // Note: Since jQuery 1.8, .success, .error and .complete are deprecated in favor of .done, .fail and .always.
    // dbg // console.log("success: " + data);
    }
  });
}

function set_status_msg(msgId, b,a){
  $("#" + msgId).text(b);
  $("#" + msgId).slideDown();
  if(a){
    setTimeout(function(){$("#" + msgId).slideUp()},a)
  }
}

function hide_status_msg(msgId){
  $("#" + msgId).slideUp()
}


// ------------------------------------------
