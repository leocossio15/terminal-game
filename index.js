const readline = require('readline-sync');

// Classe Jogador
class Jogador {
  #nome;  // Atributo privado: nome do jogador
  #vida;  // Atributo privado: pontos de vida do jogador
  #itens; // Atributo privado: itens no inventário do jogador

  constructor(nome) {
    this.#nome = nome;  // Inicializa o nome do jogador com o valor passado no construtor
    this.#vida = 100;   // Inicia a vida do jogador com 100 pontos
    this.#itens = [];   // O jogador começa sem itens
  }

  // Getter para acessar o nome do jogador
  get nome() {
    return this.#nome;
  }

  // Getter para acessar a vida do jogador
  get vida() {
    return this.#vida;
  }

  // Setter para modificar a vida do jogador com verificação
  set vida(valor) {
    if (valor < 0) {   // Se o valor passado for menor que 0, define vida como 0
      this.#vida = 0;
    } else {
      this.#vida = valor;  // Caso contrário, a vida recebe o valor passado
    }
  }

  // Getter para acessar os itens do jogador
  get itens() {
    return this.#itens;
  }

  // Método para adicionar um item ao inventário do jogador
  adicionarItem(item) {
    this.#itens.push(item);
    console.log(`Você ganhou o item: ${item.nome}`);  // Exibe qual item foi ganho
  }

  // Método para atacar um inimigo, causando um dano aleatório
  atacar(inimigo) {
    const dano = Math.floor(Math.random() * 10) + 10; // Dano entre 10 e 19
    console.log(`${this.#nome} atacou ${inimigo.nome} e causou ${dano} de dano.`);
    inimigo.receberDano(dano);  // Chama o método do inimigo para receber o dano
  }

  // Método para usar um item, se ele estiver no inventário
  usarItem(item) {
    if (this.#itens.includes(item)) {  // Verifica se o jogador possui o item
      item.usar(this);  // Usa o item
      let index = this.#itens.indexOf(item);  // Encontra o índice do item
      if (index > -1) {
        this.#itens.splice(index, 1);  // Remove o item do inventário
      }
    } else {
      console.log("Você não tem esse item.");  // Exibe mensagem caso o item não esteja no inventário
    }
  }  
}

// Classe Item
class Item {
  #nome;    // Atributo privado: nome do item
  #efeito;  // Atributo privado: efeito que o item causará ao jogador

  constructor(nome, efeito) {
    this.#nome = nome;  // Define o nome do item
    this.#efeito = efeito;  // Define o efeito do item (uma função)
  }

  // Getter para acessar o nome do item
  get nome() {
    return this.#nome;
  }

  // Método para usar o item e aplicar o efeito no jogador
  usar(jogador) {
    console.log(`Usando ${this.#nome}.`);  // Exibe o nome do item sendo usado
    this.#efeito(jogador);  // Aplica o efeito ao jogador
  }
}

// Classe base para Inimigos
class Inimigo {
  #nome;   // Atributo privado: nome do inimigo
  #vida;   // Atributo privado: vida do inimigo
  #ataque; // Atributo privado: valor de ataque do inimigo

  constructor(nome, vida, ataque) {
    this.#nome = nome;    // Define o nome do inimigo
    this.#vida = vida;    // Define a vida do inimigo
    this.#ataque = ataque;  // Define o valor de ataque do inimigo
  }

  // Getter para acessar o nome do inimigo
  get nome() {
    return this.#nome;
  }

  // Getter para acessar a vida do inimigo
  get vida() {
    return this.#vida;
  }

  // Método para receber dano, reduzindo a vida do inimigo
  receberDano(dano) {
    this.#vida -= dano;  // Reduz a vida com base no dano recebido
    if (this.#vida <= 0) {
      console.log(`${this.#nome} foi derrotado!`);  // Exibe mensagem se o inimigo for derrotado
    }
  }

  // Método padrão para o inimigo atacar o jogador
  atacar(jogador) {
    const dano = Math.floor(Math.random() * this.#ataque) + 1;  // Dano aleatório baseado no valor de ataque
    console.log(`${this.#nome} atacou ${jogador.nome} e causou ${dano} de dano.`);
    jogador.vida -= dano;  // Diminui a vida do jogador com o dano causado
  }

  // Método para ataque especial (sobrescrito nas subclasses)
  ataqueEspecial(jogador) {
    console.log(`${this.#nome} não tem um ataque especial.`);  // Exibe mensagem padrão
  }
}

// Classe específica de inimigos: Goblin
class Goblin extends Inimigo {
  constructor() {
    super('Goblin', 30, 8);  // Define nome, vida e ataque específicos do Goblin
  }

  // Método para roubar um item do jogador
  roubar(jogador) {
    console.log(`${this.nome} tentou roubar um item de ${jogador.nome}!`);
    if (jogador.itens.length > 0) {
      const itemRoubado = jogador.itens.pop();  // Remove o último item do inventário
      console.log(`${this.nome} roubou o item ${itemRoubado.nome}!`);
    } else {
      console.log(`${jogador.nome} não tem itens para roubar.`);
    }
  }

  // Sobrescreve o método de ataque especial para o Goblin
  ataqueEspecial(jogador) {
    this.roubar(jogador);  // Goblin tenta roubar um item do jogador
  }
}

// Classe específica de inimigos: Orc
class Orc extends Inimigo {
  constructor() {
    super('Orc', 50, 12);  // Define nome, vida e ataque específicos do Orc
  }

  // Método para o Orc entrar em fúria
  furia(jogador) {
    console.log(`${this.nome} entrou em fúria!`);
    const danoFuria = Math.floor(Math.random() * 10) + 12;  // Dano extra aleatório entre 12 e 19
    jogador.vida -= danoFuria;  // Aplica o dano extra no jogador
    console.log(`${this.nome} causou ${danoFuria} de dano devido à fúria.`);
  }

  // Sobrescreve o método de ataque especial para o Orc
  ataqueEspecial(jogador) {
    this.furia(jogador);  // Orc entra em fúria, causando dano extra
  }
}

// Classe específica de inimigos: Dragão
class Dragao extends Inimigo {
  constructor() {
    super('Dragão', 100, 20);  // Define nome, vida e ataque específicos do Dragão
  }

  // Método para o Dragão cuspir fogo
  cuspeDeFogo(jogador) {
    console.log(`${this.nome} cuspiu fogo!`);
    const dano = Math.floor(Math.random() * 20) + 10;  // Dano de fogo entre 10 e 29
    jogador.vida -= dano;  // Aplica o dano de fogo no jogador
    console.log(`${jogador.nome} recebeu ${dano} de dano de fogo.`);
  }

  // Sobrescreve o método de ataque especial para o Dragão
  ataqueEspecial(jogador) {
    this.cuspeDeFogo(jogador);  // Dragão cospe fogo no jogador
  }
}

// Controladora do jogo
class JogoController {
  #jogador;  // Atributo privado: instância do jogador
  #inimigosDerrotados;  // Atributo privado: contador de inimigos derrotados

  constructor() {
    const nomeJogador = readline.question("Digite o nome do seu jogador: ");
    this.#jogador = new Jogador(nomeJogador);  // Cria o jogador com o nome fornecido
    this.#inimigosDerrotados = 0;  // Inicializa o contador de inimigos derrotados
    this.#jogador.adicionarItem(new Item('Poção de Cura', (jogador) => {
      jogador.vida += 20;  // Adiciona uma poção de cura ao jogador que restaura 20 de vida
      console.log(`${jogador.nome} recuperou 20 de vida.`);
    }));
  }

  // Método para iniciar o jogo
  iniciar() {
    console.log(`Bem-vindo ao jogo, ${this.#jogador.nome}!`);
    while (this.#jogador.vida > 0) {  // O jogo continua enquanto o jogador estiver vivo
      const inimigo = this.gerarInimigoAleatorio();  // Gera um inimigo aleatório
      console.log(`Um ${inimigo.nome} apareceu!`);
      this.combate(inimigo);  // Inicia o combate com o inimigo
      if (this.#jogador.vida <= 0) {
        console.log("Você foi derrotado! Fim de jogo.");
        console.log(`Você derrotou ${this.#inimigosDerrotados} inimigos.`);  // Exibe o número de inimigos derrotados
        break;
      }
    }
  }

  // Método para gerar um inimigo aleatório
  gerarInimigoAleatorio() {
    const inimigos = [new Goblin(), new Orc(), new Dragao()];  // Lista de inimigos possíveis
    const indice = Math.floor(Math.random() * inimigos.length);  // Escolhe um inimigo aleatoriamente
    return inimigos[indice];
  }

  // Método para gerenciar o combate
  combate(inimigo) {
    while (inimigo.vida > 0 && this.#jogador.vida > 0) {  // Combate continua enquanto ambos estiverem vivos
      console.log(`--------------------------------------------------------`);
      console.log(`Sua vida: ${this.#jogador.vida} | Vida do ${inimigo.nome}: ${inimigo.vida}`);
      const acao = readline.question("O que deseja fazer? (1) Atacar, (2) Usar Item: ");
      console.log(`--------------------------------------------------------`);

      switch (acao) {
        case '1':
          this.#jogador.atacar(inimigo);  // Jogador ataca o inimigo
          break;
        case '2':
          if (this.#jogador.itens.length > 0) {
            console.log("Itens disponíveis: ");
            this.#jogador.itens.forEach((item, index) => {
              console.log(`(${index + 1}) ${item.nome}`);
            });
            const escolhaItem = readline.questionInt("Escolha o item: ") - 1;
            if (this.#jogador.itens[escolhaItem]) {
              this.#jogador.usarItem(this.#jogador.itens[escolhaItem]);  // Jogador usa o item escolhido
            } else {
              console.log("Item inválido.");
            }
          } else {
            console.log("Você não tem itens.");  // Se o jogador não tiver itens, exibe essa mensagem
          }
          break;
        default:
          console.log("Ação inválida.");
          continue;
      }

      // O inimigo ataca se ainda estiver vivo após a ação do jogador
      if (inimigo.vida > 0) {
        const ataqueEspecialChance = Math.random();
        if (ataqueEspecialChance < 0.3) {  // 30% de chance de usar um ataque especial
          inimigo.ataqueEspecial(this.#jogador);
        } else {
          inimigo.atacar(this.#jogador);
        }
      } else {
        this.#inimigosDerrotados++;  // Inimigo foi derrotado, incrementa o contador
        this.sortearItem();  // Jogador ganha um item ao derrotar o inimigo
      }
    }
  }

  // Método para sortear um item ao derrotar um inimigo
  sortearItem() {
    const itensPossiveis = [
      new Item('Poção de Cura', (jogador) => {
        jogador.vida += 20;
        console.log(`${jogador.nome} recuperou 20 de vida.`);
      }),
      new Item('Poção de Cura Mais Potente', (jogador) => {
        jogador.vida += 50;
        console.log(`${jogador.nome} recuperou 50 de vida com a Poção de Cura Mais Potente!`);
      }),
      new Item('Poção de Regeneração Total', (jogador) => {
        jogador.vida = 100;
        console.log(`${jogador.nome} recuperou sua vida original totalmente!`);
      })
    ];
    const indice = Math.floor(Math.random() * itensPossiveis.length);  // Sorteia um item aleatoriamente
    const itemGanho = itensPossiveis[indice];
    this.#jogador.adicionarItem(itemGanho);  // Adiciona o item ao inventário do jogador
  }
}

// Iniciar o jogo
const jogo = new JogoController();
jogo.iniciar();