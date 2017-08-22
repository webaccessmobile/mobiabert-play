let UtilitiesFactory = function ($url, $http) {
  "ngInject";

  let
    getImageURL = identifier => identifier ? `${$url}/image/download?identifier=${identifier}` : '',
    getFileURL = identifier => identifier ? `${$url}/app/file/download?identifier=${identifier}` : '';
    
  return { getImageURL, getFileURL };
};

export default UtilitiesFactory;