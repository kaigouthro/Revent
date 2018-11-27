import React, { Component } from "react"
import { connect } from "react-redux"
import { compose } from "redux"
import { firestoreConnect, isEmpty } from "react-redux-firebase"
import { Link } from "react-router-dom"
import LoadingSpinner from "../../../app/layout/LoadingSpinner"
import format from "date-fns/format"
import {
  Button,
  Grid,
  Header,
  Image,
  Item,
  List,
  Segment
} from "semantic-ui-react"

import {
  userDetailQuery,
  getFirstName,
  renderInterests,
  renderPhotos
} from "./helpers"
import UserDetailEvents from "./UserDetailEvents"
import { getUserEvents } from "../userActions"

class UserDetail extends Component {
  async componentDidMount() {
    const { getUserEvents, userUid } = this.props
    await getUserEvents(userUid)
  }

  render() {
    const { profile, photos, requesting } = this.props
    const isLoading = Object.values(requesting).some(a => a === true)

    if (isLoading) return <LoadingSpinner inverted={true} />

    return (
      <Grid>
        <Grid.Column width={16}>
          <Segment>
            <Item.Group>
              <Item>
                <Item.Image size="small" avatar src={profile.photoURL} />
                <Item.Content>
                  <Header as="h1">{profile.displayName}</Header>
                  <br />
                  <Header as="h3">{profile.occupation}</Header>
                  <br />
                  <Header as="h3">{profile.origin}</Header>
                </Item.Content>
              </Item>
            </Item.Group>
          </Segment>
        </Grid.Column>
        <Grid.Column width={12}>
          <Segment>
            <Grid columns={2}>
              <Grid.Column width={10}>
                <Header
                  icon="smile"
                  content={
                    profile.displayName && getFirstName(profile.displayName)
                  }
                />
                <p>
                  I am a: <strong>{profile.occupation}</strong>
                </p>
                <p>
                  Originally from <strong>{profile.origin}</strong>
                </p>
                <p>
                  Member since:{" "}
                  <strong>{format(profile.createdAt, "dddd Do MMMM")}</strong>
                </p>
                <p>{profile.about}</p>
              </Grid.Column>
              <Grid.Column width={6}>
                <Header icon="heart outline" content="Interests" />
                <List>
                  {profile.interests && renderInterests(profile.interests)}
                </List>
              </Grid.Column>
            </Grid>
          </Segment>
        </Grid.Column>
        <Grid.Column width={4}>
          <Segment>
            <Button
              as={Link}
              to={`/settings/basic`}
              color="teal"
              fluid
              basic
              content="Edit Profile"
            />
          </Segment>
        </Grid.Column>

        <Grid.Column width={12}>
          <Segment attached>
            <Header icon="image" content="Photos" />
            <Image.Group size="small">
              {photos && renderPhotos(photos)}
            </Image.Group>
          </Segment>
        </Grid.Column>

        <UserDetailEvents />
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
    auth: firebase.auth,
    userUid,
    events,
    eventsLoading: async.loading,
    photos: firestore.ordered.photos,
    requesting: firestore.status.requesting
  }
}

export default compose(
  connect(
    mapStateToProps,
    { getUserEvents }
  ),
  firestoreConnect((auth, userUid) => userDetailQuery(auth, userUid))
)(UserDetail)
