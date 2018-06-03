var map;
var map_center;
var path_bounds;
var theTitle;

var model = {
    addresses: [
    {title: "Jordan Schnitzer Museum of Art", location: "1430 Johnson Lane, Eugene, OR 97403"},
    {title: "University of Oregon", location: "1585 E 13th Ave, Eugene, OR 97403"},
    {title: "Gutenberg College", location: "1883 University St, Eugene, OR 97403"},
    {title: "Voodoo Doughnut", location: "20 E Broadway, Eugene, OR 97401"},
    {title: "The Jazz Station", location: "124 W Broadway, Eugene, OR 97401"},
    {title: "Cowfish Dance Club & Cafe", location: "62 W Broadway, Eugene, OR 97401"},
    {title: "Eugene Public Library", location: "100 W 10th Ave, Eugene, OR 97401"},
    {title: "Cheba Hut", location: "339 E. 11th Ave., Eugene, OR 97401"},
    {title: "McDonald Theater", location: "1010 Willamette St, Eugene, OR 97401"},
    {title: "Level Up Arcade", location: "1290 Oak St, Eugene, OR 97401"},
    {title: "Empire Buffet", location: "1933 Franklin Blvd, Eugene, OR 97403"}
  ],
  markers: ko.observableArray([])
};


function initMap() {
  geocoder = new google.maps.Geocoder();
  infowindow = new google.maps.InfoWindow;
  map_center = new google.maps.LatLng(44.039181, -123.074271);
  map = new google.maps.Map(document.getElementById("map"), {
    center: map_center,
    zoom: 14
  });
  makeMarkers();

  google.maps.event.addDomListener(window, "resize", function() {
    map.setCenter(map_center);
  })
};


function makeMarkers() {
  var geocoder = new google.maps.Geocoder();
  for (let  i = 0; i < model.addresses.length; i++) {
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
            marker.addListener("click", (function(markerCopy) {
              return function() {
                yoyo.addLinks(markerCopy);
              }
            })(marker));
          } else {
            alert("Geocode failed due to: " + status);
          }
      });
      }
};

function hideMarker(marker) {
  marker.setMap(null);
};


function viewModel(locations, marker) {
  query = ko.observable("");
  var self = this;
  // for (var i=0; i < locations.length; i++) {
  //   addLocation(locations[i]);
  // }
  // marker.forEach(function(element) {
  //   console.log(element);
  //   console.log("YO!");
  // });
  // self.names = ko.observableArray([]);
  for (var i = 0; i < locations.length; i++) {
    name = locations[i].title;
    address = locations[i].location;
    console.log(marker[i]);

    // self.names.push({ title: name, location: address, marker: theMarker });
    self.addLinks = function(num) {
        console.log(num);
        console.log(num.map);
          num.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function () {
            num.setAnimation(null);
          }, 1400);
            infowindow.setOptions( {
              content: num.title
            });
            infowindow.open(map, num);
    };
  }

  function search(value) {
    for (var a in locations) {
      locations.removeAll();
      if(locations[a].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
        locations.push(locations[a]);
      }
    }
  }

  self.theLocations = {
    query: ko.observable(""),
    theModel: ko.observable(model.markers),
    search: function(value) {
      model.markers.removeAll();

      for (var x in theModel.markers) {
        console.log(model.markers[x]);
        if(markers[x].toLowerCase().indexOf(value.toLowerCase()) >= 0) {
          model.markers.push(model.markers()[x]);
        }
      }
    }
    }
};

viewModel.locations = ko.dependentObservable(function() {
  console.log(viewModel);
}, viewModel)

var yoyo = new viewModel(model.addresses, model.markers());
yoyo.theLocations.query.subscribe(yoyo.theLocations.search);
ko.applyBindings(yoyo);

// Dude. You need one big view model with all the observables. Because it ain't getting bound!!!!

// Places to investigate: Museum of Natural and Cultural History
// Jordan Schnitzer Museum of Art
// University of Oregon
// Sunrise Asian Food Market
// Voodoo Doughnut
// Eugene Public Library
// Cheba Hut
// Eugene Station
// Chabad Lubavitch
// McDonald Theater
// Cowfish Dance Club and Cafe
// The Jazz Station
// Level Up Arcade
// 5th Street Public Market
// Hult Center for the Performing Arts
// Eugene Ballet

// Help received:
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
