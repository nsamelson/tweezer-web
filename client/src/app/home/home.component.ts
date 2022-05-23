import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  Tweezes: any=[]
  username = "nico"

  constructor(private http: HttpClient) { 
    this.getTweezes()

  }

  cards = [1,2]

  ngOnInit(): void {
  }

  getTweezes(): Promise<void> {
    const url = 'http://localhost:3000/tweezes';
    const params = {};
    const headers = {};
    
    return new Promise((resolve, reject)=>{
      this.http.get<any[]>(url,{params,headers}).subscribe((response) => {
        this.Tweezes = response
        
        // if user_liked is undifined in certain tweezes
        
        // response.forEach((tweez) =>{
        //   let likes: any[] = []
        //   if(tweez.user_liked !== undefined)
        //   {
        //     likes = tweez.user_liked
        //   } 

        //   // avoid doing this by getting all tweezes a definied user_liked array
        //   this.Tweezes.push({
        //     id: tweez.id,
        //     username: tweez.username,
        //     created_at: tweez.created_at,
        //     image: tweez.image,
        //     content: tweez.content,
        //     likes: tweez.likes,
        //     profile_picture: tweez.profile_picture,
        //     user_id: tweez.user_id,
        //     user_liked: likes
        //   })

        // })

      });
    })
  }

}
