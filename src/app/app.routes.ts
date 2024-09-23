import { Routes } from '@angular/router';
import { FormFeatureComponent } from './form/feature/form-feature/form-feature.component';
import { HomeFeatureComponent } from './home/feature/home-feature/home-feature.component';

export const routes: Routes = [
  {
    path: '', component: HomeFeatureComponent
  },
  {
    path: 'form', component: FormFeatureComponent
  }
];
