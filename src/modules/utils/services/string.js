export function escapeForNodeContent(str) {
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function escapeForAttrValue(str) {
    return str.replace(/"/g, '&quot;');
}