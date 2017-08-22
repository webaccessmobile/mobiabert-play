export default function ($scope, $api, $util, $modal, $q) {
  "ngInject";

  const $ctrl = this;
  
  $ctrl.getImageURL = $util.getImageURL;

  $api.radios.queryByLikes({pageNumber: 0, pageSize: 10})
    .$promise.then(
      response => {
        let promises = [];

        response.data.records.forEach(radio => {
          radio.socials = $api.socials.queryByRadio({station: radio.id});
          promises.push(radio.socials.$promise);
        });

        $q.all(promises).then(() => {
          $ctrl.radios = response;
        });
      }
    );

  $ctrl.genres = $api.genre.query();
  $ctrl.selectGenre = id => {
    $api.radios.queryByGenre({id: id, pageNumber: 0, pageSize: 12})
      .$promise.then(result => {
        $modal.open(`<mp-search-results radios="radios" type="genre" term="${id}" total="${result.data.totalRecords}"></mp-search-results>`, {radios: result.data.records});
      });
  }
};