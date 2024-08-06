import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Recipe } from '../interfaces/recipe.interface';

@Injectable()
@Pipe({
  name: 'search',
  standalone:true
})

//we use the PipeTransform interface meaning we will have to use the transform method
export class SearchPipe implements PipeTransform {
  transform(recipes: Recipe[], searchQuery: string): Recipe[] {
    //first checks if recipes is empty, if it is it returns the original recipes array
    if (!searchQuery) {
      return recipes;
    }

    //if searchQuery is not empty it converts it to lower case to make the search case insensitive
    const lowerCaseQuery = searchQuery.toLowerCase();

    //uses the filter method on the recipes array to find recipes that match the search query
    return recipes.filter((recipe) => {
      return (
        //checks if name of a recipe includes lowercase query
        recipe.name.toLowerCase().includes(lowerCaseQuery)
      );
    });
  }
}
