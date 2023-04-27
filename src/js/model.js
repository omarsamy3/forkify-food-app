//import the api url
import { API_URL } from './config.js';
//import the getJSON function
import { getJSON } from './views/helpers.js';

export const state = {
  recipe: {},
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);

    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    console.log(state.recipe);
  } catch (err) {
    //Temp error handling
    throw err;
  }
};

//Search results
export const loadSearchResults = async function (query) {
  try {
    const res = await fetch(`${API_URL}?search=${query}`);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    console.log(data);
  } catch (err) {
    throw err;
  }
};
