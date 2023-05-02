//Import from model.js
import * as model from './model.js';
//Import from views/recipeView.js
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'core-js/stable'; // Polyfilling everything (to support older browsers)
import 'regenerator-runtime/runtime'; // Polyfilling async await
import { async } from 'regenerator-runtime';

// if (module.hot) {
//   module.hot.accept();
// }

//Function to load the choosen recipe.
const controlRecipes = async function () {
  try {
    //Getting the id of the recipe from the url
    const id = window.location.hash.slice(1);

    //Guard clause
    if (!id) return;

    //Rendering the spinner
    recipeView.renderSpinner();

    //0. Update results view to mark selected search result.
    resultsView.update(model.getSearchResultsPage());

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
  resultsView.render(model.getSearchResultsPage());

  //Render initial pagination buttons.
  paginationView.render(model.state.search);
};

const controlPagination = async function (goToPage) {
  //Render the pagination buttons.
  resultsView.render(model.getSearchResultsPage(goToPage));

  //Render the recipes result.
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the servings with the new servings.
  model.updateServings(newServings);

  //Rerender the recipe view.
  recipeView.update(model.state.recipe);
};

//Publisher subscriber pattern.
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

//subscribing to the hashchange and load events
init();
