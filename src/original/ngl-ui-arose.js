import { createStore } from 'redux';
import { h, render } from 'preact';
import NGL from 'ngl';

import { Assembly } from './components.js';
import { app } from './reducers.js';
import { setAssembly, setAssemblyOptions, setStructure } from "./actions.js";


function setStageFromState(stage, state){
    var strucComp = stage.compList[0];
    if( state.pdbId && (
            !strucComp || strucComp.name !== state.pdbId
        )
    ){
        stage.removeAllComponents();
        stage.loadFile( "rcsb://" + state.pdbId, {
            defaultRepresentation: true
        } ).then( function( strucComp ){
            store.dispatch(setAssemblyOptions(strucComp.structure));
            setStageFromState(stage, store.getState());
        });
    }else if( strucComp && strucComp.type==="structure" ){
        strucComp.setDefaultAssembly( state.assembly );
    }
}


var id = "viewport";
render(
    <div id={id} style="width:800px; height:800px;"></div>,
    document.body
);
var stage = new NGL.Stage(id);


var initialState = {
    pdbId: "",
    assembly: "",
    assemblyOptions: []
};
let store = createStore(app);

store.subscribe(() => {
    setStageFromState(stage, store.getState());
});
store.dispatch(setStructure("4cup"));
store.dispatch(setAssembly("UNITCELL"));


render(
    <Assembly store={store} />,
    document.body
);
