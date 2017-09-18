function GenresController($api, $modal, $timeout) {
  "ngInject";

  const $ctrl = this;

  $ctrl.genres = $api.genre.query();
  $ctrl.selectGenre = id => {

    console.log('aqui');
    $api.radios.queryByGenre({ id: id, pageNumber: 0, pageSize: 12 })
      .$promise.then(result => {
        $modal.close();        
        $timeout(()=>{
          $modal.open(`<mp-search-results radios="radios" type="genre" term="${id}" total="${result.data.totalRecords}"></mp-search-results>`, { radios: result.data.records });
        }, 800);
        
      });
  }
}

export default GenresController;