import { combineReducers } from "redux";
import user from "./user";
const myReducer = combineReducers({
  user: user
});
export default myReducer;
