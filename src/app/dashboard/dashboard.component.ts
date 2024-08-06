//miport the component decorator from angular core
import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../interfaces/recipe.interface';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SearchPipe } from '../pipes/search.pipe';
import { Router } from '@angular/router';
import { User } from '../interfaces/User';
import { UserService } from '../services/user.service';

//use the component decorator to define our component
@Component({
  //define a custom html tag for our component
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchPipe, ReactiveFormsModule],
  //define the html tag that contains the template for this component
  templateUrl: './dashboard.component.html',
  //define css styles that contain the styles for this component
  styleUrls: ['./dashboard.component.css'],
})

//typescript class that represents our component
export class DashboardComponent implements OnInit {
  //define properties for our component and initialize them with default values
  //form to enter ingredients is initially hidden
  showForm: boolean = false;
  //there is no initial value for the ingridientName
  name: string = '';
  description: string = '';
  ingredients: [] = [];
  cookingInstructions: string = '';
  preparationTime: string = '';
  servings: string = '';
  //no initial notes for the ingredient
  notes: string = '';
  recipes: Recipe[] = [];

  selectedRecipe: Recipe | undefined;
  searchQuery: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 2;

  //edit user profile
  showUserProfile: boolean = false;
  editingProfile: boolean = false;

  recipeForm!: FormGroup;

  //stores info of the current logged in user
  //null indicates there is no logged in user
  // = null is the initial value assigned to currentUser
  //by default when component is initialized there is no logged in user so value is set to null
  currentUser: User | null = null;

  //we have used dependecy injection
  //allows us to access methods and properties of Ingridient service inside our component
  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  logout(): void {
    localStorage.removeItem('credentials');
    this.router.navigate(['/signin']);
  }

  ngOnInit(): void {
    this.loadRecipes();
    this.loadCurrentUser();
    this.createRecipeForm();
  }

  loadRecipes(): void {
    this.recipeService.getRecipes().subscribe(
      (recipes) => {
        this.recipes = recipes;
      },
      (error) => {
        console.log('Error fetching recipes', error);
      }
    );
  }

  //void - a function with no return value
  addRecipe(): void {
    if (this.recipeForm.valid) {
      const newRecipe: Recipe = {
        id: 0,
        name: this.recipeForm.value.name,
        description: this.recipeForm.value.description,
        ingredients: this.recipeForm.value.ingredients,
        cookingInstructions: this.recipeForm.value.cookingInstructions,
        preparationTime: this.recipeForm.value.preparationTime,
        servings: this.recipeForm.value.servings,
      };

      this.recipeService.addRecipe(newRecipe).subscribe(
        (response) => {
          console.log('Recipe added successfully', response);
          this.recipeForm.reset(); // Reset form controls
          this.recipeForm.markAsPristine(); // Mark form as pristine
          this.recipeForm.markAsUntouched(); // Mark form as untouched
          this.cancelForm();
        },
        (error) => {
          console.log('Error adding recipe', error);
        }
      );
    } else {
      // Display validation errors
      this.recipeForm.markAllAsTouched();
    }
  }

  toggleForm(): void {
    console.log('toggle form clicked');

    this.showForm = !this.showForm;
  }

  cancelForm(): void {
    //clears value of the ingridientName in the form
    this.name = '';
    this.description = '';
    this.ingredients = [];
    this.cookingInstructions = '';
    this.preparationTime = '';
    this.servings = '';
    this.showForm = false;
  }

  openRecipeDetails(recipe: Recipe): void {
    this.selectedRecipe = recipe;
  }

  closeRecipeDetails(): void {
    this.selectedRecipe = undefined;
  }

  //method declaration
  //:void - indicates that the method does not return any value
  loadCurrentUser(): void {
    //retrieves value associated with the key credentials from local storage
    const userJson = localStorage.getItem('credentials');

    //checks if userJson variable is null or undefined
    //checks if there is user data stored in local storage
    if (userJson) {
      //prepopulates the current user property
      //json.parse converts string to object
      this.currentUser = JSON.parse(userJson);
    }
  }

  toggleUserProfile(): void {
    this.showUserProfile = !this.showUserProfile;
  }

  editUserProfile(): void {
    this.editingProfile = true;
  }

  cancelEditUserProfile(): void {
    this.editingProfile = false;
  }

  saveUserProfile(): void {
    // Save the updated user profile to local storage
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

    // Close the edit form and refresh the view
    this.editingProfile = false;
  }

  saveUserDetails(): void {
    if (this.currentUser) {
      // Logic to save user details goes here
      // For example, you can update the currentUser object and save it back to localStorage
      // localStorage.setItem('credentials', JSON.stringify(this.currentUser));
      // this.editingProfile = false; // Exit editing mode
      if (this.currentUser) {
        // Logic to save user details goes here
        this.userService.updateUserProfile(this.currentUser).subscribe(
          (response) => {
            console.log('User details updated successfully', response);
            localStorage.setItem(
              'credentials',
              JSON.stringify(this.currentUser)
            );
            this.editingProfile = false; // Exit editing mode
          },
          (error) => {
            console.log('Error updating user details', error);
          }
        );
      }
    }
  }

  // Define a method to close the user details pop-up
  closeUserDetails(): void {
    // Logic to close the user details pop-up goes here
    // this.currentUser = null; // Reset the currentUser object to null to close the pop-up
    this.showUserProfile = false;
  }

  openUserProfileDialog(): void {
    this.loadCurrentUser();
    this.editingProfile = false;
    this.showUserProfile = true;
  }

  hideUserProfileDialog(): void {
    this.showUserProfile = false;
  }

  createRecipeForm(): void {
    this.recipeForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      ingredients: ['', Validators.required],
      cookingInstructions: ['', Validators.required],
      preparationTime: ['', Validators.required],
      servings: ['', Validators.required],
    });
  }
}

// const jsonString = '{"name":"Sam","age":22,"city":"Nyeri"}';
// const parsedObject  = JSON.parse(jsonString)

// console.log(parsedObject.name)
// console.log(parsedObject.age)
// console.log(parsedObject.city)
