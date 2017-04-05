import { SET_ASSEMBLY, SET_ASSEMBLY_OPTIONS } from '../actions/actions';

export default function(state = [], action) {
    console.log('Action received', action);
    switch (action.type) {
    case SET_ASSEMBLY:
        return Object.assign({}, state, {
            assembly: action.assembly
        });
    case SET_ASSEMBLY_OPTIONS:
        return Object.assign({}, state, {
            assemblyOptions: action.assemblyOptions
        });
    default:
        return state;
    }
}
