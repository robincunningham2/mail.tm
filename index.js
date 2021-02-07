
'use strict';

const http = require('http');
const HOST = 'api.mail.tm';

function makeRequest(method, path, data='') {
    let options = {
        host: HOST,
        port: '80',
        path, method,
        headers: {
            Accept: 'application/json'
        }
    };

    if (method == 'POST') options.headers['Content-Type'] = 'application/json';

    return new Promise((resolve, reject) => {
        const request = http.request(options, (res) => {
            let data = '';

            res.setEncoding('utf8');
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    data = JSON.parse(data);
                } catch {}

                resolve({
                    status: res.statusCode,
                    data
                });
            });
        });

        request.on('error', reject);

        if (method == 'POST') request.write(data);
        request.end();
    });
}

function domains() {
    return new Promise((resolve, reject) => {
        makeRequest('GET', '/domains').then(res => {
            let domains = [];
            res.data.forEach(domain => {
                if (domain.is_active && !domain.is_private) domains.push(domain.domain);
            });

            resolve(domains);
        }).catch(reject);
    });
}