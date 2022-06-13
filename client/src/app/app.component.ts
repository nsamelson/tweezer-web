import { Component, Inject, OnInit, Input} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {Observable} from 'rxjs';
import { ActivatedRoute,NavigationEnd, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
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
  user: any;
  searchedUsers = []
  myControl = new FormControl();
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
    });

    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router_url = router.url;

    this.getCurrentUser()    
    // console.log(this.user)
  }

  ngOnInit() {
    // console.log("init")
  }

  // ============= API calls ============== //

  /** Get the currently connected user
   * 
   * @returns Promise : sets the user object or redirect to login page
   */
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
          }else{
            this.goToLogin()
          }
          
        })
    })
  }
  

  /** Search users by name
   * 
   * @param search_value name of the user
   * @returns Promise : Array of searchedUsers(id, name, pic)
   */
  searchUsers(search_value:string): Promise<void>{
    const url = 'http://localhost:3000/users';
    const params = {params: {name: search_value}};

    return new Promise((resolve, reject)=>{
      this.http.get<any[]>(url,params).subscribe((response) => {
        
        const search:any = []

        response.forEach((res) =>{
          search.push({
            id: res.id,
            name: res.username,
            pic: res.profile_picture
          })
        } )

        this.searchedUsers = search     

      });
    })
  }

  // ================ Dialog ================= //

  /** Open dialog to create a new Tweez
   * 
   */
  openDialog() {
    const dialogRef = this.dialog.open(AppComponentDialog,
      {
        width: '30vw',
        // height: '30vh',
        data: {content: "", image: ""}
      });
  }

  
  // ============= Menu Actions ================== //

  goToHome(){
    this.router.navigate(['/home'])
  }

  goToLogin(){
    this.router.navigate(['/login'])
  }

  goToProfile(id:string){
    this.router.navigate(['/profile/'+id])
  }

  /**private router:Router,  
   * Check if the router url contains the specified route  
   * (Used in the app.component.html)
   *
   * @param {string} route
   * @returns true or false
   * @memberof MyComponent
   */
  hasRoute(route: string) {
    return this.router.url.includes(route);
  }
}



// ================= DIALOG COMPONENT ================ //


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
    private router: Router
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  
  /** Add a photo to the post
   * 
   * @param photoSelector image to send
   */
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

  /** Post tweez button
   * 
   * @param contentInput inserted text
   */
  onPostClick(contentInput: HTMLTextAreaElement){

    let formData = new FormData()

    if (this.image != undefined ){      
      formData.append('file', this.image)
      //.then(() => {this.dialogRef.close();})
    }

    formData.append('content',contentInput.value)
    this.sendNewTweez(formData)
  }

  // ============= API calls ============== //

  /** add new tweez 
   * 
   * @param _data formData containing key 'file' and 'content'
   * @returns Promise: console message
   */
  sendNewTweez(_data: any): Promise<void>{
    const url = 'http://localhost:3000/tweezes/';
    
    // console.log(testImg)
    return new Promise((resolve, reject)=>{

      this.http.post(url, _data, {reportProgress: true, observe:'events'})
        .subscribe((response) => {
          console.log(response)

        })
      
    })
  }


  /** format for the server to receive json
   * 
   * @returns value in correct json format
   */
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


