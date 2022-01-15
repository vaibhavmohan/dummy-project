import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from "./sidebar/sidebar.component";
import { LoginComponent } from "./login/login.component";
import { MatRadioModule } from '@angular/material/radio';
// import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from "@angular/material/button";
import {MatDialogModule} from '@angular/material/dialog';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatStepperModule } from "@angular/material/stepper";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTreeModule } from "@angular/material/tree";
import { MatSelectFilterModule } from 'mat-select-filter';

import { CommonService } from "./_services";
import { NotifierModule } from "angular-notifier";

import { AuthGuardService as AuthGuard } from "./guards/auth-guard.service";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';

import { LoaderComponent } from "./loader/loader.component";

import { ManageEmpComponent } from './manage-emp/manage-emp.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    LoginComponent,
    ManageEmpComponent,
    LoaderComponent
  ],
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatTooltipModule,
    MatRadioModule,
    MatDatepickerModule,
    MatTabsModule,
    MatDialogModule,
    MatSelectFilterModule,
    // MatDaterangepickerModule,
    // TabModule,
    MatTreeModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatStepperModule,
    MatSidenavModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyBDhE5PpSAlbWgTFyVNqihA_ITblZG4E5k"
    }),
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: "right",
          distance: 12
        },
        vertical: {
          position: "top",
          distance: 12,
          gap: 10
        }
      }
    }),
    BrowserAnimationsModule,
  ],
  providers: [
    AuthGuard,
    CommonService,
    HttpClientModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
