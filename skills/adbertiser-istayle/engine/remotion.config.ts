import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// WebGL for the 3D templates (D5, D6). "angle" uses the GPU; use "swangle" on machines without one.
Config.setChromiumOpenGlRenderer('angle');
