//Import the parent View
import View from './View.js';

//Importing icons:Parcel 2 way of importing images
import icons from 'url:../../img/icons.svg';

class resultsView extends View {
  _parentElement = document.querySelector('.results');
  _ErrorMessage =
    'We could not find any results for this query, please try another one.';
  _message = '';

  //Add event handler to the parent element
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(e => window.addEventListener(e, handler));
  }

  //join all recipes markups.
  _generateMarkup() {
    return this._data.map(res => this._generateMarkupPreview(res)).join('');
  }

  //Generating the markup for the recipe
  _generateMarkupPreview(data) {
    return `
    <li class="preview">
        <a class="preview__link" href="#${data.id}">
            <figure class="preview__fig">
                <img src="${data.image}" alt="${data.query} recipe image" />
            </figure>
            <div class="preview__data">
                <h4 class="preview__title">${data.title} ...</h4>
                <p class="preview__publisher">${data.publisher}</p>                
            </div>
        </a>
    </li>
  `;
  }
}

export default new resultsView();
