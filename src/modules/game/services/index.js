function fetchYath(type) {
    const fileName = `yath.min.${type}`;

    return window.fetch(`https://raw.githubusercontent.com/adrien-gueret/yath/master/${fileName}`)
        .then(response => response.text());
}

export function getScreensHtml(screens, links) {
    return screens.map(screen => screen.toHTML(links)).join('');
}

export function fetchYathCSS() {
    return fetchYath('css');
}

export function fetchYathJS() {
   return fetchYath('js');
}

export function getStartGameScript(startScreenId) {
    return `const g = new yath.Game(null, null, document.body);g.goToScreen('${startScreenId}');`;
}

export function getFullHtml(gameName, screens, links, startScreen) {
    const screensHtml = getScreensHtml(screens, links);
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
        <title>${gameName.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</title>
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

export function injectGameIntoIframe(iframe, screens, links, startScreenId) {
    if (!iframe) {
        return;
    }

    Promise.all([
        fetchYathCSS(),
        fetchYathJS(),
    ]).then((responses) => {
        const [cssContent, jsContent] = responses;

        const yathStyle = document.createElement('style');
        yathStyle.appendChild(document.createTextNode(cssContent));
        iframe.contentDocument.head.appendChild(yathStyle);

        const yathScript = document.createElement('script');
        yathScript.appendChild(document.createTextNode(jsContent));
        iframe.contentDocument.head.appendChild(yathScript);

        iframe.contentDocument.body.innerHTML = getScreensHtml(screens, links);

        const gameContent = getStartGameScript(startScreenId);
        const gameScript = document.createElement('script');
        gameScript.appendChild(document.createTextNode(gameContent));

        iframe.contentDocument.body.appendChild(gameScript);
    });
};