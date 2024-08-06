import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {path:'signup',component:SignupComponent},
  {path:'signin',component:LoginComponent},
  {path:'dashboard',component:DashboardComponent},
  {path:'',redirectTo:'signup',pathMatch:'full'},
  {path:'**', redirectTo:'signup'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
