// random link mode
var randomLinkMode = 0;

// hide random link stuff
$("#randomLinksTitle").toggle()
$("#randomLinkBrowser").toggle()
$("#goToRandomLinkTitle").toggle()

// load list of random links
var randomLinksJSON = $.getJSON('/data/random_links.json')
var listOfRandomLinks;

randomLinksJSON.done(randomLinksJSON, (listOfArticles) => {
    listOfRandomLinks = listOfArticles["links"];
})

// links
coolLinksJSON.done(() => {

    // ------------------------------------------ WIKIPEDIA
    // generate wikipedia link list
    var wikipediaArticles = coolLinksContent['wikipedia']; 
    var artList = '<ul>';
    for (const name of Object.keys(wikipediaArticles).reverse()) {
        // extract language of article
        let articleLang = wikipediaArticles[name].slice(0,2);

        // create article URL
        var articleURL = `https://${articleLang}.${wikipediaBaseLink}${wikipediaArticles[name].slice(3)}` 

        // append to article list html object
        artList += `<span>🔗</span> <a class="b" href="${articleURL}">${name}</a><br><br>`;
    }
    artList += '</ul>';

    // appending the list of articles
    if (document.getElementById("wikipediaLinkList")) {
        document.getElementById("wikipediaLinkList").innerHTML = artList;
    }

    // ------------------------------------------ WIKTIONARY
    // generate wiktionary link list
    var wiktionaryArticles = coolLinksContent['wiktionary'];
    var artList = '<ul>';
    for (const name of Object.keys(wiktionaryArticles).reverse()) {
        // extract language of article
        let articleLang = wiktionaryArticles[name].slice(0,2);

        // create article URL
        var articleURL = `https://${articleLang}.${wiktionaryBaseLink}${wiktionaryArticles[name].slice(3)}` 

        // append to article list html object
        artList += `<span>🔗</span> <a class="b" href="${articleURL}">${name}</a><br><br>`;
    }
    artList += '</ul>';

    // appending the list of articles
    if (document.getElementById("wiktionaryLinkList")) {
        document.getElementById("wiktionaryLinkList").innerHTML = artList;
    }

    // ------------------------------------------ PEOPLE I ADMIRE
    // generate links
    var peopleIAdmire = coolLinksContent['people_i_admire'];
    var artList = '<ul>';
    for (const name of Object.keys(peopleIAdmire).reverse()) {
        // create article URL
        var articleURL = peopleIAdmire[name] 

        // append to article list html object
        artList += `<span>🔗</span> <a class="b" href="${articleURL}">${name}</a><br><br>`;
    }
    artList += '</ul>';

    // appending the list of articles
    if (document.getElementById("peopleIAdmireLinkList")) {
        document.getElementById("peopleIAdmireLinkList").innerHTML = artList;
    }

    // ------------------------------------------ ANYTHING ELSE
    // generate links
    var otherSitesArticles = coolLinksContent['other_sites'];
    var artList = '<ul>';
    for (const name of Object.keys(otherSitesArticles).reverse()) {
        // create article URL
        var articleURL = otherSitesArticles[name] 

        // append to article list html object
        artList += `<span>🔗</span> <a class="b" href="${articleURL}">${name}</a><br><br>`;
    }
    artList += '</ul>';

    // appending the list of articles
    if (document.getElementById("otherSitesLinkList")) {
        document.getElementById("otherSitesLinkList").innerHTML = artList;
    }

})

// Random link browser function
function randomLinkButtonLoader() {
    if (randomLinkMode == 0) {
        $("#randomLinkSwitcher").html(`<a class='lt lts' onclick='randomLinkSwitch()'>🔄</a>`)
    } else {
        $("#randomLinkSwitcher").html(`<a class='lt lts' onclick='randomLinkSwitch()'>⛓️</a>`)
    }
}

// go to random link
function goToRandomLink() {
    // if the list is loaded
    randomLinksJSON.done(() => {
        // randomly select a link
        let randomlySelectedLink = listOfRandomLinks[listOfRandomLinks.length * Math.random() | 0];

        // navigate to the selected link
        $("#randomLinkBrowserEmbed").attr('src',randomlySelectedLink);
    })
}

// random link switch
function randomLinkSwitch() {
    // switch mode
    randomLinkMode = randomLinkMode === 0 ? 1 : 0;
    // change section of the site to show randomlink browser
    randomLinksJSON.done(() => {
        // reload button
        randomLinkButtonLoader()

        if (randomLinkMode == 0) {
            // all toggles to show the other section
            $("#randomLinksTitle").toggle()
            $("#linksTitle").toggle()
            $("#randomLinkBrowser").toggle()
            $("#linksBlock").toggle()
            $("#goToRandomLinkTitle").toggle()
        } else {
            // all toggles to show the other section
            $("#randomLinksTitle").toggle()
            $("#linksTitle").toggle()
            $("#randomLinkBrowser").toggle()
            $("#linksBlock").toggle()
            $("#goToRandomLinkTitle").toggle()
        }
        // go to random link
            goToRandomLink()
    })
}

// run random link button loader
randomLinksJSON.done(() => {
    if (!isSafari()) {
        randomLinkButtonLoader()
    }
})
