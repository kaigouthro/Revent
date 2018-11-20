import React, { Component } from "react"
import { connect } from "react-redux"
import { NavLink, Link, withRouter } from "react-router-dom"
import { Menu, Container, Button } from "semantic-ui-react"

import LoggedInMenu from "../Menus/LoggedInMenu"
import SignedOutMenu from "../Menus/SignedOutMenu"
import { openModal } from "../../modals/modalActions"
import { signOutUser } from "../../auth/authActions"

class NavBar extends Component {
  handleSignIn = () => {
    this.props.openModal("LoginModal")
  }

  handleRegister = () => {
    this.props.openModal("RegisterModal")
  }

  handleSignOut = () => {
    this.props.signOutUser()
    this.props.history.push("/")
  }

  render() {
    const {
      auth: { authenticated, currentUser }
    } = this.props
    return (
      <Menu inverted fixed="top">
        <Container>
          <Menu.Item as={Link} to="/" header>
            <img src="/assets/logo.png" alt="logo" />
            Revents
          </Menu.Item>
          <Menu.Item as={NavLink} to="/events" name="Events" />
          {authenticated && (
            <Menu.Item as={NavLink} to="/people" name="People" />
          )}
          {authenticated && (
            <Menu.Item>
              <Button
                as={Link}
                to="/createEvent"
                floated="right"
                positive
                inverted
                content="Create Event"
              />
            </Menu.Item>
          )}
          {authenticated ? (
            <LoggedInMenu
              signOut={this.handleSignOut}
              currentUser={currentUser}
            />
          ) : (
            <SignedOutMenu
              signIn={this.handleSignIn}
              register={this.handleRegister}
            />
          )}
        </Container>
      </Menu>
    )
  }
}

const mapStateToProps = ({ auth }) => ({ auth })

export default withRouter(
  connect(
    mapStateToProps,
    { openModal, signOutUser }
  )(NavBar)
)
