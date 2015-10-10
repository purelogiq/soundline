/**
 * Static class which contains the methods needed for the soundline.
 * Israel Madueme (imadueme@andrew.cmu.edu)
 */
var SoundLine = new function(){
  var loading = false; // Helps block ui events till ajax call complete.
  var API_KEY = "8ea38098ff80385a7129a182dd2076e1"; // SoundCloud API KEY

  /**
   * Load a list of tracks from a query string.
   * This uses CORS with the SoundCloud API at https://api.soundcloud.com
   * @param search The query string.
   * @param func The function to be called with the result array after loading is complete.
   */
  this.loadSearch = function(search, func){
    var url = 'https://api.soundcloud.com/tracks?client_id=' + API_KEY + '&limit=15&q=' + search;
    var result = [];
    loading = true;
    $.getJSON(url, function(apiTracks) {
      for(var i = 0; i < apiTracks.length; i++){
        var apiTrack = apiTracks[i];
        if(apiTrack.streamable && apiTrack.artwork_url != null) {
          result.push(
              newTrack(apiTrack)
          );
        }
      }
      loading = false;
      func(shuffle(result));
    });
  };

  /**
   * Given a track this will get a list of related tracks.
   * This uses CORS to my nodejs server (as an ajax request of course).
   * SoundCloud doesn't expose their related songs in the public API and so I am using my backend
   * server to retrieve the related song JSON using the same url that their main website uses. (See credits.txt)
   * @param trackid The id of the track to get related songs of.
   * @param func The function to be called with the result array after loading is complete.
   */
  this.getRelatedTracks = function(trackid, func){
    var apiUrl = "https://api-v2.soundcloud.com/tracks/" + trackid + "/related?limit=15";
    apiUrl = encodeURIComponent(apiUrl);
    var corsByPass = "http://nodejs67328-cmuimadueme.rhcloud.com/crossrequest?theurl=" + apiUrl;
    var result = [];
    loading = true;
    $.getJSON(corsByPass, function(apiTracks) {
      for(var i = 0; i < apiTracks.collection.length; i++){
        var apiTrack = apiTracks.collection[i];
        if(apiTrack.streamable && apiTrack.artwork_url != null) {
          result.push(
              newTrack(apiTrack)
          );
        }
      }
      loading = false;
      func(shuffle(result));
    });
  };

  /**
   * Play a song using the SoundCloud Widget API (https://developers.soundcloud.com/docs/api/html5-widget)
   * @param trackurl The url of the song to play
   */
  this.playSong = function(trackurl){
    $('#sc-widget').css('visibility', 'visible');
    var widgetIframe = document.getElementById('sc-widget');
    var widget = SC.Widget(widgetIframe);

    widget.load(trackurl, {
      show_artwork: true,
      visual: true,
      auto_play: true
    });
  };

  /**
   * Present a list of songs to play
   * @param tracks The list of songs
   * @param col The column that the song that was last selected was in (0 to 3 or -1 for center)
   */
  this.presentChoices = function(tracks, col){
    var colOffset = (col == -1) ? 6 : col * 3 + 1;
    var newChoice = '';
    newChoice += '<div class="row song-choices"><div class="row"><div class="col s3 offset-s' + colOffset;
    newChoice += '"><img src="arrow.png" height="80px" /></div></div>';
    for(var i = 0; i < 4; i++){
      var track = tracks[i];
      newChoice += '<div class="col s3">';
      newChoice += '<a onclick="SoundLine.selectChoice(this,' + track.id + ',\'' + track.url + '\',' + i + ')">';
      newChoice += '<img style="cursor: pointer" src="' + track.picture + '" width="100%"/></a>';
      newChoice += '<span style="font-weight: bold">' + track.title + '</span><br />';
      newChoice += '<span style="font-size: 0.9em">By: ' + track.artist + '</span></div>';
    }
    newChoice += '</div>';
    $('#theline').append(newChoice);
    $('html, body').animate({
      scrollTop: $(".song-choices :last").offset().top - 150
    }, 1000);
  };

  /**
   * Start the SoundLine by searching for some songs.
   * Gets input directly from the DOM (#searchQuery.value)
   */
  this.startSearch = function(){
    $('#theline').empty();
    var q = $('#searchQuery').val();
    SoundLine.loadSearch(q, function(tracks){
      SoundLine.presentChoices(tracks, -1);
    });
  };

  /**
   * Select a song to play out of the list of presented songs.
   * @param selection A reference to the element that was selected in the DOM
   * @param trackid The track id of the selected song
   * @param trackurl The url of the selected song
   * @param col The column the song is in (in the presented list)
   */
  this.selectChoice = function(selection, trackid, trackurl, col){
    if(loading) return;
    $(selection).closest(".song-choices").nextAll().remove();
    SoundLine.playSong(trackurl);
    SoundLine.getRelatedTracks(trackid, function(result){
      SoundLine.presentChoices(result, col);
    });
  };

  /*
    Return a new simple "track" given a SoundCloud API "track".
    Has {id, url, title, picture, artist}
   */
  function newTrack(apiTrack){
    return {
      id: apiTrack.id,
      url: apiTrack.permalink_url,
      title: apiTrack.title,
      picture: apiTrack.artwork_url.replace('large', 't500x500'),
      artist: apiTrack.user.username
    }
  }

  /**
   * Shuffle an array of items. (See credits.txt)
   * @param o The array to shuffle
   * @returns The same array shuffled.
   */
  function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  }
};