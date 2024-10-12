import {ActivatedRoute, Routes} from '@angular/router';
import {
  LoginPageComponent, ProfilePageComponent,
  HomePageComponent
} from "./pages";
import {LayoutComponentComponent} from "./layout/layout-component/layout-component.component";
import {AuthConfirmation} from "./pages/auth-confirmation/auth-confirmation";



export const routes: Routes = [
  {path: 'login', component: LoginPageComponent},
  {path: 'confirmation-required', component: AuthConfirmation},
  {
    path: '', component: LayoutComponentComponent, children: [
      {path: '', component: HomePageComponent, pathMatch: "full"},
      {path: 'profile', component: ProfilePageComponent},
    ]
  }
];
