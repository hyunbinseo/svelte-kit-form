export { createSubmitFunction, type ExtractActionResult } from './index.js';

type ModalOptions = {
	showOnMount: boolean;
	resetFormStateOnShow: boolean;
};

export const createFormState = (modalOptions: Partial<ModalOptions> = {}) => {
	type FormState = 'standby' | 'submitting' | 'submitted';
	let formState = $state<FormState>('standby');

	const m: ModalOptions = {
		showOnMount: false,
		resetFormStateOnShow: true,
		...modalOptions
	};

	let showModal = $state(m.showOnMount);

	return {
		// Form
		get isStandby() {
			return formState === 'standby';
		},
		get isSubmitting() {
			return formState === 'submitting';
		},
		get isSubmitted() {
			return formState === 'submitted';
		},
		get state() {
			return formState;
		},
		set is(state: FormState) {
			formState = state;
		},

		// Modal
		get isShown() {
			return showModal;
		},
		set isShown(show: boolean) {
			showModal = show;
		},
		show: () => {
			// The form state should not be updated in a onclose handler.
			// The dialog's content can change while it is being closed.
			if (m.resetFormStateOnShow) formState = 'standby';
			showModal = true;
		},
		close: () => (showModal = false)
	};
};
