function UserResultsController($util, $user, $http, $url, $state) {
  "ngInject";

  const $ctrl = this;

  let page = 0;

  $ctrl.getImageURL = $util.getImageURL;
  $ctrl.isIdentified = $user.isIdentified;

  $ctrl.state = 'idle';

  $ctrl.$onInit = () => {
    $ctrl.loadMore();
  }

  $ctrl.loadMore = () => {
    $ctrl.state = 'working';

    $http.get(`${$url}/app/user/search?name=${$ctrl.term}&pageNumber=${page}&pageSize=10`)
      .then(response => {
        if (response.data.data.records) {
          if (!$ctrl.persons) {
            $ctrl.persons = [];
          }
          $ctrl.persons = $ctrl.persons.concat(response.data.data.records);
          $ctrl.state = 'idle';
          page++;
        }
        else {
          $ctrl.state = 'no-more-content';
        }
      });
  };
  
  $ctrl.goToProfile = (id) => {
    $state.go('profile', { id: id });
  };
}

export default UserResultsController;