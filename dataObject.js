let fs=require("fs");
let {join} = require("path");

function isDirectorySync(path) {
    const stats = fs.statSync(path);
    return stats.isDirectory();
}

let contentTable=[];

function handleFile(file,projectFolder){
    let checkPath=join(projectFolder,file[0]);
    if(isDirectorySync(checkPath)){
        return {dir:1,path:file[1]};
    } else {
        let content=fs.readFileSync(checkPath).toString("utf8");
        let contentIdx=-1;
        if(contentTable.includes(content)){
            contentIdx=contentTable.indexOf(content);
        } else {
            contentIdx=contentTable.length;
            contentTable.push(content);
        }
        return {dir:0,path:file[1],content:contentIdx};
    }
}
function handleVersion(ver,projectFolder){
    for(let i=0;i<ver.length;i++){
        ver[i]=handleFile(ver[i],projectFolder);
    };
    return ver;
}
function makeDataObject(files,projectFolder){
    contentTable=[];
    for(let i in files){
        files[i]=handleVersion(files[i],projectFolder);
    }
    return {table:contentTable,files};
}

module.exports=makeDataObject;