import React, { Component } from "react"
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase"
import { connect } from "react-redux"
import { Grid } from "semantic-ui-react"

import EventList from "../EventList"
import EventActivity from "../EventActivity"
import LoadingSpinner from "../../../app/layout/LoadingSpinner"
import { deleteEvent } from "../eventActions"

class EventDashboard extends Component {
  handleDeleteEvent = eventId => {
    this.props.deleteEvent(eventId)
  }

  render() {
    const { events } = this.props
    if (!isLoaded(events) || isEmpty(events))
      return <LoadingSpinner inverted={true} />

    return (
      <Grid>
        <Grid.Column width={10}>
          <EventList events={events} onDeleteEvent={this.handleDeleteEvent} />
        </Grid.Column>
        <Grid.Column width={6}>
          <EventActivity />
        </Grid.Column>
      </Grid>
    )
  }
}

const mapStateToProps = state => ({
  events: state.firestore.ordered.events
})

export default connect(
  mapStateToProps,
  { deleteEvent }
)(firestoreConnect([{ collection: "events" }])(EventDashboard))
