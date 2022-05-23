import { Component, Inject, OnInit, Input} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  content: string;
  picture: string;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Tweezer';

  router_url: string;

  isHome: boolean ;
  isLogin: boolean ;
  isProfile: boolean ;

  content!: string;
  picture!: string;


  constructor(private router:Router, public dialog: MatDialog) {
    this.isHome = false;
    this.isLogin = true;
    this.isProfile = false;

    this.router_url = router.url;
  }

  // ============= SEARCH HISTORY + FILTER =============
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions!: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }


  // ============= Tweez dialog =============
  openDialog() {
    const dialogRef = this.dialog.open(AppComponentDialog,
      {
        width: '30vw',
        height: '30vh',
        data: {content: this.content, picture: this.picture}
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result.content}`);
      this.content = result.content;
    });
  }
  

  // ============= Actions ==================

  goToHome(){
    console.log("home")
    this.isHome = true;
    this.isLogin = false;
    this.isProfile = false;
    this.router.navigate(['/home'])
  }

  goToLogin(){
    this.isHome = false;
    this.isLogin = true;
    this.isProfile = false;
    this.router.navigate(['/login'])
  }

  goToProfile(){
    this.isHome = false;
    this.isLogin = false;
    this.isProfile = true;
    this.router.navigate(['/profile'])
  }

  /**
   * Check if the router url contains the specified route
   *
   * @param {string} route
   * @returns
   * @memberof MyComponent
   */
   hasRoute(route: string) {
    return this.router.url.includes(route);
  }

}


@Component({
  selector: 'app-component-dialog',
  templateUrl: './app.component.dialog.html',
  styleUrls: ['./app.component.dialog.css']
})
export class AppComponentDialog {

  constructor(
    public dialogRef: MatDialogRef<AppComponentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}


