import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"

import App from "./app/layout/App"
import ScrollToTop from "./app/common/utils/ScrollToTop"
import { configureStore } from "./app/store/configureStore"
import * as serviceWorker from "./serviceWorker"
import "semantic-ui-css/semantic.min.css"
import "./index.css"

const renderApp = () => {
  const store = configureStore()
  const rootElem = document.getElementById("root")
  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <ScrollToTop>
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
