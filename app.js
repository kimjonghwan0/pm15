// app.js
let map;
let geocoder;
let marker;

window.onload = () => {
  const container = document.getElementById("map");
  map = new kakao.maps.Map(container, {
    center: new kakao.maps.LatLng(37.5665, 126.9780),
    level: 5,
  });
  geocoder = new kakao.maps.services.Geocoder();
};

function search() {
  const location = document.getElementById("location").value;
  if (!location) return;

  geocoder.addressSearch(location, (result, status) => {
    if (status === kakao.maps.services.Status.OK) {
      const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
      map.setCenter(coords);

      if (marker) marker.setMap(null);
      marker = new kakao.maps.Marker({
        map,
        position: coords,
      });
    }
  });
}
