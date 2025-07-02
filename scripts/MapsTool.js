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

        const searchInputs = document.createElement('div');
        Object.assign(searchInputs.style,{
            display:"grid",
            direction:"column",
            gap:"5px"
        })
		const input_search_text = document.createElement('input');
		input_search_text.type = 'text';
		input_search_text.id='searchInput';
		input_search_text.placeholder='Search Genesys Map';

        const input_search_long = document.createElement('input');
		input_search_long.type = 'text';
		input_search_long.id='searchInputLong';
        input_search_long.className="searchInputs"
		input_search_long.placeholder='Longitude (e.g., 77.5946)';
        input_search_long.style.borderBottom="1px solid #348cff";

        const input_search_lat = document.createElement('input');
		input_search_lat.type = 'text';
		input_search_lat.id='searchInputLat';
        input_search_lat.className="searchInputs"
		input_search_lat.placeholder='Latitude (e.g., 21.4328)';

        searchInputs.appendChild(input_search_text);
        searchInputs.appendChild(input_search_long);
        searchInputs.appendChild(input_search_lat);


        const clear_search_button = cmjs.createButton('<i class="bi bi-x"></i>', 'Clear Search', 'genz-clear-search-button');
        clear_search_button.style.display='none';
		const advanced_search_button = cmjs.createButton('<i class="bi bi-search-heart"></i>', 'Adavance Search', 'genz-advance-search-button');
		const search_button = cmjs.createButton('<i class="bi bi-search"></i>', 'Search', 'genz-search-button searchInputs');
		const latlon_search_button = cmjs.createButton('<i class="bi bi-repeat"></i>', 'Lat, Lon Search', 'genz-lat-lon-search-button');
		const direction_search_button = cmjs.createButton('<i class="bi bi-sign-turn-right-fill"></i>', 'Direction', 'genz-direction-button');

        latlon_search_button.onclick = () =>{
            if(!advanced_search_button.classList.contains('genz-button-active')){
                latlon_search_button.classList.toggle('genz-button-active');
                input_search_text.classList.toggle('searchInputs');
                input_search_lat.classList.toggle('searchInputs');
                input_search_long.classList.toggle('searchInputs');
                search_button.classList.toggle('searchInputs');
                direction_search_button.classList.toggle('searchInputs')
            }else{
               alert('Advanced Search Mode is On'); 
            }            
        }


		container.appendChild(advanced_search_button);
		container.appendChild(searchInputs);
        container.appendChild(clear_search_button);
		container.appendChild(latlon_search_button);
		container.appendChild(search_button);
		container.appendChild(direction_search_button);

		document.body.appendChild(container);

		const searchResults = document.createElement("div");
		searchResults.id = "genz-search-results";
		document.body.appendChild(searchResults);

        clear_search_button.onclick = () =>{
            input_search_text.value = '';
            searchResults.innerHTML='';
			searchResults.style.display='none';
            clear_search_button.style.display='none';
        }

		advanced_search_button.onclick = () =>{
            if(!latlon_search_button.classList.contains('genz-button-active')){
                advanced_search_button.classList.toggle('genz-button-active');
                searchResults.innerHTML='';
			    searchResults.style.display='none';
                clear_search_button.style.display='none';
            }else{
                alert('Lat Long Search Mode is On');
            }			
		}

		return {
			advanced_search_button : advanced_search_button,
			input_search_text: input_search_text,
            clear_search_button:clear_search_button,
			latlon_search_button: latlon_search_button,
			search_button: search_button,
			direction_search_button: direction_search_button,
			searchResults:searchResults,
            input_search_lat:input_search_lat,
            input_search_long:input_search_long
		}
	}
}
