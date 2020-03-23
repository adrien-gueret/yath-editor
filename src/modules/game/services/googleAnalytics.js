export function getGtagUrl(gaId) {
    return `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
} 

export function getAnalyticsInitScript(gaId) {
    return `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}',{send_page_view:false});`;
}

export function getTrackScreenScript(gaId) {
    return `function t(n,p){gtag('config','${gaId}',{page_title:n,page_path:p});}`;
}
