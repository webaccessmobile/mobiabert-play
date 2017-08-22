function RadioSliderController($util, $user, $profile) {
  "ngInject";

  const $ctrl = this;
  
  let pointer;
  
  $ctrl.getImageURL = $util.getImageURL;
  $ctrl.isIdentified = $user.isIdentified;

  $ctrl.$onInit = () => {
    if ($ctrl.radios) {
      pointer = $ctrl.radios.length-2;
      $ctrl.slides = getSlides($ctrl.radios, 5);
    } else {
      pointer = 1;
    }
  };

  $ctrl.init = () => {

  }

  $ctrl.prev = () => {
    if (pointer == 0)
      pointer = $ctrl.radios.length-1;
    else
      pointer--;

    $ctrl.slides = getSlides($ctrl.radios, 5);
  }

  $ctrl.next = () => {
    if (pointer == $ctrl.radios.length-1)
      pointer = 0;
    else
      pointer++;

    $ctrl.slides = getSlides($ctrl.radios, 5);
  }

  function getSlides (array, amount) {
    let slides = array.slice(pointer);
    if (slides.length >= amount) {
      slides = slides.slice(0,amount);
    } else {
      let diff = amount - slides.length;
      slides = slides.concat(array.slice(0,diff));
    }
    return slides;
  }

  $ctrl.favorite = (radio) => {
    var _radio;    
    for (var r in $ctrl.radios) {
      if ($ctrl.radios[r].id == radio.id) {
        _radio = $ctrl.radios[r];
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
}

export default RadioSliderController;
