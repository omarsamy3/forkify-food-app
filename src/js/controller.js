//Import from model.js
import * as model from './model.js';
//Import from views
import recipeView from './views/recipeView.js';

import 'core-js/stable'; // Polyfilling everything (to support older browsers)
import 'regenerator-runtime/runtime'; // Polyfilling async await

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

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
    alert(err);
  }
};

//Adding event listener to the window
['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipes));
