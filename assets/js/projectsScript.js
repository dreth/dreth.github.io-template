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
                let projectLinkIsObj = typeof(projectLinks[sec][i]) == "object";
                let projectTypeOfLink = !projectLinkIsObj ? "github" : "website";

                // project NAMES
                projectList += `<li class="pjs">${projectNames[sec][i][l]}</li>`;

                // project DESCRIPTIONS
                projectList += `<br><ul class="noBullets"><li class="pjs-desc">${projectDescriptions[sec][i][l]}</li>`;

                // project LINKS
                if ((!projectLinkIsObj && projectLinks[sec][i] != "") | (projectLinkIsObj && projectLinks[sec][i].length > 0)) {
                    // if it's a live website, also show the repo link
                    let projectLinkLiContent;
                    if (projectTypeOfLink == "website" && projectLinkIsObj) {
                        projectLinkLiContent = `<a class="b" href="${projectLinks[sec][i][0]}">${projectLinkHeading['website'][l]}</a>, <a class="b" href="${projectLinks[sec][i][1]}">${projectLinkHeading['github'][l]}</a></li>`
                    } else {
                        projectLinkLiContent = `<a class="b" href="${projectLinks[sec][i]}">${projectLinkHeading[projectTypeOfLink][l]}</a></li>`
                    }

                    // append link
                    projectList += `<br><li class="pjs-gh">${projectLinkLiContent}</ul>`;
                    // add line breaks if the object isnt the last one of the last section
                    if (!lastSection) {
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
        if (this.href != 'https://dac.ac/') {
            this.target = '_blank'
        }
    })
})
