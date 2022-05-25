import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UserService } from '../user.service';
import { filter } from 'rxjs/operators';


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
    private activatedRoute:ActivatedRoute
    ) { 

      
      router.events.pipe(
        filter(event => event instanceof NavigationEnd)  
        ).subscribe((event: any) => {
          // console.log(event.url);
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


    // this.getCurrentUser()

    
  }


  //============== Get the connected user =================
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

  // ================= Get searched user ==========
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

            if (this.user.id == this.myProfile.id){
              this.isMyProfile = true
            }
            else{
              this.isMyProfile = false
              
              // TODO: search followings
            }
            this.getFollowers()
            this.getFollowing()

            this.getTweezes()
          }

        })
    })
  }


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

  getFollowing(): Promise<void>{
    const url = "http://localhost:3000/rels"
    const params = {params: {follower: this.user.id}};

    return new Promise((resolve, reject)=>{
      this.http.get<any[]>(url, params).subscribe((response) => {

        this.user.following = response.length

        

      });
    })
  }

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
