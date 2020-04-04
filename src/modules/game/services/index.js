import { getGtagUrl, getAnalyticsInitScript, getTrackScreenScript } from './googleAnalytics';

function fetchYath(type) {
    const fileName = `yath.min.${type}`;

    return window.fetch(`https://raw.githubusercontent.com/adrien-gueret/yath/master/${fileName}`)
        .then(response => response.text());
}

export function getScreensHtml(screens, links) {
    return screens.map(screen => screen.toHTML(links)).join('');
}

export function getScreensStringifiedRules(screens, logic, gaId) {
    let analyticsLogic = '';

    if (gaId) {
        const screenIdsToScreenNames = JSON.stringify(screens.reduce((acc, screen) => ({
            ...acc,
            [screen.id]: { n: screen.name, s: '/' + screen.getSlug() },
        }), {}));
        analyticsLogic = `var m=${screenIdsToScreenNames};t(m[screenName].n,m[screenName].s);`;
    }

    const specificScreensLogic = screens
        .map(screen => screen.getStringifiedRules(logic))
        .filter(stringifiedRule => !!stringifiedRule)
        .join(' else ');

    return analyticsLogic + specificScreensLogic;
}


export function fetchYathCSS() {
    return fetchYath('css');
}

export function fetchYathJS() {
   return fetchYath('js');
}

export function getStartGameScript(startScreenId, onScreenChangeStringified) {
    const optionsStringified = onScreenChangeStringified ? `{onScreenChange:function(o){var game=o.game,screenName=o.screenName;${onScreenChangeStringified}}}` : null;
    const appendedOptions = optionsStringified ? `, ${optionsStringified}` : '';

    return `const g = yath(document.body${appendedOptions});g.goToScreen('${startScreenId}');`;
}

export function getFullHtml(gameName, screens, links, logic, startScreen, customCSS, otherParameters) {
    const gaId = otherParameters.gaId;
    const screensHtml = getScreensHtml(screens, links);
    const onScreenChangeStringified = getScreensStringifiedRules(screens, logic, gaId);
    const startGame = getStartGameScript(startScreen.id, onScreenChangeStringified);
    
    return Promise.all([
        fetchYathCSS(),
        fetchYathJS(),
    ]).then((responses) => {
        const [mainCss, mainJs] = responses;

        const customStyle = customCSS ? `<style data-meta="custom-css">${customCSS.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</style>` : '';

        return `<!DOCTYPE html>
<html>
    <head>
        ${gaId ? (
            `<script async src="${getGtagUrl(gaId)}"></script><script>${getAnalyticsInitScript(gaId)};${getTrackScreenScript(gaId)}</script>`
        ) : ''}
        <meta charset="UTF-8">
        <title>${gameName.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</title>
        <style data-meta="yath">${mainCss}</style>
        ${customStyle}
        <script>${mainJs}</script>
    </head>
    <body style="display:none;">
        ${screensHtml}
        <script>${startGame}</script>
    </body>
</html>`;
    });
}

export function injectGameIntoIframe(iframe, screens, links, logic, startScreenId, customCSS, otherParameters) {
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
        yathStyle.dataset.meta = 'yath';
        iframe.contentDocument.head.appendChild(yathStyle);

        if (customCSS) {
            const customStyle = document.createElement('style');
            customStyle.appendChild(document.createTextNode(customCSS));
            customStyle.dataset.meta = 'custom-css';
            iframe.contentDocument.head.appendChild(customStyle);
        }

        const yathScript = document.createElement('script');
        yathScript.appendChild(document.createTextNode(jsContent));
        iframe.contentDocument.head.appendChild(yathScript);

        iframe.contentDocument.body.setAttribute('style', 'display:none;');
        iframe.contentDocument.body.innerHTML = getScreensHtml(screens, links);

        const onScreenChangeStringified = getScreensStringifiedRules(screens, logic);

        const gameContent = getStartGameScript(startScreenId, onScreenChangeStringified);
        const gameScript = document.createElement('script');
        gameScript.appendChild(document.createTextNode(gameContent));

        iframe.contentDocument.body.appendChild(gameScript);
    });
};