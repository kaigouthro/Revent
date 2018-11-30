import React, { Component } from "react"
import { connect } from "react-redux"
import { compose } from "redux"
import { firebaseConnect, withFirestore, isEmpty } from "react-redux-firebase"
import { Grid } from "semantic-ui-react"

import EventDetailHeader from "./EventDetailHeader"
import EventDetailInfo from "./EventDetailInfo"
import EventDetailChat from "./EventDetailChat"
import EventDetailSidebar from "./EventDetailSidebar"
import {
  objToArray,
  objectToArray,
  createDataTree
} from "../../../app/common/utils/helpers"
import { goingToEvent, cancellGoingEvent } from "../../user/userActions"
import { addEventComment } from "../eventActions"
import { openModal } from "../../modals/modalActions"

const actions = {
  goingToEvent,
  cancellGoingEvent,
  addEventComment,
  openModal
}
class EventDetail extends Component {
  async componentDidMount() {
    const { firestore, match } = this.props
    await firestore.setListener({ collection: "events", doc: match.params.id })
  }

  async componentWillUnmount() {
    const { firestore, match } = this.props
    await firestore.unsetListener({
      collection: "events",
      doc: match.params.id
    })
  }

  render() {
    const {
      event,
      auth,
      goingToEvent,
      cancellGoingEvent,
      addEventComment,
      eventChat,
      openModal,
      loading
    } = this.props
    const attendees = event && event.attendees && objToArray(event.attendees)
    const isHost = event.hostUid === auth.uid
    const isGoing = attendees && attendees.some(a => a.id === auth.uid)
    const commentTree = !isEmpty(eventChat) && createDataTree(eventChat)
    const authenticated = auth.isLoaded && !auth.isEmpty

    return (
      <Grid>
        <Grid.Column width={10}>
          <EventDetailHeader
            event={event}
            isHost={isHost}
            isGoing={isGoing}
            loading={loading}
            authenticated={authenticated}
            openModal={openModal}
            goingToEvent={goingToEvent}
            cancellGoingEvent={cancellGoingEvent}
          />
          <EventDetailInfo event={event} />
          <EventDetailChat
            eventChat={commentTree}
            eventId={event.id}
            addEventComment={addEventComment}
          />
        </Grid.Column>
        <Grid.Column width={6}>
          <EventDetailSidebar attendees={attendees} />
        </Grid.Column>
      </Grid>
    )
  }
}

const mapStateToProps = (
  { firestore: { ordered }, firebase: { auth, data }, async: { loading } },
  { match }
) => ({
  event: (ordered.events && ordered.events[0]) || {},
  eventChat:
    !isEmpty(data.event_chat) &&
    objectToArray(data.event_chat[match.params.id]),
  auth,
  loading
})

export default compose(
  withFirestore,
  connect(
    mapStateToProps,
    actions
  ),
  firebaseConnect(({ match }) => [`event_chat/${match.params.id}`])
)(EventDetail)
