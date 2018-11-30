import { connectedReduxRedirect } from "redux-auth-wrapper/history4/redirect"
import { openModal } from "../modals/modalActions"

export const AuthenticatedUser = connectedReduxRedirect({
  redirectPath: "/events",
  allowRedirectBack: true,
  authenticatedSelector: ({ firebase: { auth } }) =>
    auth.isLoaded && !auth.isEmpty,
  wrapperDisplayName: "AuthenticatedUser",
  redirectAction: newLocation => dispatch => dispatch(openModal("UnauthModal"))
})
