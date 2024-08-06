//import the necessary dependecnies
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from '../interfaces/User';

//marks UserService as an injectable service
@Injectable({
  //makes this service available throughout the application
  providedIn: 'root',
})

//UserService is exported and defined
export class UserService {
  //stores base Url for the api
  // private baseUrl = 'http://localhost:3000';
  private baseUrl = 'https://angular-recipe-finder-app-a68fcba96040.herokuapp.com';

  //HttpClient is injected as a dependency
  constructor(private http: HttpClient) {}

  //createUser method takes in user as an object of type User
  //user object represents data we want to send to the api for creation
  //represents the data of the user we want  to create
  //returns an observable of type user to represent asynchronous nature of http call
  //observable  - container represents stream of asynchronous data
  //reponse should be of type user
  createUser(user: User): Observable<User> {
    //post request is made using http client
    //htpp post request made using http client to the url
    //user object passed as a request payload - data sent from client to server
    //user object passed as a second argument
    //conatins users information such as name, email, password
    //expects server to respond to respond with a User object
    //returns an observable of type User
    //by subscribing to the observable you can you can obtain th response from the server
    //and perform necessary actions based on the result
    //this.http - instance of the http client tahat was injected into the User Service class
    return this.http.post<User>(`${this.baseUrl}/users`, user);
  }

  //method which takes an email parameter of type string
  //method returns an observable<User> which is a stream of user objects
  getUserByEmail(email: string): Observable<User | undefined> {
    //this line uses http property which is an instance of HttpClient to make a Http Get request
    //the generic parameter <User> is the expected response type
    //the get method is called with the following arguments
    //the url - this constructs the url by concatinating the base url with the path users
    //and the query parameter email
    return this.http.get<User[]>(`${this.baseUrl}/users?email=${email}`).pipe(
      map((users: User[]) => users.find((user: User) => user.email === email))
    )
  }

    // Update user profile on the server
    updateUserProfile(user: User): Observable<User> {
      const url = `${this.baseUrl }/users/${user.id}`;
      return this.http.put<User>(url, user);
    }
}
