import * as types from "../constants/ActionTypes";
import fire from "../config/fire";
require("firebase/firestore");
var db = fire.firestore();

export const setUser = dataUser => {
  return {
    type: types.SET_DATA_USER,
    dataUser: dataUser
  };
};

export const getUserBymssv = async (id) => {
  var DataUser = {}
  var docRef = db.collection("students").doc(id);
  await docRef
    .get()
    .then(function (doc) {
      DataUser = doc.data();
    })
  return dispatch => {
    dispatch(getUser(DataUser))
  }
}
export const getUser = (user) => {
  return {
    type: types.GET_DATA_USER,
    user: user
  };
};

