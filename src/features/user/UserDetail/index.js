import React, { Component } from "react"
import { connect } from "react-redux"
import { compose } from "redux"
import { firestoreConnect, isEmpty } from "react-redux-firebase"
import LoadingSpinner from "../../../app/layout/LoadingSpinner"
import { Grid } from "semantic-ui-react"

import UserDetailEvents from "./UserDetailEvents"
import UserDetailHeader from "./UserDetailHeader"
import UserDetailDescription from "./UserDetailDescription"
import UserDetailSidebar from "./UserDetailSidebar"
import UserDetailPhotos from "./UserDetailPhotos"

import { getUserEvents, followUser, unfollowUser } from "../userActions"
import { userDetailQuery } from "../userDetailQuery"

class UserDetail extends Component {
  async componentDidMount() {
    const { getUserEvents, auth, match } = this.props
    if (auth.uid === match.params.id) {
      await getUserEvents(auth.uid)
    } else {
      await getUserEvents(match.params.id)
    }
  }

  changeTab = async (e, { activeIndex }) => {
    const { getUserEvents, auth, match } = this.props
    if (auth.uid === match.params.id) {
      await getUserEvents(auth.uid, activeIndex)
    } else {
      await getUserEvents(match.params.id, activeIndex)
    }
  }

  render() {
    const {
      auth,
      profile,
      photos,
      requesting,
      match,
      events,
      following,
      followUser,
      unfollowUser,
      eventsLoading
    } = this.props
    const isCurrentUser = auth.uid === match.params.id
    const isLoading = Object.values(requesting).some(a => a === true)
    const isFollowing = !isEmpty(following)

    if (isLoading) return <LoadingSpinner inverted={true} />

    return (
      <Grid>
        <UserDetailHeader profile={profile} />
        <UserDetailDescription profile={profile} />
        <UserDetailSidebar
          isCurrentUser={isCurrentUser}
          profile={profile}
          isFollowing={isFollowing}
          followUser={followUser}
          unfollowUser={unfollowUser}
        />
        <UserDetailPhotos photos={photos} />
        <UserDetailEvents
          events={events}
          eventsLoading={eventsLoading}
          changeTab={this.changeTab}
        />
      </Grid>
    )
  }
}

const mapStateToProps = ({ firebase, firestore, events, async }, { match }) => {
  let userUid = null
  let profile = {}

  if (match.params.id === firebase.auth.uid) {
    profile = firebase.profile
  } else {
    profile =
      !isEmpty(firestore.ordered.profile) && firestore.ordered.profile[0]
    userUid = match.params.id
  }

  return {
    profile,
    userUid,
    events,
    auth: firebase.auth,
    eventsLoading: async.loading,
    photos: firestore.ordered.photos,
    following: firestore.ordered.following,
    requesting: firestore.status.requesting
  }
}

export default compose(
  connect(
    mapStateToProps,
    { getUserEvents, followUser, unfollowUser }
  ),
  firestoreConnect(props => userDetailQuery(props))
)(UserDetail)
