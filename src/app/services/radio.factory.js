let RadioFactory = function ($resource) {
  "ngInject";

  return {
    radio: $resource(`/api/app/station/:id`, null),
    score: $resource(`/api/stationunit/:id/review/avg`, null),
    phones: $resource(`/api/stationunit/:id/phone`, null),
    addresses: $resource(`/api/stationunit/:id/address`, null),
    socials: $resource(`/api/stationunit/socialnetwork/search`, null),
    programs: $resource(`/api/app/station/:id/program`, null),
    posts: $resource(`/api/app/station/:id/posts`, null),
    reviews: $resource(`/api/stationunit/:id/review`, null),
    similar: $resource(`/api/app/station/:id/similar`, null)
  };
};

export default RadioFactory;