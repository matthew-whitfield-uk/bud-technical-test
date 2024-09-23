// form.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { updateFormState, undoFormState, redoFormState } from './form.actions';
import { FormState, FormHistoryState } from './form-state.model';

export const initialFormState: FormState = {
  name: '',
  email: '',
  interests: []
};

export const initialState: FormHistoryState = {
  past: [],
  present: initialFormState,
  future: []
};

const _formReducer = createReducer(
  initialState,

  // Update form state and push to the history
  on(updateFormState, (state, { name, email, interests }) => {
    const newPresent: FormState = { name, email, interests };
    const newPast = [...state.past, state.present].slice(-3); // Keep last 3 states

    console.log('update state',newPresent, newPast );
    return {
      ...state,
      past: newPast,
      present: newPresent,
      future: [] // Clear future on new state update
    };
  }),

  // Undo to the previous state
  on(undoFormState, (state) => {
    if (state.past.length === 0) return state;

    const previousState = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, -1);
    const newFuture = [state.present, ...state.future].slice(0, 3); // Keep last 3 future states
    return {
      ...state,
      past: newPast,
      present: previousState,
      future: newFuture
    };
  }),

  // Redo to the next state
  on(redoFormState, (state) => {
    if (state.future.length === 0) return state;

    const nextState = state.future[0];
    const newFuture = state.future.slice(1);
    const newPast = [...state.past, state.present].slice(-3); // Keep last 3 states
    return {
      ...state,
      past: newPast,
      present: nextState,
      future: newFuture
    };
  })
);


export function formReducer(state: any, action: any) {
  return _formReducer(state, action);
}
