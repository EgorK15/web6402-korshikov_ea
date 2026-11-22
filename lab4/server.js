const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const contentTypes = new Map([
    ['.html', 'text/html; charset=utf-8'],
    ['.css', 'text/css; charset=utf-8'],
    ['.js', 'text/javascript; charset=utf-8'],
    ['.svg', 'image/svg+xml'],
    ['.png', 'image/png'],
    ['.jpg', 'image/jpeg'],
]);

const files = new Map([
    ['/', 'index.html'],
    ...['index.html', 'institutes.html', 'schedule.html', 'contacts.html', 'style.css', 'contacts.js']
        .map((file) => ['/' + file, file]),
]);

for (const directory of ['img', 'img/inst']) {
    for (const file of fs.readdirSync(path.join(__dirname, directory), {withFileTypes: true})) {
        if (file.isFile()) {
            const filePath = directory + '/' + file.name;
            files.set('/' + filePath, filePath);
        }
    }
}

async function receiveQuestion(req, res) {
    let body = '';
    req.setEncoding('utf8');

    for await (const chunk of req) {
        body += chunk;
        if (body.length > 4096) {
            res.writeHead(413).end();
            return;
        }
    }

    try {
        const {name, email, question, applicant} = JSON.parse(body);
        if (
            typeof name !== 'string' || !name.trim() ||
            typeof email !== 'string' || !email.includes('@') ||
            typeof question !== 'string' || !question.trim() ||
            typeof applicant !== 'boolean'
        ) {
            res.writeHead(400).end();
            return;
        }
        res.writeHead(204).end();
        console.log('Вопрос принят', {name, email, question, applicant});
    } catch {
        res.writeHead(400).end();
    }
}

const server = http.createServer(async (req, res) => {
    const url = req.url.split('?')[0];
    if (req.method === 'POST' && url === '/questions') {
        try {
            await receiveQuestion(req, res);
        } catch {
            res.writeHead(400).end();
        }
        return;
    }

    const file = files.get(url);
    if (req.method !== 'GET' || !file) {
        res.writeHead(404).end();
        return;
    }

    fs.readFile(path.join(__dirname, file), (error, data) => {
        if (error) {
            res.writeHead(404).end();
            return;
        }
        res.writeHead(200, {'Content-Type': contentTypes.get(path.extname(file))});
        res.end(data);
    });
});

const port = Number(process.argv[2] ?? 3000);

server.listen(port, '127.0.0.1', () => {
    console.log(`http://127.0.0.1:${server.address().port}/`);
});
