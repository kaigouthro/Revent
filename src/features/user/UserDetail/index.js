import React, { Component } from "react"
import { connect } from "react-redux"
import { compose } from "redux"
import { firestoreConnect } from "react-redux-firebase"
import { Link } from "react-router-dom"
import format from "date-fns/format"
import {
  Button,
  Card,
  Grid,
  Header,
  Image,
  Item,
  List,
  Menu,
  Segment
} from "semantic-ui-react"

import helperFunctions from "./helpers"
const { getFirstName, renderInterests, query, renderPhotos } = helperFunctions

class UserDetail extends Component {
  render() {
    const {
      profile: {
        displayName,
        occupation,
        origin,
        photoURL,
        createdAt,
        about,
        interests
      },
      photos
    } = this.props
    return (
      <Grid>
        <Grid.Column width={16}>
          <Segment>
            <Item.Group>
              <Item>
                <Item.Image size="small" avatar src={photoURL} />
                <Item.Content>
                  <Header as="h1">{displayName}</Header>
                  <br />
                  <Header as="h3">{occupation}</Header>
                  <br />
                  <Header as="h3">{origin}</Header>
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
                  content={displayName && getFirstName(displayName)}
                />
                <p>
                  I am a: <strong>{occupation}</strong>
                </p>
                <p>
                  Originally from <strong>{origin}</strong>
                </p>
                <p>
                  Member since:{" "}
                  <strong>{format(createdAt, "dddd Do MMMM")}</strong>
                </p>
                <p>{about}</p>
              </Grid.Column>
              <Grid.Column width={6}>
                <Header icon="heart outline" content="Interests" />
                <List>{interests && renderInterests(interests)}</List>
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

        <Grid.Column width={12}>
          <Segment attached>
            <Header icon="calendar" content="Events" />
            <Menu secondary pointing>
              <Menu.Item name="All Event" active />
              <Menu.Item name="Past Event" />
              <Menu.Item name="Future Event" />
              <Menu.Item name="Events Hosted" />
            </Menu>

            <Card.Group itemsPerRow={5}>
              <Card>
                <Image src={"/assets/categoryImages/drinks.jpg"} />
                <Card.Content>
                  <Card.Header textAlign="center">Event Title</Card.Header>
                  <Card.Meta textAlign="center">
                    28th March 2018 at 10:00 PM
                  </Card.Meta>
                </Card.Content>
              </Card>
              <Card>
                <Image src={"/assets/categoryImages/drinks.jpg"} />
                <Card.Content>
                  <Card.Header textAlign="center">Event Title</Card.Header>
                  <Card.Meta textAlign="center">
                    28th March 2018 at 10:00 PM
                  </Card.Meta>
                </Card.Content>
              </Card>
            </Card.Group>
          </Segment>
        </Grid.Column>
      </Grid>
    )
  }
}

const mapStateToProps = ({ firebase, firestore }) => ({
  auth: firebase.auth,
  profile: firebase.profile,
  photos: firestore.ordered.photos
})

export default compose(
  connect(mapStateToProps),
  firestoreConnect(auth => query(auth))
)(UserDetail)
