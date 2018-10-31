var map;
var map_center;
var path_bounds;
var theTitle;

// Create the model to store the addresses/locations, and the list of markers to be created
var model = {
    addresses: [
        {title: "Jordan Schnitzer Museum of Art", location: "1430 Johnson Lane, Eugene, OR 97403"},
        {title: "University of Oregon", location: "1585 E 13th Ave, Eugene, OR 97403"},
        {title: "Voodoo Doughnut", location: "20 E Broadway, Eugene, OR 97401"},
        {title: "The Jazz Station", location: "124 W Broadway, Eugene, OR 97401"},
        {title: "Cowfish Dance Club & Cafe", location: "62 W Broadway, Eugene, OR 97401"},
        {title: "Eugene Public Library", location: "100 W 10th Ave, Eugene, OR 97401"},
        {title: "Cheba Hut", location: "339 E. 11th Ave., Eugene, OR 97401"},
        {title: "McDonald Theater", location: "1010 Willamette St, Eugene, OR 97401"},
        {title: "Level Up Arcade", location: "1290 Oak St, Eugene, OR 97401"},
        {title: "Empire Buffet", location: "1933 Franklin Blvd, Eugene, OR 97403"},
    ],
    markers: ko.observableArray([])
};

// Initialize the google map and run the makeMarkers function
function initMap() {
  try {
        geocoder = new google.maps.Geocoder();
        infowindow = new google.maps.InfoWindow;
        map_center = new google.maps.LatLng(44.039181, -123.074271);
        map = new google.maps.Map(document.getElementById("map"), {
            center: map_center,
            zoom: 14
        });
        if (model.markers.length === 0) {
            makeMarkers();
        }
        google.maps.event.addDomListener(window, "resize", function () {
            map.setCenter(map_center);
        });
    } catch (error) {
        alert('The map could not load. Try again.');
    }
}

//A function to geocode the locations from the model, and add all of the newly
//created markers to the previously created Knockout Observable Array entitled 'markers'
function makeMarkers() {
  var geocoder = new google.maps.Geocoder();
    try {
        for (let i = 0; i < model.addresses.length; i++) {
          geocoder.geocode({"address" : model.addresses[i].location}, function(results, status) {
              theTitle = model.addresses[i].title;
                if (status == "OK") {
                  map.setCenter(results[0].geometry.location);
                    marker = new google.maps.Marker({
                    map: map,
                    title: theTitle,
                    position: results[0].geometry.location
                  });
                  model.markers.push(marker);
                  // When you click on a marker, it runs the addLinks function
                  marker.addListener("click", (function(markerCopy) {
                    return function() {
                      addLinks(markerCopy);
                    }
                  })(marker));
                } else {
                  alert("Geocode failed due to: " + status);
                }
            });
            }
  } catch (error) {
    alert('Could not make markers. Try again.')
  }
};

//This function first runs the marker agains the Yelp API. If everything is successful,
// our application will make the marker on the map clickable/animatable, and
// create an info window to be populated by the makeDomWindow function
function addLinks(num) {
    var searchLocation = 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search'
    searchLocation += '?' + $.param({
      'term':num.title,
      'location':'eugene, oregon'
    });
    $.ajax({
      url: searchLocation,
      headers: {
        'Authorization': 'Bearer omxUs0A3iJIr2nxuVHlTzktNO_uzyKQzOtyr0LrXNgdGHhgw4moXlTN61WpVqq95-ecpKFPBKx13kDe2jSOYmEBbnQlnK2frXP4p5sknZpz4GyHcW90phDJjO43UW3Yx'
      },
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        num.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function () {
          num.setAnimation(null);
        }, 1400);
          infowindow.setOptions( {
            content: makeDomWindow(data.businesses[0]),
            maxWidth: 200
          });
          infowindow.open(map, num);
          google.maps.event.addDomListener(window, 'resize', function() {
            infowindow.open(map);
          });
    },
      error: function(request, status, error) {
        alert("Could not add links. Try again.")
      }
  });
};

// This function takes the data retreived from the Yelp API about the location, and
// populates the info window with the appropriate information. It even generates the Yelp
// stars graphic and logo on each window!
function makeDomWindow(thePlace) {
  try {
    var theRatingImage;
    var theFullAddress = thePlace.location.display_address[0] + '<br>'
    + thePlace.location.display_address[1]

    if (thePlace.rating === 3) {
      theRatingImage = 'stars/regular_3.png'
    }
    else if (thePlace.rating === 3.5) {
      theRatingImage = 'stars/regular_3_half.png'
    }
    else if (thePlace.rating === 4) {
      theRatingImage = 'stars/regular_4.png'
    }
    else if (thePlace.rating === 4.5) {
      theRatingImage = 'stars/regular_4_half.png'
    }
    else if (thePlace.rating === 5) {
      theRatingImage ='stars/regular_5.png'
    }

    var theHTML = '<h2><a href="' + thePlace.url +  '" target="_blank">' + thePlace.name
    + '</a></h2>' + theFullAddress + '<p><img src="' + theRatingImage + '"</img><br>'
    + '<p><img id="theimages" src="' + thePlace.image_url + '">' + '<p>'
    + '<img src="stars/logo.png" width="62.5" height="40">'
    return theHTML
  } catch (error) {
    alert ('Could not make InfoWindow. Try again.')
  }
}

// Hides the marker from the map and list
function hideMarker(marker) {
  marker.setVisible(false);
  infowindow.close();
};

// Shows the marker on the map and list
function showMarker(marker) {
  marker.setVisible(true);
};

// Creates a working search box to filter the markers on the list AND the map
function viewModel(locations, marker) {
try {
  query = ko.observable("");
  var self = this;
  for (var i = 0; i < locations.length; i++) {
    name = locations[i].title;
    address = locations[i].location;
  }
// Part of the search box, this dependent Observable Knockout function checks the markers
// against the search term the user types in, and acts accordingly (hiding and/or showing)
// the appropriate markers
self.theLocations = ko.dependentObservable(function() {
    var search = this.query().toLowerCase();
    if (search === '') {
      for (var i = 0; i < model.markers().length; i++) {
        showMarker(model.markers()[i]);
      }
      return model.markers();
    }
    else {
      var filteredMarkers = ko.utils.arrayFilter(marker, function(mark) {
        hideMarker(mark);
        if (mark.title.toLowerCase().indexOf(search) >= 0) {
          mark.setVisible(null);
          showMarker(mark);
          return mark.title.toLowerCase().indexOf(search) >= 0;
        }
      });
      return filteredMarkers;
    }
  })
}
catch(error) {
  alert('Could not filter markers. Try again.')
}
};

var finalCopy = new viewModel(model.addresses, model.markers());
ko.applyBindings(finalCopy);

// // Help received (including sessions with a mentor to help with some code; particularly
// the search filter):
// 1. https://stackoverflow.com/questions/15421369/responsive-google-map
// For setting up a responsive google map (solution written by SandroMarques)
// 2. https://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once
// For animating a google marker.
// 3. Google Maps API docs!
// 4. https://stackoverflow.com/questions/19279199/title-of-a-marker-of-google-map-marker-api
// For setting the title of a google maps marker
// 5. http://www.jstips.co/en/javascript/closures-inside-loops/
// For javascript closures in for loops
// 6. http://todomvc.com/examples/knockoutjs/
// For getting reference to create a dynamic search box.
// 7. http://knockoutjs.com/documentation/value-binding.html
// 8. https://opensoul.org/2011/06/23/live-search-with-knockoutjs/
// 9. http://jsfiddle.net/mythical/XJEzc/
// For helping with creating a filterable search box.
// Learning how to create a dynamic search box with valueUpdate: afterkeydown
// 10. https://stackoverflow.com/questions/9960881/knockout-js-calling-method-outside-of-view-model
// For helping me access the viewModel outside of it.
// 11. https://developers.google.com/maps/documentation/javascript/examples/marker-remove
// 12. https://stackoverflow.com/questions/45422066/set-marker-visible-with-knockout-js-ko-utils-arrayfilter
// For help with removing markers and making them invisible.
// 13. https://github.com/Yelp/yelp-fusion/blob/master/fusion/node/sample.js
// 14. https://www.youtube.com/watch?v=0LFKxiATLNQ
// 15. https://stackoverflow.com/questions/51391801/cannot-retrieve-data-from-yelp-api-using-jquery-ajax
// For help with Yelp API
// 16. https://stackoverflow.com/questions/377644/jquery-ajax-error-handling-show-custom-exception-messages
// For help with error handling in AJAX
