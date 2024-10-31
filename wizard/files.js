function start(){
    if(!version){
        alert("Setup cannot proceed: This version of Windows93 is unknown.");
        return;
    }

    if(!supported.includes(version)){
        messageBox("Wizard Generator - Error","This version of Windows93 is not supported by "+meta.name+". You are currently using version "+version+".\nPlease try again with the following version(s): "+supported.join(", "));
        return;
    }

    guiSetupWizard();
}
start();

async function installFiles(sendStatus){
    if(compressed){
        sendStatus(0,"Decompressing data...");
        let inflated=pako.inflate(new Uint8Array(data),{to:"string"});
        data=JSON.parse(inflated);
    };
    let files = data.files[version];
    for(let i=0;i<files.length;i++){
        sendStatus(i/files.length,`Writing ${files[i].dir?"folder":"file"} (${i+1}/${files.length}) ${files[i].path}`);
        if(files[i].dir){
            await makeFolder(files[i].path)
        } else {
            console.log("idx "+files[i].content);
            let content=data.table[files[i].content]
            await saveFile(files[i].path,content);
        }
    };
    return;
}