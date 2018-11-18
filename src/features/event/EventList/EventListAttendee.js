import React from "react"
import { List, Image } from "semantic-ui-react"

const EventListAttendee = ({ attendee }) => (
  <List>
    <List.Item>
      <Image as="a" circular src={attendee.photoURL} />
    </List.Item>
  </List>
)

export default EventListAttendee
