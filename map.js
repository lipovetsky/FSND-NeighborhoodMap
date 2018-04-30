var map;
var markers = []
var map_center;
var path_bounds;




function initMap() {
  geocoder = new google.maps.Geocoder();
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
  var addresses = [
    {title: 'Jordan Schnitzer Museum of Art', location: '1430 Johnson Lane, Eugene, OR 97403'},
    {title: 'University of Oregon', location: '1585 E 13th Ave, Eugene, OR 97403'},
    {title: 'Gutenberg College', location: '1883 University St, Eugene, OR 97403'}
    // '20 E Broadway, Eugene, OR 97401',
    // '124 W Broadway, Eugene, OR 97401',
    // '62 W Broadway, Eugene, OR 97401',
    // '100 W 10th Ave, Eugene, OR 97401',
    // '339 E. 11th Ave., Eugene, OR 97401',
    // '1010 Willamette St, Eugene, OR 97401',
    // '1290 Oak St, Eugene, OR 97401',
    // '1933 Franklin Blvd, Eugene, OR 97403'
  ];
  var geocoder = new google.maps.Geocoder();
  for (i = 0; i < addresses.length; i++) {
    var theTitle = addresses[i].title;
    geocoder.geocode( {'address' : addresses[i].location}, function(results, status) {
      if (status == 'OK') {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });
        markers.push(marker);
        addMessagetoMarker(marker, theTitle)
      } else {
        alert('Geocode failed due to: ' + status);
      }
    });
  }
}

function addMessagetoMarker(marker, message) {
  console.log(markers);
  var infowindow = new google.maps.InfoWindow;
  marker.addListener('click', function() {
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
