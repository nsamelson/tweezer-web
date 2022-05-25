import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../user.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  Tweezes: any=[]
  // username = "nico"
  user: any={}

  constructor(
    private http: HttpClient,
    private router:Router,
    private userService: UserService ) { 

    this.getCurrentUser()


    

  }


  ngOnInit(): void {
  }

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

  getTweezes(): Promise<void> {
    const url = 'http://localhost:3000/tweezes';
    const params = {};
    const headers = {};
    
    return new Promise((resolve, reject)=>{
      this.http.get<any[]>(url,{params,headers}).subscribe((response) => {
        this.Tweezes = response
        
        // add user_liked if undifined in certain tweezes
      

      });
    })
  }

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

  // navigate to a specific profile
  goToProfile(id: string){
    // console.log(id)
    this.router.navigate(['/profile/'+id])
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
