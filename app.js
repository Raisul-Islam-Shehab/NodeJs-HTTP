//This program handles HTTP request and response at url "http://192.168.68.200:3000/"
import http from 'http';
import { existsSync } from 'fs';
import * as logger from './logger.js';
import * as readerWriter from './readerWriter.js';

//Defines the output file where all actions will be documented
const outputFile = 'Output.txt';

//Defines the port number
const port = 3000;

//Defines the variable to hold the strings describing the action happening
let content = '';

//Creates server
const server = http.createServer((req, res) => {

    //Checks error on reading the request
    req.on("error", (err) => {
        console.error(err);
        res.statusCode = 400;
        res.end("Error reading the request body");
        return;
    });

    //Checks error on writing the response
    res.on("error", (err) => {
        console.error(err);
        return;
    });

    //Accepts only the 'GET' method and appends the action to the output file 
    if (req.method != 'GET') {
        res.statusCode = 501;
        content = 'Operation not supported. Use "GET" method.\n\n';
        logger.appendTime(outputFile);
        logger.appendFile(outputFile, content);
        res.end(content);
        return;
    }

    //Appends time to the output file
    logger.appendTime(outputFile);

    //Calls readFile method to handle rest of the actions
    readerWriter.readFile(req, res, outputFile);
});

//Listens to port 3000
server.listen(port, () => {
    content = `Server running at "http://192.168.68.200:${port}"\n`;
    console.log(content);

    if (!existsSync('home/dsi/NodeJs/HelloWorld/Output.txt')) {
        logger.writeFile(outputFile, content);
    } else {
        logger.appendFile(outputFile, content);
    };
});

