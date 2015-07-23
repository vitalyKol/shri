'use strict';

var audioPlayer = (function () {

    var fileInput, volumeInput, playButton, stopButton, dropzone, playlist;

    var context = new (window.AudioContext || window.webkitAudioContext)(),
        volume = context.createGain(),
        audio = new Audio(),
        source;

    var filesList = [];

    function init () {
        fileInput = document.querySelector('input[type=file]');
        volumeInput = document.querySelector('input[type=range]');
        playButton = document.querySelector('.play');
        stopButton = document.querySelector('.stop');
        dropzone = document.querySelector('.dropzone');
        playlist = document.querySelector('.player__playlist ul');

        source = context.createMediaElementSource(audio);
        source.connect(volume);

        document.addEventListener('drop', function (e) { e.preventDefault(); });
        document.addEventListener('dragover', function (e) { e.preventDefault(); }); 

        setupListeners();
    }

    function setupListeners () {
        fileInput.onchange = handleFileUpload;
        volumeInput.oninput = handleVolumeChange;
        playButton.onclick = handlePlayClick;
        stopButton.onclick = handleStopClick;

        dropzone.ondrop = handleFileUpload;
    }

    function handleVolumeChange (e) {
        volume.gain.value = e.target.value;
    }

    function handleFileUpload (e) {
        e.stopPropagation();
        e.preventDefault();

        var files;

        if (e.target.nodeName === "DIV") {
            files = e.dataTransfer.files;
        } else if (e.target.nodeName === "INPUT") {
            files = e.target.files;
        }

        audio.src = URL.createObjectURL(files[0]);

        playlist.innerHTML += ('<li>' + files[0].name + '</li>');
        filesList.push(files[0]);
    }

    function handlePlayClick () {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    }

    function handleStopClick () {
        if (!audio.paused) {
            audio.pause();
            audio.currentTime = 0;
        }
    }

    return {
        init: init
    }

})();

window.onload = audioPlayer.init;