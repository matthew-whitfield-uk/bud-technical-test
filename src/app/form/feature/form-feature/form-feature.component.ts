import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup,  ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { FormHistoryState } from '../../data-access/form-state.model';
import { redoFormState, undoFormState, updateFormState } from '../../data-access/form.actions';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-form-feature',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './form-feature.component.html',
  styleUrl: './form-feature.component.scss'
})
export class FormFeatureComponent implements OnInit, OnDestroy {
  dynamicForm: FormGroup;

  formState$: Observable<FormHistoryState>;

  constructor(private fb: FormBuilder, private store: Store<{ form: FormHistoryState }>){
    this.dynamicForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      interests: this.fb.array([])
    });

    this.formState$ = this.store.select('form');


  }


  showUndo: boolean = false;
  showRedo: boolean = true;

  ngOnInit(): void {
    this.formState$.subscribe((state: FormHistoryState) => {
      if (state.present) {
        this.dynamicForm.patchValue({
          name: state.present.name,
          email: state.present.email
        });

        if (state.present.interests && state.present.interests.length) {
          this.dynamicForm.patchValue({
            interests: state.present.interests
          });
        }
      }

      if(state.past && state.past.length > 0) {
        this.showUndo = true;
      } else {
        this.showUndo = false;
      }

      if(state.future && state.future.length > 0) {
        this.showRedo = true;
      } else {
        this.showRedo = false;
      }


    });
  }

  ngOnDestroy(): void {
    const { name, email, interests } = this.dynamicForm.value;
    this.store.dispatch(updateFormState({ name, email, interests }));
  }

   undo() {
    this.store.dispatch(undoFormState());
  }

  redo() {
    this.store.dispatch(redoFormState());
  }



  get name() { return this.dynamicForm.get('name'); }
  get email() { return this.dynamicForm.get('email'); }
  get interests() { return this.dynamicForm.get('interests') as FormArray; }

  addInterest() {
    this.interests.push(this.fb.control(''));
  }

  removeInterest(index: number) {
    this.interests.removeAt(index);
  }

  onSubmit() {

    console.log('submit');
    if (this.dynamicForm.valid) {
      const { name, email, interests } = this.dynamicForm.value;
      this.store.dispatch(updateFormState({ name, email, interests }));

    }
  }
}
