import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import 'react-toastify/dist/ReactToastify.css';

import Root from './Root';

ReactDOM.render(<Root />, document.getElementById('root'));

serviceWorker.unregister();
