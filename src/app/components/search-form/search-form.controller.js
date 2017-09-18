function SearchFormController ($modal, $api, $http, $url) {
  "ngInject";

  const $ctrl = this;
  let
    citys = [];

  $ctrl.citys = [];
  $ctrl.citys.push({
    value: '0',
    label: 'Cidade'
  });

  $ctrl.city = '0';

  $http.get(`${$url}/address/state/containingstation`)
  .then(response => {
    if (response.data.data) {  
      $ctrl.states = [];
      $ctrl.states.push({
        value: '0',
        label: 'Estado'
      });
      $ctrl.state = '0';
      for (var i in response.data.data) {
        var state = response.data.data[i];
        $ctrl.states.push({
          value: state.id,
          label: state.name
        });
      }
    }
  });
  
  $ctrl.loadCitys = () => {
    $http.get(`${$url}/address/city/containingstation?stateid=${$ctrl.state}`)
      .then(response => {
        $ctrl.citys = [];
        $ctrl.citys.push({
          value: '',
          label: 'Cidade'
        });
        citys = response.data.data;
        if (response.data.data) {
          for (var i in response.data.data) {
            var city = response.data.data[i];
            $ctrl.citys.push({
              value: city.id,
              label: city.name
            });
          }
        }
      });
  }

  $ctrl.submit = term => {
    if (term && term.trim()) {
      $api.radios.queryByName({name: term, pageSize: 12, pageNumber: 0})
        .$promise.then(result => {
          $modal.open(`<mp-search-results radios="radios" term="${term}" total="${result.data.totalRecords}" type="name"></mp-search-results>`, {radios: result.data.records});
        })
    };
  };
  
  $ctrl.submitForCity = () => {
    if ($ctrl.city) {
      $api.radios.queryByCity({id: $ctrl.city, pageSize: 12, pageNumber: 0})
        .$promise.then(result => {
          $modal.open(`<mp-search-results radios="radios" term="${$ctrl.city}" total="${result.data.totalRecords}" type="city"></mp-search-results>`, {radios: result.data.records});
        })
    };
  };
}

export default SearchFormController;
