'use strict';

const express = require('express');
const app = express();
const path = require('path');

const bootstrapPath = path.join(__dirname, 'node_modules', 'bootstrap', 'dist');

app.use(express.static('public'));
app.use('/bootstrap', express.static(bootstrapPath));

app.listen(3000, function () {
	console.log('Server is listening on port 3000.');
});
