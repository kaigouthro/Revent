import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import ReduxToastr from "react-redux-toastr"

import App from "./app/layout/App"
import ScrollToTop from "./app/common/utils/ScrollToTop"
import { configureStore } from "./app/store/configureStore"
import { loadEvents } from "./features/events/eventActions"
import * as serviceWorker from "./serviceWorker"
import "semantic-ui-css/semantic.min.css"
import "react-redux-toastr/lib/css/react-redux-toastr.min.css"
import "./index.css"

const store = configureStore()
store.dispatch(loadEvents())
const rootElem = document.getElementById("root")

const renderApp = () => {
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <ScrollToTop>
          <ReduxToastr
            position="bottom-right"
            transitionIn="fadeIn"
            transitionOut="fadeOut"
          />
          <App />
        </ScrollToTop>
      </BrowserRouter>
    </Provider>,
    rootElem
  )
}

if (module.hot) {
  module.hot.accept("./app/layout/App", () => {
    setTimeout(renderApp)
  })
}

renderApp()
serviceWorker.unregister()
