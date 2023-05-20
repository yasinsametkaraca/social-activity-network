import {applyMiddleware, createStore} from "redux";
import rootReducer from "./rootReducer";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";



const initialState = {

};

export function configureStore(){
    return createStore(rootReducer,initialState,composeWithDevTools(applyMiddleware(thunk)));
}
