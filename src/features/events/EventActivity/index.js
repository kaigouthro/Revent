import React from "react"
import { Header, Segment, Feed, Sticky } from "semantic-ui-react"

const EventActivity = ({ activities, contextRef }) => (
  <Sticky context={contextRef} offset={100}>
    <Header attached="top" content="Recent Activity" />
    <Segment attached>
      <Feed>
        {activities &&
          activities.map(activity => (
            <EventActivity key={activity.id} activity={activity} />
          ))}
      </Feed>
    </Segment>
  </Sticky>
)

export default EventActivity
