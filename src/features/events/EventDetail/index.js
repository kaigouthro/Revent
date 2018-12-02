import React, { Component } from "react"
import { connect } from "react-redux"
import { compose } from "redux"
import { firebaseConnect, withFirestore, isEmpty } from "react-redux-firebase"
import { Grid } from "semantic-ui-react"
import { toastr } from "react-redux-toastr"

import EventDetailHeader from "./EventDetailHeader"
import EventDetailInfo from "./EventDetailInfo"
import EventDetailChat from "./EventDetailChat"
import EventDetailSidebar from "./EventDetailSidebar"
import LoadingSpinner from "../../../app/layout/LoadingSpinner"
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
  state = { initialLoading: true }

  async componentDidMount() {
    const { firestore, match } = this.props
    const event = await firestore.get(`events/${match.params.id}`)
    if (!event.exists) {
      toastr.error("Not found", "This isn't the event you're looking for")
      this.props.history.push("/error")
    }
    await firestore.setListener({ collection: "events", doc: match.params.id })
    this.setState({ initialLoading: false })
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
      loading,
      requesting,
      match
    } = this.props
    const attendees =
      event &&
      event.attendees &&
      objToArray(event.attendees).sort((a, b) => a.joinDate - b.joinDate)
    const isHost = event.hostUid === auth.uid
    const isGoing = attendees && attendees.some(a => a.id === auth.uid)
    const commentTree = !isEmpty(eventChat) && createDataTree(eventChat)
    const authenticated = auth.isLoaded && !auth.isEmpty
    const loadingEvent = requesting[`events/${match.params.id}`]

    if (loadingEvent || this.state.initialLoading) {
      return <LoadingSpinner inverted={true} />
    }

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
  {
    firestore: { ordered, status },
    firebase: { auth, data },
    async: { loading }
  },
  { match }
) => ({
  event: (ordered.events && ordered.events[0]) || {},
  eventChat:
    !isEmpty(data.event_chat) &&
    objectToArray(data.event_chat[match.params.id]),
  auth,
  loading,
  requesting: status.requesting
})

export default compose(
  withFirestore,
  connect(
    mapStateToProps,
    actions
  ),
  firebaseConnect(
    ({ auth, match }) =>
      auth.isLoaded && !auth.isEmpty && [`event_chat/${match.params.id}`]
  )
)(EventDetail)
