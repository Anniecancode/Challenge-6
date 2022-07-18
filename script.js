function Init(){
    ShowLocalStorage
}

var SearchBtn = $('.btn')

var TodayCityNameElement = $('#CityNameElement')
var TodayWeatherSec = $('#WeatherToday')
var TodayTempElement = $('#TempElement')
var TodayWindElement = $('#WindElement')
var TodayHumidElement = $('#HumidElement')
var TodayUVElement = $('#UVElement')
var CityDisplay = $('#CityDisplay')

SearchBtn.on('click',ClickSearchButton)


function ClickSearchButton(event)
{
    event.preventDefault() 
    GetLocation()    
}


function ClickCityButton(event)
{
    var CityClicked = $(event.target);
    var CityNameInput = CityClicked.text();
    GetLocation(CityNameInput);
}


function GetLocation()
{   // select form element by its `name` attribute and get its value
    CityNameInput = $('input[name="CityNameInput"]').val().toUpperCase()
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
                } else if (location.length>1)
                {location.shift()}
                else {window.alert('No valid input')
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
               TodayCityNameElement.attr("class","row")
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


// get 5 days weather forecast for searched city
function GetFutureWeather(lat, lon)
{
    var WeatherApiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=metric&appid=296016cd181ee0855801dffc3c8a2bee"
    fetch(WeatherApiUrl).then(function (response)
    {
        
        response.json().then(function (FutureData){
            console.log(FutureData)
            {  
                for (var i=0; i<5; i++){
                    // date ranges
                    var DateRange = moment().add(1+i, 'days')
                    var FutureDate = moment(DateRange).format("DD/MM/YYYY")
                    // container for displaying 5 days weather 
                    var FutureWeatherElement = $('.row')
                    var WeatherCont = $('<div>').attr("class", "col p-2 text-black rounded-lg")
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
                  
            }}                  
            }              
        )  
    }) 


    SaveLocalStorage(CityNameInput)
}


function SaveLocalStorage(CityNameInput)
{
    CityDisplay.push(CityNameInput)
    
    var CityList = $('<li>').attr("class","btn-success")
    CityList.text(CityNameInput)
    CityDisplay.append(CityList)

    $(CityList).click(ClickCityButton)


    localStorage.setItem("CityDisplay", JSON.stringify(CityDisplay))
}


function ShowLocalStorage()
{
    var SavedCity = JSON.parse(localStorage.getItem("CityDisplay"))
    if (SavedCity)
    {
        for (let i = 0; i < SavedCity.length; i++)
        {
            AddToCityDisplay(SavedCity[i])
        }
        SaveCityDisplay()
    }
}

Init();


