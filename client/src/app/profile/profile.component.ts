import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Inject, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UserService } from '../user.service';
import { filter } from 'rxjs/operators';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
// import { DialogData } from '../app.component';

export interface DialogData {
  bio: string;
  password: string;
  oldPassword: string;
  oldBio: string;
  user_id: string
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any
  userTweezes: any = []
  searchId: any
  isMyProfile:boolean = true
  myProfile: any
  isFollowing: boolean = false
  relations: any


  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
    private activatedRoute:ActivatedRoute,
    public dialog: MatDialog, 
    ) { 

      // on url update (if the id in the url changed)
      router.events.pipe(
        filter(event => event instanceof NavigationEnd)  
        ).subscribe((event: any) => {

          // get user id from the url
          if (event.url.includes('profile')){
            this.searchId = this.activatedRoute.snapshot.paramMap.get('id')
            this.getCurrentUser()
          }
          
      });

      try{
        this.searchId = this.activatedRoute.snapshot.paramMap.get('id')
      }catch{
        this.searchId = ""
      }

    }

  ngOnInit(): void {    
  }

  // ============= API calls ============== //

  /** Get the currently connected user
   * 
   * @returns Promise : sets the myProfile object and calls getSearchUser()
   */
  getCurrentUser(): Promise<void>{
    const url = 'http://localhost:3000/auths/user';
    const params = {};
    const headers = {};


    return new Promise((resolve, reject)=>{

      this.http.get(url,{params,headers})
        .subscribe((response) => {
            this.myProfile = response;

            //  then search for the searched user
            this.getSearchUser()

            
        })
    })
  }

  /** Get the user information I searched
   * 
   * @returns Promise : sets the user object and calls getFollowers(), getFollowing(), getTweezes()
   */
  getSearchUser(): Promise<void>{
    const url = 'http://localhost:3000/users/'+this.searchId;
    const params = {};
    const headers = {};


    return new Promise((resolve, reject)=>{

      this.http.get(url,{params,headers})
        .subscribe((response) => {
          
          const res: any = response
          if (res["id"] !== undefined){
            this.user = response;
            
            // if the user I'm searching for is my user profile or not
            if (this.user.id == this.myProfile.id){
              this.isMyProfile = true
            }
            else{
              this.isMyProfile = false              
            }

            this.getFollowers()
            this.getFollowing()
            this.getTweezes()
          }

        })
    })
  }

  /** Get the tweezes of the selected user  
   * sort by date in  descending order
   * 
   * @returns Promise: sets userTweezes as an array of the Tweezes
   */
  getTweezes(): Promise<void> {
    const url = 'http://localhost:3000/tweezes';
    
    const headers = {};

    const params = {params: {id: this.user.id}};
    
    return new Promise((resolve, reject)=>{
      this.http.get<any[]>(url, params).subscribe((response) => {
        response = response.sort((a:any, b:any) => new Date(b.created_at.seconds).getTime() - new Date(a.created_at.seconds).getTime())
        this.userTweezes = response
        // console.log(response)

      });
    })
  }

  /** Get the followers of the searched user
   * 
   * @returns Promise: sets the number of followers of the searched user,
   * sets if the current user follows the searched user
   */
  getFollowers(): Promise<void>{
    const url = "http://localhost:3000/rels"
    const params = {params: {following: this.user.id}};

    return new Promise((resolve, reject)=>{
      this.http.get<any[]>(url, params).subscribe((response) => {
        this.relations = response
        this.isFollowing = false

        this.user.followers = response.length

        if( !this.isMyProfile){
          this.relations.forEach((item: any) => {

            // if the current user follows the searched user
            if(item.follower_id == this.myProfile.id){
              this.isFollowing = true
              // console.log(this.isFollowing)
              return
            } 
          })
        }
        

      });
    })
  }

  /** Get the users the searched user follows
   * 
   * @returns Promise: sets the number of users the searched user follows
   */
  getFollowing(): Promise<void>{
    const url = "http://localhost:3000/rels"
    const params = {params: {follower: this.user.id}};

    return new Promise((resolve, reject)=>{
      this.http.get<any[]>(url, params).subscribe((response) => {

        this.user.following = response.length

      });
    })
  }

  /** Post a new relationship to follow the searched user
   * 
   * @returns Promise: console message, calls getSearchUser()
   */
  followUser(): Promise<void>{
    const url = "http://localhost:3000/rels"
    const params = {};
    const headers = {"Content-Type": "application/json",'accept': 'application/json'};
    const data = JSON.stringify({
      follower_id: this.myProfile.id,
      following_id: this.user.id
    },this.getCircularReplacer())

    return new Promise((resolve, reject)=>{
      this.http.post(url, {params, data}).subscribe((response) => {
        console.log(response)
        this.getSearchUser()

      });
    })

  }

  /** Deletes a relationship between the current user and the searched user to unfollow him
   * 
   * @returns Promise: console message, calls getSearchUser()
   */
  unFollowUser():Promise<void>{

    var relation: any
    this.relations.forEach((item: any) => {
      if(item.follower_id == this.myProfile.id){
        relation = item
      }
    })

    const url = "http://localhost:3000/rels/"+relation.id


    return new Promise((resolve, reject)=>{
      this.http.delete(url).subscribe((response) => {
        console.log(response)
        this.getSearchUser()

      });
    })

  }

   /** Like a tweez
   * 
   * @param id id of the tweez to like
   * @returns Promise: console message
   */
  likeTweez(id: string){

    // get current tweez info
    var tweez: any
    this.userTweezes.forEach((item: any) => {
      if(item.id == id){
        tweez = item
      }
    })

    // like the tweez
    tweez.user_liked.push(this.myProfile.username)
    tweez.likes = tweez.user_liked.length

    const update = {
      user_liked : tweez.user_liked,
      likes: tweez.likes
    }
   
    const url = "http://localhost:3000/tweezes/"+id
    const headers = {"Content-Type": "application/json",'accept': 'application/json'};
    const data = JSON.stringify(update,this.getCircularReplacer())

    return new Promise((resolve, reject)=>{
      this.http.put(url, {data}).subscribe((response) => {
        console.log(response)
      });
    })

  }

  /** Unlinke an already liked tweez
   * 
   * @param id id of the tweez to unlinke
   * @returns Promise: console message
   */
  unLikeTweez(id: string){

    // get current tweez info
    var tweez: any
    this.userTweezes.forEach((item: any) => {
      if(item.id == id){
        tweez = item
      }
    })

    // unlike the tweez
    const index = tweez.user_liked.indexOf(this.myProfile.username);
    if (index !== -1){
      tweez.user_liked.splice(index,1)
    }    
    tweez.likes = tweez.user_liked.length

    const update = {
      user_liked : tweez.user_liked,
      likes: tweez.likes
    }

    // put request
    const url = "http://localhost:3000/tweezes/"+id
    const headers = {"Content-Type": "application/json",'accept': 'application/json'};
    const data = JSON.stringify(update,this.getCircularReplacer())

    return new Promise((resolve, reject)=>{
      this.http.put(url, {data}).subscribe((response) => {
        console.log(response)
      });
    })

  }

  // ================ Dialog ================= //
  
  /** Open dialog to edit the profile of the current user
   * 
   */
  openDialog(){
    const bio: string = this.myProfile.bio.toString();
    const password: string = this.myProfile.password.toString()

    const dialogRef = this.dialog.open(ProfileComponentDialog,
      {
        width: '40vw',
        height: '50vh',
        data: {
          bio: bio, 
          password: password, 
          oldPassword: password, 
          oldBio: bio, 
          user_id: this.myProfile.id}
      });
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


// ================= DIALOG COMPONENT ================ //



@Component({
  selector: 'profile-component-dialog',
  templateUrl: './profile.component.dialog.html',
  styleUrls: ['./profile.component.dialog.css']
})
export class ProfileComponentDialog {

  hide = true
  
  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<ProfileComponentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private router: Router
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  /** Update user informatin button
   * 
   */
  onPostClick(){

    const newBio: string = this.data.bio;
    const newPassword = this.data.password
    var newData = {}

    if (newBio != this.data.oldBio){
      newData= {...newData,...{bio: newBio}}
    }
    if (newPassword != this.data.oldPassword){
      newData= {...newData,...{password: newPassword}}
    }
    

    if (Object.keys(newData).length !== 0){
      this.editProfile(newData)
    }
  }

  // ============= API calls ============== //

  /** update user information
   * 
   * @param newData body containing key 'bio' and/or 'password'
   * @returns Promise: console message
   */
  editProfile(newData:any): Promise<void>{
    const url = 'http://localhost:3000/users/'+this.data.user_id;
    
    // console.log(testImg)
    return new Promise((resolve, reject)=>{

      this.http.put(url, newData, {reportProgress: true, observe:'events'})
        .subscribe((response) => {
          console.log(response)
          

        })
      
    })
  }
}