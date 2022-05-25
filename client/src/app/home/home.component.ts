import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  Tweezes: any=[]
  username = "nico"

  constructor(private http: HttpClient,private router:Router, ) { 
    this.getTweezes()

  }


  ngOnInit(): void {
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

  goToProfile(id: string){
    // console.log(id)
    this.router.navigate(['/profile/'+id])
  }

}
