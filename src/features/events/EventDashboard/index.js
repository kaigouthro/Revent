import React, { Component } from "react"
import cuid from "cuid"
import { Grid, Button } from "semantic-ui-react"

import EventList from "../EventList"
import EventForm from "../EventForm"

import eventsDashboard from "./eventData"

class EventDashboard extends Component {
  state = {
    events: eventsDashboard,
    selectedEvent: null,
    isOpen: false
  }

  handleFormOpen = () => {
    this.setState({
      selectedEvent: null,
      isOpen: true
    })
  }

  handleCancel = () => {
    this.setState({ isOpen: false })
  }

  handleCreateEvent = newEvent => {
    newEvent.id = cuid()
    newEvent.hostPhotoURL = "/assets/user.png"
    const updatedEvent = [...this.state.events, newEvent]

    this.setState({
      events: updatedEvent,
      isOpen: false
    })
  }

  handleUpdateEvent = updatedEvent => {
    const { events } = this.state

    this.setState({
      events: events.map(event =>
        event.id === updatedEvent.id ? Object.assign({}, updatedEvent) : event
      )
    })
  }

  handleViewEvent = eventToView => {
    this.setState({
      isOpen: true,
      selectedEvent: eventToView
    })
  }

  handleDeleteEvent = eventId => {
    const updatedEvent = this.state.events.filter(event => event.id !== eventId)
    this.setState({
      events: updatedEvent
    })
  }

  render() {
    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList
            events={this.state.events}
            onViewEvent={this.handleViewEvent}
            onDeleteEvent={this.handleDeleteEvent}
          />
        </Grid.Column>
        <Grid.Column width={6}>
          <Button
            positive
            content="Create Event"
            onClick={this.handleFormOpen}
          />
          {this.state.isOpen && (
            <EventForm
              selectedEvent={this.state.selectedEvent}
              createEvent={this.handleCreateEvent}
              updateEvent={this.handleUpdateEvent}
              handleCancel={this.handleCancel}
            />
          )}
        </Grid.Column>
      </Grid>
    )
  }
}

export default EventDashboard
