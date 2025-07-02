import { CONFIG } from "../mapinfo.js";
import { MapsTool } from "./MapsTool.js";
import { CommonJS } from './CommonJS.js';
import '../app/index.js';
import { App } from '../app/app.js';
const cmjs = new CommonJS();
const app = new App();

export const global = {
  debounceTimer: null,
  controller: null,
  map: null,
  marker: null,
  selectedCoords: null,
  currentMapType:'street',
  measurementActive:false,
  searchMarker:null
};

let ulat = 0,
  ulon = 0;
let userLocation = null;

const map = new maplibregl.Map({
  container: "map",
  style: `${CONFIG.MAP_STYLE_URL}?api_key=${CONFIG.API_KEY}`,
  center: [CONFIG.ELSE_ULON, CONFIG.ELSE_ULAT],
  zoom: 12,
});

map.on('load', () => {
  // app.addGroupLayers(map);
  // global.measurementActive = true;
  // const Draw = new MapboxDraw({
  //   displayControlsDefault: false,
  //   controls: {
  //     polygon: true,
  //     line_string: true,
  //     trash: true
  //   }
  // });
  // map.addControl(Draw, 'top-right');

  // map.on('draw.create', app.updateMeasurements(Draw));
  // map.on('draw.update', app.updateMeasurements(Draw));

});



map.on("click", (e) => {
  if(global.measurementActive){
    return;
  }
  const lngLat = e.lngLat;
  cmjs.reverseGeocode(lngLat.lat, lngLat.lng)
    .then((feature) => {
      const name = feature.properties.name || "Custom Location";
      const escapedName = cmjs.escapeSingleQuotesForOnclick(name);
      const title = feature.properties.label || "Your Custom Marker";

      let popupContent;
      // if (isAllInputsEmpty && isNoDirectionPlotted) {
      if (true) {
        popupContent = `
                    <div class="popup-content">
                        <b>${name}</b><br>
                        ${title}<br>
                        Lat: ${lngLat.lat}, Lng: ${lngLat.lng}<br><br>
                        <button class="popup-button" onclick="handleSearchDirection(${lngLat.lng}, ${lngLat.lat}, '${escapedName}')">Get Direction</button>
                    </div>
                `;
      } else {
        popupContent = `
                    <div class="popup-content">
                        <b>${name}</b><br>
                        ${title}<br>
                        Lat: ${lngLat.lat}, Lng: ${lngLat.lng}<br><br>
                        <div class="popup-buttons">
                            <button class="popup-button" onclick="setPointAsOrigin(${lngLat.lng}, ${lngLat.lat}, '${escapedName}')">Set as <br>Origin</button>
                            <button class="popup-button" onclick="addPointAsWaypoint(${lngLat.lng}, ${lngLat.lat}, '${escapedName}')">Add <br>Waypoint</button>
                            <button class="popup-button" onclick="setPointAsDestination(${lngLat.lng}, ${lngLat.lat}, '${escapedName}')">Set as Destination</button>
                        </div>
                    </div>
                `;
      }

      const popup = new maplibregl.Popup({
        closeOnClick: true,
      })
        .setLngLat(lngLat)
        .setHTML(popupContent)
        .addTo(map);
      openPopups.push(popup);
    })
    .catch((error) => console.error("Error fetching reverse geocode:", error));
});

global.map = map;

const mt = new MapsTool();
const {
  advanced_search_button,
  input_search_text,
  clear_search_button,
  latlon_search_button,
  search_button,
  direction_search_button,
  searchResults,
  input_search_lat,
  input_search_long
} = mt.addSearchBar(map);

mt.addZoomButtons(map);

const {
    location_button,
    nearby_button,
    layer_button
} = mt.addOtherSpatialButtons(map);

const {
    utilityButtonContainer,
    satellite_button,
    traffic_button,
    isochrone_button,
    path_traching
} = mt.createUtilityButtons(map);

layer_button.onclick = () =>{
    let utilityButtonsStyle = utilityButtonContainer.style;
    if(utilityButtonsStyle.display=='none' || utilityButtonsStyle.display==''){
        layer_button.classList.add('genz-button-active');
        utilityButtonsStyle.display='grid';
    }else{
        layer_button.classList.remove('genz-button-active');
        utilityButtonsStyle.display='none';
    }    
}

satellite_button.onclick=(evt)=>{
    if(global.currentMapType=='street'){
        global.currentMapType = 'satellite';
        evt.srcElement.classList.add('genz-button-active');
        map.setStyle(`${CONFIG.SATELLITE_STYLE_URL}?api_key=${CONFIG.API_KEY}`);
        map.setPitch(0);
    }else{
        global.currentMapType = 'street';
        evt.srcElement.classList.remove('genz-button-active');
        map.setStyle(`${CONFIG.MAP_STYLE_URL}?api_key=${CONFIG.API_KEY}`);
        map.setPitch(0);
    }
    
};

input_search_text.onkeyup = (evt) => {
  const searchText = evt.target.value.trim();
  searchResults.innerHTML = "";
  // debounce(() => {
  const selectedCheckbox = document.querySelector('.genz-place-buttons input[type="checkbox"]:checked');;
  const isToggleOn = advanced_search_button.classList.contains('genz-button-active');
  const searchURL = cmjs.createAutoCompleteURL(isToggleOn, selectedCheckbox, searchText, ulat, ulon);
  

  if (searchText.length > 0) {
    clear_search_button.style.display='inline-block';
    const { signal } = cmjs.getAbortController();
    fetch(searchURL, { signal })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.features) && data.features.length > 0) {
          cmjs.bindSearchResult(searchResults, data, searchText);
        } else {
          searchResults.style.display = "none";
        }
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Error fetching data:", error);
        }
      });
      
  } else {
    searchResults.innerHTML='';
    searchResults.style.display = "none";
    clear_search_button.style.display='none';
  }
  // });
};

search_button.onclick = () =>{
  if(latlon_search_button.classList.contains('genz-button-active')){
    cmjs.searchLongLat(true, searchResults, input_search_long, input_search_lat);
  }
}

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        global.userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        ulat = position.coords.latitude;
        ulon = position.coords.longitude;
        map.setCenter([global.userLocation.lng, global.userLocation.lat]);
      },
      (error) => {
        console.error("Error getting user location:", error);
        initApp([CONFIG.ELSE_ULON, CONFIG.ELSE_ULAT]);
        ulat = CONFIG.ELSE_ULAT;
        ulon = CONFIG.ELSE_ULON;
        map.on("moveend", () => {
          const center = map.getCenter();
          ulat = center.lat;
          ulon = center.lng;
        });
      },
    );
} else {
    console.error("Geolocation is not available");
    map.setCenter([global.userLocation.lng, global.userLocation.lat]);
    ulat = CONFIG.ELSE_ULAT;
    ulon = CONFIG.ELSE_ULON;
    map.on("moveend", () => {
      const center = map.getCenter();
      ulat = center.lat;
      ulon = center.lng;
    });
}


location_button.onclick = ()=> {
    if (global.userLocation) {
        // if (isUserMarkerHidden) {
        //     userMarker.addTo(map);
        //     isUserMarkerHidden = false;
        // }
        cmjs.updateMapLocation(global.userLocation);
    } else {
        alert('Location access is unavailable. Please verify your location permission settings.');
    }
}
