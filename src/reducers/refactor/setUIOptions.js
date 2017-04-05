// SET UI OPTIONS - SEPARATE FROM THE NGL SCRIPT
// Don't mutate - http://pdb101.rcsb.org/js/ngl-script.js

// TODO: Need to import and export, keeping it in ngl-script for now
import { setColor, setStyle } from "../ngl-script.js";

function setColor(color) {
    console.log('setColor: color=' + color);
    switch (color) {
        case 'rainbow':
            colorRainbow();
            break;
        case 'secondaryStructure':
            colorSecondaryStructure();
            break;
        case 'chain':
            colorChain();
            break;
        default:
            colorRainbow();
    }
}

// spin
function setSpin(spin) {
    if (spin === true) {
        //stage.setSpin([0, 1, 0], 0.005);
    } else if (spin === false) {
        //stage.setSpin(null, null);
    }
    currentSpin = spin;
}

// set styles
function setStyle(style) {
    console.log('setStyle: style=' + style);
    currentStyle = style;
    switch (style) {
        case 'cartoon':
            styleCartoon();
            break;
        case 'spheres':
            styleSpheres();
            break;
        case 'surface':
            styleSurface();
            break;
        default:
            colorCartoon();
    }
}

export {setColor, setStyle, setSpin}
