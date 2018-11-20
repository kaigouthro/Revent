import { combineReducers } from "redux"
import { reducer as formReducer } from "redux-form"
// import testReducer from "../../features/testArea/testReducer"
import eventReducer from "../../features/events/eventReducer"
import modalReducer from "../../features/modals/modalReducer"
import authReducer from "../../features/auth/authReducer"

const rootReducer = combineReducers({
  // test: testReducer,
  form: formReducer,
  events: eventReducer,
  modals: modalReducer,
  auth: authReducer
})

export default rootReducer
