let UserFactory = function ($url, $http) {
  "ngInject";

  let
    profile,
    getProfile = () => profile,
    setProfile = p => profile = p,
    isIdentified = () => profile ? true : false,
    getIdentify = () => $http.get(`${$url}/app/user`),
    getUser = userId => $http.get(`${$url}/user/${userId}`),
    reset = () => {
      profile = undefined;
    };

  return { getProfile, setProfile, isIdentified, getIdentify, getUser, reset };
};

export default UserFactory;