import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService as AuthGuard } from "./guards/auth-guard.service";

import { LoginComponent } from "./login/login.component";
import { ManageEmpComponent } from './manage-emp/manage-emp.component';

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "dashboard",
    component: ManageEmpComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "",
    component: ManageEmpComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
