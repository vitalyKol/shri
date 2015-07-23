var audio = new Audio();
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var volume = context.createGain();

var fileInput = document.querySelector('input[type=file]');
var volumeInput = document.querySelector('input[type=range]');
var playButton = document.getElementById('play');
var stopButton = document.getElementById('stop');

fileInput.onchange = handleFileUpload;
volumeInput.oninput = handleVolumeChange;
playButton.onclick = handlePlayClick;
stopButton.onclick = handleStopClick;

function handleVolumeChange (e) {
    volume.gain.value = e.target.value;
}

function handleFileUpload (e) {
    e.stopPropagation();
    e.preventDefault();

    var files = e.target.files;
    audio.src = URL.createObjectURL(files[0]);

}

function handlePlayClick() {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
}

function handleStopClick() {
    if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
    }
}