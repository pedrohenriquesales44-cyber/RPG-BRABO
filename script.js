// ==========================================
// 1. MAPEAMENTO DOS ELEMENTOS DO HTML (DOM)
// ==========================================

const botaoEnviar = document.getElementById('btnEnviar');
const campoInput = document.getElementById('opcaoUsuario');
const telaTexto = document.getElementById('telaTexto');

const telaInicial = document.getElementById('telaInicial');
const telaJogo = document.getElementById('telaJogo');
const btnJogar = document.getElementById('btnJogar');
const btnSom = document.getElementById('btnSom');
const btnSomFixo = document.getElementById('btnSomFixo');
const musicaMenu = document.getElementById('musicaMenu');
const telaPreta = document.getElementById('telaPreta');
const apresentacao = document.getElementById('apresentacao');
const tituloAbertura = document.getElementById('tituloAbertura');
const telaPressione = document.getElementById('telaPressione');


// ==========================================
// 2. MÚSICA E ABERTURA
// ==========================================

musicaMenu.volume = 0.5;

function iniciarMusica() {
  musicaMenu.play().catch(() => {
    console.log("Não foi possível iniciar a música.");
  });
}

let aberturaIniciada = false;

function iniciarAbertura() {

  // Garante que a abertura rode só uma vez
  if (aberturaIniciada) return;
  aberturaIniciada = true;

  telaPressione.style.display = 'none';
  apresentacao.style.display = 'block';

  iniciarMusica();

  // Depois de 3s, troca os créditos pelo título
  setTimeout(() => {
    apresentacao.style.display = 'none';
    tituloAbertura.style.display = 'block';
  }, 3000);

  // Depois de 6s, vai para a tela inicial
  setTimeout(() => {
    telaPreta.style.display = 'none';
    telaInicial.style.display = 'flex';
  }, 6000);
}

// Teclado, mouse e toque (celular) iniciam a abertura
document.addEventListener('keydown', iniciarAbertura);
document.addEventListener('click', iniciarAbertura);
document.addEventListener('touchstart', iniciarAbertura);


// ==========================================
// 3. BANCO DE DADOS DO JOGO (Itens, Raças e Inimigos)
// ==========================================

// tipo: 0 = arma, 1 = capacete, 2 = peitoral, 3 = poção
const ITENS = {

  espada: {
    nome: "Espada",
    tipo: 0,
    efeito: 10,
    preco: 20
  },

  machado: {
    nome: "Machado",
    tipo: 0,
    efeito: 15,
    preco: 25
  },

  pocao: {
    nome: "Poção",
    tipo: 3,
    efeito: 30,
    preco: 25
  },

  capaceteCouro: {
    nome: "Capacete de Couro",
    tipo: 1,
    efeito: 15,
    preco: 30
  },

  peitoralCouro: {
    nome: "Peitoral de Couro",
    tipo: 2,
    efeito: 25,
    preco: 35
  },

  capaceteFerro: {
    nome: "Capacete de Ferro",
    tipo: 1,
    efeito: 25,
    preco: 45
  },

  peitoralFerro: {
    nome: "Peitoral de Ferro",
    tipo: 2,
    efeito: 35,
    preco: 50
  },

  martelo: {
    nome: "Lembrança do Passado",
    tipo: 0,
    efeito: 15,
    preco: 0,
    especial: true,
    compravel: false
  },

  espadaHeroi: {
    nome: "Espada do Herói",
    tipo: 0,
    efeito: 50,
    preco: 0,
    especial: true,
    compravel: false
  },

  capaceteHeroi: {
    nome: "Capacete do Herói",
    tipo: 1,
    efeito: 50,
    preco: 0,
    especial: true,
    compravel: false
  },

  peitoralHeroi: {
    nome: "Peitoral do Herói",
    tipo: 2,
    efeito: 50,
    preco: 0,
    especial: true,
    compravel: false
  },

  laminasDoCaos: {
    nome: "Lâminas do Caos",
    artigo: "as",
    tipo: 0,
    efeito: 100,
    preco: 0,
    especial: true,
    compravel: false
  }
};


const RACAS = {

  Humano: {
    nome: "Humano",
    hp: 100,
    dano: 15,
    ouro: 20
  },

  Ogro: {
    nome: "Ogro",
    hp: 150,
    dano: 25,
    ouro: 5
  },

  Anao: {
    nome: "Anão",
    hp: 120,
    dano: 18,
    ouro: 40
  }

};


const INIMIGOS = [
  { nome: "Goblin",    hp: 15, dano: 8,  ouro: 20 },
  { nome: "Lobo",      hp: 25, dano: 14, ouro: 0  },
  { nome: "Orc",       hp: 50, dano: 23, ouro: 10 },
  { nome: "Diabrete",  hp: 23, dano: 12, ouro: 25 },
  { nome: "Minotauro", hp: 40, dano: 32, ouro: 15 },
  { nome: "Ciclope",   hp: 70, dano: 40, ouro: 10 },
  { nome: "Cérbero",   hp: 60, dano: 45, ouro: 0  },
  { nome: "Bandido",   hp: 20, dano: 15, ouro: 40 },
  { nome: "Harpia",    hp: 25, dano: 12, ouro: 0  }
];


// Chefe final: aparece sempre ao chegar no Castelo e não dá para fugir dele
const CHEFE_FINAL = {
  nome: "Senhor do Caos",
  hp: 180,
  dano: 35,
  ouro: 100,
  chefe: true
};


// Itens especiais encontrados ao chegar em certas salas.
// A chave é o índice da sala (veja o array "salas" mais abaixo).
const ITENS_DAS_SALAS = {

  // 1 = Floresta
  1: {
    item: ITENS.martelo,
    texto:
      "Entre as raízes de uma árvore antiga, algo reflete a luz: " +
      "um martelo velho e gasto.\n" +
      "Ao tocá-lo, você se lembra de uma vida pacata, antes de " +
      "o Herói passar por ela.\n\n"
  },

  // 4 = Templo
  4: {
    item: ITENS.capaceteHeroi,
    texto:
      "No altar do templo repousa um elmo coberto de musgo, " +
      "marcado com o brasão do Herói.\n" +
      "Ele nunca precisou dele. Você precisa.\n\n"
  },

  // 5 = Ruínas
  5: {
    item: ITENS.peitoralHeroi,
    texto:
      "Sob uma coluna caída, você desenterra um peitoral intacto, " +
      "com o brasão do Herói ainda brilhando.\n\n"
  },

  // 6 = Montanha
  6: {
    item: ITENS.espadaHeroi,
    texto:
      "No alto da trilha, uma espada está cravada na rocha, " +
      "esperando por alguém.\n" +
      "Você a arranca sem esforço. O equipamento do Herói " +
      "agora é seu.\n\n"
  }
};


// ==========================================
// 4. ESTADO GLOBAL DO JOGO
// ==========================================

// Todos os estados possíveis do menu (evita erro de digitação)
const ESTADO = {
  ESCOLHA_PERSONAGEM: "escolha_personagem",
  MENU_PRINCIPAL: "menu_principal",
  AGUARDANDO_RETORNO: "aguardando_retorno",
  USANDO_ITEM: "usando_item",
  MENU_COMBATE: "menu_combate",
  INVENTARIO_COMBATE: "inventario_combate",
  LOJA: "loja",
  MENU_SAVE: "menu_save",
  SLOT_SAVE: "slot_save",
  FIM_DE_JOGO: "fim_de_jogo"
};

let jogador = {};
let salaAtual = 0;
let salasComItemColetado = [];

let inventario = [
  ITENS.espada,
  ITENS.pocao
];

let estadoMenu = ESTADO.ESCOLHA_PERSONAGEM;

// Estado do combate
let emCombate = false;
let chefeDerrotado = false;
let inimigoAtual = null;

// Controle do menu de salvar/carregar
let acaoSave = "";            // "salvar" ou "carregar"
let origemSave = "principal"; // "principal" ou "personagem"

const salas = [
  "Cidade",
  "Floresta",
  "Pântano",
  "Caverna",
  "Templo",
  "Ruínas",
  "Montanha",
  "Castelo"
];


// ==========================================
// 5. INICIALIZAÇÃO DO JOGO
// ==========================================

function iniciarJogo(prefixo = "") {

  telaTexto.innerText =
    prefixo +
    "===== ESCOLHA SEU PERSONAGEM =====\n" +
    "1 - Humano\n" +
    "2 - Ogro\n" +
    "3 - Anão\n\n" +
    "Digite o número correspondente:";

  campoInput.focus();
}


// ==========================================
// 6. BOTÕES: JOGAR E SOM
// ==========================================

btnJogar.addEventListener('click', () => {

  // A música começa depois do clique, evitando bloqueio de autoplay
  iniciarMusica();

  telaInicial.style.display = 'none';
  telaJogo.style.display = 'block';

  estadoMenu = ESTADO.ESCOLHA_PERSONAGEM;
  iniciarJogo();
});


// Deixa os dois botões (menu e fixo) sempre com o mesmo texto
function atualizarBotoesSom() {

  const texto = musicaMenu.muted ? "🔇 Música" : "🔊 Música";

  btnSom.innerText = texto;
  btnSomFixo.innerText = texto;
}


// Muta/desmuta. A música continua tocando no mesmo ponto.
function alternarSom() {

  musicaMenu.muted = !musicaMenu.muted;

  // Se a música nunca chegou a tocar, tenta iniciar ao desmutar
  if (!musicaMenu.muted && musicaMenu.paused) {
    iniciarMusica();
  }

  atualizarBotoesSom();
}

btnSom.addEventListener('click', alternarSom);
btnSomFixo.addEventListener('click', alternarSom);


// ==========================================
// 7. MOTOR DE ENTRADA
// ==========================================

function processarComando() {

  const escolha = campoInput.value.trim();

  campoInput.value = '';
  campoInput.focus();

  if (escolha === '') return;

  // Cada estado tem a sua própria função de tratamento
  switch (estadoMenu) {

    case ESTADO.FIM_DE_JOGO:
      location.reload();
      break;

    case ESTADO.ESCOLHA_PERSONAGEM:
      tratarEscolhaPersonagem(escolha);
      break;

    case ESTADO.MENU_PRINCIPAL:
      tratarMenuPrincipal(escolha);
      break;

    case ESTADO.AGUARDANDO_RETORNO:
      estadoMenu = ESTADO.MENU_PRINCIPAL;
      exibirMenuPrincipal("");
      break;

    case ESTADO.USANDO_ITEM:
      tratarUsoItem(escolha);
      break;

    case ESTADO.LOJA:
      tratarLoja(escolha);
      break;

    case ESTADO.MENU_COMBATE:
      tratarMenuCombate(escolha);
      break;

    case ESTADO.INVENTARIO_COMBATE:
      tratarInventarioCombate(escolha);
      break;

    case ESTADO.MENU_SAVE:
      tratarMenuSave(escolha);
      break;

    case ESTADO.SLOT_SAVE:
      tratarSlotSave(escolha);
      break;
  }
}


// ------------------------------------------
// Escolha do personagem
// ------------------------------------------

function tratarEscolhaPersonagem(escolha) {

  if (escolha === "1") {
    jogador = { ...RACAS.Humano };
  }
  else if (escolha === "2") {
    jogador = { ...RACAS.Ogro };
  }
  else if (escolha === "3") {
    jogador = { ...RACAS.Anao };
  }
  else {
    iniciarJogo("Escolha inválida!\n\n");
    return;
  }

  // HP máximo começa igual ao HP inicial da raça
  jogador.hpMax = jogador.hp;

  // Equipamentos começam vazios
  jogador.arma = { tipo: -1, nome: "Nenhuma" };
  jogador.capacete = { tipo: -1, nome: "Nenhum" };
  jogador.peitoral = { tipo: -1, nome: "Nenhum" };

  atualizarFundo();

  estadoMenu = ESTADO.MENU_PRINCIPAL;
  exibirMenuPrincipal("");
}


// ------------------------------------------
// Menu principal
// ------------------------------------------

function tratarMenuPrincipal(escolha) {

  switch (escolha) {

    case "1":
      explorar();
      break;

    case "2":
      avancarMapa();
      break

    case "3":
      voltarMapa();
      break

    case "4":
      prepararUsoItem();
      break;

    case "5":
      exibirStatus();
      break;

    case "6":
      abrirLoja();
      break;

    default:
      exibirMenuPrincipal("Opção inválida!\n\n");
  }
}


// ------------------------------------------
// Usar item fora do combate
// ------------------------------------------

function tratarUsoItem(escolha) {

  if (escolha === "0") {
    estadoMenu = ESTADO.MENU_PRINCIPAL;
    exibirMenuPrincipal("");
    return;
  }

  const indice = parseInt(escolha) - 1;

  if (isNaN(indice) || indice < 0 || indice >= inventario.length) {
    prepararUsoItem("Item inválido!\n\n");
    return;
  }

  usarItem(indice);
}


// ==========================================
// 8. MENUS: PRINCIPAL, STATUS E INVENTÁRIO
// ==========================================

function exibirMenuPrincipal(prefixo = "") {

  telaTexto.innerText =
    prefixo +

    "============================\n" +
    "    RPG - REVENGE OF NPC\n" +
    "============================\n" +

    "1 - Explorar\n" +
    "2 - Avançar para o proximo mapa\n"+
    "3 - Voltar para o mapa anterior\n"+
    "4 - Inventário / Usar item\n" +
    "5 - Status\n" +
    "6 - Loja\n\n" +

    "Opção: ";
}


function exibirStatus() {

  telaTexto.innerText =
    "===== STATUS =====\n" +
    `Raça: ${jogador.nome}\n` +
    `HP: ${jogador.hp}/${jogador.hpMax}\n` +
    `Dano: ${jogador.dano}\n` +
    `Arma: ${jogador.arma.nome}\n` +
    `Capacete: ${jogador.capacete.nome}\n` +
    `Peitoral: ${jogador.peitoral.nome}\n` +
    `Ouro: ${jogador.ouro}\n` +
    `Sala atual: ${salas[salaAtual]}\n\n` +
    "Digite 0 para voltar ao menu.";

  estadoMenu = ESTADO.AGUARDANDO_RETORNO;
}


function prepararUsoItem(prefixo = "") {

  if (inventario.length === 0) {
    exibirMenuPrincipal(
      prefixo + "Seu inventário está totalmente vazio.\n\n"
    );
    return;
  }

  let texto = prefixo + "===== INVENTÁRIO / USAR ITEM =====\n";

  inventario.forEach((item, index) => {
    texto += `${index + 1} - ${nomeDoItem(item)} (Efeito: +${item.efeito})\n`;
  });

  texto +=
    "\n0 - Voltar\n" +
    "Escolha um item pelo número para equipar/usar: ";

  telaTexto.innerText = texto;

  estadoMenu = ESTADO.USANDO_ITEM;
}


// ==========================================
// 8B. SALVAR / CARREGAR (localStorage)
// ==========================================

const SAVE_PREFIXO = "revengeOfNPC_save_";
const SAVE_SLOTS = 3;

function lerSlot(numero) {
  try {
    const bruto = localStorage.getItem(SAVE_PREFIXO + numero);
    return bruto ? JSON.parse(bruto) : null;
  } catch (erro) {
    return null;
  }
}

function descreverSlot(numero) {
  const dados = lerSlot(numero);

  if (!dados || !dados.jogador) return `${numero} - (vazio)`;

  return (
    `${numero} - ${dados.jogador.nome} | ${salas[dados.salaAtual]} | ` +
    `HP ${dados.jogador.hp}/${dados.jogador.hpMax} | ` +
    `Ouro ${dados.jogador.ouro} | ${dados.data}`
  );
}

function abrirMenuSave(prefixo = "") {

  telaTexto.innerText =
    prefixo +
    "===== SALVAR / CARREGAR =====\n" +
    "1 - Salvar jogo\n" +
    "2 - Carregar jogo\n\n" +
    "0 - Voltar\n" +
    "Opção: ";

  estadoMenu = ESTADO.MENU_SAVE;
}

function tratarMenuSave(escolha) {

  if (escolha === "0") {
    estadoMenu = ESTADO.MENU_PRINCIPAL;
    exibirMenuPrincipal("");
  }
  else if (escolha === "1") {
    mostrarSlotsSave("salvar");
  }
  else if (escolha === "2") {
    mostrarSlotsSave("carregar");
  }
  else {
    abrirMenuSave("Opção inválida!\n\n");
  }
}

function mostrarSlotsSave(acao, prefixo = "") {

  acaoSave = acao;

  let texto =
    prefixo +
    (acao === "salvar"
      ? "===== SALVAR JOGO =====\n"
      : "===== CARREGAR JOGO =====\n");

  for (let i = 1; i <= SAVE_SLOTS; i++) {
    texto += descreverSlot(i) + "\n";
  }

  texto +=
    "\n0 - Voltar\n" +
    (acao === "salvar"
      ? "Escolha o slot (sobrescreve o conteúdo): "
      : "Escolha o slot: ");

  telaTexto.innerText = texto;
  estadoMenu = ESTADO.SLOT_SAVE;
}

function voltarDoSlotSave() {

  if (origemSave === "personagem") {
    estadoMenu = ESTADO.ESCOLHA_PERSONAGEM;
    iniciarJogo();
  }
  else if (origemSave === "mini") {

    // Volta para onde o jogador estava: menu do jogo ou escolha de personagem
    if (jogador.nome) {
      estadoMenu = ESTADO.MENU_PRINCIPAL;
      exibirMenuPrincipal("");
    } else {
      estadoMenu = ESTADO.ESCOLHA_PERSONAGEM;
      iniciarJogo();
    }
  } else {
    abrirMenuSave();
  }
}

function tratarSlotSave(escolha) {

  if (escolha === "0") {
    voltarDoSlotSave();
    return;
  }

  const numero = Number(escolha);

  if (!Number.isInteger(numero) || numero < 1 || numero > SAVE_SLOTS) {
    mostrarSlotsSave(acaoSave, "Slot inválido!\n\n");
    return;
  }

  if (acaoSave === "salvar") {
    salvarJogo(numero);
  } else {
    carregarJogo(numero);
  }
}

function salvarJogo(numero) {

  const dados = {
    versao: 1,
    timestamp: Date.now(),
    data: new Date().toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit",
      hour: "2-digit", minute: "2-digit"
    }),
    jogador: jogador,
    salaAtual: salaAtual,
    salasComItemColetado: salasComItemColetado,
    inventario: inventario,
    chefeDerrotado: chefeDerrotado
  };

  try {
    localStorage.setItem(SAVE_PREFIXO + numero, JSON.stringify(dados));
  } catch (erro) {
    mostrarSlotsSave("salvar", "Não foi possível salvar neste navegador!\n\n");
    return;
  }

  if (origemSave === "mini") {
    estadoMenu = ESTADO.MENU_PRINCIPAL;
    exibirMenuPrincipal(`Jogo salvo no slot ${numero}!\n\n`);
  } else {
    abrirMenuSave(`Jogo salvo no slot ${numero}!\n\n`);
  }
}

function carregarJogo(numero) {

  const dados = lerSlot(numero);

  if (!dados || !dados.jogador || !Number.isInteger(dados.salaAtual)) {
    mostrarSlotsSave("carregar", "Esse slot está vazio!\n\n");
    return;
  }

  jogador = dados.jogador;
  salaAtual = dados.salaAtual;
  salasComItemColetado = dados.salasComItemColetado || [];
  inventario = dados.inventario || [];
  chefeDerrotado = !!dados.chefeDerrotado;

  // Salvar só é possível fora de combate
  emCombate = false;
  inimigoAtual = null;

  atualizarFundo();

  estadoMenu = ESTADO.MENU_PRINCIPAL;
  exibirMenuPrincipal(`Jogo carregado do slot ${numero}!\n\n`);
}


// ==========================================
// 9. USAR ITEM (equipar ou beber poção)
// ==========================================

// Itens especiais aparecem com uma estrela na frente do nome
function nomeDoItem(item) {
  return item.especial ? `★ ${item.nome}` : item.nome;
}


function usarItem(index) {

  // Pega o item e remove do inventário
  const itemEscolhido = inventario.splice(index, 1)[0];

  let feedback = "";

  switch (itemEscolhido.tipo) {

    // ARMA
    case 0:
      if (jogador.arma.tipo !== -1) {
        jogador.dano -= jogador.arma.efeito;
        inventario.push(jogador.arma);
      }

      jogador.arma = itemEscolhido;
      jogador.dano += itemEscolhido.efeito;

      feedback = `Você equipou ${itemEscolhido.artigo || "a"} ${itemEscolhido.nome}!\n\n`;
      break;

    // CAPACETE
    case 1:
      if (jogador.capacete.tipo !== -1) {
        removerBonusVida(jogador.capacete.efeito);
        inventario.push(jogador.capacete);
      }

      jogador.capacete = itemEscolhido;
      adicionarBonusVida(itemEscolhido.efeito);

      feedback = `Você equipou o ${itemEscolhido.nome}!\n\n`;
      break;

    // PEITORAL
    case 2:
      if (jogador.peitoral.tipo !== -1) {
        removerBonusVida(jogador.peitoral.efeito);
        inventario.push(jogador.peitoral);
      }

      jogador.peitoral = itemEscolhido;
      adicionarBonusVida(itemEscolhido.efeito);

      feedback = `Você equipou o ${itemEscolhido.nome}!\n\n`;
      break;

    // POÇÃO (nunca passa do HP máximo)
    case 3: {
      const hpAntes = jogador.hp;
      jogador.hp = Math.min(jogador.hpMax, jogador.hp + itemEscolhido.efeito);
      const curado = jogador.hp - hpAntes;

      feedback =
        `Você usou uma ${itemEscolhido.nome} ` +
        `e recuperou ${curado} de HP!\n\n`;
      break;
    }
  }

  // Dentro do combate, usar item gasta o turno
  if (emCombate) {
    const ataque = contraAtaque();

    if (!ataque.vivo) {
      derrotaJogador(feedback + ataque.texto);
      return;
    }

    mostrarMenuCombate(feedback + ataque.texto);
    return;
  }

  estadoMenu = ESTADO.MENU_PRINCIPAL;
  exibirMenuPrincipal(feedback);
}


// Armaduras aumentam o HP máximo (e o HP atual junto)
function adicionarBonusVida(valor) {
  jogador.hpMax += valor;
  jogador.hp += valor;
}

// Ao tirar a armadura, o HP nunca passa do novo máximo e nunca zera
function removerBonusVida(valor) {
  jogador.hpMax -= valor;
  jogador.hp = Math.min(jogador.hp, jogador.hpMax);
  if (jogador.hp < 1) jogador.hp = 1;
}


// ==========================================
// 9B. LOJA
// ==========================================

// Itens à venda: tudo que não é marcado com compravel: false
// (os itens especiais ficam de fora automaticamente)
function itensDaLoja() {
  return Object.values(ITENS).filter((item) => item.compravel !== false);
}


function abrirLoja(prefixo = "") {

  if (salaAtual !== 0) {
    exibirMenuPrincipal("Voce precisa estar na cidade para usar a loja!\n\n");
    return;
}

  const itens = itensDaLoja();

  let texto =
    prefixo +
    "========== LOJA ==========\n" +
    `Seu ouro: ${jogador.ouro}\n\n`;

  itens.forEach((item, index) => {
    texto += `${index + 1} - ${item.nome} (+${item.efeito}) - ${item.preco} ouro\n`;
  });

  texto +=
    "\n0 - Sair da loja\n" +
    "Escolha o item que deseja comprar: ";

  telaTexto.innerText = texto;

  estadoMenu = ESTADO.LOJA;
}


function tratarLoja(escolha) {

  // Sair da loja
  if (escolha === "0") {
    estadoMenu = ESTADO.MENU_PRINCIPAL;
    exibirMenuPrincipal("");
    return;
  }

  const itens = itensDaLoja();
  const indice = Number(escolha) - 1;

  // Número inválido
  if (!Number.isInteger(indice) || indice < 0 || indice >= itens.length) {
    abrirLoja("Opção inválida!\n\n");
    return;
  }

  const item = itens[indice];

  // Ouro insuficiente
  if (jogador.ouro < item.preco) {
    abrirLoja(
      `Ouro insuficiente para comprar ${item.nome}! ` +
      `Faltam ${item.preco - jogador.ouro} de ouro.\n\n`
    );
    return;
  }

  // Compra: tira o ouro e coloca o item no inventário
  jogador.ouro -= item.preco;
  inventario.push(item);

  abrirLoja(`Você comprou ${item.nome} por ${item.preco} de ouro!\n\n`);
}


// ==========================================
// 10. MUDANÇA DINÂMICA DE CENÁRIO
// ==========================================

function atualizarFundo() {

  const fundosPorSala = [
    'cidade.png',
    'floresta.png',
    'pantano.png',
    'caverna.png',
    'templo.png',
    'ruinas.png',
    'montanha.png',
    'castelo.png'
  ];

  // Garante que o índice não passe do limite do array
  const indiceFundo =
    salaAtual < fundosPorSala.length
      ? salaAtual
      : fundosPorSala.length - 1;

  document.body.style.backgroundImage =
    `url('${fundosPorSala[indiceFundo]}')`;
}


// ==========================================
// 11. EXPLORAR
// ==========================================

// Entrega o item especial da sala atual (se houver) e devolve o texto

// Chance de achar o item especial da região a cada exploração (10%)
const CHANCE_ITEM_ESPECIAL = 0.1;

function coletarItemDaSala() {
    const evento = ITENS_DAS_SALAS[salaAtual];

    if (!evento) return "";

    // Impede pegar o mesmo item especial novamente
    if (salasComItemColetado.includes(salaAtual)) {
        return "";
    }

    // Só uma parte das explorações encontra o item especial
    if (Math.random() >= CHANCE_ITEM_ESPECIAL) {
        return "";
    }

    inventario.push(evento.item);
    salasComItemColetado.push(salaAtual);

    return (
        evento.texto +
        `★ Você obteve: ${evento.item.nome} (+${evento.item.efeito})\n` +
        "Use-o em \"Inventário / Usar item\" para equipar.\n\n"
    );
}



function explorar() {

  const cabecalho =
    "===== EXPLORAÇÃO =====\n" +
    `Você está explorando: ${salas[salaAtual]}.\n\n`;

  // No castelo, o chefe aguarda quem explorar
  if (salaAtual === salas.length - 1) {

    if (chefeDerrotado) {
      telaTexto.innerText =
        "===== EXPLORAÇÃO =====\n\n" +
        "O Senhor do Caos foi derrotado. Sua vingança está completa!\n\n" +
        "Digite 0 para voltar ao menu.";

      estadoMenu = ESTADO.AGUARDANDO_RETORNO;
      return;
    }

    iniciarCombate(cabecalho, CHEFE_FINAL);
    return;
  }

  // Itens especiais da região são encontrados ao explorar
  const textoExploracao = cabecalho + coletarItemDaSala();

  // A cidade é segura: não tem inimigos
  if (salaAtual === 0) {

    telaTexto.innerText =
      textoExploracao +
      "A cidade está tranquila. Não há inimigos por aqui.\n\n" +
      "Digite 0 para voltar ao menu.";

    estadoMenu = ESTADO.AGUARDANDO_RETORNO;
    return;
  }

  // 70% de chance de encontrar um inimigo
  if (Math.random() < 0.7) {
    iniciarCombate(textoExploracao);
    return;
  }

  telaTexto.innerText =
    textoExploracao +
    "Você procurou pela região, mas não encontrou nada.\n\n" +
    "Digite 0 para voltar ao menu.";

  estadoMenu = ESTADO.AGUARDANDO_RETORNO;
}

// Avançar só muda de região: inimigos e itens aparecem ao EXPLORAR
function avancarMapa() {

  // Impede avançar além do Castelo
  if (salaAtual >= salas.length - 1) {

    telaTexto.innerText =
      "Você já chegou ao Castelo!\n\n" +
      (chefeDerrotado
        ? "Sua vingança está completa!\n\n"
        : "Não há mais para onde avançar.\n\n") +
      "Digite 0 para voltar ao menu.";

    estadoMenu = ESTADO.AGUARDANDO_RETORNO;
    return;
  }

  // Avança para a próxima região
  salaAtual++;
  atualizarFundo();

  let texto =
    "===== AVANÇANDO NO MAPA =====\n" +
    `Você chegou em: ${salas[salaAtual]}!\n\n`;

  if (salaAtual === salas.length - 1) {
    texto += chefeDerrotado
      ? "O Castelo está em silêncio.\nO Senhor do Caos já foi derrotado!\n\n"
      : "Uma presença sombria paira sobre o Castelo...\n\n";
  } else {
    texto += "Use Explorar para investigar a região.\n\n";
  }

  telaTexto.innerText =
    texto +
    "Digite 0 para voltar ao menu.";

  estadoMenu = ESTADO.AGUARDANDO_RETORNO;
}

function voltarMapa() {
    if (salaAtual <= 0) {
        exibirMenuPrincipal("Voce ja esta na cidade!\n\n");
        return;
    }

    salaAtual--;
    atualizarFundo();

    exibirMenuPrincipal("Voce voltou para a sala anterior.\n\n");
}

// ==========================================
// 12. COMBATE
// ==========================================

function iniciarCombate(prefixo = "", inimigoFixo = null) {

  // Se vier um inimigo fixo (chefe), usa ele. Senão sorteia da lista.
  const base = inimigoFixo
    || INIMIGOS[Math.floor(Math.random() * INIMIGOS.length)];

  // Copia o inimigo para não alterar o original da lista
  inimigoAtual = { ...base };

  emCombate = true;

  const aviso = inimigoAtual.chefe
    ? `O ${inimigoAtual.nome} bloqueia o seu caminho!\n\n`
    : `Um ${inimigoAtual.nome} apareceu!\n\n`;

  mostrarMenuCombate(prefixo + aviso);
}


function mostrarMenuCombate(prefixo = "") {

  estadoMenu = ESTADO.MENU_COMBATE;

  telaTexto.innerText =
    prefixo +
    "========== COMBATE ==========\n\n" +
    `Inimigo: ${inimigoAtual.nome}\n` +
    `HP do inimigo: ${inimigoAtual.hp}\n\n` +
    `Seu HP: ${jogador.hp}/${jogador.hpMax}\n\n` +
    "1 - Atacar\n" +
    "2 - Usar item\n" +
    "3 - Fugir";
}


function tratarMenuCombate(escolha) {

  if (escolha === "1") {
    atacar();
  }
  else if (escolha === "2") {
    mostrarInventarioCombate();
  }
  else if (escolha === "3") {

    if (inimigoAtual.chefe) {
      mostrarMenuCombate("Não há como fugir do chefe!\n\n");
    } else {
      fugir();
    }
  }
  else {
    mostrarMenuCombate("Opção inválida!\n\n");
  }
}


function atacar() {

  // Dano do jogador (com um pouco de sorte)
  const dano = jogador.dano + Math.floor(Math.random() * 6);

  inimigoAtual.hp -= dano;

  // Inimigo morreu
  if (inimigoAtual.hp <= 0) {

    inimigoAtual.hp = 0;
    jogador.ouro += inimigoAtual.ouro;
    emCombate = false;

    // Chefe final: tem tela de vitória própria e entrega as Lâminas do Caos
    if (inimigoAtual.chefe) {
      vencerChefe(dano);
      return;
    }

    telaTexto.innerText =
      "===== INIMIGO DERROTADO =====\n\n" +
      `Você derrotou ${inimigoAtual.nome}!\n` +
      `Dano causado: ${dano}\n` +
      `Ouro recebido: ${inimigoAtual.ouro}\n\n` +
      "Digite 0 para voltar ao menu.";

    estadoMenu = ESTADO.AGUARDANDO_RETORNO;
    return;
  }

  // Inimigo continua vivo e contra-ataca
  const ataque = contraAtaque();
  const log = `Você causou ${dano} de dano!\n` + ataque.texto;

  if (!ataque.vivo) {
    derrotaJogador(log);
    return;
  }

  mostrarMenuCombate(log);
}



function vencerChefe(dano) {

  if (chefeDerrotado) {
    estadoMenu = ESTADO.AGUARDANDO_RETORNO;
    telaTexto.innerText =
      "O Senhor do Caos já foi derrotado!\n\n" +
      "Você já recebeu as Lâminas do Caos.\n\n" +
      "Digite 0 para voltar ao menu.";
    return;
  }

  chefeDerrotado = true;
  inventario.push(ITENS.laminasDoCaos);

  telaTexto.innerText =
    "===== CHEFE DERROTADO =====\n\n" +
    `Você derrotou o ${inimigoAtual.nome}!\n` +
    `Dano causado: ${dano}\n` +
    `Ouro recebido: ${inimigoAtual.ouro}\n\n` +
    "Das cinzas do chefe, duas lâminas flamejantes surgem " +
    "e param diante de você.\n" +
    `★ Você obteve: ${ITENS.laminasDoCaos.nome} ` +
    `(+${ITENS.laminasDoCaos.efeito})\n\n` +
    "Digite 0 para voltar ao menu.";

  estadoMenu = ESTADO.AGUARDANDO_RETORNO;
}



// O inimigo ataca o jogador. Retorna o texto e se o jogador ainda vive.
function contraAtaque() {

  const danoRecebido = inimigoAtual.dano + Math.floor(Math.random() * 4);

  jogador.hp -= danoRecebido;

  return {
    texto: `${inimigoAtual.nome} causou ${danoRecebido} de dano!\n\n`,
    vivo: jogador.hp > 0
  };
}


function derrotaJogador(log = "") {

  jogador.hp = 0;
  emCombate = false;

  telaTexto.innerText =
    log +
    "===== VOCÊ FOI DERROTADO =====\n\n" +
    `${inimigoAtual.nome} derrotou você.\n\n` +
    "Digite qualquer coisa para recomeçar.";

  estadoMenu = ESTADO.FIM_DE_JOGO;
}


function fugir() {

  emCombate = false;

  telaTexto.innerText =
    "Você fugiu do combate!\n\n" +
    "Digite 0 para voltar ao menu.";

  estadoMenu = ESTADO.AGUARDANDO_RETORNO;
}


// ------------------------------------------
// Inventário durante o combate
// ------------------------------------------

function mostrarInventarioCombate() {

  estadoMenu = ESTADO.INVENTARIO_COMBATE;

  if (inventario.length === 0) {

    telaTexto.innerText =
      "===== INVENTÁRIO =====\n\n" +
      "Inventário vazio!\n\n" +
      "Digite 0 para voltar ao combate";

    return;
  }

  let texto = "===== INVENTÁRIO =====\n\n";

  inventario.forEach((item, index) => {
    texto += `${index + 1} - ${nomeDoItem(item)}\n`;
  });

  texto += "\n0 - Voltar ao combate";

  telaTexto.innerText = texto;
}


function tratarInventarioCombate(escolha) {

  if (escolha === "0") {
    mostrarMenuCombate();
    return;
  }

  const indice = Number(escolha) - 1;

  if (Number.isInteger(indice) && indice >= 0 && indice < inventario.length) {
    usarItem(indice);
    return;
  }

  telaTexto.innerText =
    "Opção inválida!\n\n" +
    "Escolha um item do inventário ou 0 para voltar.";
}


// ==========================================
// 12B. OPÇÕES COMO BOTÕES
// ==========================================
// Sempre que o jogo escreve algo na tela (telaTexto.innerText = ...),
// as linhas "1 - Opção" viram botões clicáveis e saem do texto.
// Assim todos os menus funcionam com botões sem mudar a lógica.

const areaBotoes = document.getElementById('botoesJogo');

// Linhas de opção: "1 - Explorar", "0 - Voltar"
const regexOpcao = /^\s*(\d+)\s*-\s*(.+?)\s*$/;

// Linhas que só serviam para pedir digitação (não fazem sentido com botões)
const regexPedidoDigitacao = /^\s*(Opção:|Digite\b.*|Escolha (um|o) .*)\s*$/i;

function converterEmBotoes(texto) {

  const botoes = [];
  const linhas = [];

  texto.split("\n").forEach((linha) => {

    const opcao = linha.match(regexOpcao);

    if (opcao) {
      botoes.push({ valor: opcao[1], rotulo: opcao[2] });
    } else if (!regexPedidoDigitacao.test(linha)) {
      linhas.push(linha);
    }
  });

  // Telas sem opções numeradas: cria o botão que substitui o "Digite..."
  if (botoes.length === 0) {

    const voltar = texto.match(/Digite 0 para (voltar[^.\n]*)/i);

    if (voltar) {
      const rotulo = voltar[1].charAt(0).toUpperCase() + voltar[1].slice(1);
      botoes.push({ valor: "0", rotulo: rotulo });
    }
    else if (/Digite qualquer coisa/i.test(texto)) {
      botoes.push({ valor: "1", rotulo: "Recomeçar" });
    }
    else if (estadoMenu === ESTADO.INVENTARIO_COMBATE) {
      botoes.push({ valor: "0", rotulo: "Voltar ao combate" });
    }
  }

  return {
    texto: linhas.join("\n").replace(/\n{3,}/g, "\n\n").trim(),
    botoes: botoes
  };
}

function desenharBotoes(botoes) {

  areaBotoes.innerHTML = "";

  botoes.forEach((botao) => {

    const elemento = document.createElement("button");

    elemento.className =
      "btn-opcao" + (botao.valor === "0" ? " btn-voltar" : "");
    elemento.dataset.valor = botao.valor;
    elemento.textContent = botao.rotulo;

    elemento.addEventListener("click", () => {
      campoInput.value = botao.valor;
      processarComando();
    });

    areaBotoes.appendChild(elemento);
  });
}

// ------------------------------------------
// Títulos bonitos
// ------------------------------------------
// Transforma as linhas de título do texto do jogo em elementos estilizados:
//   "===== ESCOLHA SEU PERSONAGEM ====="  ->  título da tela
//   "=====" / "RPG - REVENGE OF NPC" / "====="  ->  título principal

function escaparHtml(texto) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function eLinhaSeparadora(linha) {
  return /^\s*=+\s*$/.test(linha);
}

function htmlDoTitulo(texto, classe) {

  // Títulos de derrota ganham uma cor de alerta
  const extra = /DERROTAD/i.test(texto) ? " titulo-derrota" : "";

  return `<div class="${classe}${extra}">${escaparHtml(texto)}</div>`;
}

function textoParaHtml(texto) {

  const linhas = texto.split("\n");
  let html = "";
  let bloco = [];

  // Guarda o texto comum acumulado como um bloco
  const fecharBloco = () => {
    const conteudo = bloco.join("\n").replace(/^\n+|\n+$/g, "");

    if (conteudo.trim() !== "") {
      html += `<div class="texto-bloco">${escaparHtml(conteudo)}</div>`;
    }

    bloco = [];
  };

  for (let i = 0; i < linhas.length; i++) {

    const linha = linhas[i];

    // Título principal: ===== / texto / =====
    if (
      eLinhaSeparadora(linha) &&
      i + 2 < linhas.length &&
      linhas[i + 1].trim() !== "" &&
      !eLinhaSeparadora(linhas[i + 1]) &&
      eLinhaSeparadora(linhas[i + 2])
    ) {
      fecharBloco();
      html += htmlDoTitulo(linhas[i + 1].trim(), "titulo-principal");
      i += 2;
      continue;
    }

    // Linhas só de "=====" soltas não têm utilidade
    if (eLinhaSeparadora(linha)) continue;

    // Título de tela: ===== TEXTO =====
    const titulo = linha.match(/^\s*=+\s*(.+?)\s*=+\s*$/);

    if (titulo) {
      fecharBloco();
      html += htmlDoTitulo(titulo[1], "titulo-tela");
      continue;
    }

    bloco.push(linha);
  }

  fecharBloco();

  return html;
}


// Brilho do hover: guarda a posição do mouse dentro do botão
// (o CSS usa --mx e --my para desenhar o círculo de luz)
areaBotoes.addEventListener("mousemove", (e) => {

  const botao = e.target.closest ? e.target.closest(".btn-opcao") : null;
  if (!botao) return;

  const caixa = botao.getBoundingClientRect();

  botao.style.setProperty("--mx", `${e.clientX - caixa.left}px`);
  botao.style.setProperty("--my", `${e.clientY - caixa.top}px`);
});


// Intercepta a escrita em telaTexto.innerText
const descritorTexto = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "innerText");

Object.defineProperty(telaTexto, "innerText", {
  configurable: true,

  get() {
    return descritorTexto.get.call(telaTexto);
  },

  set(valor) {
    const resultado = converterEmBotoes(String(valor));
    telaTexto.innerHTML = textoParaHtml(resultado.texto);
    desenharBotoes(resultado.botoes);
  }
});

// Atalho: as teclas 0-9 também acionam o botão correspondente
document.addEventListener("keydown", (e) => {

  if (telaJogo.style.display !== "block") return;
  if (!/^[0-9]$/.test(e.key)) return;

  const botao = areaBotoes.querySelector(`[data-valor="${e.key}"]`);
  if (botao) botao.click();
});


// ==========================================
// 12C. MINI MENU (canto superior esquerdo)
// ==========================================
// Botões: Salvar, Carregar, Retomar jogo e Sair do jogo.
//
// >>> BANCO DE DADOS <<<
// Cada ação abaixo está isolada em uma função de miniMenuAcoes.
// Hoje elas usam o localStorage do navegador (lerSlot / salvarJogo /
// carregarJogo, na seção 8B). Para ligar ao banco de dados, troque o
// conteúdo dessas funções (ou as funções da 8B) por chamadas ao servidor.

const miniMenu = document.getElementById('miniMenu');
const miniMenuToggle = document.getElementById('miniMenuToggle');
const miniMenuLista = document.getElementById('miniMenuLista');
const miniMenuAviso = document.getElementById('miniMenuAviso');

const btnMiniSalvar = document.getElementById('btnMiniSalvar');
const btnMiniCarregar = document.getElementById('btnMiniCarregar');
const btnMiniRetomar = document.getElementById('btnMiniRetomar');
const btnMiniSair = document.getElementById('btnMiniSair');

let temporizadorAviso = null;

// Mensagem curta embaixo do botão (não mexe na tela do jogo)
function avisarMiniMenu(mensagem) {

  miniMenuAviso.textContent = mensagem;
  miniMenuAviso.classList.add('visivel');

  clearTimeout(temporizadorAviso);
  temporizadorAviso = setTimeout(() => {
    miniMenuAviso.classList.remove('visivel');
  }, 3000);
}

function fecharMiniMenu() {
  miniMenuLista.classList.remove('aberto');
  miniMenuToggle.setAttribute('aria-expanded', 'false');
}

const miniMenuAcoes = {

  // SALVAR: abre a escolha de slot para gravar
  // TODO (banco de dados): gravar o save no servidor
  salvar() {

    if (!jogador.nome) {
      avisarMiniMenu("Escolha um personagem antes de salvar.");
      return;
    }

    if (emCombate) {
      avisarMiniMenu("Não é possível salvar durante um combate.");
      return;
    }

    origemSave = "mini";
    mostrarSlotsSave("salvar");
  },

  // CARREGAR: abre a escolha de slot para carregar
  // TODO (banco de dados): listar/ler os saves do servidor
  carregar() {
    origemSave = "mini";
    mostrarSlotsSave("carregar");
  },

  // RETOMAR JOGO: carrega direto o save mais recente
  // TODO (banco de dados): buscar o último save do jogador no servidor
  retomar() {

    let ultimo = null;

    for (let i = 1; i <= SAVE_SLOTS; i++) {
      const dados = lerSlot(i);

      if (dados && dados.jogador) {
        const recente = !ultimo ||
          (dados.timestamp || 0) >= (ultimo.dados.timestamp || 0);

        if (recente) ultimo = { numero: i, dados: dados };
      }
    }

    if (!ultimo) {
      avisarMiniMenu("Nenhum jogo salvo para retomar.");
      return;
    }

    if (jogador.nome &&
        !confirm("Retomar o último save? O progresso não salvo será perdido.")) {
      return;
    }

    carregarJogo(ultimo.numero);
  },

  // SAIR DO JOGO: volta para a tela inicial
  // TODO (banco de dados): registrar a saída / salvar automaticamente
  sair() {

    if (jogador.nome &&
        !confirm("Sair para a tela inicial? O progresso não salvo será perdido.")) {
      return;
    }

    // Zera o estado do jogo
    jogador = {};
    salaAtual = 0;
    salasComItemColetado = [];
    inventario = [ITENS.espada, ITENS.pocao];
    chefeDerrotado = false;
    emCombate = false;
    inimigoAtual = null;
    estadoMenu = ESTADO.ESCOLHA_PERSONAGEM;

    document.body.style.backgroundImage = "url('SeiLá.gif')";

    telaJogo.style.display = 'none';
    telaInicial.style.display = 'flex';
    miniMenu.style.display = 'none';
  }
};

// Abre/fecha a lista
miniMenuToggle.addEventListener('click', () => {

  const aberto = miniMenuLista.classList.toggle('aberto');
  miniMenuToggle.setAttribute('aria-expanded', String(aberto));
});

// Cada botão fecha a lista e executa a sua ação
[
  [btnMiniSalvar, 'salvar'],
  [btnMiniCarregar, 'carregar'],
  [btnMiniRetomar, 'retomar'],
  [btnMiniSair, 'sair']
].forEach(([botao, acao]) => {

  botao.addEventListener('click', () => {
    fecharMiniMenu();
    miniMenuAcoes[acao]();
  });
});

// Clicar fora da lista também fecha
document.addEventListener('click', (e) => {
  if (e.target && !miniMenu.contains(e.target)) fecharMiniMenu();
});

// O mini menu só aparece depois de clicar em JOGAR
btnJogar.addEventListener('click', () => {
  miniMenu.style.display = 'block';
});


// ==========================================
// 13. EVENTOS DOS BOTÕES
// ==========================================

botaoEnviar.addEventListener('click', processarComando);

campoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    processarComando();
  }
});


// ==========================================
// 14. INICIALIZAÇÃO
// ==========================================

/*
   Primeiro aparece a tela preta.
   Ao pressionar qualquer tecla (ou tocar na tela), começa a abertura
   e depois aparece a tela de título.
   O jogo começa quando o jogador clicar em JOGAR.
*/

telaPreta.style.display = 'flex';
telaInicial.style.display = 'none';
telaJogo.style.display = 'none';
