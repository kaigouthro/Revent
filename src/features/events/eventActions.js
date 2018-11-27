import { FETCH_EVENTS } from "./eventContants"
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

export const getEventsForDashboard = lastEvent => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  let today = new Date(Date.now())
  const firestore = getFirestore()
  const eventsRefs = firestore.collection("events")

  try {
    dispatch(asyncActionStart())
    let startAfter =
      lastEvent &&
      (await firestore
        .collection("events")
        .doc(lastEvent.id)
        .get())
    let query = lastEvent
      ? eventsRefs
          .where("date", ">=", today)
          .orderBy("date")
          .startAfter(startAfter)
          .limit(2)
      : eventsRefs
          .where("date", ">=", today)
          .orderBy("date")
          .limit(2)
    let querySnapshot = await query.get()
    if (querySnapshot.docs.length === 0) {
      dispatch(asyncActionFinish())
      return querySnapshot
    }

    let events = []

    for (let doc in querySnapshot.docs) {
      let event = {
        ...querySnapshot.docs[doc].data(),
        id: querySnapshot.docs[doc].id
      }
      events.push(event)
    }

    dispatch({ type: FETCH_EVENTS, payload: { events } })
    dispatch(asyncActionFinish())
    return querySnapshot
  } catch (error) {
    console.log(error)
    dispatch(asyncActionError())
  }
}

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
