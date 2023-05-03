//Import the parent View
import View from './View.js';

//Importing icons:Parcel 2 way of importing images
import icons from 'url:../../img/icons.svg';

export default class previewView extends View {
  _message = '';

  //join all recipes
  _generateMarkup() {
    return this._data.map(res => this._generateMarkupPreview(res)).join('');
  }

  //Generating the markup for the recipe
  _generateMarkupPreview(data) {
    const id = window.location.hash.slice(1);
    return `
    <li class="preview">
        <a class="preview__link ${
          id === data.id ? 'preview__link--active' : ''
        }" href="#${data.id}">
            <figure class="preview__fig">
                <img src="${data.image}" alt="${data.query} recipe image" />
            </figure>
            <div class="preview__data">
                <h4 class="preview__title">${data.title} ...</h4>
                <p class="preview__publisher">${
                  data.publisher
                }</p>                
            </div>
        </a>
    </li>
  `;
  }
}

// export default new previewView();
