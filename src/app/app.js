import angular from 'angular';
import ngAnimate from 'angular-animate';
import ngResource from 'angular-resource';
import ngInfiniteScroll from 'ng-infinite-scroll';
import ngBootstrap from 'angular-ui-bootstrap';
import ngFileUpload from 'ng-file-upload';
import ngMoment from 'angular-moment';
import msdElastic from 'angular-elastic';
import * as firebase from "firebase";
import pages from './pages/pages';
import components from './components/components';
import services from './services/services';
import directives from './directives/directives';
import 'font-awesome';
import 'normalize.css';
import 'animate.css';
import './app.scss';
import searchModalTemplate from './components/search-results/search-results.html';

angular.module('app', [
  ngAnimate,
  ngResource,
  ngInfiniteScroll,
  ngBootstrap,
  ngFileUpload,
  ngMoment,
  msdElastic,
  pages,
  components,
  services,
  directives
])

.constant('$url', '/api')
.constant('G1FeedURL', 'http://g1.globo.com/dynamo/rss2.xml')
.constant('ABERTFeedURL', 'http://www.abert.org.br/web/index.php/component/obrss/rssabert')

.config(($locationProvider, $sceDelegateProvider, G1FeedURL, ABERTFeedURL) => {
  "ngInject";
  $locationProvider.html5Mode(true);
  $sceDelegateProvider.resourceUrlWhitelist([G1FeedURL, ABERTFeedURL]);
});

var config = {
  apiKey: "AIzaSyC3ChCuYZAMvDi5TWOZR4LWSKw8NEQtBmg",
  authDomain: "mobi-140607.firebaseapp.com",
  databaseURL: "https://mobi-140607.firebaseio.com",
  projectId: "mobi-140607",
  storageBucket: "mobi-140607.appspot.com",
  messagingSenderId: "464130936707"
};
firebase.initializeApp(config);

window.fbAsyncInit = () => {
  FB.init({
    appId      : '1768503930105725',
    xfbml      : true,
    status     : true,
    version    : 'v2.9'
  });
  FB.AppEvents.logPageView();

  angular.bootstrap(document, ['app']);
};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));