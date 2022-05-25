import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any
  userTweezes: any = []

  searchId: any

  isMyPorfile:boolean = true
  myProfile: any


  constructor(
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
    private activatedRoute:ActivatedRoute
    ) { 

      

      try{
        this.searchId = this.activatedRoute.snapshot.paramMap.get('id')
      }catch{
        this.searchId = ""
      }
      
      if(this.searchId != null){
        this.isMyPorfile = false

        this.getSearchUser()
      }
      else{
        this.getCurrentUser()

        this.userService.userDetail.subscribe( value => {
          this.user = value;
          console.log( value)
        });
      }
      
      
      


    }
  cards = [1,2,3,4]

  ngOnInit(): void {
  }

  //============== Get the current user =================
  getCurrentUser(): Promise<void>{
    const url = 'http://localhost:3000/auths/user';
    const params = {};
    const headers = {};


    return new Promise((resolve, reject)=>{

      this.http.get(url,{params,headers})
        .subscribe((response) => {
          
          const res: any = response
          if (res["id"]!= undefined){
            this.user = response;

            this.getTweezes()
          }
          
          
          
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
          
          this.user = response;

          this.getTweezes()
          
          
          
          
        })
    })
  }

  goToHome(){
    console.log("home")
    this.router.navigate(['/home'])
  }

  getTweezes(): Promise<void> {
    const url = 'http://localhost:3000/tweezes';
    
    const headers = {};

    const params = {params: {id: this.user.id}};
    
    return new Promise((resolve, reject)=>{
      this.http.get<any[]>(url, params).subscribe((response) => {
        this.userTweezes = response
        console.log(response)
        


      });
    })
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
