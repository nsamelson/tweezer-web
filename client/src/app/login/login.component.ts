import { Component, NgZone, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide = true       //hide password
  isSignup = false


  // get form data
  email = new FormControl('', [Validators.required, Validators.email]);
  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  
  constructor(
    private http: HttpClient,
    private router: Router,
    private zone: NgZone,
    private userService: UserService) {
      
  }

  ngOnInit(): void {
  }

  // ================ Error handling =============== //
  
  /** Display if the email has an error
   * 
   * @returns error message
   */
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  // =============== API calls ================== //

  /** Create a new user account
   * 
   * @returns Promise: calls 'getCurrentUser()' to update the user and navigates to the home page
   */
  signup(): Promise<void>{
    // console.log("signin up")
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

            this.getCurrentUser()
            this.router.navigate(['/home'])           

          })          
        })
    })
  }

  /** Logs in with existing user account
   * 
   * @returns Promise: calls 'getCurrentUser()' to update the user and navigates to the home page
   */
  signin(): Promise<void>{
    // console.log("signin in")
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
            
            this.getCurrentUser()
            this.router.navigate(['/home'])
            
          })
          
        })
    })
  }

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
          // TODO: optimize this func and get user inf directly after signin
          this.userService.userDetail.next(response);
          // console.log(response)
          
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
