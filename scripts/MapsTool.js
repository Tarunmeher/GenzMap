import { CommonJS } from './CommonJS.js';
const cmjs = new CommonJS();
export class MapsTool{
    constructor(){

    }

    addZoomButtons(map){
        const container = document.createElement('div');
        container.classList.add('genz-zoom-button-container');

        const zoomin_button = cmjs.createButton('<i class="bi bi-plus"></i>', 'Zoom In', 'genz-zoom-in-button genz-zoom-buttons');
        zoomin_button.onclick = () => { map.zoomIn(); };

        const zoomout_button = cmjs.createButton('<i class="bi bi-dash"></i>', 'Zoom Out', 'genz-zoom-out-button genz-zoom-buttons');
        zoomout_button.onclick = () => { map.zoomOut() };

        container.appendChild(zoomin_button);
        container.appendChild(zoomout_button);

        document.body.appendChild(container);
    }

    addOtherSpatialButtons(map){
        const container = document.createElement('div');
        container.classList.add('genz-feature-button-container');

        const location_button = cmjs.createButton('<i class="bi bi-crosshair"></i>', 'Current Location', 'genz-feature-button genz-location-button');
        const nearby_button = cmjs.createButton('<i class="bi bi-pin-map-fill"></i>', 'Near By', 'genz-feature-button genz-location-button');
        const layer_button = cmjs.createButton('<i class="bi bi-stack"></i>', 'Layers', 'genz-feature-button genz-location-button');

        container.appendChild(location_button);
        container.appendChild(nearby_button);
        container.appendChild(layer_button);
        document.body.appendChild(container);

        return {
            location_button:location_button,
            nearby_button:nearby_button,
            layer_button:layer_button
        }
    }

    createUtilityButtons(map){
        const utilityButtonContainer = document.createElement('div');
        utilityButtonContainer.classList.add('genz-utility-button-container');

        const satellite_button = cmjs.createButton('<i class="bi bi-globe-americas"></i>', 'Satellite', 'genz-feature-button genz-satellite-button');
        const traffic_button = cmjs.createButton('<i class="bi bi-car-front-fill"></i>', 'Traffic', 'genz-feature-button genz-traffic-button');
        const isochrone_button = cmjs.createButton('<i class="bi bi-broadcast-pin"></i>', 'Isochrone', 'genz-feature-button genz-isochrone-button');
        const path_traching = cmjs.createButton('<i class="bi bi-signpost-split-fill"></i>', 'Path Tracking', 'genz-feature-button genz-path-tracking-button');

        utilityButtonContainer.appendChild(satellite_button);
        utilityButtonContainer.appendChild(traffic_button);
        utilityButtonContainer.appendChild(isochrone_button);
        utilityButtonContainer.appendChild(path_traching);

        document.body.appendChild(utilityButtonContainer);

        return {
            utilityButtonContainer:utilityButtonContainer,
            satellite_button:satellite_button,
            traffic_button:traffic_button,
            isochrone_button:isochrone_button,
            path_traching:path_traching
        }
    }

    addSearchBar(map){
        const container = document.createElement('div');
        container.classList.add('genz-search-container');

        const input_search_text = document.createElement('input');
        input_search_text.type = 'text';
        input_search_text.id='searchInput';
        input_search_text.placeholder='Search Genesys Map';

        const advanced_search_button = cmjs.createButton('<i class="bi bi-search-heart"></i>', 'Adavance Search', 'genz-advance-search-button');
        const search_button = cmjs.createButton('<i class="bi bi-search"></i>', 'Search', 'genz-search-button');
        const latlon_search_button = cmjs.createButton('<i class="bi bi-repeat"></i>', 'Lat, Lon Search', 'genz-lat-lon-search-button');
        const direction_search_button = cmjs.createButton('<i class="bi bi-sign-turn-right-fill"></i>', 'Direction', 'genz-direction-button');

        container.appendChild(advanced_search_button);
        container.appendChild(input_search_text);
        container.appendChild(latlon_search_button);
        container.appendChild(search_button);
        container.appendChild(direction_search_button);

        document.body.appendChild(container);

        const searchResults = document.createElement("div");
        searchResults.id = "genz-search-results";
        document.body.appendChild(searchResults);

        return {
            advanced_search_button : advanced_search_button,
            input_search_text: input_search_text,
            latlon_search_button: latlon_search_button,
            search_button: search_button,
            direction_search_button: direction_search_button,
            searchResults:searchResults
        }
    }
}