function getVersion(){
    if(globalThis["$window"]) return "v2";
    if(document.querySelector("main#desktop")) return "v3";
}
var version=getVersion();

var messageBox, makeWindow, makeFolder, saveFile;
switch(version){
    case "v2":{
        messageBox = function(title,message,callback){
            $alert({title,msg:message},callback);
        };
        makeWindow = async function(title,width,height){
            let {body} = $window({title,width,height,minimizable:false,maximizable:false,resizable:false}).el;
            let myElem=document.createElement("div");
            myElem.style.width=myElem.style.height="100%";
            body.appendChild(myElem);
            return myElem;
        };
        makeFolder = async function(path){
            console.warn("v2 does not support saving folders - "+path+" will not be made");
        };
        saveFile = function(path,content){
            return new Promise(callback=>{
                $file.save(path,content,callback);
            })
        }
        break;
    }
    case "v3":{
        // lots of shit incoming!!!
        messageBox = function(title,message,callback){
            import("/c/sys/ui/invocables/alert.js").then((mod)=>{ // yeah, you have to import the thing beforehand...
                mod.alert(message,{label:title}).then(callback); // can you please explain why you had to put it as "label", v3 dev???
            })
        };
        makeWindow = async function(title,width,height){
            let mod = await import("/c/sys/ui/components/dialog.js"); // why tf did you have to make it a "dialog" -_-
            let myElem=document.createElement("div");
            myElem.style.width=myElem.style.height="100%";
            mod.dialog({label:title,width,height,content:myElem}); // apparently its not possible to make a window unresizable
            return myElem;
        };
        makeFolder = async function(path){
            console.log("mkdir",path)
            let fs = await import("/c/sys/core/fs.js")
            await fs.writeDir(path);
        }
        saveFile = async function(path,content){
            console.log("touch",path);
            let fs = await import("/c/sys/core/fs.js")
            await fs.writeText(path,content);
        }
        break;
    }
};