//import the api url
import { API_URL } from './config.js';
import { RES_PER_PAGE } from './config.js';
//import the getJSON function
import { getJSON } from './views/helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    ressultsPerPage: RES_PER_PAGE,
    pagesNumbers: 1,
  },
  bookmarks: [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);

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

    //Check if bookmarked.
    if (state.bookmarks.find(b => b.id == id)) state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    //Temp error handling
    throw err;
  }
};

//Load Search results
export const loadSearchResults = async function (query) {
  try {
    //Reset the page number.
    state.search.page = 1;
    //Set the query value.
    state.search.query = query;
    //Get the data related to this query keyword.
    const { data } = await getJSON(`${API_URL}?search=${query}`);
    //Fill the results array with the returned recipes.
    state.search.results = data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        query: query,
      };
    });
  } catch (err) {
    throw err;
  }
};

//Get recipes chunk, from the page number
export const getSearchResultsPage = function (page = state.search.page) {
  //store the current page
  state.search.page = page;

  //Store the pages number.
  state.search.pagesNumbers = Math.ceil(
    state.search.results.length / state.search.ressultsPerPage
  );

  //Get the boundries of the page.
  const start = (page - 1) * state.search.ressultsPerPage;
  const end = page * state.search.ressultsPerPage;

  //Return the page results.
  return state.search.results.slice(start, end);
};

//Update the Servings if buttons are clicked.
export const updateServings = function (newServings) {
  this.state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / this.state.recipe.servings;
  });
  this.state.recipe.servings = newServings;
};

//Add a bookmark for a recipe.
export const addBookmark = function (recipe) {
  if (recipe.id === state.recipe.id) {
    //Add bookmark.
    state.recipe.bookmarked = true;
    //Add the recipe to bookmark array.
    state.bookmarks.push(recipe);
  } else if (state.recipe.bookmarked) {
    //remove bookmark.
    state.recipe.bookmarked = false;
    //remove the recipe to bookmark array.
    state.bookmarks.splice(state.bookmarks.indexOf(recipe), 1);
  }
};

//delete a bookmark for a recipe.
export const deleteBookmark = function (id) {
  //remove bookmark.
  state.recipe.bookmarked = false;
  //remove the recipe to bookmark array.
  if (id === state.recipe.id)
    state.bookmarks.splice(
      state.bookmarks.findIndex(el => el.id == id),
      1
    );
};
