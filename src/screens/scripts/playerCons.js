let player;
let fullscreenElement;
let fullscreen = false;

function createPlayer(thePlayer, elem) {
    player = thePlayer;
    fullscreenElement = elem;
}

function play() {
    player.play();
}

function pause() {
    player.pause();
}

function seek(prog) {
    let duration = player.duration;
    let seekTo = (duration * prog)/100;
    player.currentTime = seekTo;
}

function seekTo(forward) {
    let duration = player.duration;
    let currentTime = player.currentTime;
    let seekTo;
    if(forward) {
        if(currentTime + 10 < duration) {
            seekTo = currentTime + 10;
        } else {
            seekTo = duration;
        }
    } else {
        if(currentTime - 10 > 0) {
            seekTo = currentTime - 10;
        } else {
            seekTo = 0;
        }
    }
    player.currentTime = seekTo;
}

function volumeTo(up) {
    let currentVol = player.volume;
    let volumeTo;
    if(up) {
        if(currentVol + 0.1 < 1) {
            volumeTo = currentVol + 0.1;
        } else {
            volumeTo = 1;
        }
    } else {
        if(currentVol - 0.1 > 0) {
            volumeTo = currentVol - 0.1;
        } else {
            volumeTo = 0;
        }
    }
    player.volume = volumeTo;
}

function seekVol(prog) {
    player.volume = prog / 100;
}

function mute(mute) {
    player.muted = mute;
}



function onTimeUpdate() {
    let currentTime = player.currentTime;
    let duration = player.duration;
    let progress = (currentTime/duration) * 100;
    currentTime = convertTime(currentTime * 1000);
    duration = convertTime(duration * 1000);
    let ar = ({"progress" : progress, "currentTime" : currentTime, "duration" : duration});
    return ar;
};

function goFullscreen() {
    let elem = fullscreenElement;
    if (document.fullscreenEnabled) {
        if(fullscreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
              } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
              } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
              } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
              }
              fullscreen = false;
        } else {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) { /* Firefox */
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE/Edge */
                elem.msRequestFullscreen();
            }
            fullscreen = true;
        }
    }
  }

  document.addEventListener("fullscreenchange", function (event) {
    if (document.fullscreenElement) {
        // fullscreen is activated
        fullscreen = true;
    } else {
        // fullscreen is cancelled
        fullscreen = false;
    }
    });

    function handleKeys(k) {
        if(k.key === " ") {
            k.preventDefault();
        }
        let key = k.key;
        if(key === "p" || key === "k" || key === " ") {
            if(!player.paused) {
                pause();
            } else {
                play();
            }
            
        }

        if(key === "m") {
            mute(!player.muted);
        }

        if(key === "j" || key === "ArrowLeft") {
            seekTo(false);
        }

        if(key === "l" || key === "ArrowRight") {
            seekTo(true);
        }

        if(key === "ArrowUp") {
            volumeTo(true);
        }

        if(key === "ArrowDown") {
            volumeTo(false);
        }

        if(key === "f") {
            goFullscreen();
        }

    }


function destoryPlayer() {
    player = "";
}

function convertTime(ms, delim = " : ") {
    const showWith0 = value => (value < 10 ? `0${value}` : value);
    const hours = showWith0(Math.floor((ms / (1000 * 60 * 60)) % 60));
    const minutes = showWith0(Math.floor((ms / (1000 * 60)) % 60));
    const seconds = showWith0(Math.floor((ms / 1000) % 60));
    return `${parseInt(hours) ? `${hours}${delim}` : ""}${minutes}${delim}${seconds}`;
  }

module.exports = {
    createPlayer,
    play,
    pause,
    seek,
    seekVol,
    onTimeUpdate,
    goFullscreen,
    convertTime,
    handleKeys,
    destoryPlayer
}