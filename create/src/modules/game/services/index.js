function fetchYath(type) {
    const fileName = `yath.min.${type}`;

    return window.fetch(`https://raw.githubusercontent.com/adrien-gueret/yath/master/${fileName}`)
        .then(response => response.text());
}

export function getScreensHtml(screens, screensChoices) {
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

export function getFullHtml(screens, screensChoices, startScreen) {
    const screensHtml = getScreensHtml(screens, screensChoices);
    const startGame = getStartGameScript(startScreen.id);

    return Promise.all([
        fetchYathCSS(),
        fetchYathJS(),
    ]).then((responses) => {
        const [mainCss, mainJs] = responses;

        return `<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>You Are The Hero!</title>
        <style>${mainCss}</style>
        <script>${mainJs}</script>
    </head>
    <body>
        ${screensHtml}
        <script>${startGame}</script>
    </body>
</html>`;
    });
}