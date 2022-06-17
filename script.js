"use strict";
var accessToken = null;
var curUserID = null;

function authorizeUser() {
    //var scopes = 'playlist-read-private playlist-modify-private playlist-modify-public';
    const scopesList = ['ugc-image-upload',
                'user-read-recently-played',
                'user-top-read',
                'user-read-playback-position',
                'user-read-playback-state',
                'user-modify-playback-state',
                'user-read-currently-playing',
                'app-remote-control',
                'streaming',
                'playlist-modify-public',
                'playlist-modify-private',
                'playlist-read-private',
                'playlist-read-collaborative',
                'user-follow-modify',
                'user-follow-read',
                'user-library-modify',
                'user-library-read',
                'user-read-email',
                'user-read-private'];
    var scopes = scopesList.join(' ');
    //var scopes = string.concat()

    var url = 'https://accounts.spotify.com/authorize?client_id=' + SPOTIFY_CLIENT_ID +
        '&response_type=token' +
        '&scope=' + encodeURIComponent(scopes) +
        '&redirect_uri=' + encodeURIComponent(SPOTIFY_REDIRECT_URI);
    document.location = url;
}

function parseArgs() {
    var hash = location.hash.replace(/#/g, '');
    var all = hash.split('&');
    var args = {};
    _.each(all, function(keyvalue) {
        var kv = keyvalue.split('=');
        var key = kv[0];
        var val = kv[1];
        args[key] = val;
    });
    return args;
}

function fetchCurrentUserProfile(callback) {
    var url = '/me';
    getSpotify(url, null, callback);
}

function getSpotify(url, data=null, callback=sendOutput) {
    url = "https://api.spotify.com/v1" + url
    $.ajax(url, {
        dataType: 'json',
        data: data,
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function(r) {
            callback(r);
        },
        error: function(r) {
            callback(null);
        }
    });
}

function sendOutput(obj) {
    document.getElementById('OutputTextArea').innerHTML = JSON.stringify(obj, null, 3)
}
function sendText(text) {
    document.getElementById('OutputTextArea').innerHTML = text
}


function getTopTracks(track_count=50) {
    // request top 50 tracks
    let time_range = 'short_term' // 'medium_term' 'long_term'
    getSpotify('/me/top/tracks?limit=' + track_count + '&time_range=' + time_range, null, _getTopTracks)
}
function _getTopTracks(input) {
    // parse input
    let output = ""

    sendOutput(input)
    if (input['items'].length > 0) {
        for (let i = 0; i < input['items'].length; i++) {
            output += (i + 1) + ". " + input['items'][i]['artists'][0]['name']
                    + " - " + input['items'][i]['name'] + '\n'
        }

        sendText(output)
    }
    else {
        error("Couldn't get your top tracks")
    }
}



$(document).ready(

    function() {
        //songTable = initTable();
        var args = parseArgs();


        if ('error' in args) {
            alert("Sorry, I can't read your playlists from Spotify without authorization");
            //$("#go").show();
            //$("#go").on('click', function() {
            //    authorizeUser();
            //});
        } else if ('access_token' in args) {
            // USER IS AUTHENTICATED

            accessToken = args['access_token'];

            $(".worker").hide();

            fetchCurrentUserProfile(function(user) {
                if (user) {
                    curUserID = user.id;
                    $("#who").text(user.id);
                    //loadPlaylists(user.id);
                } else {
                    alert("Trouble getting the user profile");
                }
            });
            
            // hide auth button
            document.getElementById('AuthButton').style.display = 'none';
            //$("AuthButton").hide()

            alert("you've been authenticated")
        } else {
            // USER NOT YET AUTHENTICATED
            /*
            $("#go").show();
            $("#go").on('click', function() {
                authorizeUser();
            });
            */
        }
        /*
        $("#save,#dropSave").on('click', function() {
            savePlaylist(curPlaylist, true);
        });
        $("#dropOverwrite").on('click', function() {
            savePlaylist(curPlaylist, false);
        });

        $("#pick").on('click', function() {
            showPlaylists();
        });

        $.fn.dataTable.ext.search.push(playlistFilter);
        $('#min-bpm,#max-bpm,#include-double').on('keyup change', function() {
            songTable.draw();
            updateSaveButtonState();
        });
        */
    }
);