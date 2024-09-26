import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private lastSavedValues: any = {};

  constructor(private fb: FormBuilder) {}

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      interests: this.fb.array([])
    });
  }

  updateFormFromState(form: FormGroup, state: any): void {
    if (state.present) {
      form.patchValue({
        name: state.present.name,
        email: state.present.email,
      });

      const interestsFormArray = form.get('interests') as FormArray;
      interestsFormArray.clear();

      if (state.present.interests && state.present.interests.length > 0) {
        state.present.interests.forEach((interest: string) => {
          interestsFormArray.push(new FormControl(interest));
        });
      }
    }
  }

  addInterest(interests: FormArray): void {
    interests.push(this.fb.control(''));
  }

  removeInterest(interests: FormArray, index: number): void {
    interests.removeAt(index);
  }

  handleSubmit(): void {
    alert('Form submitted');
  }

  resetForm(form: FormGroup): void {
    form.reset();
    const interestsFormArray = form.get('interests') as FormArray;
    interestsFormArray.clear();
  }

  hasControlChanged(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);

    if (control) {
      if (control instanceof FormArray) {
        return JSON.stringify(this.lastSavedValues[controlName]) !== JSON.stringify(control.value);
      } else {
        return this.lastSavedValues[controlName] !== control.value;
      }
    }

    return false;
  }

  getFormData(form: FormGroup): any {
    const { name, email, interests } = form.value;
    this.lastSavedValues = { name, email, interests };
    return { name, email, interests };
  }
}
