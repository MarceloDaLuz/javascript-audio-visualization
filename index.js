const canvas = document.getElementById('canvas');
const elAudio = document.querySelector('audio#audio')
const play = document.getElementById("play");
const pause =  document.getElementById("pause");
const repeat =  document.getElementById("repeat");

let audio = false;

function createAudio(){
    if(audio) return;

    const newaudio = new Audio();
    newaudio.src = "kingdom_hearts_sanctuary.mp3";
    newaudio.controls = false;
    elAudio.appendChild(newaudio);
    elAudio.addEventListener("progress", () => console.log('started'));
    return newaudio;
}

function createCanvas(){
    const canvasCtx = canvas.getContext("2d");
    canvas.width =  canvas.scrollWidth;
    canvas.height = canvas.scrollHeight;
    return canvasCtx;
}

function isPlaying(currentAudio){
    return !currentAudio.paused;
}

function playSong(){
    if(audio && isPlaying(audio)){
        audio.pause();
    }else if(audio.paused){
        audio.play()
    }else{
        //Audio
        audio = createAudio();

        //Canvas
        const canvasCtx =  createCanvas();
        const audioCtx = new AudioContext();
        let audioSrc =  audioCtx.createMediaElementSource(audio);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 4096;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        audioSrc.connect(analyser);
        analyser.connect(audioCtx.destination);

        //
        const barWidth = (canvas.width / bufferLength) * 13;
        let barHeight = 0;

        function renderFrame(){
            requestAnimationFrame(renderFrame);

            canvasCtx.fillStyle = "rgba(0,0,0,0.2)";
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

            let color = "rgba(222,208,226, 0.3)";
            let bars = 100;
            analyser.getByteFrequencyData(dataArray);
            for(let i =0; i < bars; i++){
                barPosition = i * (barWidth + 10);
                barHeight = dataArray[i] * 2.5;

                color = canvasCtx.createLinearGradient(barPosition, canvas.height - barHeight, barWidth, barHeight);
                color.addColorStop(1, 'rgb(255,127,205)');
                color.addColorStop(.84, 'rgb(255,102,195)');
                color.addColorStop(.56, 'rgb(255,76,185)');
                color.addColorStop(.42, 'rgb(255,50,175)');
                color.addColorStop(.28, 'rgb(255,25,165)');
                color.addColorStop(.14, 'rgb(255,0,156)');
                color.addColorStop(0, 'rgb(229,0,140)');
                canvasCtx.fillStyle = color;
                canvasCtx.fillRect(barPosition, canvas.height - barHeight, barWidth, barHeight);
            }
        }
        audio.play();
        renderFrame();
    } 
}

function stopSong(){
    if(!audio) return;

    if(audio.currentTime > 0 && audio.paused === false){
        audio.pause();
    }
    console.log(audio);
}

function loopSong(){
    if(!audio) return;

    audio.loop = true;
}

play.addEventListener("click", playSong);
pause.addEventListener("click", stopSong);
repeat.addEventListener("click", loopSong);