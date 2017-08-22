function SearchFormController ($modal, $api) {
  "ngInject";

  const $ctrl = this;

  $ctrl.submit = term => {
    if (term && term.trim()) {
      $api.radios.queryByName({name: term, pageSize: 12, pageNumber: 0})
        .$promise.then(result => {
          $modal.open(`<mp-search-results radios="radios" term="${term}" total="${result.data.totalRecords}" type="name"></mp-search-results>`, {radios: result.data.records});
        })
    };
  };
}

export default SearchFormController;
