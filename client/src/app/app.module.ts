import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent, AppComponentDialog } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { HttpClientModule } from '@angular/common/http';

import { MatToolbarModule} from  '@angular/material/toolbar';
import { MatIconModule} from  '@angular/material/icon';
import { MatSidenavModule } from  '@angular/material/sidenav';
import { MatListModule } from  '@angular/material/list';
import { MatButtonModule } from  '@angular/material/button';
import {MatInputModule} from '@angular/material/input'
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent, ProfileComponentDialog } from './profile/profile.component';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';


import { OverlayModule } from '@angular/cdk/overlay';
import { UserService } from './user.service';
// import { OverlayRef, Overlay } from '@angular/cdk/overlay';
// import {MatFormFieldModule} from '@angular/material/form-field';  


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ProfileComponent,
    AppComponentDialog,
    ProfileComponentDialog
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,MatOptionModule, MatSelectModule, MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatCardModule,
    MatListModule,
    MatDialogModule,
    HttpClientModule
  ],
  exports: [

  ],
  providers: [UserService],
  // entryComponents: [AppComponentDialog],
  bootstrap: [AppComponent]
})
export class AppModule { }
