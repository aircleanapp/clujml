'use strict';

var aqiText = ['Good! Little or no health risk.','Moderate. Kids, elderly and sick may experience irritations.','Unhealthy for kids, elderly and sick! Increased likelihood of respiratory symptoms in sensitive individuals. Others may feel slight irritation.','Unhealthy! Increased aggravation of heart and lungs. Kids, elderly and sick are at high risk to experience adverse health effects.','Very Unhealthy! Everyone can be affected.','','Hazardous! Toxic. Serious risk to heart and lungs. Everyone should avoid all outdoor exertion.','','',''];
var aqiDesc = ['Good! Ventilating your home is recommended.','Moderate! Most people can enjoy usual outdoor activities.','Unhealthy for Sensitive Groups! Kids, elederly and sick should avoid outdoor activity (others should reduce).','Unhealthy! Outdoor exertion, particularly for sensitive groups, should be limited. Everyone should wear a pollution mask.','Very Unhealthy! Avoid heaby outdoor activity.','','Toxic! Everyone should wear a pollution mask. Homes should be sealed and air purifiers turned on.','','',''];
aqiText[5] = aqiText [4]; aqiDesc[5] = aqiDesc[4];
aqiText[7] = aqiText [6]; aqiDesc[7] = aqiDesc[6];
aqiText[8] = aqiText [7]; aqiDesc[8] = aqiDesc[7];
aqiText[9] = aqiText [8]; aqiDesc[9] = aqiDesc[8];
        

const applicationServerPublicKey = 'BIHLaa69coLJ7sQ2_2Ya5NTMovYrVCMpt489hLDgEETRt-wxWdatorJzUehq_shAdVbzdrsAHOZp7iISqIdzTtE';
const pushButton = document.querySelector('.js-push-btn');
let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('sw.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);
    swRegistration = swReg;
    initializeUI();
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported');
  //pushButton.textContent = 'Push Not Supported';
  pushButton.innerHTML = '';
}

function updateBtn() {
  if (Notification.permission === 'denied') {
    pushButton.textContent = 'Push Messaging Blocked.';
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  }

  if (isSubscribed) {
    //pushButton.innerHTML='<i class="fa fa-bell-o"></i> Stop Alerts';
    pushButton.classList.remove('mdl-button--raised');
    pushButton.classList.remove('mdl-button--colored');
    pushButton.classList.add('hid');  
    //pushButton.innerHTML = '<img src="images/silent.svg" width=15 title="Pause Alerts!" rel="tooltip">';
    //pushButton.textContent = 'Pause Alerts';
  } else {
    pushButton.innerHTML='<i class="fa fa-bell"></i> Get Alerts !';
    pushButton.classList.add('mdl-button--raised');
    pushButton.classList.add('mdl-button--colored');   
    pushButton.classList.remove('hid');
    //pushButton.innerHTML = '<img src="images/bell.svg" width=15 title="Get AQI Alerts!" rel="tooltip">';
    //pushButton.textContent = 'Get AQI Alerts';
  }

  pushButton.disabled = false;
}


function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server

  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionDetails =
    document.querySelector('.js-subscription-details');

  if (subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    //subscriptionDetails.classList.remove('is-invisible');
  } else {
    //subscriptionDetails.classList.add('is-invisible');
  }
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log('User is subscribed.');

    updateSubscriptionOnServer(subscription);

    isSubscribed = true;

    updateBtn();
      
    $('#sendToken').css('visibility', 'visible');  
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
    updateBtn();
  });
}

function unsubscribeUser() {
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    if (subscription) {
      return subscription.unsubscribe();
    }
  })
  .catch(function(error) {
    console.log('Error unsubscribing', error);
  })
  .then(function() {
    updateSubscriptionOnServer(null);

    console.log('User is unsubscribed.');
    isSubscribed = false;

    updateBtn();
  });
}

function initializeUI() {
  pushButton.addEventListener('click', function() {
      pushButton.disabled = true;
      if (isSubscribed) {
        unsubscribeUser();
      } else {
        subscribeUser();
        //$('#sendToken').css('visibility', 'visible');
        //$('#getAlerts').css('visibility','hidden');
      }
  });

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    updateSubscriptionOnServer(subscription);

    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn();
  });
}

function toC(fahr) {
    return Math.round( (fahr-32)/1.8 ); 
}

function showWorldMap () {
    $("#worldMap").html('<iframe src="https://waqi.info/" style="border:0px #ffffff none;" id="aqiMapWorld" class="aqiMap" scrolling="no" frameborder="1" marginheight="0px" marginwidth="0px" height="400px" width="500px" allowfullscreen></iframe>'); 
    $("#showWorldMap").addClass('hid');
}

/* function showCountryMap () {
    $("#countryMap").html('<iframe src="http://www.calitateaer.ro/PROXY/QUALITY_INDEX/" style="border:0px #ffffff none;" id="aqiMapRo" class="aqiMap" scrolling="yes" frameborder="0" marginheight="0px" marginwidth="0px" height="400px" width="500px" allowfullscreen></iframe>'); 
    $("#showCountryMap").addClass('hid');
} */

function showVideoEN () {
    $("#videoEN").html('<iframe width="500px" height="400px" src="https://www.youtube.com/embed/n3DM5scRpns?autoplay=1&start=1&end=80&color=white" frameborder="0" allowfullscreen allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>');
    $("#showVideoEN").addClass('hid');
}

function showVideoSP () {
    $("#videoEN").html('<iframe width="500px" height="400px" src="https://www.youtube.com/embed/Yq7sUVeZ3vk?autoplay=1&start=1&end=80&color=white" frameborder="0" allowfullscreen allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>');
    $("#showVideoSP").addClass('hid');
}

function showVideoFR () {
    $("#videoEN").html('<iframe width="500px" height="400px" src="https://www.youtube.com/embed/fQz1U36Y6ls?autoplay=1&start=1&end=80&color=white" frameborder="0" allowfullscreen allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"></iframe>');
    $("#showVideoFR").addClass('hid');
}

var targets = $( '[rel~=tooltip]' ), target  = false, tooltip = false, title   = false;
targets.bind( 'mouseenter', function() {
    target  = $( this );
    var tip = target.attr( 'title' );
    tooltip = $( '<div id="tooltip"></div>' );
    if( !tip || tip == '' ) return false;
    target.removeAttr( 'title' );
    tooltip.css( 'opacity', 0 ).html( tip ).appendTo( 'body' );
    var init_tooltip = function() {
        if( $( window ).width() < tooltip.outerWidth() * 1.5 ) tooltip.css( 'max-width', $( window ).width() / 2 );
        else tooltip.css( 'max-width', 340 );
        var pos_left = target.offset().left + ( target.outerWidth() / 2 ) - ( tooltip.outerWidth() / 2 ),
            pos_top  = target.offset().top - tooltip.outerHeight() - 20;
        if( pos_left < 0 ) {
            pos_left = target.offset().left + target.outerWidth() / 2 - 20; tooltip.addClass( 'left' );}
        else tooltip.removeClass( 'left' );
        if( pos_left + tooltip.outerWidth() > $( window ).width() ) { pos_left = target.offset().left - tooltip.outerWidth() + target.outerWidth() / 2 + 20; tooltip.addClass( 'right' );}
        else tooltip.removeClass( 'right' );
        if( pos_top < 0 ) {
            var pos_top  = target.offset().top + target.outerHeight();tooltip.addClass( 'top' );}
        else tooltip.removeClass( 'top' );
        tooltip.css( { left: pos_left, top: pos_top } ) .animate( { top: '+=10', opacity: 1 }, 50 );
    };
    init_tooltip();
    $( window ).resize( init_tooltip );
    var remove_tooltip = function() {
        tooltip.animate( { top: '-=10', opacity: 0 }, 50, function() {$( this ).remove();});
        target.attr( 'title', tip );
    };
    target.bind( 'mouseleave', remove_tooltip );
    tooltip.bind( 'click', remove_tooltip );
});


function weather() {
    'use strict';
    
    var location = document.getElementById("location"), apio = "7e069e35c71343b473906398a88ddd5", url = "https://api.darksky.net/forecast/", aqio = "3496bf8a-97d7-475c-86d0-5bc7d85ae5c3";//airvisual key expires in Feb 2021, older key="MZecdAz2qjDc9KGn";
  
    //navigator.geolocation.getCurrentPosition(success, error );
    //success(null, 46.77, 23.55);
    success(null,46.778373, 23.614623 );
    
    function success(position,x,y) {
        if (x==null) {var latitude = position.coords.latitude;} else {var latitude=x;}
        if (y==null) {var longitude = position.coords.longitude;} else {var longitude=y;}

        location.innerHTML ="your latitude is " + latitude.toFixed(2) + " and your longitude is " + longitude.toFixed(2);
        //aqio+='5';
	  var settings = {
	    "url": "https://api.airvisual.com/v2/nearest_city?lat="+latitude+"&lon="+longitude+"&key="+aqio,
        //"url": "https://api.airvisual.com/v2/nearest_station?lat="+latitude+"&lon="+longitude+"&key="+aqio,
        //"url": "https://api.airvisual.com/v2/stations?city=Beijing&state=Beijing&country=China&key="+aqio,
        "method": "GET",
	    "timeout": 0,
	  };
	  $.ajax(settings).done(function (response) {
	    console.log(response); 
		var aqi = response.data.current.pollution.aqius, main = response.data.current.pollution.mainus, mainChina = response.data.current.pollution.maincn, aqiColor = parseInt(aqi/50), mainTitle="Main pollutant";
		switch ( main ) {
		  case "p2":
		    var pollutant = "PM₂₅";
            var pollutanText = "Fine Particles ≤2.5µm";    
		    break;
		  case "p1":
		    var pollutant = "PM₁₀";
            var pollutanText = "Coarse Particulate Matter ≤10µm";
		    break;
		  case "o3":
		    var pollutant = "O₃";
            var pollutanText = "Groundlevel Ozone";
		    break;
		  case "n2":
		    var pollutant = "NO₂";
            var pollutanText = "Nitrogen Dioxide";
		    break;
		  case "s2":
		    var pollutant = "SO₂";
            var pollutanText = "Sulfur Dioxide";
		    break;
		  case "co":
		    var pollutant = "CO";
            var pollutanText = "Carbon monoxide";
		}
		
        if (main!=mainChina) {
            mainTitle+="s";
            switch ( mainChina ) {
              case "p2":
                pollutant+= " PM₂₅";
                pollutanText+= ", Fine Particles ≤2.5µm";
                break;
              case "p1":
                pollutant+= " PM₁₀";
                pollutanText+= ", Coarse Particulate Matter ≤10µm";
                break;
              case "o3":
                pollutant+= " O₃";
                pollutanText+= ", Groundlevel Ozone";
                break;
              case "n2":
                pollutant+= " NO₂";
                pollutanText+= ", Nitrogen Dioxide";
                break;
              case "s2":
                pollutant+= " SO₂";
                pollutanText+= ", Sulfur Dioxide";
                break;
              case "co":
                pollutant+= " CO";
                pollutanText+= ", Carbon monoxide";
            }
        }
   /* "units": { //object containing units information
      "p2": "μgm³", //pm2.5
      "p1": "μgm³", //pm10
      "o3": "ppb", //Ozone O3
      "n2": "ppb", //Nitrogen dioxide NO2 
      "s2": "ppb", //Sulfur dioxide SO2 
      "co": "ppm" //Carbon monoxide CO */
		
		//$("#city").html( response.data.city );
        $("#city").html( 'Cluj' );  
        $("#country").html ( response.data.country );
        $('#exhaust').attr('title',mainTitle);    
		$('#pollutant').html(pollutant + " ").attr('title',pollutanText);
        $("#aqi").html("&nbsp;AQI: " + aqi + "&nbsp;" );
		$('#aqi').addClass("aqiColor"+aqiColor);
        $('#aqi').attr('title','Official AQI in Str. Dâmboviţei, Mărăști');  
        //$('#aqi').attr('title',aqiDesc[aqiColor]);  
        $('#aqicon').attr('src','images/icons/' + aqiColor + '.svg');
        $('#aqicon').attr('title',aqiText[aqiColor]);  
	  });
      apio+='e';
        
    $.getJSON(
      url + apio + "/" + latitude + "," + longitude + "?callback=?",
      function(data) { console.log(data);
        $("#summaryh").html(replaceF(data.hourly.summary));
        $("#summaryd").html(replaceF(data.daily.summary));                
        $("#day2tempHigh").html(toC(data.daily.data[1].temperatureHigh)+"°");
        $("#day2tempLow").html(toC(data.daily.data[1].temperatureLow)+"°");
        $("#day3tempHigh").html(toC(data.daily.data[2].temperatureHigh)+"°");
        $("#day3tempLow").html(toC(data.daily.data[2].temperatureLow)+"°");
        $("#day4tempHigh").html(toC(data.daily.data[3].temperatureHigh)+"°");
        $("#day4tempLow").html(toC(data.daily.data[3].temperatureLow)+"°");
        $("#day5tempHigh").html(toC(data.daily.data[4].temperatureHigh)+"°");
        $("#day5tempLow").html(toC(data.daily.data[4].temperatureLow)+"°");
        $("#day6tempHigh").html(toC(data.daily.data[5].temperatureHigh)+"°");
        $("#day6tempLow").html(toC(data.daily.data[5].temperatureLow)+"°");
        $("#day7tempHigh").html(toC(data.daily.data[6].temperatureHigh)+"°");
        $("#day7tempLow").html(toC(data.daily.data[6].temperatureLow)+"°");
        //$("#day8tempHigh").html(toC(data.daily.data[7].temperatureHigh)+"°");
        //$("#day8tempLow").html(toC(data.daily.data[7].temperatureLow)+"°");              
        $("#day2icon").attr({src: 'images/icons/' + data.daily.data[1].icon + '.svg', title: data.daily.data[1].summary });
        $("#day3icon").attr({src: 'images/icons/' + data.daily.data[2].icon + '.svg', title: data.daily.data[2].summary });
        $("#day4icon").attr({src: 'images/icons/' + data.daily.data[3].icon + '.svg', title: data.daily.data[3].summary });
        $("#day5icon").attr({src: 'images/icons/' + data.daily.data[4].icon + '.svg', title: data.daily.data[4].summary });
        $("#day6icon").attr({src: 'images/icons/' + data.daily.data[5].icon + '.svg', title: data.daily.data[5].summary });
        $("#day7icon").attr({src: 'images/icons/' + data.daily.data[6].icon + '.svg', title: data.daily.data[6].summary });
        //$("#day8icon").attr({src: 'images/icons/' + data.daily.data[7].icon + '.svg', title: data.daily.data[7].summary });
        $("#temp").html( toC(data.currently.temperature) + "°");
		$("#tempMax").html(toC(data.daily.data[0].temperatureMax) + "°");
        $("#tempMin").html(toC(data.daily.data[0].temperatureMin) + "°..");
        $("#apparentTemperature").html( toC (data.currently.apparentTemperature) + "°");
		$("#ozone").html(Math.round(data.currently.ozone)+" DU");
		$("#uvIndex").html(data.currently.uvIndex);
        $("#precipProbability").html( Math.round(data.currently.precipProbability*100) + "%");  
		$("#humidity").html( Math.round(data.currently.humidity*100) + "%");
		$("#windSpeed").html( Math.round (data.currently.windSpeed*1.609) + " ㎞h");
		$("#windGust").html( Math.round (data.currently.windGust*1.609) + " ㎞h");
		$("#windBearing").html(data.currently.windBearing + "° ");		  
		$("#dewPoint").html( toC(data.currently.dewPoint) + "°");
		$("#pressure").html( Math.round(data.currently.pressure));
		$("#cloudCover").html( Math.round(data.currently.cloudCover*100) + "%");
		$("#visibility").html( Math.round(data.currently.visibility*1.609) + "㎞");  
		$("#icon").attr('src','images/icons/' + data.currently.icon + '.svg');
        $("#summary").html(data.currently.summary);
        if (typeof data.alerts != 'undefined') {              
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
      }
    );
  }

  function error() {
    location.innerHTML = "Unable to retrieve your location";
  }

  location.innerHTML = "Coordinates: 46.78°, 23.61°"; //"Locating...";
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
	function downloadData(time, id, sensor, u, k, vocid) {
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
                    if ( (Object.keys(data)[0] == 'error') || (typeof data[0]=='undefined') )      
						$("#status").html(data['error']).css('color', 'red');
                    else {
						//var stringified = JSON.stringify(data);
						//$("#status").html('ok ' + (data.length?(data.length+' row(s) '):' ') + (stringified.length/1000) + ' KB').css('color', 'green');
                        console.log(data);
                        $('#molecule').attr('src','images/molecule.svg').attr('title','Volatile organic compounds (VOCs)');
                        var vocaqi=data[0].vocaqi, voclat=data[0].latitude, voclong=data[0].longitude, vocaddr='';
                        $.ajax({type: 'GET', url: "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=" + voclat + "&lon=" + voclong, dataType: 'json', headers: { 'Content-Type' : 'text/plain' }, 
                                success: function(locdata, status) { 
                                    console.log(locdata);
                                    if (status=='success') $('#vocaqi'+vocid).attr('title','Live VOCs level in '+locdata.address.road.replace("Strada", "Str.").replace("Sergiu Celibidache", "Celibidache")+', '+locdata.address.suburb.replace("Europa","Zorilor").replace("Aurel Vlaicu","Mărăști"));
                                    //$('#vocaqi'+vocid).attr('title',locdata.display_name);
                                }
                        });
                        var vocaqiColor = parseInt(vocaqi/50); if (vocaqiColor>=10) vocaqiColor=9;
                        $('#vocaqi'+vocid).html("&nbsp;"+vocaqi+"&nbsp;").addClass("aqiColor"+vocaqiColor);
                        $('#vocaqicon'+vocid).attr({src: 'images/icons/' + vocaqiColor + '.svg', title: aqiText[vocaqiColor] });
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

function pulse(valueType) { // = pm10, pm25, temperature, humidity, noise
    var ts1 = new Date();
    var f = ts1.toISOString(); f=f.substring(0, f.length - 5)+'%2b02:00'; console.log(f);
    var ts2 = new Date(ts1.getTime() + 3600000);
    var t = ts2.toISOString(); t=t.substring(0, t.length - 5)+'%2b02:00'; console.log(t);
    $.ajax({
		  type: 'GET',
		  url: "https://cluj-napoca.pulse.eco/rest/dataRaw?type="+valueType+"&from="+f+"&to="+t,
		  dataType: 'json',
          headers: { 'Content-Type' : 'text/plain', 'Authorization' : 'Basic ' + window.btoa('cleanair:stam1234') },
		  success: function(data, status) { 
                if (status != 'success') {
					   console.log(status);
				} else {
                    if ( (Object.keys(data)[0] == 'error') || (typeof data[0]=='undefined') )      
						console.log(data[0]);
                    else {
						//var stringified = JSON.stringify(data);
                        console.log(data[0].value,data[1].value,data[2],data[3],data[4],data[5]);
                        //$('#sensor'+valueType).attr('src','images/quote.png').attr('title',valueType);
                        $('#sensor1').attr({src: 'images/icons/sensor1.svg', title: 'Sensor 1' });
                        $('#sensor2').attr({src: 'images/icons/sensor2.svg', title: 'Sensor 2' });
                        var s1 = data[0].value;
                        var s2 = data[1].value;
                        $('#sensor1'+valueType).html("&nbsp;"+s1+"&nbsp;").addClass("aqiColor"+toAQI(s1,valueType));
                        $('#sensor2'+valueType).html("&nbsp;"+s2+"&nbsp;").addClass("aqiColor"+toAQI(s2,valueType));
                        //var vocaqi=data[0].vocaqi, voclat=data[0].latitude, voclong=data[0].longitude, vocaddr='';
                        //$('#vocaqi'+vocid).html("&nbsp;"+vocaqi+"&nbsp;").addClass("aqiColor"+vocaqiColor);
					}
				}
		    	},
		    	async: true
		});
}

function toAQI(n,t) {
    if (t=='pm25') {
        if (n<=12) { return 0; }
        else if (n<=36) { return 1; }
        else if (n<=55) { return 2; }
        else if (n<=150) { return 3; }
        else if (n<=250) { return 4; }
        else return 6; //5 is same color as 4, 6 is same as 7,8,9
    } else if (t=='pm10') {
        if (n<=54) { return 0; }
        else if (n<=154) { return 1; }
        else if (n<=254) { return 2; }
        else if (n<=354) { return 3; }
        else if (n<=424) { return 4; }
        else return 6; //5 is same color as 4, 6 is same as 7,8,9        
    } else return 0;
}

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
  var regexinch = /in/;
  var fahr = parseInt(str.match(regex));
  if (fahr && !str.match(regexinch)) {
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
        downloadData(time, '82000002', 'vocaqi', userid, userkey, 0 ); // 82000002 82000009
        downloadData(time, '82000007', 'vocaqi', userid, userkey, 1 );
        downloadData(time, '82000009', 'vocaqi', userid, userkey, 2 );
        
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