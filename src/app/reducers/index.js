import { combineReducers } from "redux"
import { reducer as formReducer } from "redux-form"
// import testReducer from "../../features/testArea/testReducer"
import eventReducer from "../../features/events/eventReducer"

const rootReducer = combineReducers({
  // test: testReducer,
  form: formReducer,
  events: eventReducer
})

export default rootReducer
