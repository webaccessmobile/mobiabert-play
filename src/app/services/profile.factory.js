let ProfileFactory = function ($http, $user, $resource) {
  "ngInject";

  let favoritestation = (method, station) => { 
    if ($user.isIdentified() && station) {
      let    
        url = `/api/userfavoritestation`,
        data = {
          stationUnit : {
            id : station.id
          }
        };
      $http({
        method : method,
        url : url,
        data : angular.toJson(data),
        headers : {'Content-Type' : 'application/json'}
      });
    }
  }

  return {
    putPlayHistory : (radio) => { 
      if (radio && radio.id) {
        let       
          url = '/api/stationunit/history',
          data = {
            stationUnit : {
              id : radio.id
            }
          };
        $http({
          method : "PUT",
          url : url,
          data : angular.toJson(data),
          headers : {'Content-Type' : 'application/json'}
        });
      }
    },
    favoritestation : (station) => { 
      favoritestation("PUT", station);
    },    
    unfavoritestation : (station) => { 
      favoritestation("DELETE", station);
    },
    posts : $resource(`/api/app/user/:id/posts`, null),
    reviews : $resource(`/api/app/user/:id/reviews`, null)
  };
};

export default ProfileFactory;