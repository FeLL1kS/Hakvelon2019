import { APP_ROOT } from "./constants";

export default async function api(path, data) {
    // TODO: REmove it
    if (path == 'user/getList') {
        return [
            {
                name: 'Oleg',
                interests: [
                    'Gay Porn',
                    'Loli'
                ]
            },
            {
                name: 'Danila',
                interests: [
                    'Coding',
                    'Loli',
                    'Cats',
                    'JavaScrpit'
                ]
            },
            {
                name: 'Alex',
                interests: [
                    'Coding',
                    'AI',
                    'Python'
                ]
            },
        ];
    }

    let url = [ APP_ROOT.trimRight('/'), 'api', path].join('/');
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
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