var map;
var map_center;
var path_bounds;
var addresses;
var geocoder;


addresses = [
  '1680 E 15th Ave, Eugene, OR 97401',
  '1430 Johnson Lane, Eugene, OR 97403',
  '1585 E 13th Ave, Eugene, OR 97403',
  '1883 University St, Eugene, OR 97403',
  '70 W 29th Ave, Eugene, OR 97405',
  '20 E Broadway, Eugene, OR 97401',
  '100 W 10th Ave, Eugene, OR 97401',
  '339 E. 11th Ave., Eugene, OR 97401',
  '433 Willamette St, Eugene, OR 97401',
  '239 E 14th Ave, Eugene, OR 97401',
  '1010 Willamette St, Eugene, OR 97401',
  '62 W Broadway, Eugene, OR 97401',
  '124 W Broadway, Eugene, OR 97401',
  '1290 Oak St, Eugene, OR 97401',
  '296 E 5th Ave #300, Eugene, OR 97401',
  '1 Eugene Center, Eugene, OR 97401',
  '4048, 1590 Willamette St, Eugene, OR 97401',
  '1933 Franklin Blvd, Eugene, OR 97403'
]

function makeMarkers(addresses) {
  for (i = 0; i < addresses.length; i++) {
    geocoder.geocode( {'address' : address[i]}, function(results, status) {
      if (status == 'OK') {
        map.sestCetner(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });
      } else {
        alert('Geocode failed due to: ' + status);
      }
    });
  }
}

function initMap() {
  geocoder = new google.maps.Geocoder();
  map_center = new google.maps.LatLng(44.039181, -123.074271);
  map = new google.maps.Map(document.getElementById('map'), {
    center: map_center,
    zoom: 15
  });
  makeMarkers(addresses);

  google.maps.event.addDomListener(window, 'resize', function() {
    map.setCenter(map_center);
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
