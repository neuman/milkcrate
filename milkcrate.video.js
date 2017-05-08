MILKCRATE.video = {};

MILKCRATE.video.freeze_on_last_frame = function(video) {
      video.pause();
      video.currentTime = MILKCRATE.video.get_last_frame_time(video);
    }

MILKCRATE.video.get_last_frame_time = function(video){
  return video.duration - .000001;
}

MILKCRATE.failed = function(e) {
   // video playback failed - show a message saying why
   switch (e.target.error.code) {
     case e.target.error.MEDIA_ERR_ABORTED:
       console.log('You aborted the video playback.');
       break;
     case e.target.error.MEDIA_ERR_NETWORK:
       console.log('A network error caused the video download to fail part-way.');
       break;
     case e.target.error.MEDIA_ERR_DECODE:
       console.log('The video playback was aborted due to a corruption problem or because the video used features your browser did not support.');
       break;
     case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
       console.log('The video could not be loaded, either because the server or network failed or because the format is not supported.');
       break;
     default:
       console.log('An unknown error occurred.');
       break;
   }
 }

 MILKCRATE.video.play_icon_svg = MILKCRATE.util.base64('image/svg+xml', 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj4KCTxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iOTAiIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMTUiIHN0cm9rZT0iI2ZmZiIvPgoJPHBvbHlnb24gcG9pbnRzPSI3MCwgNTUgNzAsIDE0NSAxNDUsIDEwMCIgZmlsbD0iI2ZmZiIvPgo8L3N2Zz4=');

MILKCRATE.video.add_play_button_overlay = function(video_element, icon_src, label){
  if(label==undefined){
    label = "Play";
  }

  var button = $('<img/>');
  var button = document.createElement('img');
  var s = button.style;
  s.position = 'fixed';
  s.width = '24px'
  s.height = '24px';
  s.backgroundSize = 'cover';
  s.backgroundColor = 'transparent';
  s.border = 0;
  s.userSelect = 'none';
  s.webkitUserSelect = 'none';
  s.MozUserSelect = 'none';
  s.cursor = 'pointer';
  s.padding = '12px';
  s.zIndex = 1;
  s.display = 'none';

$(button).addClass("play_button_overlay");
$(button).insertBefore(video_element);
  // Prevent button from being selected and dragged.
  button.draggable = false;
  button.addEventListener('dragstart', function(e) {
    e.preventDefault();
  });

  // Style it on hover.
  button.addEventListener('mouseenter', function(e) {
    /* -webkit-filter: drop-shadow(0 0 5px rgba(255,255,255,1)); */
    s.webkitFilter = 'drop-shadow(0 0 5px rgba(255,255,255,1))';
  });
  button.addEventListener('mouseleave', function(e) {
    s.webkitFilter = '';
  });
  
  button.src = icon_src;
  button.title = label;
  s.margin = 'auto';
  s.position = 'fixed';
  s.top = 0; 
  s.left = 0; 
  s.bottom = 0; 
  s.right = 0;
  s.display = 'block';
  s.width = '256px'
  s.height = '256px';

  return button;


}

MILKCRATE.video.canplaythrough = function(video_element){
    if ( video_element.readyState === 4 ){
        return true;
    }else{
        return false;
    }
}


MILKCRATE.video.oncanplaythrough = function(videoElement, successCallback){
    var checkProgress = function(event){
      var currentTime = event.timeStamp;
      var numberOfTimeRangesLoaded = videoElement.buffered.length;
      if (numberOfTimeRangesLoaded > 0) {
        var secondsLoaded = videoElement.buffered.end(0);
        var duration = videoElement.duration / 3;
        var elapsedTime = (currentTime - loadStartTime) / 1000; // in seconds
        var downloadRate = elapsedTime / secondsLoaded;
        var secondsToLoad = duration - secondsLoaded;
        var estimatedRemainingDownloadSeconds = secondsToLoad * downloadRate;

        if (secondsLoaded > estimatedRemainingDownloadSeconds) {
          successCallback();
          // console.log("progress," 1);
        } else {
          var loadingProgress = elapsedTime / ((estimatedRemainingDownloadSeconds - secondsToLoad) + elapsedTime);
          // console.log("progress," loadingProgess);
        }
      }
    };

    var loadStartTime = new Date().valueOf();

    videoElement.preload = "auto";
    videoElement.autobuffer = true;

    $(videoElement).on('progress canplaythrough canplay', checkProgress);
}

MILKCRATE.video.bind_seek_bar = function(video_element, seek_bar){
    // Event listener for the seek bar
    seek_bar.addEventListener("change", function() {
      // Calculate the new time
      var time = video_element.duration * (seek_bar.value / 100);

      // Update the video time
      video_element.currentTime = time;
    });
}
