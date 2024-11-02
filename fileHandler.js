let {join} = require("path");
let fs=require("fs");
function recursiveList(dir){
    if(fs.statSync(dir).isFile()) return dir;
    return fs.readdirSync(dir).map(a=>recursiveList(join(dir,a))).flat()
};

function joinVirtual2arg(pathA,pathB){
    if(!pathA.endsWith("/")){
        pathA+="/";
    }
    if(pathB.startsWith("/")){
        pathB=pathB.slice(1);
    }
    let out=pathA+pathB;
    if(out.endsWith("/")){
        out=out.slice(0,-1);
    }
    return pathA+pathB;
}

function joinVirtual(...paths){
    return [...paths].reduce(joinVirtual2arg);
}

function handleMove(mv,cwd){
    let asterisk=mv[0].endsWith("*")+mv[1].includes("*");
    if(asterisk===1){
        throw new Error("An asterisk cannot be used on only 1 element.");
    } else if(asterisk==0){
        return [[join(cwd,mv[0]),mv[1]]];
    } else if(asterisk==2){
        let path=join(cwd,mv[0].split("*")[0]);
        let list=recursiveList(path);
        //console.log(mv,cwd,"->",list)
        return list.map(a=>[a,joinVirtual(mv[1].split("*")[0],a.replace(path,""),mv[1].split("*")[1])])
    }
}

function handleVersion(ver,cwd){
    for(let i=0;i<ver.length;i++){
        ver[i]=handleMove(ver[i],cwd);
    }
    return ver.flat();
}

function handleConfig(config,cwd){
    for(let i in config){
        config[i]=handleVersion(config[i],cwd);
    };
    //console.log(config);
    return config;
};

module.exports=handleConfig;
