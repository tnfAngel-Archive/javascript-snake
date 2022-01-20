const morgan = require('morgan');
const { join } = require('path');
const express = require('express');
const { createServer } = require('http');

const app = express();
const server = createServer(app);

const port = process.env.PORT || 3000;

// Settings
app.set('port', port);
app.set('json spaces', 2);
app.set('views', join(__dirname, '/views'));

// Middlwares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/static', express.static('./src/static'));

// Robots
app.get('/', (req, res) => {
	res.sendFile('menu.html', { root: join(__dirname, './pages') });
});

app.get('/play', (req, res) => {
	res.sendFile('play.html', { root: join(__dirname, './pages') });
});

// Server
server.listen(app.get('port'), () => {
	console.log(`Server listening on port ${app.get('port')}`);
});
