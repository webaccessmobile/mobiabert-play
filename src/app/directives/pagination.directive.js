function PaginationDirective () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      select: '&',
      current: '<',
      pages: '<'
    },
    link: function (scope, elem, attr) {
      //Armazena os botões inseridos
      let buttons = [];

      //Função para exibir os botões
      let render = () => {
        //Pega a quantidade de páginas
        let pages = parseInt(scope.pages);
        //Remove os botões existentes
        elem.empty();
        buttons = [];
        //Cria os botões de paginação de acordo com o número de páginas
        for (let i = 0; i < pages; i++) {
          //Cria um elemento a partir do template
          let Button = angular.element(`<button>${i+1}</button>`).on('click', event => {
            if (parseInt(scope.current) == i) return;
            scope.select({page: i});
          });
          //Armazena o número da página e o escreve no elemento
          Button.data('page', i);
          //Verifica se a página atual é igual ao valor do loop e adiciona a classe "active" se for o caso
          if (parseInt(scope.current) == i) Button.addClass('active');
          //Insere o elemento no nó da diretiva
          elem.append(Button);
          //Armazena o botão no array para futuras referências
          buttons.push(Button);
        }
      }

      //Renderiza a diretiva caso o número de páginas tenha mudado
      scope.$watch('pages', (n,o) => {
        if (n !== o) render();
      });

      //Adiciona a classe "active" no botão que corresponde a página atual
      scope.$watch('current', (n,o) => {
        if (n !== o) {
          //Para cada botão armazenado
          buttons.forEach(btn => {
            //Verifica se a página do botão corresponde a página atual
            if (btn.data('page') == parseInt(n))
              //Adiciona a classe "active"
              btn.addClass('active');
            else
              //Remove a classe "active"
              btn.removeClass('active');
          });
        };
      });

      render();
    }
  };
}

export default PaginationDirective;