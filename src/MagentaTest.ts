// const mvae = require('@magenta/music/node/music_vae');
// const music_rnn = require('@magenta/music/node/music_rnn');
// const core = require('@magenta/music/node/core');

import * as mm from '@magenta/music/es6';
import { INoteSequence } from '@magenta/music/es6';

export default async () => {

    const FULL_TWINKLE: mm.INoteSequence = {
      notes: [
        {pitch: 43, quantizedStartStep: 0, quantizedEndStep: 14, program: 0},
        {pitch: 50, quantizedStartStep: 2, quantizedEndStep: 4, program: 0},
        {pitch: 57, quantizedStartStep: 4, quantizedEndStep: 6, program: 0},
        {pitch: 59, quantizedStartStep: 6, quantizedEndStep: 10, program: 0},
        {pitch: 57, quantizedStartStep: 10, quantizedEndStep: 12, program: 0},
        {pitch: 50, quantizedStartStep: 12, quantizedEndStep: 14, program: 0},

        {pitch: 43, quantizedStartStep: 14, quantizedEndStep: 28, program: 0},
        {pitch: 50, quantizedStartStep: 16, quantizedEndStep: 18, program: 0},
        {pitch: 57, quantizedStartStep: 18, quantizedEndStep: 20, program: 0},
        {pitch: 59, quantizedStartStep: 20, quantizedEndStep: 24, program: 0},
        {pitch: 57, quantizedStartStep: 24, quantizedEndStep: 26, program: 0},
        {pitch: 50, quantizedStartStep: 26, quantizedEndStep: 28, program: 0},

        {pitch: 45, quantizedStartStep: 28, quantizedEndStep: 42, program: 0},
        {pitch: 52, quantizedStartStep: 30, quantizedEndStep: 32, program: 0},
        {pitch: 57, quantizedStartStep: 32, quantizedEndStep: 34, program: 0},
        {pitch: 61, quantizedStartStep: 34, quantizedEndStep: 38, program: 0},
        {pitch: 57, quantizedStartStep: 38, quantizedEndStep: 40, program: 0},
        {pitch: 52, quantizedStartStep: 40, quantizedEndStep: 42, program: 0},

        {pitch: 45, quantizedStartStep: 42, quantizedEndStep: 56, program: 0},
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
    
    
}
