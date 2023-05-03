//Import the parent View
import previewView from './previewView.js';

class bookmarksView extends previewView {
  _parentElement = document.querySelector('.bookmarks__list');
  _ErrorMessage =
    'There are no bookmarks to view. add bookmarks to some recipes to show here😊';
}

export default new bookmarksView();
