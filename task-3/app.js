var audioPlayer = (function () {
    'use strict';

    var $  = document.querySelector.bind(document),
        $$ = document.querySelectorAll.bind(document);

    var requestAnimationFrame = (function () {
        return  window.requestAnimationFrame       || 
                window.webkitRequestAnimationFrame || 
                window.mozRequestAnimationFrame    || 
                window.oRequestAnimationFrame      || 
                window.msRequestAnimationFrame     || 
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                }
    })();
    var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

    var fileInput, volumeInput, playButton, stopButton, dropzone, playlist, progressBar, progressMeter, equalizer, visualization;

    var context = new (window.AudioContext || window.webkitAudioContext)(),
        audio = new Audio(),
        volume, source, filters,
        tracklist = [], currentFile = 0,
        progressTouched;

    var analyser, animationId, canvas, canvasWidth, canvasHeight, canvasContext, gradient;

    var analyserFunctions = {

    }

    var EQ_PRESETS = {
        pop:     [-2, -1, 0, 2, 4, 4, 2, 0, -1, -2],
        rock:    [-1, 1, 2, 3, -1, -1, 0, 0, 4, 4],
        jazz:    [0, 0, 0, 3, 3, 3, 0, 2, 4, 4],
        classic: [0, 6, 6, 3, 0, 0, 0, 0, 2, 2],
        normal:  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }

    function init () {
        setupElements();
        setupEqualizer();
        setupPlayer();
        setupVisualization();
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
        visualization = $('.visualization');
    }

    function setupListeners () {
        document.ondrop          = function (e) { e.preventDefault(); }
        document.ondragover      = function (e) { e.preventDefault(); }
        playButton.onclick       = function (e) { if (tracklist.length) handlePlayClick(); }
        stopButton.onclick       = function (e) { if (tracklist.length) handleStopClick(); }
        volumeInput.oninput      = function (e) { volume.gain.value = e.target.value; }
        dropzone.ondragover      = function (e) { e.preventDefault(); e.stopPropagation(); e.dataTransfer.dropEffect = 'copy'; }
        progressBar.onmousedown  = function (e) { progressTouched = true; setProgress(e.clientX); }
        progressBar.onmousemove  = function (e) { setProgress(e.clientX); }
        progressBar.onmouseup    = function (e) { progressTouched = false; }
        progressBar.onmouseleave = function (e) { progressTouched = false; }
        audio.onended            = function (e) { changeTrack(1); }
        visualization.onchange   = function (e) { setVisualization(e.target.value); }

        fileInput.onchange     = handleFileUpload;
        dropzone.ondrop        = handleFileUpload;
        audio.ontimeupdate     = updateProgress;
        equalizer.onchange     = setEqualizerPreset;
        playlist.onclick       = handleListItemClick;
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
        analyser = context.createAnalyser();
        filters[filters.length - 1].connect(context.destination);
        filters[filters.length - 1].connect(analyser);
    }

    function setupVisualization () {
        canvas = $('.canvas');
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        canvasContext = canvas.getContext('2d');
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

        if (files[0].type.indexOf('audio') == -1) {
            alert('Неподдерживаемый тип файла');
            return;
        }

        if (!tracklist.length) {
            audio.src = URL.createObjectURL(files[0]);
        }

        playlist.innerHTML += ('<li data-id="' + tracklist.length + '"><span>' + files[0].name + '</span><div class="delete"></div></li>');
        tracklist.push(files[0]);
    }

    function handlePlayClick () {
        if (audio.paused) {
            audio.play();
            playButton.classList.add('pause');
            playButton.classList.remove('play');
            updateCurrentTrack(true);
            setVisualization(visualization.value);
        } else {
            audio.pause();
            playButton.classList.add('play');
            playButton.classList.remove('pause');
            updateCurrentTrack();
        }
    }

    function handleStopClick () {
        audio.pause();
        audio.currentTime = 0;
        progressMeter.style.width = 0;
        playButton.classList.add('play');
        playButton.classList.remove('pause');
        updateCurrentTrack();
    }

    function changeTrack (i) {
        updateCurrentTrack();
        currentFile = Math.max(0, currentFile + i);

        if (currentFile < tracklist.length) {
            audio.src = URL.createObjectURL(tracklist[currentFile]);
            audio.play();
        } else {
            currentFile = 0;
            audio.src = URL.createObjectURL(tracklist[currentFile]);
            playButton.classList.add('play');
            playButton.classList.remove('pause');
        }

        updateCurrentTrack(true);
    }

    function updateCurrentTrack (keep) {
        var tracks = $$('.player__playlist li');

        if (keep) {
            tracks[currentFile].classList.add('current');
        } else {
            tracks[currentFile].classList.remove('current');
        }
    }

    function updateProgress () {
        var value = 0;

        if (audio.currentTime > 0) {
            value = ((100 / audio.duration) * audio.currentTime).toFixed(2);
        }

        progressMeter.style.width = value + '%';
    }

    function setProgress (clientX) {
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
            changeTrack(e.target.parentNode.attributes['data-id'].value - currentFile);
        } else if (e.target.nodeName === 'DIV') {
            var element = e.target.parentNode;

            tracklist.splice(element.attributes['data-id'].value, 1);
            element.parentElement.removeChild(element);
            updateListItems();
            changeTrack(1);
        }
    }

    function updateListItems () {
        var listItems = $$('.player__playlist li');

        for (var i = 0, len = listItems.length; i < len; i++) {
            listItems[i].attributes['data-id'].value = i;
        }
    }

    function setVisualization (type) {
        if (animationId) cancelAnimationFrame(animationId);

        switch (type) {
            case 'waveform':
                drawWaveform();
                break;

            case 'spectrum':
                drawSpectrum();
                break;
        }
    }

    function drawSpectrum () {
        var capYPositionArray = [],
            capHeight = 2,
            capStyle = 'white',
            allCapsReachBottom = false,
            meterWidth = 6,
            meterNum = canvasWidth / (meterWidth + 2);

        canvasContext.clearRect(0, 0, canvas.width, canvas.height);

        var drawMeter = function () {
            var dataArray = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(dataArray);

            var step = Math.round(dataArray.length / meterNum) ;
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);

            if (audio.paused) {
                for (var i = dataArray.length - 1; i >= 0; i--) {
                    dataArray[i] = 0;
                }

                allCapsReachBottom = true;

                for (var i = capYPositionArray.length - 1; i >= 0; i--) {
                    allCapsReachBottom = allCapsReachBottom && (capYPositionArray[i] === 0);
                }

                if (allCapsReachBottom) {
                    cancelAnimationFrame(animationId);
                    return;
                }
            }

            for (var i = 0; i < meterNum; i++) {
                var value = dataArray[i * step];

                if (capYPositionArray.length < Math.round(meterNum)) {
                    capYPositionArray.push(value);
                }

                canvasContext.fillStyle = capStyle;

                if (value < capYPositionArray[i]) {
                    canvasContext.fillRect(i * 8, canvasHeight - (--capYPositionArray[i]), meterWidth, capHeight);
                } else {
                    canvasContext.fillRect(i * 8, canvasHeight - value, meterWidth, capHeight);
                    capYPositionArray[i] = value;
                }

                canvasContext.fillStyle = '#9FEE00';
                canvasContext.fillRect(i * 8 , canvasHeight - value + capHeight, meterWidth, canvasHeight + value);
            }

            animationId = requestAnimationFrame(drawMeter);
        }

        animationId = requestAnimationFrame(drawMeter);
    }

    function drawWaveform () {
        var bufferLength = analyser.frequencyBinCount,
            dataArray = new Uint8Array(bufferLength);

        canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

        var draw = function () {
            animationId = requestAnimationFrame(draw);
            analyser.getByteTimeDomainData(dataArray);
            canvasContext.fillStyle = 'black';
            canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
            canvasContext.lineWidth = 2;
            canvasContext.strokeStyle = '#9FEE00';
            canvasContext.beginPath();

            if (audio.paused) {
                cancelAnimationFrame(animationId);
                return;
            }

            var sliceWidth = canvasWidth * 1.0 / bufferLength,
                x = 0;

            for (var i = 0; i < bufferLength; i++) {
                var v = dataArray[i] / 128.0,
                    y = v * canvasHeight / 2;

                if (i === 0) {
                    canvasContext.moveTo(x, y);
                } else {
                    canvasContext.lineTo(x, y);
                }

                x += sliceWidth;
            }

            canvasContext.lineTo(canvas.width, canvas.height / 2);
            canvasContext.stroke();
        }

        draw();
    }

    return {
        init: init
    }

})();

window.onload = audioPlayer.init;