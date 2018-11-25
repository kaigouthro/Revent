import {
  CREATE_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT,
  FETCH_EVENTS
} from "./eventContants"
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from "../async/asyncActions"

import { fetchEventData } from "../../app/data/mockApi"
import { toastr } from "react-redux-toastr"

export const fetchEvents = events => ({
  type: FETCH_EVENTS,
  payload: events
})

export const createEvent = event => async dispatch => {
  try {
    dispatch({
      type: CREATE_EVENT,
      payload: { event }
    })
    toastr.success("Success!", "Event successfully created")
  } catch (err) {
    console.log(err)
    toastr.error("Oops!", "Something went wrong")
  }
}

export const updateEvent = event => async dispatch => {
  try {
    dispatch({
      type: UPDATE_EVENT,
      payload: { event }
    })
    toastr.success("Success!", "Event successfully updated")
  } catch (err) {
    console.log(err)
    toastr.error("Oops!", "Something went wrong")
  }
}

export const deleteEvent = eventId => ({
  type: DELETE_EVENT,
  payload: { eventId }
})

export const loadEvents = () => async dispatch => {
  try {
    dispatch(asyncActionStart())
    let events = await fetchEventData()
    dispatch(fetchEvents(events))
    dispatch(asyncActionFinish())
  } catch (err) {
    console.log(err)
    dispatch(asyncActionError())
  }
}

export const cancelToggle = (cancelled, eventId) => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore()
  const message = cancelled
    ? "Are you sure you want to cancell the event?"
    : "The event will be reactive - are you sure?"

  try {
    toastr.confirm(message, {
      onOk: () => firestore.update(`events/${eventId}`, { cancelled })
    })
  } catch (error) {
    console.error(error)
  }
}
