import Route from '@ioc:Adonis/Core/Route';

const namespace = 'App/Controllers/Http/Main';

Route.get('login', 'AuthorizationPagesController.login').middleware(['guest']).namespace(namespace);
Route.get('logout', 'AuthorizationPagesController.logout').namespace(namespace);

//Route.get('dev/test', 'DevController.test');

Route.group(() => {
  Route.get('/', 'InternalPagesController.main');

  Route.get('/*', 'InternalPagesController.main');
})
  .middleware(['auth'])
  .namespace(namespace);
