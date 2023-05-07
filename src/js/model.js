import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './views/helpers.js';

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
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

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
    const { data } = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    //Fill the results array with the returned recipes.
    state.search.results = data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        query: query,
        ...(rec.key && { key: rec.key }),
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

//Store bookmarks in the local storage.
const persistBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
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

  persistBookmark();
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

  persistBookmark();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].includes('ingredient') && entry[1] !== '')
      .map(ing => getIngredientsObject(`${ing[1]}`));

    //Get the recipe object to be uploaded.
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    //Upload the recipe to the server.
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

//convert a string ingredient to an object.
const getIngredientsObject = function (ingredient) {
  try {
    //Get the ingredient as an array.
    const ingArr = ingredient.split(',').map(ele => ele.trim());

    //Check the format of the ingredient input format.
    if (ingArr.length !== 3)
      throw new Error(
        'Wrong ingredient format! Please use the correct format 😊'
      );

    //Return the ingredient object.
    return {
      quantity: ingArr[0] ? +ingArr[0] : null,
      unit: ingArr[1],
      description: ingArr[2],
    };
  } catch (err) {
    throw err;
  }
};
