let UserFactory = function ($url, $http, $window, $state) {
  "ngInject";

  let
    profile,
    getProfile = () => profile,
    setProfile = p => {
      profile = p;
      if (profile) {
        $window.localStorage.setItem('profileId', profile.id);
      }
    },
    isIdentified = () => profile ? true : false,
    getIdentify = () => $http.get(`${$url}/app/user`),
    getUser = userId => {
      if (userId && userId != 'undefined') {
        return $http.get(`${$url}/app/user/${userId}`);
      }
      else {
        return $http.get(`${$url}/app/user`);
      }
    },
    createUser = user => $http.post(`${$url}/user`, user),
    updateUser = user => $http.post(`${$url}/user`, user),
    reset = () => {
      profile = undefined;
      $window.localStorage.setItem('profileId', undefined);
    },
    checkUser = user => {
      if (user && user != 'undefined') {
        if (!user.image ||
            !user.name ||
            !user.email ||
            !user.city ||
            !user.birthdate) {
          if (confirm("Olá! Complete seu cadastro.\nPreencha as informações que faltam para que possamos conhecer você melhor.")) {
            $state.go('user');
          }
        }
      }
    };

  return { getProfile, setProfile, isIdentified, getIdentify, getUser, createUser, updateUser, reset, checkUser };
};

export default UserFactory;