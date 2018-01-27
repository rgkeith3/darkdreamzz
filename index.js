import css from './stylesheet.css';
import App from './js/App';

const init = () => {
  console.log('fashion');
  const app = new App();
  window.app = app;
  app.start()
}

document.addEventListener('DOMContentLoaded', init)
