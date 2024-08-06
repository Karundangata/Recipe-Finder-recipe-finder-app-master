//import the necessary dependencies for the component to work correctly
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';

//component decorator which defines the meta data for our application
@Component({
  //special nick name for our component. It can be used as a directive
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  //tell angular where to find the html template
  templateUrl: './login.component.html',
  //tell angular where to find the styles or our component
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  //declare necessary properties to hold values enterd by the user in the login form
  email!: string;
  password!: string;
  error!: string;

  //create a component that gets called when our component is created
  constructor(private router: Router, private userService: UserService) {}

  isEmailValid(): boolean {
    const emailRegex: RegExp =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(this.email);
  }

  //function that gets called when a user clicks a button to log in
  //void - doesnt return anything
  //when the user clicks the login button, this function will be executed
  loginUser(): void {
    console.log('login button clicked');

    // Check if the email and password are not empty
    if (!this.email || !this.password) {
      this.error = 'Please enter both email and password';
      return;
    }

    if (!this.isEmailValid()) {
      this.error = 'Please enter a valid email address';
      return;
    }

    //we use userService to make a request to get user data based on their email
    //we subscribe to the response of request which means we wait for it to complete and get the result
    //call a method getUserByEmail and pass in users email as an argument
    //takes two functions as an argument.
    // one to handle the success case and the other to handle errors
    this.userService.getUserByEmail(this.email).subscribe(
      (user) => {
        console.log(user);

        //if user is found and the password matches the entered passsword
        if (user && user.password === this.password) {
          //we log a success message with user details
          console.log('User logged in successfully', user);
          //store their credentials in local browser
          localStorage.setItem('credentials', JSON.stringify(user));
          //navigate them to dashboard
          this.router.navigate(['/dashboard']);
        } else {
          //if the user is not found or the password does not match
          //we set an error messsage in the error variable
          this.error = 'Invalid email or password';
        }
      },
      //if there is an eror while getting the users data
      (error) => {
        //we log the erorr in the console
        console.error('Error logging in', error);
        //set an error message to be displayed
        this.error = 'An error ocurred while logging in';
      }
    );
  }
}
