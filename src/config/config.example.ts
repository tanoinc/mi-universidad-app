export const CONFIG_ENV = {
    PRODUCTION: false,
    API_URL : "http://localhost:8800/",
    APP_NAME : "Mi Universidad (dev)",
    DEFAULT_LANG: "es",
    ANDROID_PUSH_ICON_COLOR: "#343434",
    NOT_AUTHENTICATED_TABS_HIDDEN: false,
    NOT_AUTHENTICATED_FULL_SCREEN: true,
    MEMORY_CACHE_DEFAULT_TTL: 60, // Seconds
    GEOLOCATION_UPDATE_INTERVAL: 150, // Seconds
    ALWAYS_SHOW_INTRO: false, // true: For debugging purposes (always show intro slides)
    GRAVATAR_DEFAULT: 'robohash',
    GRAVATAR_SIZE: '200',
    INTRO_SLIDES: [ 
        { TITLE: "Slide 1", DESCRIPTION: "algo 1", IMAGE:"s1.png" },
        { TITLE: "Slide 2", DESCRIPTION: "algo 2", IMAGE:"s2.png" },
        { TITLE: "Slide 3", DESCRIPTION: "algo 2" } // IMAGE optional
    ]
}