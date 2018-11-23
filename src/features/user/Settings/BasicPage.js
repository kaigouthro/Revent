import React from "react"
import { connect } from "react-redux"
import { Field, reduxForm } from "redux-form"
import moment from "moment"
import { Segment, Form, Header, Divider, Button } from "semantic-ui-react"

import DateInput from "../../../app/common/form/DateInput"
import PlaceInput from "../../../app/common/form/PlaceInput"
import TextInput from "../../../app/common/form/TextInput"
import RadioInput from "../../../app/common/form/RadioInput"

import { updateProfile } from "../../auth/authActions"
import { subYears } from "date-fns"

const BasicPage = ({ handleSubmit, updateProfile, pristine, submitting }) => (
  <Segment>
    <Header dividing size="large" content="Basics" />
    <Form onSubmit={handleSubmit(updateProfile)}>
      <Field
        width={8}
        name="displayName"
        type="text"
        component={TextInput}
        placeholder="Known As"
      />
      <Form.Group inline>
        <label>Gender: </label>
        <Field
          name="gender"
          type="radio"
          value="male"
          label="Male"
          component={RadioInput}
        />
        <Field
          name="gender"
          type="radio"
          value="female"
          label="Female"
          component={RadioInput}
        />
      </Form.Group>
      <Field
        name="dateOfBirth"
        component={DateInput}
        placeholder="Date of birth"
        dateFormat="YYYY-MM-d"
        showYearDropdown={true}
        showMonthDropdown={true}
        dropdownMode="select"
        maxDate={subYears(new Date(), 18)}
      />
      <Field
        name="city"
        component={PlaceInput}
        options={{ types: ["(cities)"] }}
        width={8}
        placeholder="Home town"
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

export default connect(
  null,
  { updateProfile }
)(
  reduxForm({
    form: "userProfile",
    enableReinitialize: true,
    destroyOnUnmount: false
  })(BasicPage)
)
