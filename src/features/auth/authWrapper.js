import { connectedRouterRedirect } from "redux-auth-wrapper/history4/redirect"
import { openModal } from "../modals/modalActions"

export const AuthenticatedUser = connectedRouterRedirect({
  redirectPath: "/events",
  allowRedirectBack: true,
  authenticatedSelector: ({ firebase: { auth } }) =>
    auth.isLoad && !auth.isEmpty,
  wrapperDisplayName: "AuthenticatedUser",
  redirectAction: newLocation => dispatch => dispatch(openModal("UnauthModal"))
})
