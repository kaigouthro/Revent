import React from "react"
import { reduxForm, Field } from "redux-form"
import { Form, Segment, Button } from "semantic-ui-react"

import TextInput from "../../../app/common/form/TextInput"

const RegisterForm = ({ handleSubmit }) => {
  return (
    <Form size="large">
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
          type="text"
          placeholder="Password"
        />
        <Button fluid size="large" color="teal">
          Register
        </Button>
      </Segment>
    </Form>
  )
}

export default reduxForm({ form: "RegisterForm" })(RegisterForm)
