import Route from '@ioc:Adonis/Core/Route';

const namespace = 'App/Controllers/Http/Api';

/*
|--------------------------------------------------------------------------|
|                             Authorization
|--------------------------------------------------------------------------|
*/

Route.group(() => {
  Route.post('login_with_email', 'AuthorizationController.loginWithEmail');
})
  .prefix(`/api/authorization`)
  .namespace(namespace)
  .middleware(['guest']);

Route.group(() => {
  /*
  |--------------------------------------------------------------------------|
  |                             Users
  |--------------------------------------------------------------------------|
  */
  Route.group(() => {
    Route.post('actions', 'UsersController.actions');
  }).prefix('/users');

  /*
  |--------------------------------------------------------------------------|
  |                             Sections
  |--------------------------------------------------------------------------|
  */

  Route.post('actions', 'SectionsController.actions').prefix('/sections');
  /*
  |--------------------------------------------------------------------------|
  |                             Notes
  |--------------------------------------------------------------------------|
  */
  Route.group(() => {
    Route.post('search', 'NotesController.search');
    Route.post('actions', 'NotesController.actions');
  }).prefix('/notes');

  /*
  |--------------------------------------------------------------------------|
  |                             Sources
  |--------------------------------------------------------------------------|
  */

  Route.post('actions', 'SourcesController.actions').prefix('/sources');
  /*
  |--------------------------------------------------------------------------|
  |                             Books
  |--------------------------------------------------------------------------|
  */

  Route.group(() => {
    Route.post('search', 'BooksController.search');
    Route.post('actions', 'BooksController.actions');
  }).prefix('/books');

  /*
  |--------------------------------------------------------------------------|
  |                             Tags
  |--------------------------------------------------------------------------|
  */

  Route.group(() => {
    Route.post('search', 'TagsController.search');
    Route.post('actions', 'TagsController.actions');
  }).prefix('/tags');

  /*
  |--------------------------------------------------------------------------|
  |                             Misc actions
  |--------------------------------------------------------------------------|
  */

  Route.group(() => {
    Route.post('actions', 'MiscActionsController.actions');
  }).prefix('/misc');
})
  .prefix('/api')
  .middleware(['auth'])
  .namespace(namespace);
