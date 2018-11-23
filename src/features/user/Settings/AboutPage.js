import React from "react"
import { Field, reduxForm } from "redux-form"
import { Segment, Divider, Form, Header, Button } from "semantic-ui-react"

import TextInput from "../../../app/common/form/TextInput"
import TextArea from "../../../app/common/form/TextArea"
import PlaceInput from "../../../app/common/form/PlaceInput"
import SelectInput from "../../../app/common/form/SelectInput"
import RadioInput from "../../../app/common/form/RadioInput"

import { interests } from "../../../app/data/eventData"
import { updateProfile } from "../../auth/authActions"

const AboutPage = ({ updateProfile, handleSubmit, pristine, submitting }) => (
  <Segment>
    <Header dividing size="large" content="About Me" />
    <p>Complete your profile to get the most out of this site</p>

    <Form onSubmit={handleSubmit(updateProfile)}>
      <Form.Group>
        <label>Tell us your status: </label>
        <Field
          name="status"
          component={RadioInput}
          type="radio"
          label="Single"
          value="single"
        />
        <Field
          name="status"
          component={RadioInput}
          type="radio"
          label="Relationship"
          value="relationship"
        />
        <Field
          name="status"
          component={RadioInput}
          type="radio"
          label="Married"
          value="married"
        />
      </Form.Group>
      <Divider />
      <label>Tell us about yourself</label>
      <Field
        name="about"
        component={TextArea}
        rows={4}
        placeholder="About Me"
      />
      <Field
        name="interests"
        component={SelectInput}
        options={interests}
        value="interests"
        multipel={true}
        placeholder="Select your interests"
      />
      <Field
        name="occupation"
        width={8}
        type="text"
        component={TextInput}
        placeholder="Occupation"
      />
      <Field
        name="origin"
        width={8}
        options={{ types: ["(regions)"] }}
        component={PlaceInput}
        placeholder="Country of Origin"
      />
      <Divider />
      <Button
        disabled={pristine || submitting}
        size="large"
        positive
        content="Update Profile"
      />
    </Form>
  </Segment>
)

export default reduxForm({
  form: "userProfile",
  enableReinitialize: true,
  destroyOnUnmount: false
})(AboutPage)
