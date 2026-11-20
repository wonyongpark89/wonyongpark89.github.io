// Dependency-free preview. Test mode is opt-in and never contacts the live API.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const testing = process.argv.includes('--test');
const port = testing ? 4174 : 4173;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
http.createServer((req, res) => {
    const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (testing && name === '/__tests__') {
        let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
        const before = fs.readFileSync(path.join(root, 'tests/setup.js'), 'utf8');
        const after = fs.readFileSync(path.join(root, 'tests/workbook-regression.js'), 'utf8');
        html = html.replace('<head>', () => '<head><script>' + before + '</script>');
        const closing = html.lastIndexOf('</body>');
        html = html.slice(0, closing) + '<script>' + after + '</script>' + html.slice(closing);
        res.writeHead(200, { 'Content-Type': types['.html'], 'Cache-Control': 'no-store' });
        return res.end(html);
    }
    const file = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
    const relative = path.relative(root, file);
    if (relative.startsWith('..') || relative.startsWith('.') || /^(tests|scripts)([\\/]|$)/.test(relative)) { res.writeHead(403); return res.end('Forbidden'); }
    try {
        const body = fs.readFileSync(file);
        res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
        res.end(body);
    } catch { res.writeHead(404); res.end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Workbook ${testing ? 'checks' : 'preview'}: http://127.0.0.1:${port}/${testing ? '__tests__' : ''}`));
