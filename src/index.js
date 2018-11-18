import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from "react-router-dom"
import App from "./app/layout/App"

import * as serviceWorker from "./serviceWorker"
import "semantic-ui-css/semantic.min.css"
import "./index.css"

const render = () => {
  ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById("root")
  )
}

if (module.hot) {
  module.hot.accept("./app/layout/App", () => {
    setTimeout(render)
  })
}

render()
serviceWorker.unregister()
