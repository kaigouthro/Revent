import { DELETE_EVENT, FETCH_EVENTS } from "./eventContants"
import moment from "moment"
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from "../async/asyncActions"

import { fetchEventData } from "../../app/data/mockApi"
import { toastr } from "react-redux-toastr"
import { createNewEvent } from "../../app/common/utils/helpers"

export const fetchEvents = events => ({
  type: FETCH_EVENTS,
  payload: events
})

export const createEvent = event => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase()
  const firestore = getFirestore()
  const user = firebase.auth().currentUser
  const photoURL = getState().firebase.profile.photoURL
  let newEvent = createNewEvent(user, photoURL, event)

  try {
    const createdEvent = await firestore.add("events", newEvent)
    await firestore.set(`event_attendees/${createdEvent.id}_${user.uid}`, {
      eventId: createdEvent.id,
      userUid: user.uid,
      eventDate: event.date,
      host: true
    })
    toastr.success("Success!", "Event successfully creaed")
  } catch (err) {
    console.log(err)
    toastr.error("Oops!", "Something went wrong")
  }
}

export const updateEvent = event => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firestore = getFirestore()
  // check new event date difference last event date from the state firestore, if diff update
  const lastEvent = getState().firestore.ordered.events.find(
    e => e.id === event.id
  )
  if (event.date !== lastEvent.date) {
    event.date = moment(event.date).toDate()
  }
  try {
    await firestore.update(`events/${event.id}`, event)
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
