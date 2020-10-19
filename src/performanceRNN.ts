/* Copyright 2017 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/
import * as tf from '@tensorflow/tfjs-core';
import { toNamespacedPath } from 'path';
import * as Tone from 'tone';

const sampler = new Tone.Sampler({
	urls: {
		"C4": "C4.mp3",
		"D#4": "Ds4.mp3",
		"F#4": "Fs4.mp3",
		"A4": "A4.mp3",
	},
	release: 1,
	baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();

// Tone.loaded().then(() => {
// 	sampler.triggerAttackRelease(["Eb4", "G4", "Bb4"], 4);
// });
// tslint:disable-next-line:no-require-imports
 const Piano = require('tone-piano').Piano;


let lstmKernel1: tf.Tensor2D;
let lstmBias1: tf.Tensor1D;
let lstmKernel2: tf.Tensor2D;
let lstmBias2: tf.Tensor1D;
let lstmKernel3: tf.Tensor2D;
let lstmBias3: tf.Tensor1D;
let c: tf.Tensor2D[];
let h: tf.Tensor2D[];
let fcB: tf.Tensor1D;
let fcW: tf.Tensor2D;
const forgetBias = tf.scalar(1.0);
const activeNotes = new Map<number, number>();

// How many steps to generate per generateStep call.
// Generating more steps makes it less likely that we'll lag behind in note
// generation. Generating fewer steps makes it less likely that the browser UI
// thread will be starved for cycles.
const STEPS_PER_GENERATE_CALL = 10;
// How much time to try to generate ahead. More time means fewer buffer
// underruns, but also makes the lag from UI change to output larger.
const GENERATION_BUFFER_SECONDS = .5;
// If we're this far behind, reset currentTime time to piano.now().
const MAX_GENERATION_LAG_SECONDS = 1;
// If a note is held longer than this, release it.
const MAX_NOTE_DURATION_SECONDS = 3;

const NOTES_PER_OCTAVE = 12;
const DENSITY_BIN_RANGES = [1.0, 2.0, 4.0, 8.0, 16.0, 32.0, 64.0];
const PITCH_HISTOGRAM_SIZE = NOTES_PER_OCTAVE;

const RESET_RNN_FREQUENCY_MS = 30000;

let pitchHistogramEncoding: tf.Tensor1D;
let noteDensityEncoding: tf.Tensor1D;
let conditioned = true;

let currentPianoTimeSec = 0;
// When the piano roll starts in browser-time via performance.now().
//let pianoStartTimestampMs = 0;

let currentVelocity = 100;

const MIN_MIDI_PITCH = 0;
const MAX_MIDI_PITCH = 127;
const VELOCITY_BINS = 32;
const MAX_SHIFT_STEPS = 100;
const STEPS_PER_SECOND = 100;

// The unique id of the currently scheduled setTimeout loop.
let currentLoopId = 0;

const EVENT_RANGES = [
  ['note_on', MIN_MIDI_PITCH, MAX_MIDI_PITCH],
  ['note_off', MIN_MIDI_PITCH, MAX_MIDI_PITCH],
  ['time_shift', 1, MAX_SHIFT_STEPS],
  ['velocity_change', 1, VELOCITY_BINS],
];

///////////////////////////////////////////////////////
//const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const SCALE_CHOICES = {
  'Cmajor': majorScale(0),
  'C#major': majorScale(1),
  'Dmajor': majorScale(2),
  'D#major': majorScale(3),
  'Emajor': majorScale(4),
  'Fmajor': majorScale(5),
  'F#major': majorScale(6),
  'Gmajor': majorScale(7),
  'G#major': majorScale(8),
  'Amajor': majorScale(9),
  'A#major': majorScale(10),
  'Bmajor': majorScale(11),

  'Cpentatonic': pentatonicScale(0),
  'C#pentatonic': pentatonicScale(1),
  'Dpentatonic': pentatonicScale(2),
  'D#pentatonic': pentatonicScale(3),
  'Epentatonic': pentatonicScale(4),
  'Fpentatonic': pentatonicScale(5),
  'F#pentatonic': pentatonicScale(6),
  'Gpentatonic': pentatonicScale(7),
  'G#pentatonic': pentatonicScale(8),
  'Apentatonic': pentatonicScale(9),
  'A#pentatonic': pentatonicScale(10),
  'Bpentatonic': pentatonicScale(11)
};

function majorScale (rootIdx: number): number[] {
  let notes = [0,0,0,0,0,0,0,0,0,0,0,0];

  notes[rootIdx] = 2;
  notes[(rootIdx + 2) % 12] = 1;
  notes[(rootIdx + 4) % 12] = 1;
  notes[(rootIdx + 5) % 12] = 1;
  notes[(rootIdx + 7) % 12] = 1;
  notes[(rootIdx + 9) % 12] = 1;
  notes[(rootIdx + 11) % 12] = 1;

  return notes;
}

function pentatonicScale (rootIdx: number): number[] {
  let notes = [0,0,0,0,0,0,0,0,0,0,0,0];

  notes[rootIdx] = 2;
  notes[(rootIdx + 3) % 12] = 1;
  notes[(rootIdx + 5) % 12] = 1;
  notes[(rootIdx + 7) % 12] = 1;
  notes[(rootIdx + 10) % 12] = 1;

  return notes;
}

// number in range 0 - 6, only integers
let noteDensity = 0;
updateConditioningParams(noteDensity, SCALE_CHOICES['C#pentatonic']);
const globalGain = 0.1;

var stopped = false;

//x.addEventListener('click', function(){ alert('blah');}, false);



// setTimeout(() => {
//   console.log('updating conditions');
//   updateConditioningParams(4, [1,1,0,0,0,0,0,0,0,0,0,0]);
// }, 30000)
/////////////////////////////////////////////////////


function calculateEventSize(): number {
  let eventOffset = 0;
  for (const eventRange of EVENT_RANGES) {
    const minValue = eventRange[1] as number;
    const maxValue = eventRange[2] as number;
    eventOffset += maxValue - minValue + 1;
  }
  return eventOffset;
}


const EVENT_SIZE = calculateEventSize();
const PRIMER_IDX = 355;  // shift 1s.
let lastSample = tf.scalar(PRIMER_IDX, 'int32');

const piano = new Piano({velocities: 10}).toMaster();

const SALAMANDER_URL = 'https://storage.googleapis.com/' +
    'download.magenta.tensorflow.org/demos/SalamanderPiano/';
const CHECKPOINT_URL = 'https://storage.googleapis.com/' +
    'download.magenta.tensorflow.org/models/performance_rnn/tfjs';

const isDeviceSupported = tf.ENV.get('WEBGL_VERSION') >= 1;

let modelReady = false;


function start() {
  //console.log('in start method');
      fetch(`${CHECKPOINT_URL}/weights_manifest.json`)
                     .then((response) => response.json())
                     .then(
                         (manifest: tf.WeightsManifestConfig) =>
                             tf.loadWeights(manifest, CHECKPOINT_URL))

      .then((vars: {[varName: string]: tf.Tensor}) => {
        
        lstmKernel1 =
            vars['rnn/multi_rnn_cell/cell_0/basic_lstm_cell/kernel'] as
            tf.Tensor2D;
        lstmBias1 = vars['rnn/multi_rnn_cell/cell_0/basic_lstm_cell/bias'] as
            tf.Tensor1D;

        lstmKernel2 =
            vars['rnn/multi_rnn_cell/cell_1/basic_lstm_cell/kernel'] as
            tf.Tensor2D;
        lstmBias2 = vars['rnn/multi_rnn_cell/cell_1/basic_lstm_cell/bias'] as
            tf.Tensor1D;

        lstmKernel3 =
            vars['rnn/multi_rnn_cell/cell_2/basic_lstm_cell/kernel'] as
            tf.Tensor2D;
        lstmBias3 = vars['rnn/multi_rnn_cell/cell_2/basic_lstm_cell/bias'] as
            tf.Tensor1D;

        fcB = vars['fully_connected/biases'] as tf.Tensor1D;
        fcW = vars['fully_connected/weights'] as tf.Tensor2D;
        modelReady = true;
        resetRnn();
      });
}

// function start() {
//   //console.log('in start method');
//   piano.load(SALAMANDER_URL)
//       .then(() => {
//         console.log('got stuff');
//         return fetch(`${CHECKPOINT_URL}/weights_manifest.json`)
//                      .then((response) => {console.log(response.json()); return response.json()})
//                      .then(
//                          (manifest: tf.WeightsManifestConfig) =>
//                              tf.loadWeights(manifest, CHECKPOINT_URL));
//       })
//       .then((vars: {[varName: string]: tf.Tensor}) => {
        
//         lstmKernel1 =
//             vars['rnn/multi_rnn_cell/cell_0/basic_lstm_cell/kernel'] as
//             tf.Tensor2D;
//         lstmBias1 = vars['rnn/multi_rnn_cell/cell_0/basic_lstm_cell/bias'] as
//             tf.Tensor1D;

//         lstmKernel2 =
//             vars['rnn/multi_rnn_cell/cell_1/basic_lstm_cell/kernel'] as
//             tf.Tensor2D;
//         lstmBias2 = vars['rnn/multi_rnn_cell/cell_1/basic_lstm_cell/bias'] as
//             tf.Tensor1D;

//         lstmKernel3 =
//             vars['rnn/multi_rnn_cell/cell_2/basic_lstm_cell/kernel'] as
//             tf.Tensor2D;
//         lstmBias3 = vars['rnn/multi_rnn_cell/cell_2/basic_lstm_cell/bias'] as
//             tf.Tensor1D;

//         fcB = vars['fully_connected/biases'] as tf.Tensor1D;
//         fcW = vars['fully_connected/weights'] as tf.Tensor2D;
//         modelReady = true;
//         resetRnn();
//       });
// }

function resetRnn() {
  c = [
    tf.zeros([1, lstmBias1.shape[0] / 4]),
    tf.zeros([1, lstmBias2.shape[0] / 4]),
    tf.zeros([1, lstmBias3.shape[0] / 4]),
  ];
  h = [
    tf.zeros([1, lstmBias1.shape[0] / 4]),
    tf.zeros([1, lstmBias2.shape[0] / 4]),
    tf.zeros([1, lstmBias3.shape[0] / 4]),
  ];
  if (lastSample != null) {
    lastSample.dispose();
  }
  lastSample = tf.scalar(PRIMER_IDX, 'int32');
  currentPianoTimeSec = piano.now();
  currentLoopId++;
  generateStep(currentLoopId);
}


function updateConditioningParams(noteDensityIdx: number, pitchHistogram: number[]) {
  noteDensityEncoding =
      tf.oneHot(
          tf.tensor1d([noteDensityIdx + 1], 'int32'),
          DENSITY_BIN_RANGES.length + 1).as1D();

  const buffer = tf.buffer<tf.Rank.R1>([PITCH_HISTOGRAM_SIZE], 'float32');
  const pitchHistogramTotal = pitchHistogram.reduce((prev, val) => {
    return prev + val;
  });
  for (let i = 0; i < PITCH_HISTOGRAM_SIZE; i++) {
    buffer.set(pitchHistogram[i] / pitchHistogramTotal, i);
  }
  pitchHistogramEncoding = buffer.toTensor();
}

function getConditioning(): tf.Tensor1D {
  return tf.tidy(() => {
    if (!conditioned) {
      // TODO(nsthorat): figure out why we have to cast these shapes to numbers.
      // The linter is complaining, though VSCode can infer the types.
      const size = 1 + (noteDensityEncoding.shape[0] as number) +
          (pitchHistogramEncoding.shape[0] as number);
      const conditioning: tf.Tensor1D =
          tf.oneHot(tf.tensor1d([0], 'int32'), size).as1D();
      return conditioning;
    } else {
      const axis = 0;
      const conditioningValues =
          noteDensityEncoding.concat(pitchHistogramEncoding, axis);
      return tf.tensor1d([0], 'int32').concat(conditioningValues, axis);
    }
  });
}

async function generateStep(loopId: number) {
  //console.log('in generateStep()');
  if (loopId < currentLoopId) {
    // Was part of an outdated generateStep() scheduled via setTimeout.
    return;
  }

  const lstm1 = (data: tf.Tensor2D, c: tf.Tensor2D, h: tf.Tensor2D) =>
      tf.basicLSTMCell(forgetBias, lstmKernel1, lstmBias1, data, c, h);
  const lstm2 = (data: tf.Tensor2D, c: tf.Tensor2D, h: tf.Tensor2D) =>
      tf.basicLSTMCell(forgetBias, lstmKernel2, lstmBias2, data, c, h);
  const lstm3 = (data: tf.Tensor2D, c: tf.Tensor2D, h: tf.Tensor2D) =>
      tf.basicLSTMCell(forgetBias, lstmKernel3, lstmBias3, data, c, h);

  let outputs: tf.Scalar[] = [];
  [c, h, outputs] = tf.tidy(() => {
    // Generate some notes.
    const innerOuts: tf.Scalar[] = [];
    for (let i = 0; i < STEPS_PER_GENERATE_CALL; i++) {
      // Use last sampled output as the next input.
      const eventInput = tf.oneHot(
        lastSample.as1D(), EVENT_SIZE).as1D();
      // Dispose the last sample from the previous generate call, since we
      // kept it.
      if (i === 0) {
        lastSample.dispose();
      }
      const conditioning = getConditioning();
      const axis = 0;
      const input = conditioning.concat(eventInput, axis).toFloat();
      const output =
          tf.multiRNNCell([lstm1, lstm2, lstm3], input.as2D(1, -1), c, h);
      c.forEach(c => c.dispose());
      h.forEach(h => h.dispose());
      c = output[0];
      h = output[1];

      const outputH = h[2];
      const logits = outputH.matMul(fcW).add(fcB);

      const sampledOutput = tf.multinomial(logits.as1D(), 1).asScalar();

      innerOuts.push(sampledOutput);
      lastSample = sampledOutput;
    }
    return [c, h, innerOuts] as [tf.Tensor2D[], tf.Tensor2D[], tf.Scalar[]];
  });

  for (let i = 0; i < outputs.length; i++) {
    if(!stopped){
      playOutput(outputs[i].dataSync()[0]);
    }
    
  }

  if (piano.now() - currentPianoTimeSec > MAX_GENERATION_LAG_SECONDS) {
    console.warn(
        `Generation is ${piano.now() - currentPianoTimeSec} seconds behind, ` +
        `which is over ${MAX_NOTE_DURATION_SECONDS}. Resetting time!`);
    currentPianoTimeSec = piano.now();
  }
  const delta = Math.max(
      0, currentPianoTimeSec - piano.now() - GENERATION_BUFFER_SECONDS);
  setTimeout(() => generateStep(loopId), delta * 1000);
}

/**
 * Decode the output index and play it on the piano and keyboardInterface.
 */
function playOutput(index: number) {
  //console.log('inm playOutput()');
  let offset = 0;
  for (const eventRange of EVENT_RANGES) {
    const eventType = eventRange[0] as string;
    const minValue = eventRange[1] as number;
    const maxValue = eventRange[2] as number;
    if (offset <= index && index <= offset + maxValue - minValue) {
      if (eventType === 'note_on') {
        const noteNum = index - offset;
        activeNotes.set(noteNum, currentPianoTimeSec);
        //console.log(piano);
        //console.log('note on event');
        //console.log(noteNum, currentPianoTimeSec, currentVelocity * 1 / 100);
        sampler.triggerAttack(Tone.Frequency(noteNum, "midi").toFrequency(), currentPianoTimeSec, globalGain*currentVelocity);
        return;
        //return piano.keyDown(noteNum, currentPianoTimeSec, currentVelocity * 10 / 100);
      } else if (eventType === 'note_off') {
        const noteNum = index - offset;

        const activeNoteEndTimeSec = activeNotes.get(noteNum);
        // If the note off event is generated for a note that hasn't been
        // pressed, just ignore it.
        if (activeNoteEndTimeSec == null) {
          return;
        }
        const timeSec = Math.max(currentPianoTimeSec, activeNoteEndTimeSec + .5);
        sampler.triggerRelease(Tone.Frequency(noteNum, "midi").toFrequency(), timeSec);
        //piano.keyUp(noteNum, timeSec);
        activeNotes.delete(noteNum);
        return;
      } else if (eventType === 'time_shift') {
        currentPianoTimeSec += (index - offset + 1) / STEPS_PER_SECOND;
        activeNotes.forEach((timeSec, noteNum) => {
          if (currentPianoTimeSec - timeSec > MAX_NOTE_DURATION_SECONDS) {
            // console.info(
            //     `Note ${noteNum} has been active for ${
            //         currentPianoTimeSec - timeSec}, ` +
            //     `seconds which is over ${MAX_NOTE_DURATION_SECONDS}, will ` +
            //     `release.`);
            sampler.triggerRelease(Tone.Frequency(noteNum, "midi").toFrequency(), currentPianoTimeSec);
            //piano.keyUp(noteNum, currentPianoTimeSec);
            activeNotes.delete(noteNum);
          }
        });
        return currentPianoTimeSec;
      } else if (eventType === 'velocity_change') {
        currentVelocity = (index - offset + 1) * Math.ceil(127 / VELOCITY_BINS);
        currentVelocity = currentVelocity / 127;
        return currentVelocity;
      } else {
        throw new Error('Could not decode eventType: ' + eventType);
      }
    }
    offset += maxValue - minValue + 1;
  }
  throw new Error(`Could not decode index: ${index}`);
}

// Reset the RNN repeatedly so it doesn't trail off into incoherent musical
// babble.
//const resettingText = document.getElementById('resettingText');
function resetRnnRepeatedly() {
  if (modelReady) {
    resetRnn();
    //resettingText.style.opacity = '100';
  }

  // setTimeout(() => {
  //   //resettingText.style.opacity = '0';
  // }, 1000);
  setTimeout(resetRnnRepeatedly, RESET_RNN_FREQUENCY_MS);
}
setTimeout(resetRnnRepeatedly, RESET_RNN_FREQUENCY_MS);


const resumeRNN = () => {
    console.log('resuming rnn');
    stopped = false;
    resetRnn(); 
}

const pauseRNN = () => {
    console.log('pausing rnn');
    //modelReady = false;
    stopped = true;  
}

const startRNN = () => {
  if (!isDeviceSupported) {
    document.querySelector('#status').innerHTML =
        'We do not yet support your device. Please try on a desktop ' +
        'computer with Chrome/Firefox, or an Android phone with WebGL support.';
  } else {
    start();
  } 
}

export {
  startRNN, 
  resumeRNN, 
  pauseRNN
}
