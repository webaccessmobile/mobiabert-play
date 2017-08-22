export default function PlayerController ($scope, $document, $window, $api, $util, $timeout, $user, $profile) {
  "ngInject";

  const
    $ctrl = this,
    body = $document.find('body'),
    audio = body.find('#audio').get(0);

  $ctrl.visible = false;
  $ctrl.getImageURL = $util.getImageURL;
  $ctrl.sources = [];
  $ctrl.volume = 100;
  $ctrl.stateVolume = 'volume-up';

  $ctrl.togglePlay = () => {  
    if ($ctrl.state && $ctrl.state == 'loading') return;

    if ($ctrl.state == 'paused') {
      if (audio.readyState > 0) {
        //Altera o tempo para o final do que foi carregado
        audio.currentTime = audio.buffered.end(0);
        //Manda tocar o áudio
        audio.play();
      } else {
        $ctrl.state = 'loading';
        audio.load();
        audio.play();
        checkAudioState();
      }
    } else {
      //Pausa o áudio
      audio.pause();
    }
  };

  $ctrl.toggleMute = () => {  
    if (audio) {
      audio.muted = !audio.muted;
    }
  };

  $ctrl.volumeChange = () => {  
    if (audio) {
      audio.volume = $ctrl.volume ? ($ctrl.volume > 0 ? ($ctrl.volume/100) : 0) : 0;
      if (audio.volume > 0) {
        audio.muted = false;
      }
    }
  };
  
  let checkPromise;
  //Função que verifica o estado do audio depois de 20 segundos
  $ctrl.checkAudioState = () => {
    if (checkPromise)
      $timeout.cancel(checkPromise);
      
    checkPromise = $timeout(() => {
      if (audio.readyState == 0) {
        alert('Não foi possível tocar a rádio. Tente novamente mais tarde');
        audio.pause();
      }
    }, 20000);
  }

  $ctrl.checkVolumeIcon = () => {  
    if (audio) {
      $ctrl.volume = audio.volume * 100;
      if (audio.muted) {
        $ctrl.stateVolume = 'volume-off';
      }
      else {
        if (audio.volume == 0) {
          audio.muted = true;
        }
        else if (audio.volume <= 0.5) {
          $ctrl.stateVolume = 'volume-down';
        }
        else {
          $ctrl.stateVolume = 'volume-up';
        }
      }
    }
  };

  //Registra uma função quando o audio começa a tocar
  audio.addEventListener('playing', () => {
    //Altera o estado do player para "playing"
    $ctrl.state = 'playing';
    //Inicia o $digest para o angular saber o que mudou
    $scope.$digest();
  });

  //Registra uma função quando o audio começa a tocar
  audio.addEventListener('pause', () => {
    //Altera o estado do player para "playing"
    $ctrl.state = 'paused';
    //Inicia o $digest para o angular saber o que mudou
    $scope.$digest();
  });

  audio.addEventListener('volumechange', () => {
    $ctrl.checkVolumeIcon();
    $scope.$digest();
  });

  //Evento disparado pela diretiva "play"
  $scope.$on('play', (event, radio) => {
    //Deixa o player visível
    $ctrl.visible = true;
    //Muda o estado do player para "carregando"
    $ctrl.state = 'loading';
    //Armazena as informações da rádio
    $ctrl.radio = radio;

    //Coloca a classe no <body> para dar espaço ao player
    body.addClass('with-player');

    //Baixa a lista de canais da rádio
    $api.channel.get({id: radio.id})
      //Quando completar a requisição
      .$promise.then(
        //Caso a resposta seja positiva
        response => {
          //Pega a lista de streamings do primeiro canal de áudio
          let streamings = response.data[0].streamings.map(stream => {
            //Pega ou o link de alta qualidade ou o de baixa
            let url = stream.linkHigh || stream.linkLow;

            //Adiciona a barra ao final do link caso não possua
            if (/(:[0-9]+)$/igm.test(url)) url = url + '/';

            //Retorna apenas o link no novo array
            return url;
          });

          //Cria um array de fontes
          let sources = [];

          //Para cada link de streaming
          streamings.forEach(stream => {
            //Adiciona o link original e o link com ";" no final à lista de fontes
            sources.push(stream, stream + ';');
          });

          //Armazena as fontes no controlador
          $ctrl.sources = sources;
          //Recarrega o elemento <audio>
          audio.load();
          //Manda tocar o áudio
          audio.play();
          //Atualiza histórico
          if ($user.isIdentified()) {
            $profile.putPlayHistory(radio);
          }

          $ctrl.checkAudioState();
          $ctrl.checkVolumeIcon();
        }
      );
  });
}