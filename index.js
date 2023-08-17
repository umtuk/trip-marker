let map;
let marker;

async function initMap() {
  // Request needed libraries.
  //@ts-ignore
  const [{ Map }, { AdvancedMarkerElement }] = await Promise.all([
    google.maps.importLibrary("marker"),
    google.maps.importLibrary("places"),
  ]);

  // Initialize the map.
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 40.749933, lng: -73.98633 },
    zoom: 13,
    mapId: "4504f8b37365c3d0",
    mapTypeControl: false,
  });

  // Create the input HTML element, and add it to the map as a custom control.
  const input = document.createElement("input");

  input.id = "pac-input";

  //@ts-ignore
  const pac = new google.maps.places.PlaceAutocompleteElement({
    inputElement: input,
  });
  const card = document.getElementById("pac-card");

  card.appendChild(pac.element);
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);
  // Create the marker and infowindow
  marker = new google.maps.marker.AdvancedMarkerElement({
    map,
  });
  // Add the gmp-placeselect listener, and display the results on the map.
  pac.addListener("gmp-placeselect", async ({ place }) => {
    await place.fetchFields({
      fields: ["displayName", "formattedAddress", "location"],
    });
    // If the place has a geometry, then present it on a map.
    if (place.viewport) {
      map.fitBounds(place.viewport);
    } else {
      map.setCenter(place.location);
      map.setZoom(17);
    }

    console.log(place);

    marker.position = place.location;
  });
}

initMap();