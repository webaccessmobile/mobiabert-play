function ApiFactory ($http, $resource) {
  "ngInject";
  
  return {
    smartsearch: $resource('/api/app/smartsearch'),
    radios: $resource('/api/stationunit/search/:action', null, {
      queryByName: {
        url: '/api/app/smartsearch/station',
      },
      queryByCity: {
        params: {action: 'city'}
      },
      queryByState: {
        params: {action: 'state'}
      },
      queryByUserFavorites: {
        url: '/api/app/station/userfavorites'
      },
      queryByUserHistory: {
        url: '/api/app/user/stationhistory'
      },
      queryByLocation: {
        params: {action: 'location'}
      },
      queryByLikes: {
        params: {action: 'likes'}
      },
      queryByGenre: {
        url: '/api/app/musicgenre/:id/station'
      },
      get: {
        url: '/api/app/station/:id'
      },
      getSimilar: {
        url: '/api/app/station/:id/similar',
      },
      score: {
        url: '/api/stationunit/:id/review/avg'
      }
    }),
    posts: $resource('/api/app/station/:id/posts', null, {
      query: {isArray: false}
    }),
    states: $resource('/api/app/smartsearch/state', null, {
      query: {
        method: 'GET',
        isArray: true,
        transformResponse: response => angular.fromJson(response).data
      }
    }),
    cities: $resource('/api/app/smartsearch/city', {pageSize: 24, pageNumber: 0}, {
      query: {
        method: 'GET',
        transformResponse: response => angular.fromJson(response).data
      }
    }),
    genre: $resource('/api/app/smartsearch/genre?:default', null, {
      query: {
        method: 'GET',
        params: {default: 'name'},
        isArray: true,
        transformResponse: (response, headers, status) => {
          if (status == 200) {
            return angular.fromJson(response).data;
          } else {
            return angular.fromJson(response).error;
          }
        }
      }
    }),
    phones: $resource('/api/stationunit/:id/phone', null, {
      queryByRadio: {
        isArray: false
      }
    }),
    addresses: $resource('/api/stationunit/:id/address', null, {
      queryByRadio: {
        isArray: false
      }
    }),
    socials: $resource('/api/stationunit/socialnetwork/search', null, {
      queryByRadio: {
        isArray: false
      }
    }),
    programs: $resource('/api/app/station/:id/program', null, {
      query: {
        isArray: false
      }
    }),
    reviews: $resource('/api/stationunit/:id/review', null,{
      query: {
        isArray: false
      }
    }),
    channel: $resource('/api/app/station/:id/audiochannel', null)
  };
};

export default ApiFactory;