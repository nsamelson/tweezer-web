import { Component, Inject, OnInit, Input} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';

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

  // content!: string;
  // picture!: string;

  user: any;

  options: string[] =[];

  // userDetail:any;


  constructor(
    private route: ActivatedRoute,
    private router:Router, 
    public dialog: MatDialog, 
    private http: HttpClient,
    private userService: UserService) {


    // automatically update data
    this.userService.userDetail.subscribe( value => {
      this.user = value;
      // console.log( value)
    });


    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router_url = router.url;

    this.getCurrentUser()

    // this.options = this.user["search history"]
    
    
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
    
    // console.log(this.user)
  }

  //============== Get the current user =================
  getCurrentUser(): Promise<void>{
    const url = 'http://localhost:3000/auths/user';
    const params = {};
    const headers = {};


    return new Promise((resolve, reject)=>{

      this.http.get(url,{params,headers})
        .subscribe((response) => {
          this.user = response;
          // console.log(response)
          if (this.user["id"]){
            // console.log(this.user)
            this.options = this.user["search history"]
            // this.goToHome() //TODO: see if it's usefull or not
          }else{
            this.goToLogin()
          }
          
        })
    })
  }

  // ============= SEARCH HISTORY + FILTER =============
  myControl = new FormControl();
  
  filteredOptions!: Observable<string[]>;

  ngOnInit() {
    // console.log("init")
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
        // height: '30vh',
        data: {content: "", image: ""}
      });

    // dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result.content}`);
      // console.log(result)
      // this.content = result.content;
      // if (result != undefined ){
      //   if (result.content != undefined || result.image != undefined){
      //     if(result.content != "" || result.image != ""){
      //       const data = {content: result.content, image: result.image}
      //       // console.log(data)
      //       // this.sendNewTweez(data)
      //     }
          
      //   }
        
      // }
      
    // });
  }

  
  

  // ============= Menu Actions ==================

  goToHome(){
    console.log("home")
    // this.isHome = true;
    // this.isLogin = false;
    // this.isProfile = false;
    this.router.navigate(['/home'])
  }

  goToLogin(){
    console.log("login")
    // this.isHome = false;
    // this.isLogin = true;
    // this.isProfile = false;
    this.router.navigate(['/login'])
    // this.user = {}
  }

  goToProfile(){
    console.log("profile")
    // this.isHome = false;
    // this.isLogin = false;
    // this.isProfile = true;
    this.router.navigate(['/profile/'+this.user.id])
  }

  /**private router:Router,
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
  image: File | undefined;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<AppComponentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  

  onPhotoSelected(photoSelector: HTMLInputElement){
    if (photoSelector.files != null){
      this.image = photoSelector.files[0];

      

      let fileReader = new FileReader();
      fileReader.readAsDataURL(this.image);
      fileReader.addEventListener(
          "loadend",
          ev => {
            if (fileReader.result != null){
              let readableString = fileReader.result.toString();
              let postPreviewImage = <HTMLImageElement>document.getElementById("post-preview-image")
              postPreviewImage.src = readableString;

              // console.log(postPreviewImage)
            }
            
          }
      );
    }
    
    
  }


  onPostClick(contentInput: HTMLTextAreaElement){

    let formData = new FormData()

    if (this.image != undefined ){
      
      formData.append('file', this.image, "testImg")
      //.then(() => {this.dialogRef.close();})
    }


    formData.append('content',contentInput.value)
    this.sendNewTweez(formData)
    

  }

  sendNewTweez(_data: any): Promise<void>{
    const url = 'http://localhost:3000/tweezes/';
    
    // console.log(testImg)
    return new Promise((resolve, reject)=>{

      this.http.post(url, _data, {reportProgress: true, observe:'events'})
        .subscribe((response) => {
          console.log(response)
          
        })
      // let formData = new FormData()
      // if (this.image != undefined){
      //   formData.append('file', this.image, "testImg")
      //   formData.append('content',_data.content)

      //   this.http.post(url, formData,  {
      //     reportProgress: true,
      //     observe: 'events',
      //   })
      //     .subscribe((response) => {
      //       console.log(response)
            
      //   })
      // }
      
    })
  }


  // format for the server to receive json
  getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key: any, value: object | null) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };



}


