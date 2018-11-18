import React from "react"
import ReactDOM from "react-dom"
import App from "./app/layout/App"

import * as serviceWorker from "./serviceWorker"
import "./index.css"

const render = () => {
  ReactDOM.render(<App />, document.getElementById("root"))
}

if (module.hot) {
  module.hot.accept("./app/layout/App", () => {
    setTimeout(render)
  })
}

render()
serviceWorker.unregister()
