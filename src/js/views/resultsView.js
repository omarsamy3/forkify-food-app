//Import the parent View
import previewView from './previewView.js';
class resultsView extends previewView {
  _parentElement = document.querySelector('.results');
  _ErrorMessage =
    'We could not find any results for this query, please try another one.';
}

export default new resultsView();
