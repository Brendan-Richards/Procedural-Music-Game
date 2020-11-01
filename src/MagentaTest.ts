// const mvae = require('@magenta/music/node/music_vae');
// const music_rnn = require('@magenta/music/node/music_rnn');
// const core = require('@magenta/music/node/core');

import * as mm from '@magenta/music/es6';
import { INoteSequence } from '@magenta/music/es6';

export default async () => {
    
    const FULL_TWINKLE: mm.INoteSequence = {
      notes: [
        {pitch: 43, quantizedStartStep: 0, quantizedEndStep: 2, program: 0},
        {pitch: 50, quantizedStartStep: 2, quantizedEndStep: 4, program: 0},
        {pitch: 57, quantizedStartStep: 4, quantizedEndStep: 6, program: 0},
        {pitch: 59, quantizedStartStep: 6, quantizedEndStep: 10, program: 0},
        {pitch: 57, quantizedStartStep: 10, quantizedEndStep: 12, program: 0},
        {pitch: 50, quantizedStartStep: 12, quantizedEndStep: 14, program: 0},

        {pitch: 43, quantizedStartStep: 14, quantizedEndStep: 16, program: 0},
        {pitch: 50, quantizedStartStep: 16, quantizedEndStep: 18, program: 0},
        {pitch: 57, quantizedStartStep: 18, quantizedEndStep: 20, program: 0},
        {pitch: 59, quantizedStartStep: 20, quantizedEndStep: 24, program: 0},
        {pitch: 57, quantizedStartStep: 24, quantizedEndStep: 26, program: 0},
        {pitch: 50, quantizedStartStep: 26, quantizedEndStep: 28, program: 0},

        {pitch: 45, quantizedStartStep: 28, quantizedEndStep: 30, program: 0},
        {pitch: 52, quantizedStartStep: 30, quantizedEndStep: 32, program: 0},
        {pitch: 57, quantizedStartStep: 32, quantizedEndStep: 34, program: 0},
        {pitch: 61, quantizedStartStep: 34, quantizedEndStep: 38, program: 0},
        {pitch: 57, quantizedStartStep: 38, quantizedEndStep: 40, program: 0},
        {pitch: 52, quantizedStartStep: 40, quantizedEndStep: 42, program: 0},

        {pitch: 45, quantizedStartStep: 42, quantizedEndStep: 44, program: 0},
        {pitch: 52, quantizedStartStep: 44, quantizedEndStep: 46, program: 0},
        {pitch: 57, quantizedStartStep: 46, quantizedEndStep: 48, program: 0},
        {pitch: 61, quantizedStartStep: 48, quantizedEndStep: 52, program: 0},
        {pitch: 57, quantizedStartStep: 52, quantizedEndStep: 54, program: 0},
        {pitch: 52, quantizedStartStep: 54, quantizedEndStep: 56, program: 0}

      ],
      tempos: [
        {time: 0, qpm: 140}
      ],
      quantizationInfo: {stepsPerQuarter: 4},
      totalQuantizedSteps: 56
    };
    
    // const player = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/salamander');
    // const music_rnn = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/melody_rnn');
    // music_rnn.initialize().then(() => {
    //     player.loadAllSamples().then(() => {

    //       let count = 0;
    //       for(let i=0; i<10; i++){
            
    //       }

    //       music_rnn.continueSequence(FULL_TWINKLE, 50).then((sequence: mm.INoteSequence) => {
    //         player.start(FULL_TWINKLE).then(() => {
    //           player.start(sequence);
    //         });
            
    //       });
          
    //     });
    // });


    
    


    // const model = new music_rnn.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn');
    // model.initialize();

    // const TWINKLE_TWINKLE = {
    //     notes: [
    //     {pitch: 60, startTime: 0.0, endTime: 0.5},
    //     {pitch: 60, startTime: 0.5, endTime: 1.0},
    //     {pitch: 67, startTime: 1.0, endTime: 1.5},
    //     {pitch: 67, startTime: 1.5, endTime: 2.0},
    //     {pitch: 69, startTime: 2.0, endTime: 2.5},
    //     {pitch: 69, startTime: 2.5, endTime: 3.0},
    //     {pitch: 67, startTime: 3.0, endTime: 4.0},
    //     {pitch: 65, startTime: 4.0, endTime: 4.5},
    //     {pitch: 65, startTime: 4.5, endTime: 5.0},
    //     {pitch: 64, startTime: 5.0, endTime: 5.5},
    //     {pitch: 64, startTime: 5.5, endTime: 6.0},
    //     {pitch: 62, startTime: 6.0, endTime: 6.5},
    //     {pitch: 62, startTime: 6.5, endTime: 7.0},
    //     {pitch: 60, startTime: 7.0, endTime: 8.0},  
    //     ],
    //     totalTime: 8
    // };

    // const player = new core.Player();

    // player.start(TWINKLE_TWINKLE);
    
}
