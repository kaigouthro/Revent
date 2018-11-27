import React from "react"
import { Segment, Header, Item } from "semantic-ui-react"
import differenceInYears from "date-fns/difference_in_years"

const UserDetailHeader = ({
  profile: { photoURL, displayName, occupation, city, dateOfBirth }
}) => (
  <Segment>
    <Item.Group>
      <Item>
        <Item.Image size="small" avatar src={photoURL || "/assets/user.png"} />
        <Item.Content>
          <Header as="h1">{displayName}</Header>
          <br />
          <Header as="h3">{occupation}</Header>
          <br />
          <Header as="h3">
            {dateOfBirth
              ? differenceInYears(Date.now(), dateOfBirth)
              : "Unknown age"}
            , {city || "Lives in unknown city"}
          </Header>
        </Item.Content>
      </Item>
    </Item.Group>
  </Segment>
)

export default UserDetailHeader
