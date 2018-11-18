import React, { Component } from "react"
import { Container } from "semantic-ui-react"
import EventDashboard from "../../features/event/EventDashboard"

class App extends Component {
  render() {
    return (
      <div>
        <Container className="main">
          <h1>Re-vents</h1>
          <EventDashboard />
        </Container>
      </div>
    )
  }
}
export default App
