import * as types from "../constants/ActionTypes";

//var data = JSON.parse(localStorage.getItem("Data"));

//var initialState = data ? data : [];
var initialState = {};
var myReducer = (state = initialState, action) => {
  if (action.type === types.SET_DATA_USER) {
    state = action.dataUser;
    return state;
  }
  
  return state;
};
export default myReducer;
