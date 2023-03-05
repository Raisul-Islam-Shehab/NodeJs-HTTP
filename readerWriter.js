import fs, { access, statSync, constants } from 'fs';
import * as logger from './logger.js';
import path from 'path';

function readFile(req, res, outputFile) {

    //Defines the variable to hold the strings describing the action happening
    let content = '';

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

    // Checks if a file is accessible or not
    access(filePath, constants.R_OK | constants.F_OK, (err) => {

        if (err) {
            if (err.code === 'EACCES') {
                res.statusCode = 403;
                content = `File 'Read' permission is denied\n\n`;
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

        //Extracts the file stats and handles errors
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
}

export { readFile };