import { APP_ROOT } from "./constants";

export default async function api(path, data = {}) {
    let url = [ APP_ROOT.trimRight('/'), 'api', path].join('/');
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    let result = await response.json();

    if (result.success) {
        return result.data;
    } else {
        // TODO: Error handling
        alert(result.message);
        return null;
    }
}