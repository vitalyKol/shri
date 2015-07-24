var audioPlayer = (function () {
    'use strict';

    var $  = document.querySelector.bind(document),
        $$ = document.querySelectorAll.bind(document);

    var fileInput, volumeInput, playButton, stopButton, dropzone, playlist, progressBar, progressMeter, equalizer, list;

    var context = new (window.AudioContext || window.webkitAudioContext)(),
        audio = new Audio(),
        volume, source, filters,
        filesList = [], currentFile = 0,
        progressTouched;

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
        fileInput     = $('input[type="file"]');
        volumeInput   = $('input[type="range"]');
        playButton    = $('.play');
        stopButton    = $('.stop');
        dropzone      = $('.dropzone');
        playlist      = $('.player__playlist ul');
        progressBar   = $('.progress-bar');
        progressMeter = $('.progress-bar span');
        equalizer     = $('.equalizer');
        list          = $('.player__playlist ul');
    }

    function setupListeners () {
        document.addEventListener('drop', function (e) { e.preventDefault(); });
        document.addEventListener('dragover', function (e) { e.preventDefault(); }); 
    
        playButton.onclick       = function (e) { if (filesList.length) handlePlayClick(); }
        stopButton.onclick       = function (e) { if (filesList.length) handleStopClick(); }
        volumeInput.oninput      = function (e) { volume.gain.value = e.target.value; }
        progressBar.onmousedown  = function (e) { progressTouched = true; updateProgressOnClick(e.clientX); }
        progressBar.onmousemove  = function (e) { updateProgressOnClick(e.clientX); }
        progressBar.onmouseup    = function (e) { progressTouched = false; }
        progressBar.onmouseleave = function (e) { progressTouched = false; }
        audio.onended            = function (e) { changeFile(1); }

        fileInput.onchange = handleFileUpload;
        dropzone.ondrop    = handleFileUpload;
        audio.ontimeupdate = updateProgressOnPlay;
        equalizer.onchange = setEqualizerPreset;
        list.onclick       = handleListItemClick;
    }

    function setupEqualizer () {
        var frequencies = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000];
        
        filters = frequencies.map(function (frequency) {
            var filter = context.createBiquadFilter();

            filter.type = 'peaking';
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

        if (e.target.nodeName === 'DIV') {
            files = e.dataTransfer.files;
        } else if (e.target.nodeName === 'INPUT') {
            files = e.target.files;
        }

        if (!filesList.length) {
            audio.src = URL.createObjectURL(files[0]);
        }

        playlist.innerHTML += ('<li data-id="' + filesList.length + '"><span>' + files[0].name + '</span><div class="delete"></div></li>');
        filesList.push(files[0]);
    }

    function handlePlayClick () {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
            updateCurrentFile();
        }
    }

    function handleStopClick () {
        audio.pause();
        audio.currentTime = 0;
        progressMeter.style.width = 0;
        updateCurrentFile();
    }

    function changeFile (i) {
        updateCurrentFile();
        currentFile = Math.max(0, currentFile + i);

        if (currentFile < filesList.length) {
            audio.src = URL.createObjectURL(filesList[currentFile]);
            audio.play();
        } else {
            currentFile = 0;
            audio.src = URL.createObjectURL(filesList[currentFile]);
        }

        updateCurrentFile(true);
        updateProgressOnPlay();
    }

    function updateCurrentFile (keep) {
        var tracks = $$('.player__playlist li');

        if (keep) {
            tracks[currentFile].classList.add('current');
        } else {
            tracks[currentFile].classList.remove('current');
        }
    }

    function updateProgressOnPlay () {
        var value = 0;

        if (audio.currentTime > 0) {
            value = ((100 / audio.duration) * audio.currentTime).toFixed(2);
        }

        progressMeter.style.width = value + '%';
    }

    function updateProgressOnClick (clientX) {
        var x = clientX - progressMeter.offsetLeft,
            width = x * 100 / progressBar.clientWidth;

        if (progressTouched && audio.duration) {
            progressMeter.style.width = width + '%';
            audio.currentTime = audio.duration * width / 100;
        }
    }

    function setEqualizerPreset (e) {
        var preset = e.target.value;

        for (var i = 0, len = filters.length; i < len; i++) {
            filters[i].gain.value = EQ_PRESETS[preset][i];
        }
    }

    function handleListItemClick (e) {
        if (e.target.nodeName === 'SPAN') {
            changeFile(e.target.parentNode.attributes['data-id'].value - currentFile);
        } else if (e.target.nodeName === 'DIV') {
            var element = e.target.parentNode;

            filesList.splice(element.attributes['data-id'].value, 1);
            element.parentElement.removeChild(element);
            updateListItems();
            changeFile(1);
        }
    }

    function updateListItems () {
        var listItems = $$('.player__playlist li');

        for (var i = 0, len = listItems.length; i < len; i++) {
            listItems[i].attributes['data-id'].value = i;
        }
    }

    return {
        init: init
    }

})();

window.onload = audioPlayer.init;