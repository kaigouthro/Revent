import cuid from "cuid"

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
