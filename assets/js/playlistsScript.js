// creating playlists list
var breakPlaylistsAt = 4;
var playlistList = '<br><br><div class="column leftcol-half centered">';

playlistsJSON.done(() => {
    let playlistDivisionCounter = 0;
    for (const [name, page] of Object.entries(playlistsContent)) {
        // construct playlist url
        let playlistURL = `${baseSpotifyLink}${page}`;

        // boilerplate
        let playlistBlock = `
            <div class="img__wrap">
                <a href="${playlistURL}"><br>
                <img class="playlistImages" src="/assets/playlist_images/${name}.png" title="${name}">
                <div class="img__description_layer img__dl_hover_panel">
                    <br>
                    <p class="img__description">${name}</p>
                </div>
                </a>
            </div><br><br><br>
        `;
        
        // append to playlist list html object
        if (playlistDivisionCounter < (breakPlaylistsAt + 1)) {
            if (playlistDivisionCounter === breakPlaylistsAt) {
                playlistList += `${playlistBlock}</div>`;
            } else {
                playlistList += `${playlistBlock}`;
            }
        } else {
            if (playlistDivisionCounter === (breakPlaylistsAt + 1)) {
                playlistList += `<div class="column rightcol-half centered">${playlistBlock}`;
            } else {
                playlistList += `${playlistBlock}`;
            }
            
        }

        // increment playlistdivision counter
        playlistDivisionCounter += 1;
    }
    playlistList += '</div>'

    // appending the list of playlists
    $("#playlistsLinks").html(playlistList);
})
