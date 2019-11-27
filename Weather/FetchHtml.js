function parseResponse(FetchXml) {

	var i;
	var ForecastTag = FetchXml.getElementsByTagName("forecast");
	var TimeTag = ForecastTag[0].getElementsByTagName("time").length;
	var DayTag,
		TemperatureTag,
		WindTag,
		CloudTag,
		HumidityTag,
		IconTag, temp, wps;
	var WholeData = [],
		avgerageofday = [],
		value = [],
		TimeCheck = [],
		MMPPSS = [],
		TTEEPP = [],
		dateee = [];
	var current = null;
	var cnt = 0,
		sum = 0;
	var months = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


	for (i = 0; i < TimeTag; i++) {

		DayTag = ForecastTag[0].getElementsByTagName("time")[i].getAttribute('from');



		TemperatureTag = parseInt(parseFloat(ForecastTag[0].getElementsByTagName("time")[i].getElementsByTagName("temperature")[0]
			.getAttribute('value')) - 273);

		WindTag = ForecastTag[0].getElementsByTagName("time")[i].getElementsByTagName("windDirection")[0].getAttribute('name');

		CloudTag = ForecastTag[0].getElementsByTagName("time")[i].getElementsByTagName("clouds")[0].getAttribute('value');

		HumidityTag = ForecastTag[0].getElementsByTagName("time")[i].getElementsByTagName("humidity")[0].getAttribute('value') +
			ForecastTag[0].getElementsByTagName("time")[i].getElementsByTagName("humidity")[0].getAttribute('unit');


		IconTag = ForecastTag[0].getElementsByTagName("time")[i].getElementsByTagName("symbol")[0].getAttribute('var');

		temp = ForecastTag[0].getElementsByTagName("time")[i].getElementsByTagName("temperature")[0].getAttribute('value');

		wps = ForecastTag[0].getElementsByTagName("time")[i].getElementsByTagName("windSpeed")[0].getAttribute('mps');

		TTEEPP.push(TemperatureTag);
		MMPPSS.push(wps);
		dateee.push(DayTag.substring(0, 10));

		console.log(TemperatureTag);

		TimeCheck.push(DayTag.substring(0, 10));

		WholeData.push({
			Date: DayTag.substring(0, 10),
			Temperature: TemperatureTag,
			Wind: WindTag,
			Cloud: CloudTag,
			HumidityTag: HumidityTag,
			Icon: IconTag,

		})

	}
	console.log(WholeData);

	for (var i = 0; i < TimeCheck.length; i++) {
		if (TimeCheck[i] != current) {
			if (cnt > 0) {
				value.push({
					CurrentDate: current,
					Count: cnt
				});
				
				console.log(current , cnt);
			}
			current = TimeCheck[i];
			cnt = 1;
		} else {
			cnt++;
		}
		
	}
	if (cnt > 0) {
		value.push({
			CurrentDate: current,
			Count: cnt
		});
		
		console.log(current , cnt);
	}

	//console.log(value);
	for (var w = 0; w < value.length; w++) {
		sum = 0;
		for (var q = 0; q < TimeTag; q++) {
			if (WholeData[q].Date === value[w].CurrentDate) {
				sum += WholeData[q].Temperature;

			}
		}

		avgerageofday.push({
			Average: sum / value[w].Count,
			AverageWind: WholeData[w].Wind,
			AverageCloud: WholeData[value[w].Count].Cloud,
			AveragIcon: WholeData[value[w].Count].Icon
		});
	}

	var finalString = '';
	for (row = 0; row < avgerageofday.length; row++) {
		//	finalString += "<td><div class='pic'><img src='http://openweathermap.org/img/w/" + avgerageofday[row].AveragIcon + ".png'><div>" + value[row].Count + "</td>";
		if (row == 0) {
			document.getElementById("CurrentValue").innerHTML = avgerageofday[row].Average;
			document.getElementById("CurrentCloud").innerHTML = avgerageofday[row].AverageCloud;
			document.getElementById("CurrentWind").innerHTML = avgerageofday[row].AverageWind;
		} else {
			var day = new Date(value[row].CurrentDate);
			finalString += " <td><div><center><label id='AverageVV'>" + avgerageofday[row].Average.toFixed(2) + "</label></center></div><center><div><label id='WindVV' >" + avgerageofday[row].AverageWind + "</label></center></div><div><center><label id='CloudVV' >" + avgerageofday[row].AverageCloud + "</label></center></div><div></center><center><label id='DateVV'>" + months[day.getDay()] + "</center></div></td>";
		}

	}

	document.getElementById('ClassTable').innerHTML = finalString;
	// document.getElementById('FirstConatiner').style.display = 'none';
	// document.getElementById('SecondContainer').style.display = 'block';

	DrawGraphChat(TTEEPP, MMPPSS, dateee);
}


function DrawGraphChat(TTEEPP, MMPPSS, dateee) {

	document.getElementById('myChart').style.display = 'block';
	document.getElementById('myChartBar').style.display = 'block';

	var ctx = document.getElementById('myChart').getContext('2d');
	var ctx1 = document.getElementById('myChartBar').getContext('2d');

	var chart = new Chart(ctx, {
		// The type of chart we want to create
		type: 'line',

		// The data for our dataset
		data: {
			labels: dateee,
			datasets: [{
					label: "Wind Speed",
					backgroundColor: 'rgb(0, 0, 255)',
					borderColor: 'rgb(0, 0, 132)',
					fill: false,
					data: MMPPSS,
				},
				{
					label: "Temperature",
					backgroundColor: 'rgb(255, 99, 132)',
					borderColor: 'rgb(255, 99, 132)',
					data: TTEEPP,
				},
			]

		},

		// Configuration options go here
		options: {
			maintainAspectRatio: false,
			responsive: false,
			legend: {
				labels: {
					fontColor: "white",
					fontSize: 18
				}
			},
			scales: {
				yAxes: [{
					ticks: {
						fontColor: "white",

						beginAtZero: true
					}
				}],
				xAxes: [{
					ticks: {
						fontColor: "white",
						fontSize: 14,
						stepSize: 1,
						beginAtZero: true
					}
				}]
			}
		}
	});
	var chartBar = new Chart(ctx1, {
		// The type of chart we want to create
		type: 'bar',

		// The data for our dataset
		data: {
			labels: dateee,
			datasets: [{
					label: "Wind Speed",
					backgroundColor: 'rgb(0, 0, 255)',
					borderColor: 'rgb(0, 0, 132)',
					fill: false,
					data: MMPPSS,
				},
				{
					label: "Temperature",
					backgroundColor: 'rgb(255, 99, 132)',
					borderColor: 'rgb(255, 99, 132)',
					data: TTEEPP,
				},


			]
		},

		// Configuration options go here
		options: {
			maintainAspectRatio: false,
			responsive: false,
			legend: {
				labels: {
					fontColor: "white",
					fontSize: 18
				}
			},
			scales: {
				yAxes: [{
					ticks: {
						fontColor: "white",

						beginAtZero: true
					}
				}],
				xAxes: [{
					ticks: {
						fontColor: "white",
						fontSize: 14,
						stepSize: 1,
						beginAtZero: true
					}
				}]
			}
		}
	});
}

function ResponseCheck() {
	var cityName = document.getElementById("CityName").value;

	var request;
	if (window.XMLHttpRequest) {
		request = new XMLHttpRequest();
	} else {
		request = new ActiveXObject("Microsoft.XMLHTTP");
	}
	if (request) {
		request.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				console.log(request.responseXML);
				parseResponse(this.responseXML);
			} else {
				if (this.status == 404){
					document.getElementById("wrapper").style.background = "url('notfound.gif') no-repeat center center";
					document.getElementById('ClassTable').innerHTML = '';
					document.getElementById('CurrentValue').innerHTML = '';
					document.getElementById('CurrentCloud').innerHTML = '';
					document.getElementById('CurrentWind').innerHTML = '';
				}
				else
					document.getElementById("wrapper").style.background = "url('rocket.gif') no-repeat center center";
					document.getElementById('SecondContainer').style.display = 'block';
			}
		};
	}

	request.open("GET", "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName +
		"&APPID=2f29909bd3753c69676857ba59f53c4b&mode=xml", true);
	request.send();

}
window.onload = function () {
	document.getElementById("wrapper").style.background = "url('rocket.gif') no-repeat center center";
	var input = document.getElementById("CityName");
	input.addEventListener("keyup", function (event) {
		if (event.keyCode === 13) {
			event.preventDefault();
			ResponseCheck();
		}
	});

}