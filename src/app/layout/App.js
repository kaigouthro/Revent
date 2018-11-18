import React, { Component } from "react"
import { Container } from "semantic-ui-react"
import NavBar from "../../features/nav/NavBar"
import EventDashboard from "../../features/events/EventDashboard"

class App extends Component {
  render() {
    return (
      <div>
        <Container className="main">
          <NavBar />
          <EventDashboard />
        </Container>
      </div>
    )
  }
}
export default App
