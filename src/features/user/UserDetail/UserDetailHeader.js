import React from "react"
import { Segment, Header, Item } from "semantic-ui-react"
import differenceInYears from "date-fns/difference_in_years"

const UserDetailHeader = ({ profile }) => (
  <Segment>
    <Item.Group>
      <Item>
        <Item.Image
          size="small"
          avatar
          src={profile.photoURL || "/assets/user.png"}
        />
        <Item.Content>
          <Header as="h1">{profile.displayName}</Header>
          <br />
          <Header as="h3">{profile.occupation}</Header>
          <br />
          <Header as="h3">
            {profile.dateOfBirth
              ? differenceInYears(Date.now(), profile.dateOfBirth)
              : "Unknown age"}
            , {profile.city || "Lives in unknown city"}
          </Header>
        </Item.Content>
      </Item>
    </Item.Group>
  </Segment>
)

export default UserDetailHeader
