export default function RadioController($state, $util, $user, $radio, $profile, $anchorScroll) {
  "ngInject";

  const $ctrl = this;

  let
    postsPage = 1,
    reviewsPage = 1,
    similarPage = 1,
    radioId = $state.params.radioId;

  $ctrl.getImageURL = $util.getImageURL;
  $ctrl.getFileURL = $util.getFileURL;
  $ctrl.isIdentified = $user.isIdentified;

  $ctrl.plays = [];
  $ctrl.tab = 'wall';
  $ctrl.day = 'day0';
  $ctrl.postsState = 'idle';
  $ctrl.similarState = 'idle';
  
  $radio.radio.get({ id: radioId }).$promise.then(response => {$ctrl.radio = response.data; $ctrl.plays.push($ctrl.radio)});
  $radio.score.get({ id: radioId }).$promise.then(response => $ctrl.score = response.data);
  $radio.phones.get({ id: radioId }).$promise.then(response => $ctrl.phones = response.data);
  $radio.addresses.get({ id: radioId }).$promise.then(response => $ctrl.addresses = response.data);
  $radio.socials.get({ station: radioId }).$promise.then(response => $ctrl.socials = response.data);
  $radio.programs.get({ id: radioId }).$promise.then(response => $ctrl.programs = response.data);
  $radio.posts.get({ id: radioId, pageSize: 5, pageNumber: 0 }).$promise.then(response => $ctrl.posts = response.data.records);
  $radio.reviews.get({ id: radioId, pageSize: 5, pageNumber: 0 }).$promise.then(response => $ctrl.reviews = response.data.records);
  $radio.similar.get({ id: radioId, pageSize: 5, pageNumber: 0 }).$promise.then(response => $ctrl.similar = response.data.records);

  $ctrl.loadMorePosts = () => {
    if ($ctrl.radioState != 'idle') return;
    $ctrl.postsState = 'working';

    $radio.posts.get({ id: radioId, pageSize: 5, pageNumber: postsPage })
      .$promise.then(response => {
        if (response.data.records) {
          if (!$ctrl.posts) $ctrl.posts = [];
          $ctrl.posts = $ctrl.posts.concat(response.data.records);
          $ctrl.postsState = 'idle';
          postsPage++;
        } else {
          $ctrl.postsState = 'no-more-content';
        }
      });
  };

  $ctrl.loadMoreSimilar = () => {
    if ($ctrl.similarState != 'idle') return;
    $ctrl.similarState = 'working';
    $radio.similar.get({ id: radioId, pageSize: 5, pageNumber: similarPage })
      .$promise.then(similar => {
        if (similar.data.records) {
          if (!$ctrl.similar) $ctrl.similar = [];
          $ctrl.similar = $ctrl.similar.concat(similar.data.records);
          $ctrl.similarState = 'idle';
          similarPage++;
        } else {
          $ctrl.similarState = 'no-more-content';
        }
      });
  };

  $ctrl.selectTab = tab => {
    if ($ctrl.tab == tab) return;
    $ctrl.tab = tab;
  };

  $ctrl.selectDay = day => {
    if ($ctrl.day == day) return;
    $ctrl.day = day;
  };  

  $ctrl.favoritePlay = (play) => {
    var _play;    
    for (var r in $ctrl.plays) {
      if ($ctrl.plays[r].id == play.id) {
        _play = $ctrl.plays[r];
        break;
      }
    }
    if (play.favorite) {
      $profile.unfavoritestation(play);      
      _play.favorite = play.likes - 1;
      _play.favorite = false;
    }
    else {
      $profile.favoritestation(play);    
      _play.favorite = play.likes + 1;
      _play.favorite = true;
    }
  }

  $ctrl.favorite = (radio) => {
    var _radio;
    for (var r in $ctrl.similar) {
      if ($ctrl.similar[r].id == radio.id) {
        _radio = $ctrl.similar[r];
        break;
      }
    }
    if (radio.favorite) {
      $profile.unfavoritestation(radio);
      _radio.favorite = radio.likes - 1;
      _radio.favorite = false;
    }
    else {
      $profile.favoritestation(radio);
      _radio.favorite = radio.likes + 1;
      _radio.favorite = true;
    }
  }

  $ctrl.goToRadio = id => {
    $anchorScroll();
    $state.go('radio', { radioId: id });
  };
};
