import { FETCH_EVENTS } from "./eventContants"
import moment from "moment"
import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from "../async/asyncActions"

import { fetchEventData } from "../../app/data/mockApi"
import { toastr } from "react-redux-toastr"
import compareAsc from "date-fns/compare_asc"
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
  if (event.date !== getState().firestore.ordered.events[0].date) {
    event.date = moment(event.date).toDate()
  }

  try {
    dispatch(asyncActionStart())
    let eventDocRef = firestore.collection("events").doc(event.id)
    let dateEqual = compareAsc(
      getState().firestore.ordered.events[0].date,
      event.date
    )
    if (dateEqual !== 0) {
      let batch = firestore.batch()
      await batch.update(eventDocRef, event)

      let eventAttendeeRef = firestore.collection("event_attendees")
      let eventAttendeeQuery = await eventAttendeeRef.where(
        "eventId",
        "==",
        event.id
      )
      let eventAttendeeQuerySnap = await eventAttendeeQuery.get()
      for (let doc in eventAttendeeQuerySnap.docs) {
        let eventAttendeeDocRef = await firestore
          .collection("event_attendees")
          .doc(eventAttendeeQuerySnap.docs[doc].id)

        await batch.update(eventAttendeeDocRef, {
          eventDate: event.date
        })
      }
      await batch.commit()
    } else {
      await eventDocRef.update(event)
    }

    dispatch(asyncActionFinish())
    toastr.success("Success!", "Event successfully updated")
  } catch (err) {
    console.log(err)
    dispatch(asyncActionError())
    toastr.error("Oops!", "Something went wrong")
  }
}

export const getEventsForDashboard = lastEvent => async (
  dispatch,
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

export const addEventComment = (eventId, values, parentId) => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase()
  const profile = getState().firebase.profile
  const user = getState().firebase.auth

  let newComment = {
    parentId,
    displayName: profile.displayName,
    photoURL: process.photoURL || "/assets/user.png",
    uid: user.uid,
    text: values.comment,
    date: Date.now()
  }
  try {
    await firebase.push(`event_chat/${eventId}`, newComment)
  } catch (error) {
    console.log(error)
    toastr.error("Oops!", "Problem adding comment")
  }
}
