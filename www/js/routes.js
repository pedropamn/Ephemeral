
var routes = [
  {
    path: '/',
    url: './index.html',
  },
  {
    path: '/mylinks/',
    url: './pages/mylinks.html',
  },
  {
    path: '/contact/',
    url: './pages/contact.html',
  },

  {
    path: '/about/',
    url: './pages/about.html',
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
