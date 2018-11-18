import React, { Component } from "react"
import EventListItem from "./EventListItem"

const EventList = ({ events }) => (
	<div>
		<h1>EventList</h1>
		{events.map((event) => <EventListItem key={event.id} event={event} />)}
	</div>
)

export default EventList
