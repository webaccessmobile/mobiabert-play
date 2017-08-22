function SearchResultsController($modal, $api, $util, $user, $scope, $log, $state, $anchorScroll, $profile) {
  "ngInject";

  const $ctrl = this;

  let page = 1;

  $ctrl.getImageURL = $util.getImageURL;
  $ctrl.isIdentified = $user.isIdentified;

  $ctrl.state = 'idle';

  $ctrl.loadMore = () => {
    $ctrl.state = 'working';

    switch ($ctrl.type) {
      case 'name':
        $api.radios.queryByName({ name: $ctrl.term, pageNumber: page, pageSize: 12 })
          .$promise.then(result => {
            if (result.data.records) {
              $ctrl.radios = $ctrl.radios.concat(result.data.records);
              page++;
              $ctrl.state = 'idle';
            } else {
              $ctrl.noMoreContent = 'no-more-content';
            }
          });
        break;
      case 'genre':
        $api.radios.queryByGenre({ id: $ctrl.term, pageNumber: page, pageSize: 12 })
          .$promise.then(result => {
            if (result.data.records) {
              $ctrl.radios = $ctrl.radios.concat(result.data.records);
              page++;
              $ctrl.state = 'idle';
            } else {
              $ctrl.noMoreContent = 'no-more-content';
            }
          });
        break;
    }
  };
  
  $ctrl.favorite = (radio) => {
    var _radio;    
    for (var r in $ctrl.radios) {
      if ($ctrl.radios[r].id == radio.id) {
        _radio = $ctrl.radios[r];
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
}

export default SearchResultsController;