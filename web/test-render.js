const React = require('react');
const ReactDOMServer = require('react-dom/server');

// We need Babel to transpile JSX on the fly to test it, or we can just use the vite dev server.
// Actually, since vite is running, I can fetch the page from localhost:5176 and see if it crashes.
