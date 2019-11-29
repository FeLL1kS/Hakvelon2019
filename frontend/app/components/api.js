import { APP_ROOT } from "./constants";

export default async function api(path, data = {}) {
    // TODO: REmove it
    if (path == 'user/getList') {
        return [{"user_id":2,"login":"oleg","name":"Oleg","role":1,"interests":"Gay Porn, Loli"},{"user_id":3,"login":"danila","name":"Danila","role":5,"interests":"Coding, Loli, Cats, JavaScript"},{"user_id":4,"login":"alex","name":"Alex","role":1,"interests":"Coding, Python, Alex"},{"user_id":1,"login":"admin","name":"Administrator","role":5,"interests":""}];
    }

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