const glob = require("glob");

function handleMove(mv,cwd){
    let asterisk=mv[0].includes("*")+mv[1].includes("*");
    if(asterisk===1){
        throw new Error("An asterisk cannot be used on only 1 element.");
    } else if(asterisk==0){
        return [[mv[0],mv[1]]];
    } else if(asterisk==2){
        let fromTo=mv.map(a=>a.split("*"));
        return glob.sync(mv[0].replaceAll("*","**"),{cwd}).filter(a=>a!==fromTo[0][0].slice(0,-1))
        .map(a=>[a,a.replace(fromTo[0][0],fromTo[1][0]).replace(fromTo[0][1],fromTo[1][1])])
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
    return config;
};

module.exports=handleConfig;