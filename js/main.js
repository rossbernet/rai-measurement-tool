mapboxgl.accessToken =
  "pk.eyJ1IjoiYXphdmVhIiwiYSI6IkFmMFBYUUUifQ.eYn6znWt8NzYOa3OrWop8A";

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function removeLayerAndSource(map, layer) {
  map.getLayer(layer) && map.removeLayer(layer);
  map.getSource(layer) && map.removeSource(layer);
}

// prettier-ignore
var fillOpacity = ["interpolate", ["exponential", 1.21], ["zoom"], 0, 1, 14, 0.3, 17, 0.2];

// prettier-ignore
var lineWidth = ["interpolate", ["linear"], ["zoom"], 14, 1, 17, 2, 18, 2, 23, 8];

var count = 0;

var steps = [0.25, 0.5, 0.75];

var colorsOne = ["#f0f9e8", "#bae4bc", "#7bccc4", "#2b8cbe"];

var mapAnimationDuration = 2000;

var selectedCountryCode;

// prettier-ignore
var colorOne = ["step", ["get", "pct_served"], colorsOne[0], steps[0], colorsOne[1], steps[1], colorsOne[2], steps[2], colorsOne[3]];

var trialCodes = ["NPL", "MWI", "MMR"];

function returnToPrimary(changePosition) {
  selectedCountryCode = undefined;
  $body.classList.remove("trial");
  $body.classList.remove("detail");
  removeLayerAndSource(mapAlt, "road-vector-alt");
  removeLayerAndSource(mapRegular, "road-vector");
  removeLayerAndSource(mapRegular, "country-raster-tiles");
  removeLayerAndSource(mapAlt, "country-raster-tiles-alt");

  if (changePosition) {
    mapRegular.easeTo({
      zoom: mapOrigin.zoom,
      center: mapOrigin.center,
      pitch: mapOrigin.pitch,
      bearing: mapOrigin.bearing,
      duration: 0
    });
  }

  $primary.style.display = "block";
  $detail.style.display = "none";

  mapRegular.setPaintProperty("world-summary-fill", "fill-opacity", 1);
  mapAlt.setPaintProperty("world-summary-fill-alt", "fill-opacity", 1);
}

// var mapOrigin = {
//   zoom: 0,
//   lng: 66.90249510103365,
//   lat: 7.034499481291888,
//   pitch: 0,
//   bearing: 0,
//   center: [0, 0]
// };

var mapOrigin = {
  zoom: 0,
  pitch: 0,
  bearing: 0,
  center: [0, 0]
};

var mapAlt = new mapboxgl.Map({
  container: "before",
  style: "mapbox://styles/azavea/ck24v5wnsh0zj1dpeq0l2rqph",
  zoom: mapOrigin.zoom,
  center: mapOrigin.center,
  pitch: mapOrigin.pitch,
  bearing: mapOrigin.bearing,
  minZoom: 0,
  maxZoom: 14,
  maxBounds: [-180, -59.3, 180, 84.9]
});

var mapRegular = new mapboxgl.Map({
  container: "after",
  style: "mapbox://styles/azavea/ck24v5wnsh0zj1dpeq0l2rqph",
  zoom: mapOrigin.zoom,
  center: mapOrigin.center,
  pitch: mapOrigin.pitch,
  bearing: mapOrigin.bearing,
  minZoom: 0,
  maxZoom: 14,
  maxBounds: [-180, -59.3, 180, 84.9]
});

compare = new mapboxgl.Compare(mapRegular, mapAlt, "#map-container", {
  mousemove: true,
  orientation: "vertical"
});

var popup;

var $body = document.getElementById("body");
var $modal = document.getElementById("about-modal");
var $primary = document.getElementById("primary");
var $detail = document.getElementById("detail");
var $cityName = document.getElementById("city-name");
var $indicator1 = document.getElementById("indicator-1");
var $indicator2 = document.getElementById("indicator-2");
var $indicator3 = document.getElementById("indicator-3");
var $indicator4 = document.getElementById("indicator-4");
var $indicator5 = document.getElementById("indicator-5");
var $indicator1alt = document.getElementById("indicator-1alt");
var $indicator2alt = document.getElementById("indicator-2alt");
var $indicator3alt = document.getElementById("indicator-3alt");
var $indicator4alt = document.getElementById("indicator-4alt");
var $indicator5alt = document.getElementById("indicator-5alt");
var $buttons = document.querySelectorAll(".location input");

document.onkeydown = function(e) {
  if (e.key === "Escape") {
    if ($modal.classList.contains("active")) hideModal();
    if (mapRegular.getLayer("country-raster-tiles")) returnToPrimary(true);
  }
};

function showModal() {
  $modal.className += " active";
}

function hideModal() {
  $modal.classList.remove("active");
}

var popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false
});

// function goToCountry(number) {
//   var code = $buttons[number].value;
//   var country = trialRegular[code];
//   var countryAlt = trialAlt[code];

//   activateLayer(
//     country.code,
//     country.name,
//     country.properties,
//     countryAlt.properties
//   );

//   $buttons.forEach(function(button) {
//     button.checked = false;
//   });

//   $buttons[number].checked = true;
// }

function raiDecimalToPct(decimal) {
  return Math.floor(decimal * 100) + "%";
}

var hoveredCountryCode;

function updatePopup(event) {
  var countryCode = event.features[0].properties.code;
  var name = event.features[0].properties.name;
  var indicator = raiDecimalToPct(event.features[0].properties.pct_served);

  if (countryCode !== selectedCountryCode) {
    if (countryCode !== hoveredCountryCode) {
      hoveredCountryCode = countryCode;
      popup.setHTML(
        "<h1>RAI score</h1>" +
          "<h2>" +
          name +
          "</h2>" +
          "<h3>" +
          indicator +
          "</h3>"
      );
    }
    popup.setLngLat(event.lngLat).addTo(mapRegular);
    mapRegular.getCanvas().style.cursor = "pointer";
  } else {
    popup.remove();
  }
}

function removePopup() {
  popup.remove();
  mapRegular.getCanvas().style.cursor = "";
}

mapRegular.on("mousemove", "world-summary-fill", updatePopup);
mapRegular.on("mouseleave", "world-summary-fill", removePopup);

// mapRegular.on("zoomend", function() {
//   if (mapRegular.getZoom() < 2) {
//     if (mapRegular.getLayer("country-raster-tiles")) returnToPrimary(false);
//   }
// });

mapRegular.on("load", function() {
  mapRegular.addSource("world-summary", {
    type: "vector",
    tiles: [
      "https://un-sdg.s3.amazonaws.com/tiles/cardno-world-summary/{z}/{x}/{y}.pbf"
    ],
    minzoom: 0,
    maxzoom: 2
  });

  mapAlt.addSource("world-summary-alt", {
    type: "vector",
    tiles: [
      "https://un-sdg.s3.amazonaws.com/tiles/cardno-world-summary/{z}/{x}/{y}.pbf"
    ],
    minzoom: 0,
    maxzoom: 2
  });

  var toggleColor = document.getElementById("toggle-color");

  mapRegular.addLayer(
    {
      id: "world-summary-fill",
      type: "fill",
      source: "world-summary",
      "source-layer": "data",
      paint: {
        "fill-color": colorOne,
        "fill-opacity": 1
      }
    },
    "admin-3-4-boundaries-bg"
  );

  mapAlt.addLayer(
    {
      id: "world-summary-fill-alt",
      type: "fill",
      source: "world-summary-alt",
      "source-layer": "data",
      paint: {
        "fill-color": colorOne,
        "fill-opacity": 1
      }
    },
    "admin-3-4-boundaries-bg"
  );

  function activateLayer(
    countryCode,
    countryName,
    indicatorsRegular,
    indicatorsAlt
  ) {
    $primary.style.display = "none";
    $detail.style.display = "block";
    $body.classList.add("detail");
    $cityName.innerHTML = countryName;
    $indicator1.innerHTML = raiDecimalToPct(indicatorsRegular.pct_served);
    $indicator2.innerHTML = numberWithCommas(Math.floor(indicatorsRegular.pop));
    $indicator3.innerHTML = numberWithCommas(
      Math.floor(indicatorsRegular.pop_rural)
    );
    $indicator4.innerHTML = numberWithCommas(
      Math.floor(indicatorsRegular.pop_served)
    );
    $indicator5.innerHTML = numberWithCommas(
      Math.floor(indicatorsRegular.roads_total_km)
    );

    if (indicatorsAlt) {
      $indicator1alt.innerHTML = raiDecimalToPct(indicatorsAlt.pct_served);
      $indicator2alt.innerHTML = numberWithCommas(
        Math.floor(indicatorsAlt.pop)
      );
      $indicator3alt.innerHTML = numberWithCommas(
        Math.floor(indicatorsAlt.pop_rural)
      );
      $indicator4alt.innerHTML = numberWithCommas(
        Math.floor(indicatorsAlt.pop_served)
      );
      $indicator5alt.innerHTML = numberWithCommas(
        Math.floor(indicatorsAlt.roads_total_km)
      );
    }

    selectedCountryCode = countryCode;

    mapRegular.fitBounds(countryToBboxIndex[countryCode], {
      padding: { top: 10, bottom: 10, left: 10, right: 10 },
      linear: true,
      duration: mapAnimationDuration
    });

    removeLayerAndSource(mapRegular, "country-raster-tiles");
    removeLayerAndSource(mapRegular, "road-vector");
    removeLayerAndSource(mapAlt, "road-vector-alt");
    removeLayerAndSource(mapAlt, "country-raster-tiles-alt");

    setTimeout(function() {
      if (selectedCountryCode) {
        mapRegular.setPaintProperty("world-summary-fill", "fill-opacity", 0);
        mapAlt.setPaintProperty("world-summary-fill-alt", "fill-opacity", 0);
      }
    }, mapAnimationDuration);

    popup.remove();

    mapRegular.addLayer(
      {
        id: "country-raster-tiles",
        type: "raster",
        source: {
          tileSize: 256,
          type: "raster",
          bounds: countryToBboxIndex[countryCode],
          tiles: [
            "https://un-sdg.s3.amazonaws.com/tiles/cardno/" +
              countryCode +
              "/forgotten-pop-global/{z}/{x}/{y}.png"
          ]
        }
      },
      "world-summary-fill"
    );

    mapRegular.addLayer(
      {
        id: "road-vector",
        type: "line",
        "source-layer": "roads",
        paint: {
          "line-color": "#fff",
          "line-opacity": 1,
          "line-width": ["case", ["==", ["get", "isIncluded"], true], 2, 0.5]
        },
        source: {
          maxzoom: 10,
          type: "vector",
          bounds: countryToBboxIndex[countryCode],
          tiles: [
            "https://un-sdg.s3.amazonaws.com/tiles/cardno/" +
              countryCode +
              "/roads/{z}/{x}/{y}.mvt"
          ]
        }
      },
      "admin-3-4-boundaries-bg"
    );

    if (indicatorsAlt) {
      mapAlt.addLayer(
        {
          id: "road-vector-alt",
          type: "line",
          "source-layer": "data",
          paint: {
            "line-color": "#fff",
            "line-opacity": 1,
            "line-width": ["case", ["==", ["get", "used"], 1], 2, 0.5]
          },
          source: {
            maxzoom: 10,
            type: "vector",
            bounds: countryToBboxIndex[countryCode],
            tiles: [
              "https://un-sdg.s3.amazonaws.com/tiles/cardno/" +
                countryCode +
                "/country-data-roads/{z}/{x}/{y}.pbf"
            ]
          }
        },
        "admin-3-4-boundaries-bg"
      );

      mapAlt.addLayer(
        {
          id: "country-raster-tiles-alt",
          type: "raster",
          source: {
            tileSize: 256,
            type: "raster",
            bounds: countryToBboxIndex[countryCode],
            tiles: [
              "https://un-sdg.s3.amazonaws.com/tiles/cardno/" +
                countryCode +
                "/country-data/{z}/{x}/{y}.png"
            ]
          }
        },
        "world-summary-fill-alt"
      );
    }
  }

  mapRegular.addControl(new mapboxgl.ScaleControl());

  mapRegular.on("click", "world-summary-fill", function(e) {
    var feature = e.features[0];
    if (feature.properties.code !== selectedCountryCode) {
      if (trialCodes.includes(feature.properties.code)) {
        var regular = trialRegular[feature.properties.code];
        var alt = trialAlt[feature.properties.code];
        activateLayer(
          regular.code,
          regular.name,
          regular.properties,
          alt.properties
        );
        $body.classList.add("trial");
      } else {
        activateLayer(
          feature.properties.code,
          feature.properties.name,
          feature.properties
        );
        $body.classList.remove("trial");
      }
    }
  });

  // mapRegular.setLayoutProperty("mapbox-satellite", "visibility", "visible");
});
