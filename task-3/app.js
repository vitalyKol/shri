var audioPlayer = (function () {
    'use strict';

    var $ = document.querySelector.bind(document);

    var fileInput, volumeInput, playButton, stopButton, dropzone, playlist, progressBar, progressMeter, equalizer;

    var context = new (window.AudioContext || window.webkitAudioContext)(),
        audio = new Audio(),
        volume, source, filters;

    var filesList = [];

    var EQ_PRESETS = {
        pop: [-2, -1, 0, 2, 4, 4, 2, 0, -1, -2],
        rock: [-1, 1, 2, 3, -1, -1, 0, 0, 4, 4],
        jazz: [0, 0, 0, 3, 3, 3, 0, 2, 4, 4],
        classic: [0, 6, 6, 3, 0, 0, 0, 0, 2, 2],
        normal: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }

    function init () {
        setupElements();
        setupEqualizer();
        setupPlayer();
        setupListeners();
    }

    function setupElements () {
        fileInput = $('input[type="file"]');
        volumeInput = $('input[type="range"]');
        playButton = $('.play');
        stopButton = $('.stop');
        dropzone = $('.dropzone');
        playlist = $('.player__playlist ul');
        progressBar = $('.progress-bar');
        progressMeter = $('.progress-bar span');
        equalizer = $('.equalizer');
    }

    function setupListeners () {
        document.addEventListener('drop', function (e) { e.preventDefault(); });
        document.addEventListener('dragover', function (e) { e.preventDefault(); }); 

        fileInput.onchange  = handleFileUpload;
        volumeInput.oninput = handleVolumeChange;
        playButton.onclick  = handlePlayClick;
        stopButton.onclick  = handleStopClick;
        dropzone.ondrop     = handleFileUpload;
        audio.ontimeupdate  = updateProgressBar;
        progressBar.onclick = handleProgressBarClick;
        equalizer.onchange  = setEqualizerPreset;
    }

    function setupEqualizer () {
        var frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];
        
        filters = frequencies.map(function (frequency) {
            var filter = context.createBiquadFilter();

            filter.type = "peaking";
            filter.frequency.value = frequency;
            filter.Q.value = 1;
            filter.gain.value = 0;

            return filter;
        });

        filters.reduce(function (prev, curr) {
            prev.connect(curr);

            return curr;
        });
    }

    function setupPlayer () {
        volume = context.createGain();
        source = context.createMediaElementSource(audio);
        source.connect(volume);
        volume.connect(filters[0]);
        filters[filters.length - 1].connect(context.destination);
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

    function handleVolumeChange (e) {
        volume.gain.value = e.target.value;
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

    function updateProgressBar () {
        var value = 0;

        if (audio.currentTime > 0) {
            value = ((100 / audio.duration) * audio.currentTime).toFixed(2);
        }

        progressMeter.style.width = value + "%";
    }

    function handleProgressBarClick (e) {
        var x = e.clientX - progressMeter.offsetLeft,
            width = x * 100 / progressBar.clientWidth;

        progressMeter.style.width = width + '%';
        audio.currentTime = audio.duration * width / 100;
    }

    function setEqualizerPreset (e) {
        var preset = e.target.value;

        for (var i = 0, len = filters.length; i < len; i++) {
            filters[i].gain.value = EQ_PRESETS[preset][i];
        }
    }

    return {
        init: init
    }

})();

window.onload = audioPlayer.init;