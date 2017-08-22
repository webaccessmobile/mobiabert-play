let AuthenticationFactory = function ($url, $window, $http) {
  "ngInject";

  let
    token = $window.localStorage.getItem('token') || null,
    getToken = () => token,
    setToken = (t) => {
      token = t;
      $window.localStorage.setItem('token', token);
      $http.defaults.headers.common.userToken = token;
    },
    isAuthenticated = () => token ? true : false,
    autenticatenative = (username, password) => {
      let params = {
        email: username,
        password: password
      };
      return $http.get(`${$url}/panel/users/autenticate`, { params: params });
    },
    authorize = (token) => {
      let params = {
        token: token
      };
      return $http.get(`${$url}/app/user/authorize`, { params: params });
    },
    reset = () => {
      $window.localStorage.removeItem('token', token);
      delete $http.defaults.headers.common.userToken;
    };

  if (token) 
    $http.defaults.headers.common.userToken = token;

  return { getToken, setToken, isAuthenticated, autenticatenative, authorize, reset };
};

export default AuthenticationFactory;