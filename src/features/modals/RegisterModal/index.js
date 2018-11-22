import React from "react"
import { connect } from "react-redux"
import { Modal } from "semantic-ui-react"

import RegisterForm from "../../auth/RegisterForm"
import { closeModal } from "../modalActions"

const RegisterModal = ({ closeModal }) => (
  <Modal size="small" open={true} onClose={closeModal}>
    <Modal.Header>Sign Up to Re-vents!</Modal.Header>
    <Modal.Content>
      <Modal.Description>
        <RegisterForm />
      </Modal.Description>
    </Modal.Content>
  </Modal>
)

export default connect(
  null,
  { closeModal }
)(RegisterModal)
