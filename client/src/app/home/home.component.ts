import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavigationEnd, Router } from '@angular/router';
import { UserService } from '../user.service';
import { filter } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  Tweezes: any=[]
  user: any={}

  constructor(
    private http: HttpClient,
    private router:Router,
    private userService: UserService ) { 
      this.getCurrentUser()
  }


  ngOnInit(): void {
  }

  // ============= API calls ============== //

  /** Get the currently connected user
   * 
   * @returns Promise : sets the user object and calls getTweezes()
   */
  getCurrentUser(): Promise<void>{
    const url = 'http://localhost:3000/auths/user';
    const params = {};
    const headers = {};


    return new Promise((resolve, reject)=>{

      this.http.get(url,{params,headers})
        .subscribe((response) => {
            this.user = response;

            // get tweezes related to the user
            this.getTweezes()
        })
    })
  }

  /** Get a list of Tweezes  
   * filter with only the tweezes created by the users the current user follows  
   * sort by date in descending order
   * 
   * @returns Promise: sets the Tweezes array
   */
  getTweezes(): Promise<void> {
    const url = 'http://localhost:3000/tweezes';
    const params = {params: {follower: this.user.id}};
    const headers = {};
    
    return new Promise((resolve, reject)=>{
      this.http.get<any[]>(url,params).subscribe((response) => {
        
        response = response.sort((a:any, b:any) => new Date(b.created_at.seconds).getTime() - new Date(a.created_at.seconds).getTime())
        this.Tweezes = response
        
        // TODO: add user_liked if undefined in certain tweezes
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
    this.Tweezes.forEach((item: any) => {
      if(item.id == id){
        tweez = item
      }
    })

    // like the tweez
    tweez.user_liked.push(this.user.username)
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
    this.Tweezes.forEach((item: any) => {
      if(item.id == id){
        tweez = item
      }
    })

    // unlike the tweez
    const index = tweez.user_liked.indexOf(this.user.username);
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

  // =============== Navigation ================== //

  /** Navigate to the profile page of a specific user
   * 
   * @param id id of a specific user
   */
  goToProfile(id: string){
    // console.log(id)
    this.router.navigate(['/profile/'+id])
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
