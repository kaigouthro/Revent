import React, { Component } from "react"
import { Container } from "semantic-ui-react"
import { Switch, Route, Redirect } from "react-router-dom"
import NavBar from "../../features/nav/NavBar"
import EventDashboard from "../../features/events/EventDashboard"
import PeopleDashboard from "../../features/user/PeopleDashboard"
import Settings from "../../features/user/Settings"

class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <Container className="main">
          <Switch>
            <Redirect exact from="/" to="/events" />
            <Route path="/events" component={EventDashboard} />
            <Route path="/people" component={PeopleDashboard} />
            <Route path="/settings" component={Settings} />
          </Switch>
        </Container>
      </div>
    )
  }
}
export default App
