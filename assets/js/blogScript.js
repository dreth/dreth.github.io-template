// blog links
let art_path = window.location.href.split("/");
art_path = art_path[art_path.length - 2];
var art_md_path = `/blog/${art_path}/article.md`;
var art_draft_md_path = `/blog/drafts/${art_path}/article.md`;

// current article index (for prev and next)
var current_article_index;
allFiles.done(() => {
    current_article_index = articleTag.indexOf(art_path);

    // prev article title
    let prevNextArticleSwitcher = "";
    if (!(articleTitles[current_article_index+1] === undefined)) {
        // prev article title and path
        let prevArticleTitle = articleTitles[current_article_index+1];
        let prevArticlePath = articleTag[current_article_index+1];

        // add to the html tag
        prevNextArticleSwitcher += `
        <div class="column leftcol-half-articles divBorder paddingAllAround rightmargin-2">
            <p class="centered" id="prevArticleText"></p><br>
            <a class="b" href="/blog/${prevArticlePath}"><i>${prevArticleTitle}</i></a>
        </div>`;

    } else {
        prevNextArticleSwitcher += `
        <div class="column leftcol-half-articles divBorder paddingAllAround rightmargin-2">
            <i><p class="centered" id="oldestArticleText"></p></i><br>
        </div>`;
    }

    // next article title
    if (!(articleTitles[current_article_index-1] === undefined)) {
        // next article title and path
        let nextArticleTitle = articleTitles[current_article_index-1];
        let nextArticlePath = articleTag[current_article_index-1];

        // add to the html tag
        prevNextArticleSwitcher += `
        <div class="column rightcol-half-articles divBorder paddingAllAround leftmargin-2">
            <p class="centered" id="nextArticleText"></p><br>
            <a class="b" href="/blog/${nextArticlePath}"><i>${nextArticleTitle}</i></a>
        </div>`;

    } else {
        prevNextArticleSwitcher += `
        <div class="column rightcol-half-articles divBorder paddingAllAround leftmargin-2">
            <i><p class="centered" id="latestArticleText"></p></i><br>
        </div>`;
    }

    // add the article switcher
    $("#prevNextArticleSwitcher").html(prevNextArticleSwitcher)

    // reload texts
    loadObjects(langs)
})


// check if there's a post div id to insert article content
if (document.getElementById("content")) {
    // fetch the markdown file
    fetch(art_md_path)
      .then(response => response.text())
      .then(data => {
        document.getElementById('content').innerHTML =
          marked.parse(`${data}`);

        // make all links' target _blank if the link does not have #
        $('a').click(function() {
            if (!(this.href.indexOf('#') > -1) && !(this.href.indexOf('https://yoursite.com/') > -1)) {
                this.target = '_blank'
            }
        })

        // for articles with more custom web devy shit
        var specialAttribute = $("#content").attr('special');
        // ---------------------------- evaluate crypto projects
        switch (specialAttribute) {

        }
      });
}

// random functions in specific articles
// ------------- evaluate crypto projects
// add functionality to toggle audio
function showBoysDontCry() {
    $('#boysDontCryAudio').toggle()
}
// go back to section after clicking glossary sup-button ⬆
function goBackToReadingSection() {
    $('#goBackToReadingSectionDiv').hide()
}
function captureSection(section) {
    $('#goBackToReadingSectionDiv').show()
    $('#goBackToReadingSection').attr('href',section)
}
// add ethernautsolutions html to the ethernaut solutions article content2 block
if ($("#ethernautSolutions")) {
    $('#ethernautSolutions').load('/blog/ethernaut_solutions/assets/ethernautsolutions.html', function() {
        $(".katex-html").hide();
        hljs.highlightAll();
    })
}
// add capturetheether html to the capture the ether solutions article content2 block
if ($("#captureTheEtherSolutions")) {
    $('#captureTheEtherSolutions').load('/blog/capture_the_ether_solutions/assets/capturetheethersolutions.html', function() {
        $(".katex-html").hide();
        hljs.highlightAll();
    })
}
