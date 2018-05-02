var map;
var map_center;
var path_bounds;
var theTitle;

var model = {
    addresses: [
    {title: 'Jordan Schnitzer Museum of Art', location: '1430 Johnson Lane, Eugene, OR 97403'},
    {title: 'University of Oregon', location: '1585 E 13th Ave, Eugene, OR 97403'},
    {title: 'Gutenberg College', location: '1883 University St, Eugene, OR 97403'},
    {title: 'Voodoo Doughnut', location: '20 E Broadway, Eugene, OR 97401'},
    {title: 'The Jazz Station', location: '124 W Broadway, Eugene, OR 97401'},
    {title: 'Cowfish Dance Club & Cafe', location: '62 W Broadway, Eugene, OR 97401'},
    {title: 'Eugene Public Library', location: '100 W 10th Ave, Eugene, OR 97401'},
    {title: 'Cheba Hut', location: '339 E. 11th Ave., Eugene, OR 97401'},
    {title: 'McDonald Theater', location: '1010 Willamette St, Eugene, OR 97401'},
    {title: 'Level Up Arcade', location: '1290 Oak St, Eugene, OR 97401'},
    {title: 'Empire Buffet', location: '1933 Franklin Blvd, Eugene, OR 97403'}
  ],
  markers: []
}


function initMap() {
  geocoder = new google.maps.Geocoder();
  infowindow = new google.maps.InfoWindow;
  map_center = new google.maps.LatLng(44.039181, -123.074271);
  map = new google.maps.Map(document.getElementById('map'), {
    center: map_center,
    zoom: 14
  });
  makeMarkers();

  google.maps.event.addDomListener(window, 'resize', function() {
    map.setCenter(map_center);
  });
};


function makeMarkers() {
  var geocoder = new google.maps.Geocoder();
  for (let  i = 0; i < model.addresses.length; i++) {
    geocoder.geocode({'address' : model.addresses[i].location}, function(results, status) {
        theTitle = model.addresses[i].title;
          if (status == 'OK') {
            map.setCenter(results[0].geometry.location);
              marker = new google.maps.Marker({
              map: map,
              title: theTitle,
              position: results[0].geometry.location
            });
            model.markers.push(marker);
            addMessagetoMarker(marker, theTitle);
          } else {
            alert('Geocode failed due to: ' + status);
          }
      });

      // console.log(theTitle);
      // google.maps.event.addListener(marker, 'click', (function(titleCopy) {
      //   return function() {
      //     console.log(titleCopy);
      //   }
      // }(theTitle)));
      // markers.addListener('click', function() {
      //   markers.setAnimation(google.maps.Animation.BOUNCE);
      //   setTimeout(function () {
      //     marker.setAnimation(null);
      //   }, 1400);
      //     infowindow.setOptions( {
      //       content: theTitle
      //     });
      //     infowindow.open(map, marker);
      //   });
      }
}


function addMessagetoMarker(marker, message) {
  // for (i = 0; i < markers.length; i++) {
  //   console.log(markers[i]);
  // }
  marker.addListener('click', function() {
    console.log(marker);
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function () {
      marker.setAnimation(null);
    }, 1400);
      infowindow.setOptions( {
        content: message
      });
      infowindow.open(map, marker);
    });
};



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
