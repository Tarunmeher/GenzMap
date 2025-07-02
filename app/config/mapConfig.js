export const MAP_CONFIG = {
    COORDINATES:[9129167.077757929, 3123334.8895011344],
    ZOOM:7,

    /*GEOSERVER DETAIL STARTS*/
    GEOSERVER_URL:"http://10.0.16.36:8080/geoserver/",
    WORKSPACE:"gp_collection",
    GROUP_LAYERS:[
        {displayname : "Survey Data", layer : "Survey Data", type : "GroupLayer"}
    ],
    WMS_LAYERS:[
        {displayname: "GP Layer", layer:"gp", type:"Layer"},
        {displayname: "Grid Layer", layer:"grid", type:"Layer"}
    ],
    WFS_LAYERS:[
        {displayname: "Grid Layer New", layer:"grid_new", type:"Layer"}
    ],
    TOC_DISPLAY_NAME:{
        ftth_points:"FTTH Points",
        wifi_points:"WIFI Points"
    },
    /*GEOSERVER DETAIL ENDS*/
    BUFFER_LAYERS:[
        {
            v:"ftth_points",
            t:"Ftth Points"
        },
        {
            v:"wifi_points",
            t:"Wifi Points"
        },
        {
			v: "gp",
			t: "GP Layer"
		},
        {
			v: "grid",
			t: "Grid Layer"
		},
        {
			v: "gp",
			t: "GP Layer"
		},
    ],

    WIDGET:{
        THEME_COLOR:"#940d1d"
    }
};