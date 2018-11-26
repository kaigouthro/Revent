import React, { Component } from "react"
import { connect } from "react-redux"
import { compose } from "redux"
import { firestoreConnect } from "react-redux-firebase"
import { Grid } from "semantic-ui-react"

import EventDetailHeader from "./EventDetailHeader"
import EventDetailInfo from "./EventDetailInfo"
import EventDetailChat from "./EventDetailChat"
import EventDetailSidebar from "./EventDetailSidebar"
import { objToArray } from "../../../app/common/utils/helpers"
import { goingToEvent, cancellGoingEvent } from "../../user/userActions"

class EventDetail extends Component {
  render() {
    const { event, auth, goingToEvent, cancellGoingEvent } = this.props
    const attendees = event && event.attendees && objToArray(event.attendees)
    const isHost = event.hostUid === auth.uid
    const isGoing = attendees && attendees.some(a => a.id === auth.uid)

    return (
      <Grid>
        <Grid.Column width={10}>
          <EventDetailHeader
            event={event}
            isHost={isHost}
            isGoing={isGoing}
            goingToEvent={goingToEvent}
            cancellGoingEvent={cancellGoingEvent}
          />
          <EventDetailInfo event={event} />
          <EventDetailChat />
        </Grid.Column>
        <Grid.Column width={6}>
          <EventDetailSidebar attendees={attendees} />
        </Grid.Column>
      </Grid>
    )
  }
}

const mapStateToProps = (
  { firestore: { ordered }, firebase: { auth } },
  ownProps
) => {
  let event = {}
  if (ordered.events && ownProps.match.params) {
    const id = ownProps.match.params.id
    event = ordered.events.find(event => event.id === id)
  }
  return {
    event,
    auth
  }
}

export default compose(
  connect(
    mapStateToProps,
    { goingToEvent, cancellGoingEvent }
  ),
  firestoreConnect([{ collection: "events" }])
)(EventDetail)
