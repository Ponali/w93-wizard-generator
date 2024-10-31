var UglifyJS = require("uglify-js");
let fs=require("fs");

function stringifyData(data){
    if(data instanceof Buffer){
        return `atob(${JSON.stringify(data.toString("base64"))}).split("").map(a=>a.charCodeAt())`;
    } else return data;
}

function makeScript(data,meta,compressed,supported){
    let main=fs.readdirSync("wizard").filter(a=>a!="pako_inflate.min.js").map(a=>fs.readFileSync("wizard/"+a).toString("utf8")).join("\n");
    let out=`var data=${stringifyData(data)},meta=${JSON.stringify(meta)},compressed=${compressed},supported=${JSON.stringify(supported)};${main}`;
    if(compressed) out=`(()=>{${fs.readFileSync("wizard/pako_inflate.min.js").toString("utf8")}})();\n`+out;
    return out;
}

function makeScriptMinified(data,meta,compressed,supported,beautified){
    let out=makeScript(data,meta,compressed,supported);
    if(beautified) return out;
    let result=UglifyJS.minify(out,{output:{ascii_only:true},compress:{toplevel:true},mangle:{toplevel:true}});
    if(result.error) throw result.error;
    let minified=result.code;
    return minified;
}

module.exports=makeScriptMinified;