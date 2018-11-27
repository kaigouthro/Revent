import React from "react"
import format from "date-fns/format"
import { Link } from "react-router-dom"
import { Grid, Segment, Header, Card, Image, Tab } from "semantic-ui-react"

const panes = [
  { menuItem: "All Events", pane: { key: "allEvents" } },
  { menuItem: "Past Event", pane: { key: "pastEvents" } },
  { menuItem: "Future Events", pane: { key: "futureEvents" } },
  { menuItem: "Events Hosted", pane: { key: "hosted" } }
]

const UserDetailEvents = ({ events, eventsLoading, changeTab }) => (
  <Grid.Column width={12}>
    <Segment attached loading={eventsLoading}>
      <Header icon="calendar" content="Events" />
      <Tab
        onTabChange={(e, data) => changeTab(e, data)}
        panes={panes}
        menu={{ secondary: true, pointing: true }}
      />

      <Card.Group itemsPerRow={5}>
        {events &&
          events.map(event => (
            <Card as={Link} to={`event/${event.id}`} key={event.id}>
              <Image src={`/assets/categoryImages/${event.category}.jpg`} />
              <Card.Content>
                <Card.Header textAlign="center">${event.title}</Card.Header>
                <Card.Meta textAlign="center">
                  <div>{format(event.date && event.date, "DD MMM YYYY")}</div>
                  <div>{format(event.date && event.date, "h:mm A")}</div>
                </Card.Meta>
              </Card.Content>
            </Card>
          ))}
      </Card.Group>
    </Segment>
  </Grid.Column>
)

export default UserDetailEvents
