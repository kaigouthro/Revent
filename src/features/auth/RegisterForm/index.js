import React from "react"
import { connect } from "react-redux"
import { combineValidators, isRequired } from "revalidate"
import { reduxForm, Field } from "redux-form"
import { Form, Segment, Button, Divider } from "semantic-ui-react"

import { registerUser } from "../authActions"
import TextInput from "../../../app/common/form/TextInput"
import SocialLogin from "../SocialLogin"

const validate = combineValidators({
  displayName: isRequired("User Display Name"),
  email: isRequired("Email"),
  password: isRequired("Password")
})

const RegisterForm = ({
  handleSubmit,
  registerUser,
  error,
  invalid,
  submitting
}) => (
  <Form size="large" onSubmit={handleSubmit(registerUser)}>
    <Segment>
      <Field
        name="displayName"
        component={TextInput}
        type="text"
        placeholder="Known As"
      />
      <Field
        name="email"
        component={TextInput}
        type="text"
        placeholder="Email"
      />
      <Field
        name="password"
        component={TextInput}
        type="password"
        placeholder="Password"
      />
      <Button disabled={invalid || submitting} fluid size="large" color="teal">
        Register
      </Button>
      <Divider horizontal>OR</Divider>
      <SocialLogin />
    </Segment>
  </Form>
)

export default connect(
  null,
  { registerUser }
)(reduxForm({ form: "RegisterForm", validate })(RegisterForm))
