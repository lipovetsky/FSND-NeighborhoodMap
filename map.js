var map;
var map_center;
var path_bounds;

function initMap() {
  map_center = new google.maps.LatLng(-34.397, 150.644);
  map = new google.maps.Map(document.getElementById('map'), {
    center: map_center,
    zoom: 10
  });

  google.maps.event.addDomListener(window, 'resize', function() {
    map.setCenter(map_center);
  });
};


Help received:
// 1. https://stackoverflow.com/questions/15421369/responsive-google-map
// For setting up a responsive google map (solution written by SandroMarques)
