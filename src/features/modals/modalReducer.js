import { MODAL_OPEN, MODAL_CLOSE } from "./modalConstants"
import { createReducer } from "../../app/common/utils/reducerUtil"

const initialModal = null

const openModal = (state, { modalType, modalProps }) => ({
  modalType,
  modalProps
})

const closeModal = (state, payload) => null

export default createReducer((state = initialModal), {
  [MODAL_OPEN]: openModal,
  [MODAL_CLOSE]: closeModal
})
