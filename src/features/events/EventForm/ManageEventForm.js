/*global google*/
import React, { Component } from "react"
import { reduxForm, Field } from "redux-form"
import { connect } from "react-redux"
import { compose } from "redux"
import { firestoreConnect } from "react-redux-firebase"
import { Grid, Header, Segment, Form, Button } from "semantic-ui-react"
import moment from "moment"
import Script from "react-load-script"
import { googleApiKey } from "../../../app/config/keys"
import { geocodeByAddress, getLatLng } from "react-places-autocomplete"

import { category } from "../../../app/data/eventData"
import { createEvent, updateEvent, cancelToggle } from "../eventActions"
import { validate } from "../../../app/common/form/formValidate"
import TextInput from "../../../app/common/form/TextInput"
import TextArea from "../../../app/common/form/TextArea"
import SelectInput from "../../../app/common/form/SelectInput"
import DateInput from "../../../app/common/form/DateInput"
import PlaceInput from "../../../app/common/form/PlaceInput"

class EventForm extends Component {
  state = {
    cityLatLng: {},
    venueLatLng: {},
    scriptLoaded: false
  }

  handleScriptLoad = () => {
    this.setState({ scriptLoaded: true })
  }

  handleCitySelect = selectedCity => {
    geocodeByAddress(selectedCity)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({
          cityLatLng: latlng
        })
      })
      .then(() => {
        this.props.change("city", selectedCity)
      })
      .catch(error => console.error("Error", error))
  }

  handleVenueSelect = selectedVenue => {
    geocodeByAddress(selectedVenue)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({
          venueLatLng: latlng
        })
      })
      .then(() => {
        this.props.change("venue", selectedVenue)
      })
      .catch(error => console.error("Error", error))
  }

  onFormSubmit = async values => {
    const {
      initialValues,
      event,
      createEvent,
      updateEvent,
      history
    } = this.props
    values.date = moment(values.date).format("YYYY-MM-DD")
    values.venueLatLng = this.state.venueLatLng

    if (initialValues.id) {
      if (Object.keys(values.venueLatLng).length === 0) {
        values.venueLatLng = event.venueLatLng
      }
      await updateEvent(values)
      history.goBack()
    } else {
      await createEvent(values)
      history.push("/events")
    }
  }

  render() {
    const {
      event,
      invalid,
      submitting,
      pristine,
      cancelToggle,
      loading
    } = this.props
    return (
      <Grid>
        <Script
          url={`https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`}
          onLoad={this.handleScriptLoad}
        />
        <Grid.Column width={10}>
          <Segment>
            <Header sub color="teal" content="Event Details" />
            <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
              <Field
                name="title"
                type="text"
                component={TextInput}
                placeholder="Give your event a name"
              />
              <Field
                name="category"
                type="text"
                component={SelectInput}
                options={category}
                placeholder="What is your event about"
              />
              <Field
                name="description"
                type="text"
                rows={3}
                component={TextArea}
                placeholder="Tell us about your event"
              />
              <Header sub color="teal" content="Event Location Details" />
              <Field
                name="city"
                type="text"
                component={PlaceInput}
                options={{ type: ["(cities)"] }}
                placeholder="Event City"
                onSelect={this.handleCitySelect}
              />
              {this.state.scriptLoaded && (
                <Field
                  name="venue"
                  type="text"
                  component={PlaceInput}
                  options={{
                    location: new google.maps.LatLng(this.state.cityLatLng),
                    radius: 1000,
                    type: ["establishments"]
                  }}
                  placeholder="Event Venue"
                  onSelect={this.handleVenueSelect}
                />
              )}
              <Field
                name="date"
                type="text"
                component={DateInput}
                dateFormat="yyyy-MM-d HH:mm"
                timeFormat="HH:mm"
                showTimeSelect
                placeholder="Event Date"
              />
              <Button
                positive
                type="submit"
                loading={loading}
                disabled={invalid || submitting || pristine}
              >
                Submit
              </Button>
              <Button
                type="button"
                loading={loading}
                onClick={this.props.history.goBack}
              >
                Cancel
              </Button>
              {event && (
                <Button
                  type="button"
                  onClick={() => cancelToggle(!event.cancelled, event.id)}
                  color={event.cancelled ? "green" : "red"}
                  content={
                    event.cancelled ? "Reactivate event" : "Cancel Event"
                  }
                  floated="right"
                />
              )}
            </Form>
          </Segment>
        </Grid.Column>
      </Grid>
    )
  }
}

const mapStateToProps = (
  { firestore: { ordered }, async: { loading } },
  ownProps
) => {
  let event = {}
  if (ordered.events && ownProps.match.params) {
    const id = ownProps.match.params.id
    event = ordered.events.find(event => event.id === id)
  }
  // initialValues provides redux-form the initial data to populate with
  return {
    initialValues: event,
    event,
    loading
  }
}

export default compose(
  connect(
    mapStateToProps,
    { createEvent, updateEvent, cancelToggle }
  ),
  firestoreConnect([{ collection: "events" }]),
  reduxForm({ form: "eventForm", enableReinitialize: true, validate })
)(EventForm)
