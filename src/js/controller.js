//Import from model.js
import * as model from './model.js';
//Import from views/recipeView.js
import recipeView from './views/recipeView.js';

import 'core-js/stable'; // Polyfilling everything (to support older browsers)
import 'regenerator-runtime/runtime'; // Polyfilling async await

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

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

//Publisher subscriber pattern.
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
};

//subscribing to the hashchange and load events
init();
