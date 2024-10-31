console.log("running on version",version);

function handleContentFooter(win){
    win.style.display="flex";
    win.style.flexDirection="column";
    let content=document.createElement("div");
    let footer=document.createElement("div");
    content.style.width=footer.style.width="100%";
    content.style.height="100%";
    content.style.overflow="auto";
    win.appendChild(content);
    win.appendChild(footer);
    return [content,footer];
}

function addReturn(parentElem,elem){
    parentElem.appendChild(elem);
    return elem;
}

function textElem(parentElem,tagName,text){
    let elem = document.createElement(tagName);
    elem.innerText=text;
    if(tagName=="h1"&&version=="v3") elem.style.fontSize="2em";
    return addReturn(parentElem,elem);
}

function progressBar(parentElem){
    let elem=document.createElement("div");
    elem.style.width="100%";
    elem.style.height="16px";
    let fillColor="#fff";
    let progressColor="#36e"
    elem.style.background=fillColor;
    elem.update=(progress)=>{
        progress*=100;
        elem.style.background=`linear-gradient(90deg, ${progressColor} ${progress}%, ${fillColor} calc(${progress}% + 1px))`;
    };
    return addReturn(parentElem,elem);
}

function getInstallText(){
    if(meta.installTxt) return meta.installTxt;
    return "Installing "+meta.name+"...";
}

function title(){
    return meta.name+" Installer";
}

async function guiSetupWizard(){
    let win = await makeWindow(title(),480,400);
    let [content,footer] = handleContentFooter(win);

    let header = textElem(content,"h1",meta.name+" Installation wizard");
    let text = textElem(content,"p",meta.description);

    textElem(footer,"button","Next").addEventListener("click",async ()=>{
        text.innerText=getInstallText();
        let progressElem = progressBar(content);
        let progressTxt = textElem(content,"p","Initiating...");

        footer.remove();
        try{
            await installFiles((progress,state)=>{
                console.log(state);
                progressElem.update(progress);
                progressTxt.innerText=state;
            })
            text.innerText = meta.name+" has been installed successfully!\nYou can now close this window.";
            progressElem.remove();
            progressTxt.remove();
        } catch (e){
            let errTxt=""+(e.stack?e.stack:e);
            win.innerText=
                "The setup procedure has errored out and cannot continue.\n"+
                `Status when error occured: ${progressTxt.innerText}\n`+
                "\n"+errTxt;
        }
    })
}