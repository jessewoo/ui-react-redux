import { createStore } from 'redux';
import { h, render } from 'preact';
import NGL from 'ngl';

import { Header, DisplayOptions } from './components/components.js';
import { app } from './reducers/reducers.js';
import { setAssemblyOptions } from "./actions/actions.js";
import { initRepr, setColor, setStyle } from "./ngl-script.js";
import { getQueryStringParameterByName, inspect } from "./util.js";

var store;
var structureComponent;
const header = document.getElementById('header');
const displayOptions = document.getElementById('displayOptions');

init();

function init() {
    // get the pdbId from the parameterString or set a default pdbId
    const pdbId = (getQueryStringParameterByName('pdbId') !== '') ? getQueryStringParameterByName('pdbId') : '4cup';

    // set the stage
    var stage = new NGL.Stage('viewport');
    console.log('stage created **********');

    stage.removeAllComponents();
    stage.loadFile( "rcsb://" + pdbId, {
        defaultRepresentation: true
    } ).then( function( _structureComponent ) {

        structureComponent = _structureComponent;

        initRepr(structureComponent, null);

        // set initial state for store - TODO this could be combined with setAssemblyOptions
        const initialState = {
            pdbId: pdbId,
            assembly: structureComponent.defaultAssembly,
            color: 'rainbow',
            colorOptions: [
                { value: "rainbow", label: "Rainbow" },
                { value: "secondaryStructure", label: "SecondaryStructure" },
                { value: "chain", label: "Chain" }
            ],
            style: 'cartoon',
            styleOptions: [
                { value: "cartoon", label: "Cartoon" },
                { value: "spheres", label: "Spheres" },
                { value: "surface", label: "Surface" }
            ]
        };
        store = createStore(app, initialState);
        console.log('store created using initial state **********');
        store.dispatch(setAssemblyOptions(structureComponent.structure)); // update the state here - now everything is set
        store.getState().assemblyOptions.forEach( (item) => console.log(item.value + ' ' + item.label) ); // debug
        store.subscribe(updateStage); // any change in state will trigger call to update stage

        initUi(); // init the ui
    });
}

// init the ui
function initUi () {
    render(<Header id={structureComponent.structure.id} title={structureComponent.structure.title} />, header);
    render(<DisplayOptions store={store} />, displayOptions);
}

// function to update the stage whenever state changes
const updateStage = function() {
    if ( structureComponent && structureComponent.type==="structure" ) {
        structureComponent.setDefaultAssembly( store.getState().assembly );
        setColor(store.getState().color);
        setStyle(store.getState().style);
    }
}