import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  public userDetail: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor() { }
}
