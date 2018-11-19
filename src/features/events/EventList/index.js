import React from "react"
import EventListItem from "./EventListItem"

const EventList = ({ events, onDeleteEvent }) => (
  <div>
    <h1>EventList</h1>
    {events.map(event => (
      <EventListItem
        key={event.id}
        event={event}
        onDeleteEvent={onDeleteEvent}
      />
    ))}
  </div>
)

export default EventList
