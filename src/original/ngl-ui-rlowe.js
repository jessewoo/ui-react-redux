render(<Assembly store={store} />, document.body);

var structure = strucComp.structure; // now we have the structure loaded

// __AU|BU1|UNITCELL|SUPERCELL


store.subscribe(() => {
    setStageFromState(stage, store.getState());
});

function setStageFromState(stage, state){
    var strucComp = stage.compList[0]; // initially null
    var name = (strucComp && strucComp.name) ? strucComp.name : '';
    console.log('setStageFromState: strucComp.name=' + name + ', state.pdbId=' + state.pdbId);

    if( state.pdbId && ( !strucComp || strucComp.name !== state.pdbId ) ) {
        stage.removeAllComponents();
        stage.loadFile( "rcsb://" + state.pdbId, {
            defaultRepresentation: true
        } ).then( function( strucComp ){
            structure = strucComp.structure; // now we have the structure loaded
            store.dispatch(setAssemblyOptions(strucComp.structure)); // update the state here - now everything is set
            // setStageFromState(stage, store.getState()); // recursive call not needed
            strucComp.setDefaultAssembly( state.assembly );
        });
    } else if ( strucComp && strucComp.type==="structure" ) {
        console.log('setStageFromState: setDefaultAssembly state.assembly=' + state.assembly);
        strucComp.setDefaultAssembly( state.assembly );
    }
}



var id = "viewport";
render(
    <div id={id} style="width:400px; height:400px;"></div>,
    document.body
);

var initialState = {
    pdbId: "",
    assembly: "",
    assemblyOptions: []
};
