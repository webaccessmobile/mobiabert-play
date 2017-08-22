export default function RadioController ($state, $util, $user, $api, $anchorScroll, $profile) {
  "ngInject";

  const $ctrl = this;

  let
    postsPage = 1,
    similarPage = 0,
    radioId = $state.params.radioId;

  $ctrl.getImageURL = $util.getImageURL;
  $ctrl.getFileURL = $util.getFileURL;
  $ctrl.isIdentified = $user.isIdentified;

  $ctrl.postsState = 'idle';
  $ctrl.similarState = 'idle';
  $ctrl.tab = 'wall';
  $ctrl.radio = $api.radios.get({id: radioId});
  $ctrl.score = $api.radios.score({id: radioId});
  $ctrl.posts = $api.posts.query({id: radioId, pageSize: 10, pageNumber: 0});
  $ctrl.reviews = $api.reviews.query({id: radioId});
  $ctrl.phones = $api.phones.queryByRadio({id: radioId});
  $ctrl.addresses = $api.addresses.queryByRadio({id: radioId});
  $ctrl.socials = $api.socials.queryByRadio({station: radioId});
  $ctrl.programs = $api.programs.query({id: radioId});
  $ctrl.day = 'day0';  
  $ctrl.similar = [];

  $ctrl.loadMorePosts = () => {
    if ($ctrl.radioState != 'idle') return;
    $ctrl.postsState = 'working';

    $api.posts.query({id: radioId, pageSize: 5, pageNumber: postsPage})
      .$promise.then(posts => {
        if (posts.data.records) {
          $ctrl.posts.data.records = $ctrl.posts.data.records.concat(posts.data.records);
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

    $api.radios.getSimilar({id: radioId, pageSize: 5, pageNumber: similarPage})
      .$promise.then(similar => {
        if (similar.data.records) {
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
    $state.go('radio', {radioId: id});
  };
};
