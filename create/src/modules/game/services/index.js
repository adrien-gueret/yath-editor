function fetchYath(type) {
    return window.fetch(`https://raw.githubusercontent.com/adrien-gueret/yath/master/yath.${type}`)
        .then(response => response.text());
}

export function getHtmlGame(screens, screensChoices) {
    return screens.map(screen => screen.toHTML(screensChoices)).join('');
}

export function fetchYathCSS() {
    return fetchYath('css');
}

export function fetchYathJS() {
   return fetchYath('js');
}

export function getStartGameScript(startScreenId) {
    return `const g = new yath.Game(null, null, document.body);g.goToScreen(${startScreenId});`;
}