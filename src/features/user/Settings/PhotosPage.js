import React, { Component } from "react"
import { connect } from "react-redux"
import { firestoreConnect } from "react-redux-firebase"
import Dropzone from "react-dropzone"
import Cropper from "react-cropper"
import { toastr } from "react-redux-toastr"

import {
  Segment,
  Header,
  Icon,
  Divider,
  Button,
  Grid,
  Card,
  Image
} from "semantic-ui-react"
import "cropperjs/dist/cropper.css"

import { updateProfileImage, deletePhoto, setMainPhoto } from "../userActions"

const query = ({ auth }) => [
  {
    collection: "users",
    doc: auth.uid,
    subcollections: [{ collection: "photos" }],
    storeAs: "photos"
  }
]

class PhotosPage extends Component {
  state = {
    files: [],
    fileName: "",
    image: {},
    cropResult: null
  }

  onDrop = files => {
    this.setState({
      files,
      fileName: files[0].name
    })
  }

  cropImage = () => {
    if (typeof this.refs.cropper.getCroppedCanvas() === "undefined") {
      return
    }
    this.refs.cropper.getCroppedCanvas().toBlob(blob => {
      let imageUrl = URL.createObjectURL(blob)
      this.setState({
        cropResult: imageUrl,
        image: blob
      })
    }, "image/jpeg")
  }

  cancelCrop = () => {
    this.setState({
      files: [],
      image: {}
    })
  }

  handleSetMainPhoto = photo => async () => {
    try {
      await this.props.setMainPhoto(photo)
      toastr.success("Success!", "Photo has been updated!")
    } catch (error) {
      toastr.success("Oops!", error.message)
    }
  }

  handlePhotoDelete = photo => async () => {
    try {
      await this.props.deletePhoto(photo)
      toastr.success("Success!", "Photo has been deleted!")
    } catch (error) {
      toastr.error("Oops!", error.message)
    }
  }

  uploadImage = async () => {
    try {
      await this.props.updateProfileImage(this.state.image, this.state.fileName)
      this.cancelCrop()
      toastr.success("Success!", "Photo has been uploaded!")
    } catch (error) {
      toastr.error("Oops!", error.message)
    }
  }

  render() {
    const { photos, profile, loading } = this.props
    let filterredPhotos
    if (photos) {
      filterredPhotos = photos.filter(photo => photo.url !== profile.photoURL)
    }
    console.log(this.state)
    return (
      <Segment>
        <Header dividing size="large" content="Your Photos" />
        <Grid>
          <Grid.Row />
          <Grid.Column width={4}>
            <Header color="teal" sub content="Step 1 - Add Photo" />
            <Dropzone onDrop={this.onDrop} multiple={false}>
              <div
                style={{
                  paddingTop: "30px",
                  textAlign: "center",
                  cursor: "pointer"
                }}
              >
                <Icon name="upload" size="huge" />
                <Header content="Drop image here or click to upload" />
              </div>
            </Dropzone>
          </Grid.Column>
          <Grid.Column width={1} />

          <Grid.Column width={4}>
            <Header sub color="teal" content="Step 2 - Resize image" />
            {this.state.files[0] && (
              <Cropper
                ref="cropper"
                src={this.state.files[0].preview}
                style={{ height: 200, width: "100%" }}
                // Cropper.js options
                aspectRatio={1}
                viewMode={0}
                dragMode="move"
                guides={false}
                scalable={true}
                cropBoxMovable={true}
                cropBoxResizable={true}
                crop={this.cropImage}
              />
            )}
          </Grid.Column>
          <Grid.Column width={1} />

          <Grid.Column width={4}>
            <Header sub color="teal" content="Step 3 - Preview and Upload" />
            {this.state.files[0] && (
              <div>
                <Image
                  style={{ minHeight: "200px", minWidth: "200px" }}
                  src={this.state.cropResult}
                />
                <Button.Group>
                  <Button
                    loading={loading}
                    onClick={this.uploadImage}
                    style={{ width: 100 }}
                    positive
                    icon="check"
                  />
                  <Button
                    disabled={loading}
                    onClick={this.cancelCrop}
                    style={{ width: 100 }}
                    positive
                    icon="close"
                  />
                </Button.Group>
              </div>
            )}
          </Grid.Column>
        </Grid>

        <Divider />
        <Header sub color="teal" content="All Photos" />
        <Card.Group itemsPerRow={5}>
          <Card>
            <Image src={profile.photoURL} />
            <Button positive>Main Photo</Button>
          </Card>

          {photos &&
            filterredPhotos.map(photo => (
              <Card key={photo.id}>
                <Image src={photo.url} />
                <div className="ui two buttons">
                  <Button
                    onClick={this.handleSetMainPhoto(photo)}
                    basic
                    color="green"
                  >
                    Main
                  </Button>
                  <Button
                    onClick={this.handlePhotoDelete(photo)}
                    basic
                    icon="trash"
                    color="red"
                  />
                </div>
              </Card>
            ))}
        </Card.Group>
      </Segment>
    )
  }
}

const mapStateToProps = ({ firebase, firestore, async }) => ({
  auth: firebase.auth,
  photos: firestore.ordered.photos,
  profile: firebase.profile,
  loading: async.loading
})

export default connect(
  mapStateToProps,
  { updateProfileImage, deletePhoto, setMainPhoto }
)(firestoreConnect(auth => query(auth))(PhotosPage))
