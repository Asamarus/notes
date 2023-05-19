import { ModalsState } from './types';

interface AddAction {
	type: 'ADD';
	payload: string;
}

interface OpenAction {
	type: 'OPEN';
	payload: string;
}

interface ReplaceAction {
	type: 'REPLACE';
	payload: [string, string];
}

interface CloseAction {
	type: 'CLOSE';
	payload: string;
}

interface RemoveAction {
	type: 'REMOVE';
	payload: string;
}

export default function modalsReducer(
	state: ModalsState,
	action: AddAction | OpenAction | ReplaceAction | CloseAction | RemoveAction,
): ModalsState {
	switch (action.type) {
		case 'ADD': {
			return {
				modals: [...state.modals, action.payload],
				modalState: { ...state.modalState, ...{ [action.payload]: 'added' } },
			};
		}

		case 'OPEN': {
			return {
				modals: state.modals,
				modalState: { ...state.modalState, ...{ [action.payload]: 'opened' } },
			};
		}

		case 'REPLACE': {
			const [oldId, newId] = action.payload;
			const { [oldId]: value, ...modalState } = state.modalState;
			return {
				modals: [...state.modals.filter((m) => m !== oldId), newId],
				modalState: { ...modalState, ...{ [newId]: 'opened' } },
			};
		}

		case 'CLOSE': {
			return {
				modals: state.modals,
				modalState: { ...state.modalState, ...{ [action.payload]: 'closed' } },
			};
		}

		case 'REMOVE': {
			const { [action.payload]: value, ...modalState } = state.modalState;
			return {
				modals: state.modals.filter((m) => m !== action.payload),
				modalState: { ...modalState },
			};
		}

		default: {
			return state;
		}
	}
}
