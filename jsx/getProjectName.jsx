function getProjectName(appName){
    var projectName = [];
      
    switch(appName) {
        case "After Effects":
            try{
                projectName[0] = app.project.file.displayName.split(".")[0];
                projectName[1] = app.project.file.fsName;
            } 
            catch(err){
                projectName[0] = "Untitled Project";
                projectName[1] = "No project open";
            }
            return projectName;

        case "Premiere Pro":
            try{
                projectName[0] = app.project.name.split(".")[0];
                projectName[1] = app.project.path;
            } 
            catch(err){
                projectName[0] = "Untitled Project";
                projectName[1] = "No project open";
            }
            return projectName;
        
        default: //Photoshop, Illustrator, InDesign
            try{
                projectName[0] = app.activeDocument.fullName.displayName.split(".")[0];
                projectName[1] = app.activeDocument.fullName.fsName;
            } 
            catch(err){
                projectName[0] = "Untitled Project";
                projectName[1] = "No project open";
            }
            return projectName.toString(); //InDesign needs result passed as a string, other programes work either way
    }
}