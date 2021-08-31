import {applyMiddleware, combineReducers, createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import listingsReducer from "./reducers/listingsReducer";
import thunk from "redux-thunk";
import bidsReducer from "./reducers/bidsReducer";

const rootReducer = combineReducers({
    listingsReducer, bidsReducer
})
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))
export default store