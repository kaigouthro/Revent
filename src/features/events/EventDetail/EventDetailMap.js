import React from "react"
import { Segment, Icon } from "semantic-ui-react"
import GoogleMapReact from "google-map-react"

const Marker = () => <Icon name="marker" size="big" color="red" />

const EventDetailMap = ({ lat, lng }) => {
  const center = [lat, lng]
  const zoom = 11

  return (
    <Segment attached="bottom" style={{ padding: 0 }}>
      <div style={{ height: "400px", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyCoQjnvLgRC0ZBexMiise4KbMyX41VG3Q4" }}
          defaultCenter={center}
          defaultZoom={zoom}
        >
          <Marker lat={lat} lng={lng} />
        </GoogleMapReact>
      </div>
    </Segment>
  )
}

export default EventDetailMap
