let UserFactory = function ($url, $http) {
  "ngInject";

  let
    profile,
    getProfile = () => profile,
    setProfile = p => profile = p,
    isIdentified = () => profile ? true : false,
    getIdentify = () => $http.get(`${$url}/app/user`),
    getUser = userId => $http.get(`${$url}/app/user/${userId}`),
    createUser = user => $http.post(`${$url}/user`, user),
    updateUser = user => $http.post(`${$url}/user`, user),
    reset = () => {
      profile = undefined;
    };

  return { getProfile, setProfile, isIdentified, getIdentify, getUser, createUser, updateUser, reset };
};

export default UserFactory;