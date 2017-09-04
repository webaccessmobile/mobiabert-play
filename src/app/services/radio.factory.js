let RadioFactory = function ($resource) {
  "ngInject";

  return {
    radio: $resource(`/api/app/station/:id`, null),
    score: $resource(`/api/stationunit/:id/review/avg`, null),
    phones: $resource(`/api/stationunit/:id/phone`, null),
    addresses: $resource(`/api/stationunit/:id/address`, null),
    socials: $resource(`/api/stationunit/socialnetwork/search`, null),
    programs: $resource(`/api/app/station/:id/program`, null),
    posts: $resource(`/api/app/station/:id/posts`, null, {'post': {method:'PUT'}}),
    wall: $resource(`/api/stationunit/:id/wall`, null, {'post': {method:'PUT'}}),
    comments: $resource(`/api/wall/:id/comments`, null),
    reviews: $resource(`/api/stationunit/:id/review`, null, {'post': {method:'POST'}}),
    similar: $resource(`/api/app/station/:id/similar`, null),
    genres: $resource(`/api/stationunit/:id/genre`, null),
    radiosByGenres: $resource(`/api/app/musicgenre/:id/station`, null)
  };
};

export default RadioFactory;