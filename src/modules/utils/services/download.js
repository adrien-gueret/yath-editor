function download(filename, fileContent, dataType) {
    const link = document.createElement('a');
    link.setAttribute('href', `data:${dataType};charset=utf-8,${encodeURIComponent(fileContent)}`);
    link.setAttribute('download', filename);

    link.style.display = 'none';
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
}

export function downloadJson(filename, jsonObject) {
    download(`${filename}.json`, JSON.stringify(jsonObject), 'application/json');
}

export function downloadHtml(filename, htmlContent) {
    download(`${filename}.html`, htmlContent, 'text/html');
}