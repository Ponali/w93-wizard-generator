let fs=require("fs");
let {join} = require("path");

function isHeader(line){
    return line.startsWith("> ");
}
function getHeaderVersion(line){
    if(!isHeader(line)){
        throw new Error("Invalid header: "+line);
    };
    return line.slice(2);
}
function readVersion(lines,i){
    let scannedHeader=getHeaderVersion(lines[i]);
    let data=[];
    while((lines[++i]!=="---")&&(!isHeader(lines[i]))){
        let line=lines[i].split(" -> ");
        data.push(line);
    }
    return [i,scannedHeader,data];
}
function makeConfigObject(projectFolder){
    let lines=fs.readFileSync(join(projectFolder,"wizgen-config")).toString("utf8").split("\n").filter(a=>a.replaceAll(" ",""));
    let i=0;
    let obj={};
    let supported=[];
    while(lines[i]!=="---"){
        [i,version,data]=readVersion(lines,i);
        obj[version]=data;
        supported.push(version);
    };
    let meta=JSON.parse(lines.slice(i+1).join("\n"));
    return [obj,meta,supported];
}
module.exports=makeConfigObject