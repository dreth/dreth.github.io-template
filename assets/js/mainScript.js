// GENERAL STUFF ------------ links to all the profiles + email
const linkedin = 'https://www.linkedin.com/in/your_linkedin_user/';
const github = 'https://github.com/your_github_user';
const twitter = 'https://twitter.com/your_twitter_user';
const email = 'mailto:contact@yoursite.com';
const blog = '/blog/';
const about = '/about/';
const home = '/';
const status = '/status';
const projects = '/projects';
const cool_links = '/cool_links';
const playlists = '/playlists';
var language;
var darkThemeLabel;
var lightThemeLabel;

// logging something cool cause life's too short and this may make someone smile, hopefully.
console.log(`Fun ascii art
`)
console.log('Welcome to my site (:')

// base links
const baseSpotifyLink = 'https://open.spotify.com/playlist/';
const wikipediaBaseLink = 'wikipedia.org/wiki/';
const wiktionaryBaseLink = 'wiktionary.org/wiki/';

// LANGUAGES -------------- get languages and labels
const langsJSON = $.getJSON('/data/languages.json');
var langs; 

langsJSON.done(langsJSON, (langsData) => {
    langs = langsData;
})

// BLOG STUFF -------------- lists of article info
const articlesJSON = $.getJSON('/data/articles.json');
var articleDates;
var articleLang;
var articleTitles;
var articleTag;
var articleEmoji;

articlesJSON.done(articlesJSON, (articleData) => {
    articleDates = articleData["articleDates"];
    articleLang = articleData["articleLang"];
    articleTitles = articleData["articleTitles"];
    articleTag = articleData["articleTag"];
    articleEmoji = articleData["articleEmoji"];
})

// PLAYLISTS STUFF -------- list playlists stuff
const playlistsJSON = $.getJSON('/data/playlists.json');
var playlistsContent;
var homepagePlaylist;

playlistsJSON.done(playlistsJSON, (playlistsData) => {
    playlistsContent = playlistsData["playlists"];
    homepagePlaylist = playlistsData["homepage_playlist"];
})

// COOL LINKS STUFF -------- cool links stuff
const coolLinksJSON = $.getJSON('/data/links.json');
var coolLinksContent;

coolLinksJSON.done(coolLinksJSON, (coolLinksData) => {
    coolLinksContent = coolLinksData;
})

// PROJECTS STUFF -------- projects stuff
const projectsJSON = $.getJSON('/data/projects.json');
var projectLinkHeading;
var projectHeadings;
var projectSections;
var projectNames;
var projectDescriptions;
var projectLinks;

projectsJSON.done(projectsJSON, (projectsData) => {
    projectHeadings = projectsData["projectHeadings"];
    projectLinkHeading = projectsData["projectLinkHeading"];
    projectSections = projectsData["projectSections"];
    projectNames = projectsData["projectNames"];
    projectDescriptions = projectsData["projectDescriptions"];
    projectLinks = projectsData["projectLinks"];
})

// ALL FILES LOADED?
allFiles = $.when(langsJSON, articlesJSON, playlistsJSON, coolLinksJSON, projectsJSON);

// COOKIES ---------------------------------------
function setCookie(key, value, time_in_days=365) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (time_in_days * 24 * 60 * 60 * 1000)); // expire in a year
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString() + ';SameSite=Lax' + ';path=/';
}

function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}

// FAVICON ---------------------------------------
var link = $('#icon').attr('href',"/assets/icons/icon.ico");

// DETECT BROWSER LOCALE -------------------------
if (navigator.language.substring(0,2) == 'es') {
    var browserLocale = 'es';
} else if (navigator.language.substring(0,2) == 'nl') {
    var browserLocale = 'nl';
} else {
    var browserLocale = 'en';
}

// take language from browser locale
language = getCookie('language') ? getCookie('language') : browserLocale;

// detect if user agent has safari
function isSafari() {
    return (navigator.userAgent.includes("Safari"))
}

// get window width
function getWidth() {
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
}
  
function getHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
    );
}

// generate menus
function loadObjects(langsObj, l=language) {
    // loop over fields
    for (const [itemType, items] of Object.entries(langsObj["objectIds_Field"])) {

        // check if field is actually in the page before doing anything
        for (const [fieldId, content] of Object.entries(items)) {
            // get translation
            translation = langsObj["content"][content][l]

            // loop over items
            if (document.getElementById(fieldId) && itemType == 2) {
                // PAGE TITLES ------------------------------------------------------------------------------
                $(`#${fieldId}`).html(`${translation} | Your name`);

            } else if (document.getElementById(fieldId) && itemType == 1) {
                // field contents
                let fieldContent = '';
                // SPECIAL FIELDS ---------------------------------------------------------------------------
                switch(fieldId) {
                    // theme switcher
                    case 'themeSwitcher':
                        // arrangement of theme link
                        if (getCookie('theme') == 0) {
                            changeTheme(set=false);
                        } else {
                            changeTheme(set=false);
                        }

                        break;
    
                    // about me preview
                    case 'aboutHomepagePreview':
                        // homepage self description
                        fieldContent = `<br><span class="notThatSmall">${translation}</span>`;

                        // add stuff to object
                        $(`#${fieldId}`).html(fieldContent)

                        break;
                    
                    // about me in CV page
                    case 'aboutMeDescription':
                        // homepage self description
                        aboutMeDescription = `<span>${translation}</span>`;

                        // add stuff to object
                        $(`#${fieldId}`).html(aboutMeDescription)

                        break;
    
                    // cool links preview
                    case 'coolLinksHomepagePreview':
                        // cool wikipedia links preview
                        fieldContent = `<br><span class="notThatSmall">${translation}</span><br><br>`;
                        let maxAmountOfLinks = 3;
                        let cnt = 0;
                        var wikipediaArticles = coolLinksContent['wikipedia'];
                        for (const name of Object.keys(wikipediaArticles).reverse()) {
                            // extract language of article
                            let articleLang = wikipediaArticles[name].slice(0,2);

                            // create article URL
                            let articleURL = `https://${articleLang}.${wikipediaBaseLink}${wikipediaArticles[name].slice(3)}`;

                            // append to article list html object
                            if (cnt < (maxAmountOfLinks-1)) {
                                fieldContent += `<a class="notThatSmall bp" href="${articleURL}">🔗 ${name}</a><br><br>`;
                            } else {
                                fieldContent += `<a class="notThatSmall bp" href="${articleURL}">🔗 ${name}</a><br>`;
                            }
                            
                            // increase counter
                            cnt += 1;
                            
                            // break if counter reaches 3
                            if (cnt >= maxAmountOfLinks) {break;}
                        }

                        // add stuff to object
                        $(`#${fieldId}`).html(fieldContent)

                        break;
    
    
                    // playlists preview
                    case 'playlistsHomepagePreview':
                        // set homepage playlists stuff
                        fieldContent = `<br><span class="notThatSmall">${translation}</span><br>`;

                        // creating homepage playlists list
                        for (const [name, page] of Object.entries(homepagePlaylist)) {
                            // construct playlist url
                            let playlistURL = `${baseSpotifyLink}${page}`;
                            // append to article list html object
                            fieldContent += `
                                <div class="column img__wrap homepagePlaylist">
                                    <a href="${playlistURL}"><br>
                                    <img class="playlistImages-hp" src="/assets/playlist_images/${name}.png" title="${name}">
                                        <div class="homepagePlaylist img__description_layer img__dl_hover_panel">
                                            <span class="img__description">${name}</span>
                                        </div>
                                    </a>
                                </div>
                            <br>`;
                        }

                        $(`#${fieldId}`).html(fieldContent)
                        break;
                    
                    // subscribe button
                    case 'subscribeButton':
                        $("#subscribeButton").attr('value', translation)
                }
    
            } else if (document.getElementById(fieldId) && itemType == 0) {
                // SITE TEXT FIELDS ---------------------------------------------------------------------------
                $(`#${fieldId}`).html(translation);
            }
        }

    }

    // loadArticles
    loadArticleList()

    // load homepage buttons
    loadProfileButtons()
}

// links for the article MD files and article URL
function loadArticleList() {
    let artList = '';
    for (let i = 0; i < articleTag.length; i++) {
            // generate article URL
            let articleURL = `/blog/${articleTag[i]}/`;
    
            // append to article list html object
            artList += `
            <div>
                <span class="articleTopInfo">${articleDates[i]} - ${articleLang[i]}</span>
                <br> 
                <a onmouseenter="setBlogIcon('${articleEmoji[i]}')" onmouseleave="removeBlogIcon()" class="c" href="${articleURL}">${articleEmoji[i]} ${articleTitles[i]}</a> 
            </div>`;

            // append line breaks
            artList += '<br><br>'
        }
    
        // appending the list of articles
        $("#articleList").html(artList);
}

// load profile buttons
function loadProfileButtons() {
    // profile buttons
    profileButtons = {
        'github': github,
        'linkedin': linkedin,
        'twitter': twitter
    }

    // margins
    buttonMargins = {
        'github': "0 2% 0 0",
        'linkedin': "0 2% 0 2%",
        'twitter': "0 0 0 2%"
    }

    // generate profile buttons
    profileButtonsContent = ''
    for (const [name, link] of Object.entries(profileButtons)) {
        // append to profile buttons html object
        profileButtonsContent += `
        <a href="${link}" onclick="this.href = ${name};" oncontextmenu="this.href = ${name};" class="b ml-prof" target="_blank">
            <div id="${name}HomepageButtonDiv" class="column leftcol-half-mb-3 centered divBorder ml">
                <img src="/assets/icons/${name}.svg" class="homepageButtonSVG"/>
            </div>
        </a>
        `
    }

    // add elements to section
    $("#profileButtons").html(profileButtonsContent)

    // loop over buttons
    for (const name of Object.keys(profileButtons)) {
        // set margins between buttons
        $(`#${name}HomepageButtonDiv`).css('margin', buttonMargins[name]);
    }
}


// detecting the language to abstract language-based links
function updateLang(l) {
    setCookie('language',l)
    language = l;

    // reload all objectes
    allFiles.done(() => {
        // load all site objects specified the langs.json file
        loadObjects(langs)
    })

    // if on about me page
    if (document.getElementById("downloadCVLink")) {
        // CV PDF DOWNLOAD LINK
        $("#downloadCVLink").attr('href',`/assets/py/Your_name_CV_${language}.pdf`)
    }

    // if on projects page
    if (document.getElementById("projectsTitleBar")) {
        updateProjectsList()
    } else if (document.getElementById("aboutMeTitleBar")) {
        loadCV(l)
    }
}

// change theme
function changeTheme(set=false) {
    // change theme if set is true
    if (set===true) {
        setCookie('theme', getCookie('theme') == 1 ? 0 : 1)
    }
    // translation lang for changing language
    if (getCookie('theme') == 1) {
        $("#themeSwitcher").html(`<a class='lt lts' onclick='changeTheme(set=true)'>☀️</a>`)
        $("#mainStylesheet").attr('href','/assets/css/styles.css')

        // for articles
        if (document.getElementById('articleStylesheet')) {
            $("#articleStylesheet").attr('href','/assets/css/articleStyles.css')
        }

        // for pages with code
        if (document.getElementById('codeStylesheet')) {
            $("#codeStylesheet").attr('href','/assets/css/libs/dracula.css')
        }
    } else {
        $("#themeSwitcher").html(`<a class='dt dts' onclick='changeTheme(set=true)'>🌒</a>`)
        $("#mainStylesheet").attr('href','/assets/css/styles-light.css')

        // for articles
        if (document.getElementById('articleStylesheet')) {
            $("#articleStylesheet").attr('href','/assets/css/articleStyles-light.css')
        }

        // for pages with code
        if (document.getElementById('codeStylesheet')) {
            $("#codeStylesheet").attr('href','/assets/css/libs/highlight.css')
        }
    }
}

// show lang text on right col
function toggleLangText(l, event) {
    // preview the language on mouse entry
    if (l != language) {
        if (event===1) {
            allFiles.done(() => {
                // reload objects with hover lang
                loadObjects(langs, l)
                // if on projects page
                if (document.getElementById("projectsTitleBar")) {
                // if on cv page
                    updateProjectsList(l)
                } else if (document.getElementById("aboutMeTitleBar")) {
                    loadCV(l)
                }
            })
        // go back to normal on mouse exit
        } else {
            allFiles.done(() => {
                // reload objects back with original lang
                loadObjects(langs, language)
                // if on projects page
                if (document.getElementById("projectsTitleBar")) {
                    updateProjectsList(language)
                // if on cv page
                } else if (document.getElementById("aboutMeTitleBar")) {
                    loadCV(language)
                }
            })
        }
    }
}


// function to change blog icon (fun stuff)
function setBlogIcon(icon) {
    allFiles.done(() => {
        // replace blog icon
        if (document.getElementById('blogTitle')) {
            $("#blogTitle").html($("#blogTitle").html().replace('🗒️',icon))
        } else if (document.getElementById('blogHomepageLink')) {
            $("#blogHomepageLi").attr('data-before',icon)
        }

        // change blog div background
        $("#blogArticles").addClass('alt2')
    })
}
function removeBlogIcon() {
    allFiles.done(() => {
        loadObjects(langs)

        // restore li icon if it exists
        if (document.getElementById('blogHomepageLi')) {
            $("#blogHomepageLi").attr('data-before','🗒️')
        }

        // change blog div background
        $("#blogArticles").removeClass('alt2')
    })
}

// MAILCHIMP STUFF --------------------------------------
$("#mailchimpStuff").html(`
<!-- Begin Mailchimp Signup Form -->
<div id="mc_embed_signup">
<form action="https://dac.us12.list-manage.com/subscribe/post?u=2dc3eb13fc6803ee768b95c77&amp;id=97eb89d742" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
<div id="mc_embed_signup_scroll">
<div class="mc-field-group">
	<p for="mce-EMAIL">
        <input type="email" value="" name="EMAIL" class="emailField" id="mce-EMAIL" placeholder="e-mail">
    </p>
</div>
	<div id="mce-responses" class="clear foot">
		<div class="response" id="mce-error-response" style="display:none"></div>
		<div class="response" id="mce-success-response" style="display:none"></div>
	</div>    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
    <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_2dc3eb13fc6803ee768b95c77_97eb89d742" tabindex="-1" value=""></div>
        <div class="optionalParent">
            <div class="clear foot">
                <h3 class="inline"><input type="submit" id="subscribeButton" value="Subscribe" name="subscribe" onmouseover="mcSubscribeIn()" onmouseout="mcSubscribeOut()" id="mc-embedded-subscribe"  class="subscribeButton"></h3>
            </div>
        </div>
    </div>
</form>
</div>

<!--End mc_embed_signup-->
`)

// background color change for subscribe button
function mcSubscribeIn() {
    $("#mcStuff").addClass("alt2");
}
function mcSubscribeOut() {
    $("#mcStuff").removeClass("alt2");
}
// validate email
function validateEmail(email) {
    var re = /\S+@\S+\.\S+/
    return re.test(email)
}

// only allow adding to the list of there's a valid email
$("#subscribeButton").hide()
$("#mce-EMAIL").on('input', () => {
    if (!validateEmail($("#mce-EMAIL").prop('value'))) {
        $("#subscribeButton").hide()
    } else {
        $("#subscribeButton").show()
    }
})

// ADD HOMEPAGE EVENTS ----------------------------------
// change text of about me, cool links and playlists on hover or clicking the div
function addTextChangeEvents() {
    // sections' divs and their respective link
    let expandedSec = {
        'aboutHomepageDIV':'aboutHomepageLink',
        'coolLinksHomepageDIV':'coolLinksHomepageLink',
        'playlistsHomepageDIV':'playlistsHomepageLink'
    };
    // keys to search the language for
    let expandedLangKey = {
        'aboutHomepageDIV':'about',
        'coolLinksHomepageDIV':'cool_links',
        'playlistsHomepageDIV':'playlists'
    }
    // add onmousenter and onmouseleave events
    for (const div of Object.keys(expandedSec)) {
        // event listeners for divs
        $(`#${div}`).mouseenter(function() {
            // change link text
            $(`#${expandedSec[div]}`).html(langs['content'][`${expandedLangKey[div]}_full`][language])
        })
        $(`#${div}`).mouseleave(function() {
            // back to original link text
            $(`#${expandedSec[div]}`).html(langs['content'][`${expandedLangKey[div]}_title`][language])
        })

        // event listeners for links
        $(`#${expandedSec[div]}`).mouseenter(function() {
            // change background color
            $(`#${div}`).addClass('alt')
        })
        $(`#${expandedSec[div]}`).mouseleave(function() {
            // change background color to original
            $(`#${div}`).removeClass('alt')
        })
    }
}


// LOAD ALL OBJECTS -------------------------------------
allFiles.done(() => {
    // load default color (dark) depending on whether it's been visited before or not
    if (~['0','1'].includes(getCookie('theme'))) {
        setCookie('theme','1')
        loadObjects(langs)
    // otherwise just load stuff
    } else {
        loadObjects(langs)
    }
    // add the events
    if (document.getElementById('homepageMainDiv')) {
        addTextChangeEvents()
    }
})


// add analytics at the end of the body of each page
$("body").append(`<!-- 100% privacy friendly analytics -->
<script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
<noscript><img src="https://queue.simpleanalyticscdn.com/noscript.gif" alt="" referrerpolicy="no-referrer-when-downgrade" /></noscript>`)
