import React from "react"
import { Container } from "semantic-ui-react"
import { Switch, Route, Redirect } from "react-router-dom"

import NavBar from "../../features/nav/NavBar"
import PeopleDashboard from "../../features/user/PeopleDashboard"
import Settings from "../../features/user/Settings"
import UserDetail from "../../features/user/UserDetail"
import EventDashboard from "../../features/events/EventDashboard"
import EventDetail from "../../features/events/EventDetail"
import EventForm from "../../features/events/EventForm/ManageEventForm"
import CreateEventForm from "../../features/events/EventForm/CreateEventForm"
import ModalManager from "../../features/modals/ModalManager"
import NotFound from "./NotFound"
import Home from "../../features/home"

const App = () => (
  <div>
    <ModalManager />
    <Switch>
      <Route exact path="/" component={Home} />
    </Switch>

    <Route
      path="/(.+)"
      render={() => (
        <div>
          <NavBar />
          <Container className="main">
            <Switch>
              <Redirect exact from="/" to="/events" />
              <Route exact path="/events" component={EventDashboard} />
              <Route path="/event/:id" component={EventDetail} />
              <Route path="/manage/:id" component={EventForm} />
              <Route path="/createEvent" component={CreateEventForm} />
              <Route path="/events/:id" component={EventForm} />
              <Route path="/people" component={PeopleDashboard} />
              <Route path="/settings" component={Settings} />
              <Route path="/profile/:id" component={UserDetail} />
              <Route component={NotFound} />
            </Switch>
          </Container>
        </div>
      )}
    />
  </div>
)

export default App
