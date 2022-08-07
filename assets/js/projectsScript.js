// update language function
function updateProjectsList(l=language) {    

    // -------------------------- PROJECTS
    var projectList = '';
    let projectsPageSections = Object.keys(projectNames);
    for (const sec of projectsPageSections) {
        // avoid adding extra brs at the end
        let lastSection = sec == projectsPageSections[projectsPageSections.length - 1] ? true : false;

        // generate section
        if (JSON.parse(projectSections[sec]["include"]) == true) {
            
            // generate heading
            var projectHeading = `<h3 class="inline"><b>${projectSections[sec]['emoji']} ${projectHeadings[sec][l]}</b></h3>`;

            // append to article list html object
            projectList += `${projectHeading}<ul class="noBullets">`;
            for (let i = 0; i < projectNames[sec].length; i++) {
                // type of link to project
                let projectTypeOfLink = projectLinks[sec][i].includes("github") ? "github" : "website";

                // project NAMES
                projectList += `<li class="pjs">${projectNames[sec][i][l]}</li>`;
                // project DESCRIPTIONS
                projectList += `<br><ul class="noBullets"><li class="pjs-desc">${projectDescriptions[sec][i][l]}</li>`;
                // project LINKS
                if (projectLinks[sec][i] != "") {
                    projectList += `<br><li class="pjs-gh"><a class="b" href="${projectLinks[sec][i]}">${projectLinkHeading[projectTypeOfLink][l]}</a></li></ul>`;
                    // add line breaks if the object isnt the last one of the last section
                    if (!lastSection) {
                        console.log('test')
                        projectList += '<br><br>';
                    }
                } 
            }
            projectList += '</ul>';
        }
    }

    // appending the list of articles
    if (document.getElementById("projectsList")) {
        $("#projectsList").html(projectList);
    }

}

// update projects list
allFiles.done(() => {
    updateProjectsList()

    // make all links' target _blank if the link does not have #
    $('a').click(function() {
        if (this.href != 'https://yoursite.com/') {
            this.target = '_blank'
        }
    })
})
