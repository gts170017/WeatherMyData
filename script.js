$(document).ready(function() {
    var APIKey = "7ef22ec01451c04c8ed4c0d745cdc77f";
    var cities = JSON.parse(localStorage.getItem("cities")) || [];
    renderCities();
  
    $("#search-btn").on("click", function() {
      var city = $("#city-input").val().trim();
      if (city !== "") {
        fetchWeatherData(city);
        $("#city-input").val("");
      }
    });
  
    $(document).on("click", ".city-btn", function() {
      var city = $(this).text();
      fetchWeatherData(city);
    });
  
    function renderCities() {
      $("#city-list").empty();
      for (var i = 0; i < cities.length; i++) {
        var cityBtn = $("<button>")
          .addClass("list-group-item list-group-item-action city-btn")
          .text(cities[i]);
        $("#city-list").append(cityBtn);
      }
    }
  
    function fetchWeatherData(city) {
      var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${APIKey}`;
  
      console.log("Fetching weather data for:", city);
  
      $.ajax({
        url: queryURL,
        method: "GET",
      })
        .then(function(response) {
          console.log("API response:", response);
  
          if (cities.indexOf(city) === -1) {
            cities.push(city);
            localStorage.setItem("cities", JSON.stringify(cities));
            renderCities();
          }
  
          $(".city-details").empty();
          $(".city-details").append(
            `<h2>${response.city.name} (${moment
              .unix(response.list[0].dt)
              .format("M/D/YYYY")})</h2>
             <p>Temperature: ${response.list[0].main.temp} °F</p>
             <p>Humidity: ${response.list[0].main.humidity}%</p>
             <p>Wind Speed: ${response.list[0].wind.speed} MPH</p>`
          );
  
          var iconCode = response.list[0].weather[0].icon;
          var iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;
          $("#current-icon").html(`<img src="${iconURL}" alt="Weather Icon">`);
  
          $("#forecast").empty();
          for (var i = 0; i < response.list.length; i += 8) {
            var forecastData = response.list[i];
            var forecastCard = $("<div>").addClass("forecast-card");
            forecastCard.html(`
              <h5>${moment.unix(forecastData.dt).format("M/D/YYYY")}</h5>
              <img src="https://openweathermap.org/img/w/${
                forecastData.weather[0].icon
              }.png" alt="Weather Icon">
              <p>Temp: ${forecastData.main.temp} °F</p>
              <p>Humidity: ${forecastData.main.humidity}%</p>
            `);
            $("#forecast").append(forecastCard);
          }
        })
        .catch(function(error) {
          console.error("Error fetching weather data:", error);
          alert(
            "An error occurred while fetching weather data. Please try again later."
          );
        });
    }
  });