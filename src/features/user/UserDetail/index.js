import React, { Component } from "react"
import { connect } from "react-redux"
import { compose } from "redux"
import { firestoreConnect, isEmpty } from "react-redux-firebase"
import LoadingSpinner from "../../../app/layout/LoadingSpinner"
import { Grid } from "semantic-ui-react"
import { toastr } from "react-redux-toastr"

import UserDetailEvents from "./UserDetailEvents"
import UserDetailHeader from "./UserDetailHeader"
import UserDetailDescription from "./UserDetailDescription"
import UserDetailSidebar from "./UserDetailSidebar"
import UserDetailPhotos from "./UserDetailPhotos"

import { getUserEvents, followUser, unfollowUser } from "../userActions"
import { userDetailQuery } from "../userDetailQuery"

class UserDetail extends Component {
  async componentDidMount() {
    const { firestore, getUserEvents, match } = this.props
    let user = await firestore.get({
      collection: "users",
      doc: match.params.id
    })
    if (!user.exists) {
      toastr.error("Not found", "This is not the user you're looking for")
      this.props.history.push("/error")
    }
    await getUserEvents(match.params.id)
  }

  changeTab = async (e, { activeIndex }) => {
    const { getUserEvents, match } = this.props
    await getUserEvents(match.params.id, activeIndex)
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
    const isLoading = requesting[`users/${match.params.id}`]
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
