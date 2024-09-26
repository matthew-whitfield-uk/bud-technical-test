import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FormHistoryState } from './form-state.model';
import { updateFormState, undoFormState, redoFormState } from './form.actions';

@Injectable({
  providedIn: 'root'
})
export class FormStateService {
  formState$: Observable<FormHistoryState>;

  constructor(private store: Store<{ form: FormHistoryState }>) {
    this.formState$ = this.store.select('form');
  }

  updateFormState(formData: any): void {
    this.store.dispatch(updateFormState(formData));
  }

  undo(): void {
    this.store.dispatch(undoFormState());
  }

  redo(): void {
    this.store.dispatch(redoFormState());
  }
}
