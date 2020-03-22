export function getGtagUrl(gaId) {
    return `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
} 

export function getAnalyticsInitScript(gaId) {
    return `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`;
}

export function getTrackScreenScript(gameName) {


    return `gtag('event','screen_view',{app_name:'myAppName',screen_name:'Home'});`;
}