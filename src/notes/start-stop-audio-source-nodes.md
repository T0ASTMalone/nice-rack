# How to start stop nodes
1. Gain Node 
2. Connect / Disconnect  
3. Create / Destroy

## Gain Node 

Add gain node and set gain to 1 on start and set gain to 0 on stop

Example from stack overflow
```js
// the "audio output" in our chain:
const audioContext = new AudioContext();

// the "volume control" in our chain:
const gainNode = audioContext.createGain();
gainNode.connect(audioContext.destination);
gainNode.gain.setValueAtTime(0, audioContext.currentTime);

// the "signal" in our chain:
const osc = audioContext.createOscillator();
osc.frequency.value = 440;
osc.connect(gainNode);
osc.start();

const smoothingInterval = 0.02;
const beepLengthInSeconds = 0.5;

playButton.addEventListener(`click`, () => {
  const now = audioContext.currentTime;
  gainNode.gain.setTargetAtTime(1, now, smoothingInterval);
  gainNode.gain.setTargetAtTime(0, now + beepLengthInSeconds, smoothingInterval);
});

```

## Connect / Disconnect

connect the oscillator on start and disconnect it on stop

```js
var ctx = new AudioContext();
var osc = ctx.createOscillator();   
osc.frequency.value = 8000;    
osc.start();    
$(document).ready(function() {
    $("#start").click(function() {
         osc.connect(ctx.destination);
    });
    $("#stop").click(function() {
         osc.disconnect(ctx.destination);
    });
});
```

## Create / Destroy 

Create the oscillator on start and destory it on stop

```js
var ctx = new AudioContext();
var osc = null;

function startOsc(bool) {
    if(bool === undefined) bool = true;
    
    if(bool === true) {
		osc = ctx.createOscillator();
        osc.frequency.value = 1000;

        osc.start(ctx.currentTime);
        osc.connect(ctx.destination);
    } else {
		osc.stop(ctx.currentTime);
        osc.disconnect(ctx.destination);
        osc = null;
    }
}

$(document).ready(function() {
    $("#start").click(function() {
       startOsc(); 
    });
    $("#stop").click(function() {
       startOsc(false); 
    });
});
```


