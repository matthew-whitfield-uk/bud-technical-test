// form.actions.ts
import { createAction, props } from '@ngrx/store';

export const updateFormState = createAction(
  '[Form] Update State',
  props<{ name: string; email: string; interests: string[] }>()
);
export const undoFormState = createAction('[Form] Undo State');
export const redoFormState = createAction('[Form] Redo State');
export const resetFormState = createAction('[Form] Reset State');
