import React, { Component } from "react"
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
    const { events, loading } = this.props
    if (loading) return <LoadingSpinner inverted={true} />

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

const mapStateToProps = ({ events, async: { loading } }) => ({
  events,
  loading
})

export default connect(
  mapStateToProps,
  { deleteEvent }
)(EventDashboard)
