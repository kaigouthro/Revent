import React from "react"
import { connect } from "react-redux"
import { reduxForm, Field } from "redux-form"
import { Form, Segment, Button, Divider } from "semantic-ui-react"

import { loginUser, socialLogin } from "../authActions"
import TextInput from "../../../app/common/form/TextInput"
import SocialLogin from "../SocialLogin"
import renderError from "../../../app/common/utils/renderError"

const LoginForm = ({ loginUser, socialLogin, handleSubmit, error }) => {
  return (
    <Form size="large" onSubmit={handleSubmit(loginUser)}>
      <Segment>
        <Field
          name="email"
          component={TextInput}
          type="text"
          placeholder="Email Address"
        />
        <Field
          name="password"
          component={TextInput}
          type="password"
          placeholder="Password"
        />
        {renderError(error)}
        <Button fluid size="large" color="teal">
          Login
        </Button>
        <Divider horizontal>OR</Divider>
        <SocialLogin socialLogin={socialLogin} />
      </Segment>
    </Form>
  )
}

export default connect(
  null,
  { loginUser, socialLogin }
)(reduxForm({ form: "loginForm" })(LoginForm))
