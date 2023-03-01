import fs, { appendFileSync, writeFileSync } from 'fs';

//Appends time to the output file
function appendTime(fileName) {
    let date_ob = new Date();
    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();

    let content = `Time(hour:minute:seconds) ==> ${hours}:${minutes}:${seconds}\n`;
    appendFile(fileName, content);
}


//Write the Output.txt file. If file does not exist, creates a file named 'Output.txt'
function writeFile(fileName, content) {
    try {
        writeFileSync(fileName, content, { flag: 'a+' });
    } catch (err) {
        console.error(err);
        return;
    }
}

//Appends texts at the end of the 'Output.txt' file
function appendFile(fileName, content) {
    try {
        appendFileSync(fileName, content);
    } catch (err) {
        console.error(err);
        return;
    }
}

//Exports the functions outside the module
export { writeFile, appendFile, appendTime }; 