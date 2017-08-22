import angular from 'angular';
import uiRouter from 'angular-ui-router';
import home from './home/home';
import profile from './profile/profile';
import radio from './radio/radio';
import about from './about/about';
import news from './news/news';

export default angular.module('app.pages', [
  uiRouter
])

.config(($stateRegistryProvider, $transitionsProvider) => {
  "ngInject";

  $stateRegistryProvider.register({
    name: 'home',
    url: '/',
    template: home.template,
    controller: home.controller,
    controllerAs: '$ctrl'
  });

  $stateRegistryProvider.register({
    name: 'profile',
    url: '/profile/:id',
    template: profile.template,
    controller: profile.controller,
    controllerAs: '$ctrl'
  });

  $stateRegistryProvider.register({
    name: 'radio',
    url: '/radio/:radioId',
    template: radio.template,
    controller: radio.controller,
    controllerAs: '$ctrl'
  });

  $stateRegistryProvider.register({
    name: 'about',
    url: '/sobre',
    template: about.template
  });

  $stateRegistryProvider.register({
    name: 'news',
    url: '/noticias',
    template: news.template,
    controller: news.controller,
    controllerAs: '$ctrl'
  });

  /**
   * Registra um gancho que verifica as credenciais e perfil do usuário
   * antes de entrar no estado "panel"
  $transitionsProvider.onBefore({
    entering: 'home'
  }, trans => {
    //Carrega as dependências
    let $auth = trans.injector().get('$auth');

    $auth.isAuthenticated();

    return true;
  }, {priority: 10});
  */

  //Gancho de transição que fecha o modal e vai para o topo da página
  $transitionsProvider.onStart({}, trans => {
    let
      $modal = trans.injector().get('$modal'),
      $anchorScroll = trans.injector().get('$anchorScroll');
      
    $modal.close();
    $anchorScroll();
    return true;
  })
})

.name;