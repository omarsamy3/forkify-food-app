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
  } catch (err) {
    //Temp error handling
    throw err;
  }
};

//Load Search results
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const { data } = await getJSON(`${API_URL}?search=${query}`);
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
