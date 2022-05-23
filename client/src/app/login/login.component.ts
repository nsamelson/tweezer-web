import { Component, NgZone, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  

  
  constructor(
    private http: HttpClient,
    private router: Router,
    private zone: NgZone,) {
      
  }


  ngOnInit(): void {
  }

  hide = true       //hide password
  isSignup = false


  // get form data
  email = new FormControl('', [Validators.required, Validators.email]);
  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  signup(): Promise<void>{
    console.log("signin up")
    const url = 'http://localhost:3000/auths/signup';
    const params = {};
    const headers = {"Content-Type": "application/json",'accept': 'application/json'};
    const data = JSON.stringify({
      email: this.email,
      password: this.password,
      username: this.username,
    }, this.getCircularReplacer())

    return new Promise((resolve, reject)=>{

      this.http.post(url,{params,headers, data})
        .subscribe((response) => {
          this.zone.run(() =>{
            this.router.navigate(['/home'])
            

          })
          
        })
    })
  }

  signin(): Promise<void>{
    console.log("signin in")
    const url = 'http://localhost:3000/auths/signin';
    const params = {};
    const headers = {"Content-Type": "application/json",'accept': 'application/json'};
    const data = JSON.stringify({
      email: this.email,
      password: this.password
    }, this.getCircularReplacer())

    return new Promise((resolve, reject)=>{

      this.http.post(url,{params,headers, data})
        .subscribe((response) => {
          this.zone.run(() =>{
            this.router.navigate(['/home'])
            

          })
          
        })
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
