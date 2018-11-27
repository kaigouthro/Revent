import React from "react"
import { Item, Icon, Image } from "semantic-ui-react"

export const getFirstName = fullName => fullName && fullName.split(" ")[0]

export const renderInterests = interests =>
  interests.map((interest, index) => (
    <Item key={index}>
      <Icon name="heart" />
      <Item.Content>{interest}</Item.Content>
    </Item>
  ))

export const renderPhotos = photos =>
  photos && photos.map(photo => <Image key={photo.id} src={photo.url} />)

export const userDetailQuery = ({ auth, userUid }) => {
  if (userUid !== null) {
    return [
      {
        collection: "users",
        doc: userUid,
        storeAs: "profile"
      },
      {
        collection: "users",
        doc: userUid,
        subcollections: [{ collection: "photos" }],
        storeAs: "photos"
      }
    ]
  }

  return [
    {
      collection: "users",
      doc: auth.uid,
      subcollections: [{ collection: "photos" }],
      storeAs: "photos"
    }
  ]
}
