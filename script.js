// contains list (empty until given event)
var searchHistory = [];
// returns local storage search history
function getItems() {
    var storedCities = JSON.parse(localStorage.getItem("searchHistory"));
    if (storedCities !== null) {
        searchHistory = storedCities;
    };
     // lists up to 8 locations
    for (i = 0; i < searchHistory.length; i++) {
        if (i == 8) {
            break;
          }
        //  creates links/buttons https://getbootstrap.com/docs/4./components/list-group/
        cityListButton = $("<a>").attr({
            class: "list-group-item list-group-item-action",
            href: "#"
        });
        // appends history as a button below the search field
        cityListButton.text(searchHistory[i]);
        $("#CityDisplay").append(cityListButton);
    }
};






var SearchBtn = $('.btn')

var TodayCityNameElement = $('#CityNameElement')
var TodayWeatherSec = $('#WeatherToday')
var TodayTempElement = $('#TempElement')
var TodayWindElement = $('#WindElement')
var TodayHumidElement = $('#HumidElement')
var TodayUVElement = $('#UVElement')

var CityDispaly = $('#CityDisplay')

SearchBtn.on('click',ClickSearchButton)


function ClickSearchButton(event)
{
    event.preventDefault() 
    GetLocation()
    
}

getItems()

function GetLocation()
{   // select form element by its `name` attribute and get its value
    var CityNameInput = $('input[name="CityNameInput"]').val().toUpperCase()
    // if there's nothing in the form entered, alert is triggered
    if (!CityNameInput) {
      window.alert('No valid input')
      TodayCityNameElement.text('')
      return;
    } 

    // get latitude & longtitude of searched city
    var LocationApiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + CityNameInput + "&limit=1&appid=296016cd181ee0855801dffc3c8a2bee"
    fetch(LocationApiUrl).then(function(response)
    {
        if (response.ok)
        {
            response.json().then(function(location){
                console.log(location);
                if (location.length>0)
                {var lat = location[0].lat
                 var lon = location[0].lon
                } else {window.alert('No valid input')
                $('input[name="CityNameInput"]').val('')
                return;
                }
            GetTodayWeather(CityNameInput,lat,lon)
            })
        }}
    )
}

    // get weather information of the searched city
function GetTodayWeather(CityNameInput, lat, lon)
{
    var WeatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=metric&exclude=hourly,daily&appid=296016cd181ee0855801dffc3c8a2bee"
    fetch(WeatherApiUrl).then(function (response)
    {
        if (response.ok)
        {
            response.json().then(function (data){
                console.log(data);

               // display today's date from using Moment
               var TodayDate = moment().format("DD/MM/YYYY")
               // get today's weather icon to indicate weather condition
               var TodayIcon = " http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png"
              
               // clear previous city name display if applicable
               TodayCityNameElement.text('')
               // show the name of the searched city
               TodayCityNameElement.prepend('<h3>' + CityNameInput + ' ' + "(" + TodayDate + ")" + '</h3>')
               // show weather icon of searched city
               
               TodayCityNameElement.append($('<img>').attr("src", TodayIcon))
               // clear the form input element
               $('input[name="CityNameInput"]').val('')
               //show tempreture of the searched city
               TodayTempElement.text("Temp: "+ Math.round(data.current.temp) + "°C");
               //show wind of the searched city
               TodayWindElement.text("Wind: "+ data.current.wind_speed + " km/h");
               //show humid of the searched city
               TodayHumidElement.text("Humid: "+ data.current.humidity + "%");
               //show UV index of the searched city
               TodayUVElement.text("UV Index: "+ data.current.uvi)
               // various colors to indicate UV condition
               if (data.current.uvi <= 3) {
                TodayUVElement.attr("class", "btn-success")
                } else if (data.current.uvi > 7){
                TodayUVElement.attr("class", "btn-danger")
                } else {
                TodayUVElement.attr("class", "btn-warning")
                }
            
                GetFutureWeather(lat, lon)
            })
        }  
    })
}


function GetFutureWeather(lat, lon)
{
        var WeatherApiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=metric&appid=296016cd181ee0855801dffc3c8a2bee"
        fetch(WeatherApiUrl).then(function (response)
        {
            response.json().then(function (FutureData){
                console.log(FutureData)
                {
                    for (var i=0; i<5; i++){
                        var DateRange = moment().add(1+i, 'days')
                        var FutureDate = moment(DateRange).format("DD/MM/YYYY")
                        
                        WeatherCont = $('<div>').attr("class", "col p-2 text-black rounded-lg")
                        WeatherCont.removeClass('hide')
                        var FutureWeatherElement = $('.row')
                        FutureWeatherElement.append(WeatherCont)
                        WeatherCont.append('<h4>' + FutureDate + '</h4>')

                       var FutureIcon = " http://openweathermap.org/img/wn/" + FutureData.list[i].weather[0].icon + "@2x.png"
                       WeatherCont.append($('<img>').attr("src", FutureIcon))
                       var FutureTemp = "Temp: "+ Math.round(FutureData.list[i].main.temp) + "°C"
                       WeatherCont.append('<p>' + FutureTemp + '</p>')
                       var FutureWind = "Wind: "+ FutureData.list[i].wind.speed + " km/h"
                       WeatherCont.append('<p>' + FutureWind + '</p>')            
                       FutureHumid = "Humid: "+ FutureData.list[i].main.humidity + "%"
                       WeatherCont.append('<p>' + FutureHumid + '<p>')  
                    }                  
                }              
            })  
        }) 
}
















