function toC(fahr) {
    return Math.round( (fahr-32)/1.8 ); 
}

function showWorldMap () {
    $("#worldMap").html('<iframe src="https://waqi.info/" style="border:0px #ffffff none;" id="aqiMapWorld" class="aqiMap" scrolling="no" frameborder="1" marginheight="0px" marginwidth="0px" height="400px" width="500px" allowfullscreen></iframe>'); 
    $("#showWorldMap").addClass('hid');
}

function showCountryMap () {
    $("#countryMap").html('<iframe src="http://www.calitateaer.ro/PROXY/QUALITY_INDEX/" style="border:0px #ffffff none;" id="aqiMapRo" class="aqiMap" scrolling="yes" frameborder="0" marginheight="0px" marginwidth="0px" height="400px" width="500px" allowfullscreen></iframe>'); 
    $("#showCountryMap").addClass('hid');
}
									
function weather() {
    'use strict';
    
    var location = document.getElementById("location"), apiKey = "7e069e35c71343b473906398a88ddd5e", url = "https://api.darksky.net/forecast/", aqiKey = "MZecdAz2qjDc9KGn5";
  
    //navigator.geolocation.getCurrentPosition(success, error );
    success(null, 46.77, 23.55);
    
    function success(position,x,y) {
        if (x==null) {var latitude = position.coords.latitude;} else {var latitude=x;}
        if (y==null) {var longitude = position.coords.longitude;} else {var longitude=y;}

        location.innerHTML ="your latitude is " + latitude.toFixed(2) + " and your longitude is " + longitude.toFixed(2);

	  var settings = {
	    "url": "https://api.airvisual.com/v2/nearest_city?lat="+latitude+"&lon="+longitude+"&key="+aqiKey,
	    "method": "GET",
	    "timeout": 0,
	  };
	  $.ajax(settings).done(function (response) {
	    console.log(response); 
		var aqi = response.data.current.pollution.aqius;
		var main = response.data.current.pollution.mainus;
        var aqiColor = parseInt(aqi/50); 
		
		switch ( main ) {
		  case "p2":
		    var pollutant = "PM 2.5";
		    break;
		  case "p1":
		    var pollutant = "PM 10";
		    break;
		  case "o3":
		    var pollutant = "Ozone";
		    break;
		  case "n2":
		    var pollutant = "NO2";
		    break;
		  case "s2":
		    var pollutant = "SO2";
		    break;
		  case "co":
		    var pollutant = "CO";
		}
		
		/* units": { //object containing units information
      "p2": "ugm3", //pm2.5
      "p1": "ugm3", //pm10
      "o3": "ppb", //Ozone O3
      "n2": "ppb", //Nitrogen dioxide NO2 
      "s2": "ppb", //Sulfur dioxide SO2 
      "co": "ppm" //Carbon monoxide CO */
		
		$("#city").html( response.data.city );
        $("#country").html ( response.data.country );  
		$("#aqi").html("&nbsp;AQI: " + aqi + "&nbsp;" );
		$('#aqi').addClass("aqiColor"+aqiColor);
		$('#pollutant').html(pollutant + " ");
        $('#aqicon').attr('src','images/icons/' + aqiColor + '.svg');  
        switch ( aqiColor ) {
		  case "p2":
		    pollutant = "PM 2.5";
		    break;
		  case "p1":
		    pollutant = "PM 10";
		    break;
		  case "o3":
		    pollutant = "Ozone";
		    break;
		  case "n2":
		    pollutant = "NO2";
		    break;
		  case "s2":
		    pollutant = "SO2";
		    break;
		  case "co":
		    pollutant = "CO";
		}  
	  });

    $.getJSON(
      url + apiKey + "/" + latitude + "," + longitude + "?callback=?",
      function(data) { console.log(data);
        $("#summaryh").html(replaceF(data.hourly.summary));  
        $("#summaryd").html(replaceF(data.daily.summary));                
        $("#day2tempHigh").html(toC(data.daily.data[2].temperatureHigh)+"°");
        $("#day2tempLow").html(toC(data.daily.data[2].temperatureLow)+"°");
        $("#day3tempHigh").html(toC(data.daily.data[3].temperatureHigh)+"°");
        $("#day3tempLow").html(toC(data.daily.data[3].temperatureLow)+"°");
        $("#day4tempHigh").html(toC(data.daily.data[4].temperatureHigh)+"°");
        $("#day4tempLow").html(toC(data.daily.data[4].temperatureLow)+"°");
        $("#day5tempHigh").html(toC(data.daily.data[5].temperatureHigh)+"°");
        $("#day5tempLow").html(toC(data.daily.data[5].temperatureLow)+"°");
        $("#day6tempHigh").html(toC(data.daily.data[6].temperatureHigh)+"°");
        $("#day6tempLow").html(toC(data.daily.data[6].temperatureLow)+"°");
        $("#day7tempHigh").html(toC(data.daily.data[7].temperatureHigh)+"°");
        $("#day7tempLow").html(toC(data.daily.data[7].temperatureLow)+"°");
        $("#day2icon").attr('src','images/icons/' + data.daily.data[2].icon + '.svg');
        $("#day3icon").attr('src','images/icons/' + data.daily.data[3].icon + '.svg');
        $("#day4icon").attr('src','images/icons/' + data.daily.data[4].icon + '.svg');
        $("#day5icon").attr('src','images/icons/' + data.daily.data[5].icon + '.svg');
        $("#day6icon").attr('src','images/icons/' + data.daily.data[6].icon + '.svg');
        $("#day7icon").attr('src','images/icons/' + data.daily.data[7].icon + '.svg');
        $("#temp").html( toC(data.currently.temperature) + "°");
		$("#apparentTemperature").html( toC (data.currently.apparentTemperature) + "°");
		$("#ozone").html(Math.round(data.currently.ozone)+" DU");
		$("#uvIndex").html(data.currently.uvIndex);
        $("#precipProbability").html( Math.round(data.currently.precipProbability*100) + " % ");  
		$("#humidity").html( Math.round(data.currently.humidity*100) + " % ");
		$("#windSpeed").html( Math.round (data.currently.windSpeed*1.609) + " ㎞h");
		$("#windGust").html( Math.round (data.currently.windGust*1.609) + " ㎞h");
		$("#windBearing").html(data.currently.windBearing + "° ");		  
		$("#dewPoint").html( toC(data.currently.dewPoint) + "°");
		$("#pressure").html( Math.round(data.currently.pressure));
		$("#cloudCover").html( Math.round(data.currently.cloudCover*100) + "%");
		$("#visibility").html( Math.round(data.currently.visibility*1.609) + "㎞");  
		$("#icon").attr('src','images/icons/' + data.currently.icon + '.svg');
        $("#summary").html(data.currently.summary);
        if (data.alerts.length>0) {
            $("#alert0").html(data.alerts[0].description);
            $("#alert0date").html(toDate(data.alerts[0].time));
            $("#alert0title").html("Weather Alert");
        }
        if (data.alerts.length>1) {
            $("#alert1").html(data.alerts[1].description);
            $("#alert1date").html(toDate(data.alerts[1].time));                 
            $("#alert1title").html("Weather Alert");
        }
        if (data.alerts.length>2) {              
            $("#alert2").html(data.alerts[2].description);
            $("#alert2date").html(toDate(data.alerts[2].time));
            $("#alert2title").html("Weather Alert");
        }              
      }
    );
  }

  function error() {
    location.innerHTML = "Unable to retrieve your location";
  }

  location.innerHTML = "Locating...";
}

    /* HELPER FUNCTIONS FOR URADMONITOR API
	function getUnit(sensor) {
		switch (sensor) {
			case "temperature": return "°C";
			case "cpm": return "CPM";
			case "voltage": return "Volts";
			case "duty": return "‰";
			case "pressure": return "Pa";
			case "humidity": return "% RH";
			case "gas1": return "ppm";
			case "gas2": return "ppm";
			case "gas3": return "ppm";
			case "gas4": return "ppm";
			case "dust": return "mg/m³";
			case "co2" : return "ppm";
			case "ch2o" : return "ppm";
			case "pm25" : return "µg/m³";
			case "pm10" : return "µg/m³";
			case "noise" : return "dBA";
			case "voc" : return "voc";
		}
	}
    */
    
	/*
	function downloadUnits(u) {
		$("#status").html('loading').css('color', 'magenta');
		$.ajax({
	    		type: 'GET',
    			url: "https://data.uradmonitor.com/api/v1/devices/userid/" + u ,
	    		dataType: 'json',
			success: function(data) { 
			    // status
			    if (Object.keys(data)[0] == 'error') 
			    	$("#status").html(data['error']).css('color', 'red');
				else 
					$("#status").html('Units ok').css('color', 'green');
			    // populate select
				$.each(data, function(key, value) {
					$('#units').append($("<option />").val(value['id']).text(value['id']));
				});
				// first trigger
				if (data.length > 0)
					$('#units').trigger('change');
			},
			async: true
		});
	}

	function downloadCapabilities(id, u, k) {
		$("#status").html('loading').css('color', 'magenta');
		$.ajax({
	    		type: 'GET',
    			url: "https://data.uradmonitor.com/api/v1/devices/" + id ,
	    		dataType: 'json',
	    		headers: { 'Content-Type' : 'text/plain', 'X-User-id': u, 'X-User-hash': k },
			success: function(data) { 
				console.log(data);
			    // status
			    if (Object.keys(data)[0] == 'error') 
			    	$("#status").html(data['error']).css('color', 'red');
				else 
					$("#status").html('Sensors ok').css('color', 'green');
			    // populate select
				$.each(data, function(key, value) {
					$('#sensors').append($("<option />").val(key).text(value[0]));
					console.log(key + " " + value);
				});
				// first trigger
				if (data.length > 0)
					$('#sensors').trigger('change');
			},
			async: true
		});
	}
    */
	function downloadData(time, id, sensor, u, k) {
		$("#status").html('loading').css('color', 'magenta');
		$.ajax({
		    	type: 'GET',
		    	url: "https://data.uradmonitor.com/api/v1/devices/" + id + "/" + sensor + "/" + time,
		    	dataType: 'json',
			headers: { 'Content-Type' : 'text/plain', 'X-User-id': u, 'X-User-hash': k },
		    	success: function(data, status) { 
				if (status != 'success') {
					$("#status").html('error').css('color', 'red');
				} else {
					if (Object.keys(data)[0] == 'error')
						$("#status").html(data['error']).css('color', 'red');
					else {
						//var stringified = JSON.stringify(data);
						//$("#status").html('ok ' + (data.length?(data.length+' row(s) '):' ') + (stringified.length/1000) + ' KB').css('color', 'green');
                        console.log(data);
                        var vocaqi=data[0].vocaqi;
                        $('#vocaqi').html("&nbsp;"+vocaqi+"&nbsp;");
                        $('#vocaqi').addClass("aqiColor"+parseInt(vocaqi/50));
					}
				}
		    	},
		    	async: true
		});
	}
	/*
	if (typeof userid == 'undefined' || typeof userkey == 'undefined')
		$("#status").html('Configure variables userid and userkey in the code, using your credentials, as presented in the dashboard').css('color', 'red');
	else {
		downloadUnits(userid);
	}

	$('#units').on('change', function() {
		$('#sensors').empty();
		downloadCapabilities(this.value, userid, userkey );
	});

	$('#sensors').on('change', function() {
		downloadData(time, $("#units").val(), $("#sensors").val(), userid, userkey ); alert('units='+$("#units").val()+" sensor="+$("#sensors").val());
	});
    */
    
    //units=82000007 sensor=vocaqi
    //units=82000007 sensor=co2
    //units=82000009 sensor=voc
    //units=82000002 sensor=pm1
    //units=82000002 sensor=ch2o
    //units=82000009 sensor=pm25

function toDate(t) {
    var dt=eval(t*1000);
    var myDate = new Date(dt);
    return(myDate.toLocaleString().slice(0, -3));
}

function today() {
  var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var today = new Date();
  var dd = today.getDate();
  var daynum = today.getDay();    
  var day = days[ daynum ];
  var month = months[ today.getMonth() ];    
  var yyyy = today.getFullYear();
  $("#today").html(day+", "+dd+" "+month+" "+yyyy);
  $("#day2").html(days[ daynum+1 ]);
  $("#day3").html(days[ daynum+2 ]);
  $("#day4").html(days[ daynum+3 ]);
  $("#day5").html(days[ daynum+4 ]);
  $("#day6").html(days[ daynum+5 ]);
  $("#day7").html(days[ daynum+6 ]);
}

function replaceF(str) {
  var regex = /\d{1,3}/; 
  var fahr = parseInt(str.match(regex));
  if (fahr) {
    return str.replace(regex, (toC (fahr))) .replace("°F", "°C");     
  } else {
    return str;
  }
  
  //var regex = /\d{1,3}/;
  //return str.replace(regex, (parseInt(str.search(regex))-32)/1.8).replace("°F", "°C");
}

(function($, document, window){
	
	$(document).ready(function(){
        
        today();
        weather();
        
        var userid = "4159"; 
        var userkey= "10b933896af21c291af344f487b9515c";
        var time = 60; // minimum 60 = last reading = 1 min
        downloadData(time, '82000007', 'vocaqi', userid, userkey );
        
		// Cloning main navigation for mobile menu
		$(".mobile-navigation").append($(".main-navigation .menu").clone());

		// Mobile menu toggle 
		$(".menu-toggle").click(function(){
			$(".mobile-navigation").slideToggle();
		});

		var map = $(".map");
		var latitude = map.data("latitude");
		var longitude = map.data("longitude");
		if( map.length ){
			
			map.gmap3({
				map:{
					options:{
						center: [latitude,longitude],
						zoom: 15,
						scrollwheel: false
					}
				},
				marker:{
					latLng: [latitude,longitude],
				}
			});
			
		}
	});

	$(window).load(function(){

	});

})(jQuery, document, window);