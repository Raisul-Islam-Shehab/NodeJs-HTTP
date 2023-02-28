//This program handles HTTP request and response at url "http://192.168.68.200:3000/"
import http from 'http';
import url from 'url';
import fs, { statSync } from 'fs';
import path from 'path';
import { existsSync } from 'fs';
import * as logger from './logger.js';

//Output file where all actions will be documented
const outputFile = 'Output.txt';

//port number
const port = 3000;

//To hold the string describing the action happening
let content = '';

//creates server
const server = http.createServer((req, res) => {

    //only accepts 'GET' method
    if (req.method != 'GET') {
        res.statusCode = 501;
        content = 'Operation not supported. Use "GET" method.\n';
        logger.appendTime(outputFile);
        logger.appendFile(outputFile, content);
        res.end(content);
        return;
    }

    //Appends time to the output file
    logger.appendTime(outputFile);

    //Extracts the file name
    const fileName = req.url;

    if (fileName == '/') {
        content = `Didn't provide a valid path\n\n`;
        logger.appendFile(outputFile, content);
        res.end(`Provide a valid path like "http://192.168.68.200:3000/file_name.extension"\n`)
        return;
    }

    const filePath = "/home/dsi/NodeJs/HelloWorld" + fileName;
    content = `Request path extracted "${filePath}"\n`;
    logger.appendFile(outputFile, content);

    //Checks if the file exists or not
    if (!existsSync(filePath)) {
        res.statusCode = 404;
        content = 'File not found\n\n';
        logger.appendFile(outputFile, content);
        res.end(content);
        return;
    }

    //Extracts the file extension
    let fileExt = path.extname(filePath);
    content = `File extention is "${fileExt}"\n`;
    logger.appendFile(outputFile, content);

    //Sets response headers
    switch (fileExt) {
        case '.mp4':
            res.setHeader('Content-Type', 'video/mp4');
            break;
        case '.png':
            res.setHeader('Content-Type', 'image/png');
            break;
        case '.jpg':
            res.setHeader('Content-Type', 'image/jpeg');
            break;
        case '.gif':
            res.setHeader('Content-Type', 'image/gif');
            break;
        case '.html':
            res.setHeader('Content-Type', 'text/html');
            break;
        case '.txt':
            res.setHeader('Content-Type', 'text/plain');
            break;
        case '.xml':
            res.setHeader('Content-Type', 'text/xml');
            break;
        case '.json':
            res.setHeader('Content-Type', 'application/json');
            break;
        case '.css':
            res.setHeader('Content-Type', 'text/css');
            break;
        case '.pdf':
            res.setHeader('Content-Type', 'application/pdf');
            break;
        case '.mpeg':
            res.setHeader('Content-Type', 'audio/mpeg');
            break;
    }

    //Extracts the file stats
    let stats;
    try {
        stats = statSync(filePath);
    } catch (err) {
        console.error(err);
        return;
    }

    content = `File size is "${stats.size}" bytes\n`;
    logger.appendFile(outputFile, content);

    //Shows the file on browser
    res.statusCode = 200;
    content = 'File shown in the browser\n\n';
    logger.appendFile(outputFile, content);

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);

});

//Listening to port 3000
server.listen(port, () => {
    content = `Server running at "http://192.168.68.200:${port}"\n`;
    console.log(content);

    if (!existsSync('home/dsi/NodeJs/HelloWorld/Output.txt')) {
        logger.writeFile(outputFile, content);
    } else {
        logger.appendFile(outputFile, content);
    }

});