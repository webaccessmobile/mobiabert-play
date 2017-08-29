export default function RadioController($state, $util, $user, $radio, $profile, $api, $modal, $anchorScroll, Upload, $timeout) {
  "ngInject";

  const $ctrl = this;

  let
    sleep = 8000,
    postsPage = 0,
    reviewsPage = 0,
    similarPage = 0,
    radioId = $state.params.radioId;

  $ctrl.getImageURL = $util.getImageURL;
  $ctrl.getFileURL = $util.getFileURL;
  $ctrl.isIdentified = $user.isIdentified;
  $ctrl.profile = $user.getProfile;

  $ctrl.plays = [];
  $ctrl.tab = 'wall';
  $ctrl.day = 'day0';
  $ctrl.postsState = 'idle';
  $ctrl.reviewsState = 'idle';
  $ctrl.similarState = 'idle';

  $ctrl.picture = { valid: null, invalid: null, progress: 0 };
  $ctrl.audio = { valid: null, invalid: null, progress: 0 };

  $radio.radio.get({ id: radioId }).$promise.then(response => { $ctrl.radio = response.data; $ctrl.plays.push($ctrl.radio) });
  $radio.score.get({ id: radioId }).$promise.then(response => $ctrl.score = response.data.toFixed(1));
  $radio.phones.get({ id: radioId }).$promise.then(response => $ctrl.phones = response.data);
  $radio.addresses.get({ id: radioId }).$promise.then(response => $ctrl.addresses = response.data);
  $radio.socials.get({ station: radioId }).$promise.then(response => $ctrl.socials = response.data);
  $radio.programs.get({ id: radioId }).$promise.then(response => $ctrl.programs = response.data);
  $radio.reviews.get({ id: radioId }).$promise.then(response => $ctrl.reviews = response.data);
  $radio.genres.get({ id: radioId }).$promise.then(response => $ctrl.genres = response.data);

  let clearInfo = () => {
    $ctrl.info = undefined;
    $ctrl.error = undefined;
  }
  let clear = () => {
    $ctrl.picture = { valid: null, invalid: null, progress: 0 };
    $ctrl.audio = { valid: null, invalid: null, progress: 0 };
    $ctrl.msgPost = undefined;
    $ctrl.msgReview = undefined;
    $ctrl.anexarAudio = false;
    $ctrl.anexarFoto = false;
  }

  $ctrl.anexarFoto = false;
  $ctrl.toogleAnexarFoto = () => {
    $ctrl.anexarFoto = !$ctrl.anexarFoto;
    $ctrl.anexarAudio = false;
  }
  
  $ctrl.anexarAudio = false;
  $ctrl.toogleAnexarAudio = () => {
    $ctrl.anexarAudio = !$ctrl.anexarAudio;
    $ctrl.anexarFoto = false;
  }

  $ctrl.sendPost = () => {    
    if ($ctrl.picture.valid) {
      $ctrl.state = 'uploading';
      let params = {
        url: `/api/app/file/upload`,
        data: {
          attachment: $ctrl.picture.valid,
          action: 'upload'
        }
      };
      Upload.upload(params).then(
        response => {
          $ctrl.state = 'finishing';
          sendPost(1, response.data.data);
        },
        response => {
          $ctrl.state = 'idle';
          $ctrl.error = response;
        },
        event => $ctrl.picture.progress = parseInt(100.0 * event.loaded / event.total)
      );
    } 
    if ($ctrl.audio.valid) {
      $ctrl.state = 'uploading';
      let params = {
        url: `/api/app/file/upload`,
        data: {
          attachment: $ctrl.audio.valid,
          action: 'upload'
        }
      };
      Upload.upload(params).then(
        response => {
          let audio = response.data.data;
          $ctrl.state = 'finishing';
          sendPost(2, audio);
        },
        response => {
          $ctrl.state = 'idle';
          console.log(response)
        },
        event => $ctrl.audio.progress = parseInt(100.0 * event.loaded / event.total)
      );
    } else {
      sendPost(0);
    }
  }

  let sendPost = (postType, attachmentIdentifier) => {    
    clearInfo();
    if ($ctrl.isIdentified()) {
      let
        data = {
          text: $ctrl.msgPost,
          postType: postType,
          dateTime: Date.now()
        }
      if (attachmentIdentifier) {
        data.attachmentIdentifier = attachmentIdentifier;
      }
      $radio.wall.post({ id: radioId }, data).$promise
        .then(response => {
          $ctrl.info = `Obrigado ${$ctrl.profile().name}! Seu cometário será exibido após moderação da Rádio.`;
          $timeout(clearInfo, sleep);
          clear();
        })
        .catch(response => {
          $ctrl.error = response.data.error.message;
          $timeout(clearInfo, sleep);
        });
    }
  }

  $ctrl.sendReview = () => {
    clearInfo();
    if ($ctrl.isIdentified()) {
      let
        data = {
          text: $ctrl.msgReview,
          score: $ctrl.reviewScore,
          dateTime: Date.now()
        }
      $radio.reviews.post({ id: radioId }, data).$promise
        .then(response => {
          $ctrl.info = `Obrigado ${$ctrl.profile().name}! Sua avaliação será exibida após moderação da Rádio.`;
          $timeout(clearInfo, sleep);
          clear();
        })
        .catch(response => {
          $ctrl.error = response.data.error.message
          $timeout(clearInfo, sleep);
        });
    }
  }

  $ctrl.loadMorePosts = () => {
    if ($ctrl.postsState != 'idle') return;
    $ctrl.postsState = 'working';

    $radio.posts.get({ id: radioId, pageSize: 5, pageNumber: postsPage })
      .$promise.then(response => {
        if (response.data.records && response.data.records.length > 0) {
          if (!$ctrl.posts) $ctrl.posts = [];
          $ctrl.posts = $ctrl.posts.concat(response.data.records);
          $ctrl.postsState = 'idle';
          postsPage++;
        } else {
          $ctrl.postsState = 'no-more-content';
        }
      });
  };

  $ctrl.loadMoreReviews = () => {
    if ($ctrl.reviewsState != 'idle') return;
    $ctrl.reviewsState = 'working';

    $radio.reviews.get({ id: radioId, pageSize: 5, pageNumber: reviewsPage })
      .$promise.then(response => {
        if (response.data && response.data.length > 0) {
          if (!$ctrl.reviews) $ctrl.reviews = [];
          $ctrl.reviews = $ctrl.reviews.concat(response.data);
          $ctrl.reviewsState = 'idle';
          reviewsPage++;
        } else {
          $ctrl.reviewsState = 'no-more-content';
        }
      });
  };

  $ctrl.loadMoreSimilar = () => {
    if ($ctrl.similarState != 'idle') return;
    $ctrl.similarState = 'working';
    $radio.similar.get({ id: radioId, pageSize: 5, pageNumber: similarPage })
      .$promise.then(similar => {
        if (similar.data.records) {
          if (!$ctrl.similar) $ctrl.similar = [];
          $ctrl.similar = $ctrl.similar.concat(similar.data.records);
          $ctrl.similarState = 'idle';
          similarPage++;
        } else {
          $ctrl.similarState = 'no-more-content';
        }
      });
  };

  $ctrl.selectTab = tab => {
    if ($ctrl.tab == tab) return;
    $ctrl.tab = tab;
  };

  $ctrl.selectDay = day => {
    if ($ctrl.day == day) return;
    $ctrl.day = day;
  };

  $ctrl.favoritePlay = (play) => {
    var _play;
    for (var r in $ctrl.plays) {
      if ($ctrl.plays[r].id == play.id) {
        _play = $ctrl.plays[r];
        break;
      }
    }
    if (play.favorite) {
      $profile.unfavoritestation(play);
      _play.favorite = play.likes - 1;
      _play.favorite = false;
    }
    else {
      $profile.favoritestation(play);
      _play.favorite = play.likes + 1;
      _play.favorite = true;
    }
  }

  $ctrl.favorite = (radio) => {
    var _radio;
    for (var r in $ctrl.similar) {
      if ($ctrl.similar[r].id == radio.id) {
        _radio = $ctrl.similar[r];
        break;
      }
    }
    if (radio.favorite) {
      $profile.unfavoritestation(radio);
      _radio.favorite = radio.likes - 1;
      _radio.favorite = false;
    }
    else {
      $profile.favoritestation(radio);
      _radio.favorite = radio.likes + 1;
      _radio.favorite = true;
    }
  }

  $ctrl.goToRadio = id => {
    $anchorScroll();
    $state.go('radio', { radioId: id });
  };

  $ctrl.selectGenre = id => {
    $radios.radiosByGenres.get({ id: radioId, pageNumber: 0, pageSize: 12 })
      .$promise.then(result => {
        $modal.open(`<mp-search-results radios="radios" type="genre" term="${id}" total="${result.data.totalRecords}"></mp-search-results>`, { radios: result.data.records });
      });
  }

  $ctrl.viewAllGenres = () => {
    $api.genre.query().$promise.then(result => {
      let html = '';

      html += '<div class="genres-section">';
      html += '<div class="genre-list-container">';

      for (var genre in result) {
        genre = result[genre];
        if (genre.id) {
          html += '<div class="genre-container">';
          html += '<div class="genre-picture-container" ng-click="$ctrl.selectGenre(' + genre.id + ')">';
          switch (genre.id) {
            case 1:
              html += '<img class="genre-picture ng-scope" src="/assets/images/anos-60-90.jpg">';
              break;
            case 2:
              html += '<img class="genre-picture ng-scope" src="/assets/images/catolica.jpg">';
              break;
            case 3:
              html += '<img class="genre-picture ng-scope" src="/assets/images/classica.jpg">';
              break;
            case 4:
              html += '<img class="genre-picture ng-scope" src="/assets/images/country.jpg">';
              break;
            case 5:
              html += '<img class="genre-picture ng-scope" src= "/assets/images/edm.jpg">';
              break;
            case 6:
              html += '<img class="genre-picture ng-scope" src="/assets/images/gospel.jpg">';
              break;
            case 7:
              html += '<img class="genre-picture ng-scope" src="/assets/images/esporte.jpg">';
              break;
            case 8:
              html += '<img class="genre-picture ng-scope" src="/assets/images/mpb.jpg">';
              break;
            case 9:
              html += '<img class="genre-picture ng-scope" src="/assets/images/popular.jpg">';
              break;
            case 10:
              html += '<img class="genre-picture ng-scope" src="/assets/images/pop-internacional.jpg">';
              break;
            case 11:
              html += '<img class="genre-picture ng-scope" src="/assets/images/rock.jpg">';
              break;
            case 12:
              html += '<img class="genre-picture ng-scope" src="/assets/images/samba.jpg">';
              break;
            case 13:
              html += '<img class="genre-picture ng-scope" src="/assets/images/sertanejo.jpg">';
              break;
            default:
          }
          html += '</div>';
          html += '<h3 class="genre-title color-primary ng-binding">' + genre.name + '</h3>';
          html += '</div>';
        }
      }

      html += '</div>';
      html += '</div>';

      $modal.open(html);
    });
  }
};
