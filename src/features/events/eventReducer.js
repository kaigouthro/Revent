import {
  CREATE_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT,
  FETCH_EVENTS
} from "./eventContants"
import { createReducer } from "../../app/common/utils/reducerUtil"

const initialState = []

const fetchEvents = (state, payload) => payload.events

const createEvent = (state, payload) => [
  ...state,
  ...state.filter(event => event.id !== payload.eventId)
]

const updateEvent = (state, payload) => [
  ...state.filter(event => event.id !== payload.event.id),
  Object.assign({}, payload.event)
]

const deleteEvent = (state, payload) => [
  ...state.filter(event => event.id !== payload.eventId)
]

export default createReducer(initialState, {
  [CREATE_EVENT]: createEvent,
  [UPDATE_EVENT]: updateEvent,
  [DELETE_EVENT]: deleteEvent,
  [FETCH_EVENTS]: fetchEvents
})
