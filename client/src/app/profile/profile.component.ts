import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private router: Router) { }
  cards = [1,2,3,4]

  ngOnInit(): void {
  }

  goToHome(){
    console.log("home")
    this.router.navigate(['/home'])
  }

}
