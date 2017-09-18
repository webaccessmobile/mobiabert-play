import angular from 'angular';
import navbarComponent from './navbar/navbar.component';
import footerComponent from './footer/footer.component';
import loginComponent from './login/login.component';
import registerComponent from './register/register.component';
import radioSliderComponent from './radio-slider/radio-slider.component';
import searchFormComponent from './search-form/search-form.component';
import searchResultsComponent from './search-results/search-results.component';
import userResultsComponent from './user-results/user-results.component';
import genresComponent from './genres/genres.component';
import player from './player/player.component';

export default angular.module('app.components', [])

.component('mpNavbar', navbarComponent)
.component('mpFooter', footerComponent)
.component('mpLogin', loginComponent)
.component('mpRegister', registerComponent)
.component('mpRadioSlider', radioSliderComponent)
.component('mpSearchForm', searchFormComponent)
.component('mpSearchResults', searchResultsComponent)
.component('mpUserResults', userResultsComponent)
.component('mpGenres', genresComponent)
.component('mpPlayer', player)

.name;
