import cuid from "cuid"
import { toastr } from "react-redux-toastr"

import { FETCH_EVENTS } from "../events/eventContants"

import {
  asyncActionStart,
  asyncActionFinish,
  asyncActionError
} from "../async/asyncActions"

export const updateProfileImage = (file, fileName) => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const imageName = cuid()
  const firebase = getFirebase()
  const firestore = getFirestore()
  const user = firebase.auth().currentUser
  const path = `${user.uid}/user_images`
  const options = {
    name: imageName
  }

  try {
    dispatch(asyncActionStart())
    // update the image file to firebase storage
    let uploadedFile = await firebase.uploadFile(path, file, null, options)
    // get url of the image after uploaded
    let downloadURL = await uploadedFile.uploadTaskSnapshot.downloadURL
    // get userdoc from firebase using firestore obj
    let useDoc = await firestore.get(`users/${user.uid}`)
    // check if user not has a photo, update profile with new image (photoURL field)
    if (!useDoc.data().photoURL) {
      await user.updateProfile({ photoURL: downloadURL })
    }
    // add new photo to photos collection
    await firestore.add(
      {
        collection: "users",
        doc: user.uid,
        subcollections: [{ collection: "photos" }]
      },
      {
        name: imageName,
        url: downloadURL
      }
    )
    dispatch(asyncActionFinish())
  } catch (error) {
    console.log(error)
    dispatch(asyncActionError())
    throw new Error("Problem with uploading photos")
  }
}

export const deletePhoto = photo => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase()
  const firestore = getFirestore()
  const user = firebase.auth().currentUser
  try {
    // delete user image from storage
    await firebase.deleteFile(`${user.uid}/user_images/${photo.name}`)
    // delete image from collections image of user
    await firestore.delete({
      collection: "users",
      doc: user.uid,
      subcollections: [{ collection: "photos", doc: photo.id }]
    })
  } catch (error) {
    console.log(error)
    throw new Error("Problem during deleting the photo")
  }
}

export const setMainPhoto = photo => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase()
  try {
    return await firebase.updateProfile({
      photoURL: photo.url
    })
  } catch (error) {
    console.log(error)
    throw new Error("Problem set the main photo")
  }
}

export const goingToEvent = event => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase()
  const firestore = getFirestore()
  const user = firebase.auth().currentUser
  const photoURL = getState().firebase.profile.photoURL
  const attendee = {
    displayName: user.displayName,
    going: true,
    host: false,
    joinDate: Date.now(),
    photoURL: photoURL || "/assets/user.png"
  }

  try {
    await firestore.update(`events/${event.id}`, {
      [`attendees.${user.uid}`]: attendee
    })
    await firestore.set(`event_attendees/${event.id}_${user.uid}`, {
      eventId: event.id,
      userUid: user.uid,
      eventDate: event.date,
      host: false
    })
    toastr.success("Success", "You have signed up for the event")
  } catch (error) {
    console.log(error)
    toastr.error("Oops!", "Problem signing up to the even")
  }
}

export const cancellGoingEvent = event => async (
  dispatch,
  getState,
  { getFirebase, getFirestore }
) => {
  const firebase = getFirebase()
  const firestore = getFirestore()
  const user = firebase.auth().currentUser

  try {
    await firestore.update(`events/${event.id}`, {
      [`attendees.${user.uid}`]: firestore.FieldValue.delete()
    })
    await firestore.delete(`event_attendees/${event.id}_${user.uid}`)
    toastr.success(
      "Success",
      "You're successfully removed yourself from the event"
    )
  } catch (error) {
    console.log(error)
    toastr.error("Oops!", "Something went wrong")
  }
}

export const getUserEvents = (userUid, activeTab) => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  dispatch(asyncActionStart())
  const firestore = getFirestore()
  const today = new Date(Date.now())
  let eventsRef = firestore.collection("event_attendees")
  let query

  switch (activeTab) {
    case 1: // past events
      query = eventsRef
        .where("userUid", "==", userUid)
        .where("eventDate", "<=", today)
        .orderBy("eventDate", "desc")
      break
    case 2: // future events
      query = eventsRef
        .where("userUid", "==", userUid)
        .where("eventDate", ">=", today)
        .orderBy("eventDate")
      break
    case 3: // hosted events
      query = eventsRef
        .where("userUid", "==", userUid)
        .where("host", "==", true)
        .orderBy("eventDate", "desc")
      break
    default:
      query = eventsRef
        .where("userUid", "==", userUid)
        .orderBy("eventDate", "desc")
      console.log(query)
      break
  }

  try {
    let querySnapshot = await query.get()
    let events = []

    for (let doc in querySnapshot.docs) {
      let event = await firestore
        .collection("events")
        .doc(querySnapshot.docs[doc].data().eventId)
        .get()

      events.push({ ...event.data(), id: event.id })
    }

    dispatch({ type: FETCH_EVENTS, payload: { events } })
    dispatch(asyncActionFinish())
  } catch (error) {
    console.log(error)
    dispatch(asyncActionError())
  }
}

export const followUser = profile => {}

export const unfollowUser = profile => {}
