import { combineReducers } from 'redux';
import SetAssembly from './reducer_assembly';

const rootReducer = combineReducers({
    setAssembly: SetAssembly
});

export default rootReducer;