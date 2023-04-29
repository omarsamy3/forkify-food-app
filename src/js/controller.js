//Import from model.js
import * as model from './model.js';
//Import from views/recipeView.js
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';

import 'core-js/stable'; // Polyfilling everything (to support older browsers)
import 'regenerator-runtime/runtime'; // Polyfilling async await

if (module.hot) {
  module.hot.accept();
}

//Function to load the choosen recipe.
const controlRecipes = async function () {
  try {
    //Getting the id of the recipe from the url
    const id = window.location.hash.slice(1);

    //Guard clause
    if (!id) return;

    //Rendering the spinner
    recipeView.renderSpinner();

    //1. Loading recipe
    await model.loadRecipe(id);

    //2. Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

//Function to load the recipes for the search result.
const controlSearchResults = async function () {
  //1. Render Spinner
  resultsView.renderSpinner();

  //2. Get search query
  const query = searchView.getQuery();
  if (!query) return;

  //3. Load search results.
  await model.loadSearchResults(query);

  //4. Render results.
  resultsView.render(model.state.search.results);
};

//Publisher subscriber pattern.
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};

//subscribing to the hashchange and load events
init();
