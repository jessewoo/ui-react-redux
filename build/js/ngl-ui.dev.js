(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('redux'), require('preact'), require('ngl')) :
	typeof define === 'function' && define.amd ? define(['redux', 'preact', 'ngl'], factory) :
	(factory(global.Redux,global.preact,global.NGL));
}(this, (function (redux,preact,NGL) { 'use strict';

NGL = 'default' in NGL ? NGL['default'] : NGL;

var SET_STRUCTURE = 'SET_STRUCTURE';
var SET_ASSEMBLY = 'SET_ASSEMBLY';
var SET_ASSEMBLY_OPTIONS = 'SET_ASSEMBLY_OPTIONS';
var SET_COLOR = 'SET_COLOR';
var SET_STYLE = 'SET_STYLE';

console.log("ACTIONS file passed thru");



var setAssembly = function (assembly) {
    console.log("ACTIONS: " + assembly);
    return {
        type: SET_ASSEMBLY,
        assembly: assembly
    };
};

var setColor = function (color) {
    console.log("ACTIONS: " + color);
    return {
        type: SET_COLOR,
        color: color
    };
};

var setStyle = function (style) {
    console.log("ACTIONS: " + style);
    return {
        type: SET_STYLE,
        style: style
    };
};

var setAssemblyOptions = function (structure) {
    console.log("Dispatching Set Assembly Options");
    var options = [];
    var biomolDict = structure.biomolDict;
    if( !structure.unitcell && Object.keys( biomolDict ).length === 1 &&
        biomolDict[ "BU1" ] && biomolDict[ "BU1" ].isIdentity( structure )
    ) {
        // don't add an entry for "Asymmetric Unit" / "Full Structure" as
        // there is only one bioassembly with an identity transform on all chains
        options.push({
            value: "BU1",
            label: "Full Structure"
        });
    } else {
        options.push({
            value: "__AU",
            label: structure.unitcell ? "Asymmetric Unit" : "Full Structure"
        });
        for( var name in biomolDict ){
            if( name === "UNITCELL" ) {
                options.push({
                    value: name,
                    label: "Unitcell"
                });
            }else if( name === "SUPERCELL" ) {
                options.push({
                    value: name,
                    label: "Supercell"
                });
            }else if( name.substr( 0, 2 ) === "BU" ) {
                options.push({
                    value: name,
                    label: "Bioassembly " + name.substr( 2 )
                });
            }else{
                options.push({
                    value: name,
                    label: name
                });
            }
        }
    }
    return {
        type: SET_ASSEMBLY_OPTIONS,
        assemblyOptions: options
    };
};

// return querystring parameter by name
function getQueryStringParameterByName(name) {
    var href = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(href);
    //if (!results) return null;
    if (!results) { return ''; }  // return empty string so we don't have to check for null
    if (!results[2]) { return ''; }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// TODO: Break up into different files
var Header = (function (Component$$1) {
    function Header () {
        Component$$1.apply(this, arguments);
    }

    if ( Component$$1 ) Header.__proto__ = Component$$1;
    Header.prototype = Object.create( Component$$1 && Component$$1.prototype );
    Header.prototype.constructor = Header;

    Header.prototype.render = function render$$1 () {
        var store = this.props.store;
        var storeState = store.getState();
        console.log("------------ HEADER SET -------------");
        console.log(storeState);
        return (
            preact.h( 'div', null,
                preact.h( 'h1', null, storeState.pdbId ),
                preact.h( 'h4', null, storeState.structureTitle )
            )
        );
    };

    return Header;
}(preact.Component));

// Display Options Panel
var DisplayOptions = (function (Component$$1) {
    function DisplayOptions () {
        Component$$1.apply(this, arguments);
    }

    if ( Component$$1 ) DisplayOptions.__proto__ = Component$$1;
    DisplayOptions.prototype = Object.create( Component$$1 && Component$$1.prototype );
    DisplayOptions.prototype.constructor = DisplayOptions;

    DisplayOptions.prototype.render = function render$$1 () {
        var store = this.props.store;
        var storeState = store.getState();
        console.log("------------ DISPLAY OPTIONS -------------");
        console.log(storeState);

        // Uses the SelectGroup class to generate dropdown selection
        return (
            preact.h( 'div', { className: 'form-horizontal' },
                preact.h( SelectGroup, {
                    label: 'Assembly', name: 'assembly', options: storeState.assemblyOptions, selected: storeState.assembly, onChange: store.dispatch, action: setAssembly }),
                preact.h( SelectGroup, {
                    label: 'Color', name: 'color', options: storeState.colorOptions, selected: storeState.color, onChange: store.dispatch, action: setColor }),
                preact.h( SelectGroup, {
                    label: 'Style', name: 'style', options: storeState.styleOptions, selected: storeState.style, onChange: store.dispatch, action: setStyle })
            )
        );
    };

    return DisplayOptions;
}(preact.Component));

// A Select Group from Display Options
// TODO: Programatically subscribe to updates to NGL
var SelectGroup = (function (Component$$1) {
    function SelectGroup () {
        Component$$1.apply(this, arguments);
    }

    if ( Component$$1 ) SelectGroup.__proto__ = Component$$1;
    SelectGroup.prototype = Object.create( Component$$1 && Component$$1.prototype );
    SelectGroup.prototype.constructor = SelectGroup;

    SelectGroup.prototype.handleChange = function handleChange (e) {
        var ref = this.props;
        var onChange = ref.onChange;
        var action = ref.action;
        onChange(action(e.target.value));
    };
    SelectGroup.prototype.render = function render$$1 () {
        // Arguments supplied by SelectGroup component
        var ref = this.props;
        var label = ref.label;
        var name = ref.name;
        var options = ref.options;
        var selected = ref.selected;
        // Push options into an array
        var optionsList = [];

        console.log('***** ' + label + ' selected: ' + selected + ' ******');
        console.log(options);

        // Loop thru each Options
        options.forEach(function (option) {
            optionsList.push(
                preact.h( Option, {
                    option: option, selected: selected })
            );
        });

        return (
            preact.h( 'div', { className: 'form-group' },
                preact.h( 'label', { className: 'col-sm-5 control-label', for: name + 'Select' },
                    label
                ),
                preact.h( 'div', { class: 'col-sm-7' },
                    preact.h( 'select', { onChange: this.handleChange.bind(this), className: 'form-control input-sm' },
                        optionsList
                    )
                )
            )
        );
    };

    return SelectGroup;
}(preact.Component));

// List of Options from Select Group
var Option = (function (Component$$1) {
    function Option () {
        Component$$1.apply(this, arguments);
    }

    if ( Component$$1 ) Option.__proto__ = Component$$1;
    Option.prototype = Object.create( Component$$1 && Component$$1.prototype );
    Option.prototype.constructor = Option;

    Option.prototype.render = function render$$1 () {
        var ref = this.props;
        var option = ref.option;
        var selected = ref.selected;
        console.log('++++++ Selected: ' + selected + ' ++++++');
        // Ternary operator
        var isSelected = (option.value === selected) ? 'selected' : null;
        return (
            preact.h( 'option', { selected: isSelected, value: option.value },
                option.label
            )
        );
    };

    return Option;
}(preact.Component));

function app(state, action) {
    console.log('REDUCERS FIRED OFF. OLD STATE');
    console.log(state);
    console.log('action.type=' + action.type);

    switch (action.type) {
        // Defined in initialState - but may be needed if we want to load a different structure
        case SET_STRUCTURE:
            return Object.assign({}, state, {
                pdbId: action.pdbId
            });

        case SET_ASSEMBLY:
            return Object.assign({}, state, {
                assembly: action.assembly
            });
        case SET_ASSEMBLY_OPTIONS:
            return Object.assign({}, state, {
                assemblyOptions: action.assemblyOptions
            });

        case SET_COLOR:
            return Object.assign({}, state, {
                color: action.color
            });

        case SET_STYLE:
            return Object.assign({}, state, {
                style: action.style
            });
        // Cases like: @@redux/INIT
        default:
            return state;
    }
}

var structureComponent;
var cartoonRepr;
var sphereRepr;
var surfaceRepr;
var ligandRepr;
var ligandSphereRepr;
var ligandSurfaceRepr;
var currentColorScheme = 'rainbow';
var currentStyle = 'cartoon';
var currentSpin = false;
var atomCount;
var instanceCount;
var ligandSele = "";

function initRepr(_structureComponent, groupNames) {
    structureComponent = _structureComponent;
    if (structureComponent.structure.biomolDict["BU1"]) {
        var assembly = structureComponent.structure.biomolDict["BU1"];
        atomCount = assembly.getAtomCount(structureComponent.structure);
        instanceCount = assembly.getInstanceCount();
    } else {
        atomCount = structureComponent.structure.getModelProxy(0).atomCount;
        instanceCount = 1;
    }

    // feature mostly only available on phones/tablets
    if (typeof window.orientation !== 'undefined') {
        atomCount *= 4;  // bump atomCount which is used for deciding quality level
    }
    //
    ligandSele = 'none';
    if (groupNames) {
        groupNames = groupNames.split(/,\s*/);
        if (groupNames.length) {
            ligandSele = '[' + groupNames.join('] OR [') + ']';
        }
    }
    //
    initLigand();
    initSpheres();
    initCartoon();
    initSurface();

    // Set Style and Spin
    setStyle$1(currentStyle);
    setSpin(currentSpin);
    colorRainbow();
}

// init representations
function initLigand() {
    ligandRepr = structureComponent.addRepresentation('ball+stick', {
        color: 'element',
        scale: 3.0,
        aspectRatio: 1.3,
        sele: ligandSele,
        visible: false,
        lazy: true
    });
}
function initSpheres() {
    var quality = atomCount < 15000 ? "medium" : "low";
    sphereRepr = structureComponent.addRepresentation('spacefill', {
        colorScheme: currentColorScheme,
        colorScale: 'RdYlBu',
        quality: quality,
        sele: 'polymer',
        visible: false,
        lazy: true
    });
    //
    ligandSphereRepr = structureComponent.addRepresentation('spacefill', {
        color: 'element',
        sele: ligandSele,
        visible: false,
        lazy: true
    });
}
function initCartoon() {
    var quality = "low";
    if (atomCount < 15000) {
        quality = "high";
    } else if (atomCount < 70000) {
        quality = "medium";
    }
    cartoonRepr = structureComponent.addRepresentation('cartoon', {
        colorScheme: currentColorScheme,
        colorScale: 'RdYlBu',
        aspectRatio: 5,
        scale: 0.7,
        quality: quality,
        visible: false,
        lazy: true
    });
}
function initSurface() {
    surfaceRepr = structureComponent.addRepresentation('surface', {
        colorScheme: currentColorScheme,
        colorScale: 'RdYlBu',
        surfaceType: "sas",
        probeRadius: 1.4,
        scaleFactor: Math.min(1.5, Math.max(0.1, 20000 / atomCount)),
        sele: 'polymer',
        visible: false,
        lazy: true
    });
    ligandSurfaceRepr = structureComponent.addRepresentation('surface', {
        colorScheme: 'element',
        surfaceType: "sas",
        probeRadius: 1.4,
        scaleFactor: Math.min(1.5, Math.max(0.1, 20000 / atomCount)),
        sele: ligandSele,
        visible: false,
        lazy: true
    });
}

function styleSpheres() {
    sphereRepr.setVisibility(true);
    cartoonRepr.setVisibility(false);
    surfaceRepr.setVisibility(false);
    ligandRepr.setVisibility(false);
    ligandSurfaceRepr.setVisibility(false);
    ligandSphereRepr.setVisibility(true);
}
function styleCartoon() {
    sphereRepr.setVisibility(false);
    cartoonRepr.setVisibility(true);
    surfaceRepr.setVisibility(false);
    ligandRepr.setVisibility(true);
    ligandSurfaceRepr.setVisibility(false);
    ligandSphereRepr.setVisibility(false);
}
function styleSurface() {
    sphereRepr.setVisibility(false);
    cartoonRepr.setVisibility(false);
    surfaceRepr.setVisibility(true);
    ligandRepr.setVisibility(false);
    ligandSurfaceRepr.setVisibility(true);
    ligandSphereRepr.setVisibility(false);
}

// set color schemes
function colorRainbow() {
    var p = {colorScheme: 'residueindex', colorScale: 'RdYlBu'};
    cartoonRepr.setParameters(p);
    sphereRepr.setParameters(p);
    surfaceRepr.setParameters(p);
    currentColorScheme = 'residueindex';
    console.log('colorRainbow(): currentColorScheme=' + currentColorScheme);
}
function colorSecondaryStructure() {
    var p = {colorScheme: 'sstruc'};
    cartoonRepr.setParameters(p);
    sphereRepr.setParameters(p);
    surfaceRepr.setParameters(p);
    currentColorScheme = 'sstruc';
    console.log('colorSecondaryStructure(): currentColorScheme=' + currentColorScheme);
}
function colorChain() {
    var p = {colorScheme: 'chainindex'};
    cartoonRepr.setParameters(p);
    sphereRepr.setParameters(p);
    surfaceRepr.setParameters(p);
    currentColorScheme = 'chainindex';
    console.log('colorChain(): currentColorScheme=' + currentColorScheme);
}


// added for ngl-ui
function setColor$1(color) {
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
        // stage.setSpin([0, 1, 0], 0.005);
    } else if (spin === false) {
        // stage.setSpin(null, null);
    }
    currentSpin = spin;
}

// set styles
function setStyle$1(style) {
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

// Subscribe > Action > Reducer > Component
// Kick start the initialization process
init();

function init() {
    // Get the pdbId from the parameterString or set a default pdbId
    var pdbId = (getQueryStringParameterByName('pdbId') !== '') ? getQueryStringParameterByName('pdbId') : '4cup';

    // Set the NGL Stage, argument is the id of HTML element
    var stage = new NGL.Stage('viewport');
    console.log('********** NGL stage created **********');

    // NGL remove all component, load file
    stage.removeAllComponents();

    // Promise resolves to 'StructureComponent'
    stage.loadFile( "rcsb://" + pdbId, {
            defaultRepresentation: true
        } ).then( function( _structureComponent ) {
            // Utilizing the return promise
            var structureComponent = _structureComponent;
            console.log(structureComponent);

            // Function initRepr() - returns console logs
            initRepr(structureComponent, null);

            // Set Initial State for Redux STORE
            // TODO this could be combined with setAssemblyOptions
            var initialState = {
                pdbId: pdbId,
                structureTitle: structureComponent.structure.title,
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

            // Creates a REDUX store that holds the complete state tree of app
            // createStore(reducer, [preloadedState])

            // Go to reducers.js
            console.log('********* Store created with the initialState being 2nd variable **********');
            var store = redux.createStore(app, initialState);
            console.log('********* Store creation DONE **********');


            // Dispatching the action: setAssemblyOptions
            store.dispatch(
                setAssemblyOptions(structureComponent.structure)
            );

            console.log('The assembly options for the specific PDB ID');
            console.log(store.getState().assemblyOptions);

            // Any change in STATE will trigger call to update NGL stage
            store.subscribe(function () {
                updateStageFromReduxStore(structureComponent, store);
            });


            // Render the UI in index.html
            initUi(store);
    });
}

// Initialize the UI, second argument is the id of the HTML structure
function initUi (store) {

    // Rendering React components to root DOM node
    var header = document.getElementById('header');
    var displayOptions = document.getElementById('displayOptions');

    // id, title stored into this.props in Header component
    preact.render(
        preact.h( Header, { store: store }), header
    );
    // Using the store
    preact.render(
        preact.h( DisplayOptions, { store: store }), displayOptions
    );
}

// Function to update the NGL STAGE whenever REDUX state changes
function updateStageFromReduxStore(structureComponent, store) {

    console.log('UPDATING NGL STAGE WITH REDUX STORE. USING NEW STATE');
    console.log(store.getState());

    // NGL structure component, using functions in ngl-script.js
    if ( structureComponent && structureComponent.type==="structure" ) {

        // Set Assembly, Color, Style
        structureComponent.setDefaultAssembly( store.getState().assembly );
        setColor$1(store.getState().color);
        setStyle$1(store.getState().style);

    }
}

})));
//# sourceMappingURL=ngl-ui.dev.js.map
