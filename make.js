let fs=require("fs");

var argv = require('minimist')(process.argv.slice(2));

let projectFolder=argv._[0];

let outputFile = argv.o||argv.output||"out.js";

let compress=!(argv.u||argv.uncompressed);

let beautified=(argv.b||argv.beautified);

function makeData(dataObject){
    let dataJSON=JSON.stringify(dataObject);
    if(compress){
        console.log("Compressing data...")
        return require("zlib").deflateSync(dataJSON);
    } else {
        return dataJSON;
    }
}

console.log("Parsing configuration...");
let [config,meta,supported] = require("./config.js")(projectFolder);

console.log("Reading files...");
let files = require("./fileHandler.js")(config,projectFolder);

console.log("Making data object...");
let dataObject = require("./dataObject.js")(files,projectFolder);

let data=makeData(dataObject);

console.log("Making script...");
let script = require("./makeScript.js")(data,meta,compress,supported,beautified);

console.log("Saving...");
fs.writeFileSync(outputFile,script);

console.log("Successfully made setup script ("+outputFile+")")