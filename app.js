//This program handles HTTP request and response at url "http://192.168.68.200:3000/"
import http from 'http';
import url from 'url';
import fs, { access, statSync, constants } from 'fs';
import path from 'path';
import { existsSync } from 'fs';
import * as logger from './logger.js';

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
    });

    //Checks error on writing the response
    res.on("error", (err) => {
        console.error(err);
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

    //Extracts the file name
    const fileName = req.url;

    //Checks if provided path is valid or not
    if (fileName == '/') {
        content = `Didn't provide a valid path\n\n`;
        logger.appendFile(outputFile, content);
        res.statusCode = 400;
        res.end(`Provide a valid path like "http://192.168.68.200:3000/file_name.extension"\n`)
        return;
    }

    //Appends the file path to the output file
    const filePath = "/home/dsi/NodeJs/HelloWorld" + fileName;
    content = `Request path extracted "${filePath}"\n`;
    logger.appendFile(outputFile, content);

    //Checks if the file exists or not
    // if (!existsSync(filePath)) {
    //     res.statusCode = 404;
    //     content = 'File not found\n\n';
    //     logger.appendFile(outputFile, content);
    //     res.end(content);
    //     return;
    // }


    access(filePath, constants.R_OK | constants.F_OK, (err) => {
        if (err) {
            if (err.code === 'EACCES') {
                res.statusCode = 403;

                content = 'Read permission is not allowed\n\n';
                logger.appendFile(outputFile, content);
                res.end(content);
                return;
            }
            else {
                res.statusCode = 404;

                content = 'File not found\n\n';
                logger.appendFile(outputFile, content);
                res.end(content);
                return;
            }

        }

        //Appends the file extension to the output file
        let fileExt = path.extname(filePath);
        content = `File extention is "${fileExt}"\n`;
        logger.appendFile(outputFile, content);

        //Extracts the file stats
        let stats;
        try {
            stats = statSync(filePath);
        } catch (err) {
            console.error(err);
            return;
        }

        //Appends the file size to the output file
        content = `File size is "${stats.size}" bytes\n`;
        logger.appendFile(outputFile, content);

        //Shows the file on browser and appends the action to the output file
        res.statusCode = 200;
        content = 'File shown in the browser\n\n';
        logger.appendFile(outputFile, content);

        try {
            const stream = fs.createReadStream(filePath);
            stream.pipe(res);
        } catch (err) {
            console.error(err);
            return;
        }
    });

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

