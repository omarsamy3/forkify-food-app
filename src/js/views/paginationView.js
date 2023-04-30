//Import the parent View
import View from './View.js';

//Importing icons:Parcel 2 way of importing images
import icons from 'url:../../img/icons.svg';

class paginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const pagesNumbers = this._data.pagesNumbers;
    const page = this._data.page;
    return `
        ${
          pagesNumbers <= 1
            ? '' //Only one page.
            : page == 1 && page < pagesNumbers
            ? this._getRightBtn(page + 1) //If in the first page.
            : page == pagesNumbers
            ? this._getLeftBtn(page - 1) //If in the last page.
            : this._getLeftAndRightBtns(page) //If in the middle of pages.
        }
        
    `;
  }

  //Get left button markup.
  _getLeftBtn(page) {
    return `
          <button data-goto="${page}" class="btn--inline pagination__btn--prev">
              <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
              </svg>
              <span>Page ${page}</span>
          </button>
      `;
  }

  //Get right button markup.
  _getRightBtn(page) {
    return `
        <button data-goto="${page}" class="btn--inline pagination__btn--next">
            <span>Page ${page}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
  }

  //Get both left and right markup.
  _getLeftAndRightBtns(page) {
    return this._getLeftBtn(page - 1) + this._getRightBtn(page + 1);
  }

  //Add event handler to the parent element
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
}

//Export an instance of the class.
export default new paginationView();
