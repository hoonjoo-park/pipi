import { combineReducers } from 'redux';
import updateUserReducer from './authentication/userUpdate';

const rootReducer = combineReducers({ updateUserReducer });

export default rootReducer;
