//Import from model.js
import * as model from './model.js';
//Import from views/recipeView.js
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

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

    //0. Update results and bookmarks views.
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

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

//Function to control the view of pagination buttons
const controlPagination = async function (goToPage) {
  //Render the pagination buttons.
  resultsView.render(model.getSearchResultsPage(goToPage));

  //Render the recipes result.
  paginationView.render(model.state.search);
};

//Function to control the servings view if changed.
const controlServings = function (newServings) {
  //Update the servings with the new servings.
  model.updateServings(newServings);

  //Rerender the recipe view.
  recipeView.update(model.state.recipe);
};

//Function to control the bookmark button.
const controlAddBookmark = function () {
  //Add or remove bookmark of this recipe.
  !model.state.recipe.bookmarked
    ? model.addBookmark(model.state.recipe)
    : model.deleteBookmark(model.state.recipe.id);

  //update the recipe view.
  recipeView.update(model.state.recipe);

  //render the bookmarks list.
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

//Publisher subscriber pattern.
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
};

//subscribing to different events.
init();
