//type safety - data is used and manipulated in a consistent and predicatble manner based on its data type
//e.g you cannot assign a string value to a variable declared as a number

import { User } from "./User";

//you cannot perform arithmentic operations on variables of incompatible data types (e.g adding a string and a number)
export interface Recipe{
    //this property is optional
    id?:number;
    name:string;
    description:string;
    ingredients:string[];
    cookingInstructions:string;
    preparationTime:string;
    servings:string;
}