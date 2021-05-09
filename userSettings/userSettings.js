//Load Settings
var csInterface = new CSInterface();
var userSettingsPath = csInterface.getSystemPath(SystemPath.USER_DATA) + "/ProjectLogger"; 
var userSettingsFileName = "/userSettings.json";
csInterface.setWindowTitle("Project Logger Settings")
var userSettingsFile = window.cep.fs.readFile(userSettingsPath + userSettingsFileName);
var userSettings = JSON.parse(userSettingsFile.data);
var bkColour = Math.floor(csInterface.hostEnvironment.appSkinInfo.panelBackgroundColor.color.green);

//IDs
var savedID = document.getElementById("saved");
var startOnLaunchID = document.getElementById("startOnLaunch")
var showTimerID = document.getElementById("showTimer");
var dateFormatID = document.getElementById("dateFormat")
var pickSaveFolderID = document.getElementById("pickSaveFolder");
var fileNameID = document.getElementById("fileName");
var saveAllID = document.getElementById("saveAll");
var saveLocalID = document.getElementById("saveLocal");
var saveLocalCheckboxID = document.getElementById("saveLocalCheckbox");
var saveIndividualID = document.getElementById("saveIndividual");
var mainBodyID = document.getElementById("mainBody");

//Display User Settings
mainBody.style.background = "rgb("+ bkColour + "," + bkColour + "," + bkColour +")";
startOnLaunchID.checked = userSettings.startOnLaunch;
showTimerID.checked = userSettings.showTimer;
saveAllID.checked = userSettings.saveAll;
pickSaveFolderID.innerHTML = userSettings.filePath;
fileNameID.value = userSettings.fileName.split(".csv")[0];
dateFormatID.value = userSettings.dateFormat;
saveIndividualID.checked = userSettings.saveIndividual;
saveIndividualCheckbox();

//Runs on start and if checkbox changed
function saveIndividualCheckbox(){
    if(saveIndividualID.checked == false){
        saveLocalCheckboxID.disabled = true;
        saveLocalID.classList.add("greyOut");
        saveLocalCheckboxID.checked = false;
    }else{
        saveLocalCheckboxID.checked = userSettings.saveLocal;
        saveLocalCheckboxID.disabled = false;
        saveLocalID.classList.remove("greyOut");
    }
}

function pickSaveFolder(){
    var saveFolder = window.cep.fs.showOpenDialog(false, true, "Save Location", null);
    pickSaveFolderID.innerHTML = saveFolder.data[0] + "/";
    userSettings.filePath = saveFolder.data[0] + "/";
}

function apply(){
    userSettings.firstLaunch = false;
    userSettings.fileName = fileNameID.value.replace(/[\<>:"|?*\/.\\]/g, "");
    userSettings.dateFormat = dateFormatID.value;
    savedID.classList.remove("fadeOut");
    void savedID.offsetWidth; //reset animation
    savedID.classList.add("fadeOut");
    userSettings.startOnLaunch = startOnLaunchID.checked;
    userSettings.showTimer = showTimerID.checked;
    userSettings.saveAll = saveAllID.checked;
    userSettings.saveLocal = saveLocalCheckboxID.checked;
    userSettings.saveIndividual = saveIndividual.checked;
    userSettingsSave = JSON.stringify(userSettings, null, 4);
    window.cep.fs.writeFile(userSettingsPath + userSettingsFileName, userSettingsSave);
    var event = new CSEvent("settingsApply", "APPLICATION");
    csInterface.dispatchEvent(event);
}

//document.getElementById("test").innerHTML = JSON.stringify(csInterface.getExtensions(["com.project.logger.settings.panel"]));

//Didn't work try to open a new extensions with putting in manifest
/*
newExtension = new Extension("com.project.logger.test.panel", "Project Logger Test", "C:\\Users\\Grego\\AppData\\Roaming\\Adobe\\CEP\\extensions\\Extension Testing\\index.html", "C:\\Users\\Grego\\AppData\\Roaming\\Adobe\\CEP\\extensions\\Extension Testing", "Panel", 150, 150, 150, 150, 150, 150,
"", "", ["CSXS",0,0,9], true, false);
*/