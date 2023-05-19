import ConfirmationModal from './confirmation';
import LoadingModal from './loading';
import ContentModal from './content';

const modals = {
	[ConfirmationModal.name]: ConfirmationModal,
	[LoadingModal.name]: LoadingModal,
	[ContentModal.name]: ContentModal,
};

export default modals;
