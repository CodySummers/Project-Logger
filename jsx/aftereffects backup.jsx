function getProjectName(){
    var projectName = [];
    try{projectName[0] = app.project.file.displayName.split(".aep")[0]} //After Effects
    catch(err){projectName[0] = "Untitled Project"}
    try{projectName[1] = app.project.file.fsName}
    catch(err){projectName[1] = "No project open"}
    try{projectName[0] = app.activeDocument.fullName.displayName.split(".")[0]} //Photoshop
    catch(err){projectName[0] = "Untitled Project"} 
    try{projectName[1] = app.activeDocument.fullName.fsName} //Photoshop
    catch(err){projectName[0] = "No project open"} 
    return projectName;
}