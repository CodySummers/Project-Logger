//working on other adobe programs, dreamweaver and audition need testing
//launch invisible first and have that load the panel

var csInterface = new CSInterface();
var userSettingsPath = csInterface.getSystemPath(SystemPath.USER_DATA) + "/ProjectLogger";
var userSettingsFileName = "/userSettings.json";
var projectName;
var projectPath;
var oldProjectName;
var oldProjectPath;
var projectChange;
var timer;
var dateDDMMYY;
var startTime;
var running = false;
var userSettings;
var totalSeconds = 0;
var projectChangeTimer = 1000; //1 seconds
var appName = getFullAppName();
var bkColour = Math.floor(csInterface.hostEnvironment.appSkinInfo.panelBackgroundColor.color.green);
var projectLog;

/*
var test = cep.fs.readdir("E:/OneDrive - Dentsu Aegis Network/After Effects Scripts and Expressions/Videogrid/Animals");
alert(test.data)
*/

//IDs
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var startStopButton = document.getElementById("startStop");
var mainBodyID = document.getElementById("mainBody");

mainBodyID.style.background = "rgb(" + bkColour + "," + bkColour + "," + bkColour + ")";

//If window or AE closes write to file. 
window.addEventListener("beforeunload", function () {
    if (running == true) {
        //window.cep.fs.writeFile("C:/1.txt", "Hello");
        stopButton();
    }
});

function loadUserSettings() {
    var userSettingsFile = window.cep.fs.readFile(userSettingsPath + userSettingsFileName);
    if (userSettingsFile.err == 0) {
        userSettings = JSON.parse(userSettingsFile.data);
        document.getElementById("timer").style.display = (userSettings.showTimer == true) ? 'inline' : 'none';
    } else makeUserSettings();
}

function makeUserSettings() {
    userSettings = {
        filePath: "Please pick a folder.",
        fileName: "ProjectLog",
        showTimer: true,
        startOnLaunch: false,
        dateFormat: "ddmmyy",
        saveAll: true,
        saveIndividual: false,
        saveLocal: false,
        firstLaunch: true
    };
    window.cep.fs.makedir(userSettingsPath);
    userSettingsSave = JSON.stringify(userSettings, null, 4);
    window.cep.fs.writeFile(userSettingsPath + userSettingsFileName, userSettingsSave);
}

function mainOnload() {
    loadUserSettings()
    if (userSettings.firstLaunch == true) {
        settingsWindow();
    }
    if (userSettings.startOnLaunch == true) {
        startButton();
    };
}

function settingsWindow() {
    csInterface.requestOpenExtension("com.project.logger.settings.panel");
}

csInterface.addEventListener("settingsApply", function (event) {
    loadUserSettings();
});

function projectLogStart() {
    totalSeconds = 0;
    dateDDMMYY = dateFormat();
    getProjectName();
    startTime = new Date().toLocaleTimeString();
    setTimeout(function () {
        oldProjectName = projectName.slice(0);
        oldProjectPath = projectPath.slice(0);
    }, 1000);
    projectChange = setInterval(function () { compareProjectName() }, projectChangeTimer);
}

function dateFormat() {
    var dd = new Date().getDate();
    var mm = (new Date().getMonth() + 1);
    var yy = new Date().getFullYear();

    switch (userSettings.dateFormat) {
        case "ddmmyy":
            return dd + "/" + mm + "/" + yy;
        case "mmddyy":
            return mm + "/" + dd + "/" + yy;
        case "yymmdd":
            return yy + "/" + mm + "/" + dd;
    }
}

function compareProjectName() {
    getProjectName();
    if (oldProjectName != projectName) {
        clearInterval(projectChange);
        writeToFile(oldProjectName, oldProjectPath);
        projectLogStart();
    }
}

function writeToFile(projectNameToRecord, projectPathToRecord) {
    if (userSettings.saveAll == true) {
        fileExists(userSettings.filePath + userSettings.fileName, projectNameToRecord);
    }
    if (userSettings.saveIndividual == true && userSettings.saveLocal == false && projectNameToRecord != "Untitled Project") {
        fileExists(userSettings.filePath + projectNameToRecord + "-" + userSettings.fileName, projectNameToRecord);
    }
    if (userSettings.saveIndividual == true && userSettings.saveLocal == true && projectNameToRecord != "Untitled Project") {
        fileExists(projectPathToRecord + projectNameToRecord + " - " + userSettings.fileName, projectNameToRecord)
    }
}

function fileExists(fileInfo, projectNameToRecord) {
    projectLog = window.cep.fs.readFile(fileInfo + ".csv");
    var endTime = new Date().toLocaleTimeString();
    var dataToWrite = projectLog.data + dateDDMMYY + "," + appName + "," + projectNameToRecord + "," + startTime + "," + endTime + "," + (totalSeconds / 60).toFixed(2) + "\r";
    if (projectLog.err != 0) {
        dataToWrite = "Date,Program,Project Name,Start time,End Time,Elapsed Time\r" + dataToWrite;

    }
    window.cep.fs.writeFile(fileInfo + ".csv", dataToWrite);
}

function getProjectName() {
    csInterface.evalScript('getProjectName("' + appName + '")', function (msg) {
        //alert(JSON.stringify(msg))
        projectName = msg.split(",")[0];
        projectPath = msg.split(",")[1];
        projectPath = projectPath.substring(0, projectPath.lastIndexOf("\\")) + "/"; //won't work on mac?? will try catch work
    });
}

function startStop() {
    if (running == false) {
        startButton();
    } else {
        stopButton();
    }
}

function startButton() {
    projectLogStart();
    startStopButton.innerHTML = "Stop";
    running = true;
    timer = setInterval(setTime, 1000);
}

function stopButton() {
    startStopButton.innerHTML = "Start";
    running = false;
    clearInterval(projectChange);
    clearInterval(timer);
    writeToFile(projectName, projectPath);
}

//Timer
function setTime() {
    ++totalSeconds;
    minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
    secondsLabel.innerHTML = pad(totalSeconds % 60);
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}

function getFullAppName() {
    switch (csInterface.hostEnvironment.appName) {

        case "PHSP":
        case "PHXS":
            return "Photoshop";
        case "IDSN":
            return "InDesign";
        case "AICY":
            return "InCopy";
        case "ILST":
            return "Illustrator";
        case "PPRO":
            return "Premiere Pro";
        case "PRLD":
            return "Prelude"
        case "AEFT":
            return "After Effects";
        case "FLPR":
            return "Animate";
        case "AUDT":
            return "Audition";
        case "DRWV":
            return "Dreamweaver";
        case "MUSE":
            return "Muse";
        case "KBRG":
            return "Bridge";
        case "RUSH":
            return "Rush";
    }
}

/*
//Helper function for promises
function runEvalScript(script) {
    return new Promise(function(resolve, reject){
        csInterface.evalScript(script, resolve);
    });
}

//How to write promises

function writeToFile(){
runEvalScript('writeToFile()')
    .then(function(res){
        return alert("write to file promise returned")
    })
}
*/

/*
function saveFile(){
    var oldFile = window.cep.fs.readFile("C:\\Users\\Grego\\Desktop\\ProjectLog-ExtensionText.csv");
    window.cep.fs.writeFile("G:\\Test.csv", oldFile.data + "this is a test");
}
*/

//document.getElementById("test").innerHTML = JSON.stringify(csInterface.hostEnvironment);

/*
//Added to writeToFile
function createFile(){
    projectLog = window.cep.fs.readFile(filePath + fileName);
    if(projectLog.err != 0){
        projectLog = window.cep.fs.writeFile(filePath + fileName, "Date,Project Name,Start time,End Time,Elapsed Time\r")
    }
}
*/