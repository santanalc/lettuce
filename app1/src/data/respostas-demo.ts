// Modo demonstração offline: respostas preparadas pela equipe a partir do
// roteiro da demo e das fontes dos snapshots (19/08/2026). Sem chamada externa.

interface Regra {
  id: string;
  palavras: string[];
  resposta: string;
}

function normalizar(t: string): string {
  return t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

const RECUSA_REGULADA =
  "Pedido regulado. A LettuceIA não indica produto, dose, mistura nem aplicação, e não diagnostica praga ou doença. " +
  "Procure um engenheiro agrônomo ou técnico agrícola habilitado (CATI/ATER). Lei 14.785/2023.";

const REGRAS: Regra[] = [
  {
    id: "regulada",
    palavras: [
      "defensivo", "dose", "veneno", "fungicida", "inseticida", "agrotoxico",
      "praga", "pulgao", "lagarta", "doenca", "aplicar", "aplicacao", "remedio", "pesticida",
    ],
    resposta: RECUSA_REGULADA,
  },
  {
    id: "lucro",
    palavras: ["lucro", "lucrar", "ganhar", "ganho", "retorno", "sobra", "quanto vou", "rende", "rentabilidade"],
    resposta:
      "Lucro é o dinheiro da venda menos o que você gastou para plantar. No exemplo simulado da demo: R$ 2.940 líquidos da venda " +
      "menos R$ 2.000 de investimento, sobram R$ 940. É um exemplo com dados simulados para mostrar a conta, não uma promessa. " +
      "O resultado real depende de produtividade, preço e custos do seu talhão; por isso o app mostra faixas com as premissas à vista.",
  },
  {
    id: "ranking",
    palavras: ["alface", "antes", "primeiro", "primeira", "venceu", "ordem", "destaque"],
    resposta:
      "A alface aparece primeiro porque, entre as opções compatíveis com agosto, ela tem o início de colheita mais cedo: ciclo de " +
      "60 a 80 dias para cultivar de verão, contra 85 a 90 do repolho. Primeiro significa colheita mais cedo pelas regras visíveis, " +
      "não que seja a melhor cultura nem a mais lucrativa. Fonte: Embrapa Hortaliças, Circular Técnica 47, referência ampla para o Sudeste.",
  },
  {
    id: "couve",
    palavras: ["couve"],
    resposta:
      "A couve ficou fora porque a janela de plantio dela no perfil da demo vai de abril a junho, e o plantio simulado é em agosto. " +
      "Fora da janela, o modo explorar não a considera elegível. Fonte: Embrapa Circular Técnica 47, com datas de referência ampla " +
      "para o Sudeste; o calendário exato do seu talhão deve ser confirmado com um técnico.",
  },
  {
    id: "condicional",
    palavras: ["condicional", "pendencia", "confirmar cultivar"],
    resposta:
      "Condicional quer dizer que a cultura pode entrar, mas falta confirmar algo. Em agosto, alface e repolho dependem de cultivar " +
      "de verão, e sem irrigação confirmada o sistema não escolhe vencedora: ele mostra a pendência de água em vez de fingir certeza.",
  },
  {
    id: "comparacao",
    palavras: ["compara", "comparacao", "tres culturas", "opcoes", "diferenca entre"],
    resposta:
      "Para agosto em Jundiapeba: alface colhe em 60 a 80 dias e repolho em 85 a 90, ambos exigindo cultivar de verão; " +
      "a couve fica fora porque a janela dela é de abril a junho. Repolho e couve são da mesma família, então plantar um após o outro " +
      "não é rotação de verdade. As regras e fontes de cada decisão aparecem nos cards do plano.",
  },
  {
    id: "investimento",
    palavras: ["investimento", "custo", "custos", "gasto", "gastar", "quanto custa"],
    resposta:
      "O investimento estimado soma os custos de produção do talhão: quantidade por hectare de cada item vezes a sua área vezes o " +
      "custo unitário. Todos os valores são editáveis e o total recalcula na hora. A faixa de mais ou menos 15% é premissa declarada " +
      "da demo. Sem análise de solo, adubação aparece só como categoria; dose é assunto para o responsável técnico.",
  },
  {
    id: "clima",
    palavras: ["clima", "chuva", "tempo", "risco", "geada", "calor"],
    resposta:
      "Para os próximos 7 dias, a demo usa a previsão municipal do CPTEC/INPE no snapshot de 19/08/2026. Depois desse horizonte não " +
      "existe previsão confiável: o app mostra climatologia histórica e marca o risco como desconhecido, que não é o mesmo que risco " +
      "baixo. Alerta regional descreve a região; o diagnóstico do talhão continua sendo trabalho de campo.",
  },
  {
    id: "fontes",
    palavras: ["dados", "fonte", "fontes", "onde vem", "de onde", "api", "atualizado"],
    resposta:
      "Os dados são snapshots públicos, versionados e datados de 19/08/2026: Embrapa Circular Técnica 47 (perfis e calendário), " +
      "FGV Cinturão Verde (contexto regional), CPTEC/INPE (previsão municipal) e CEAGESP/Conab (referência atacadista histórica). " +
      "Nada é buscado ao vivo durante a demonstração, e cada número exibe a fonte ao lado.",
  },
  {
    id: "saudacao",
    palavras: ["oi", "ola", "bom dia", "boa tarde", "boa noite", "quem e voce"],
    resposta:
      "Olá! Sou a LettuceIA, a explicadora do plano de cultivo. Posso contar por que uma cultura entrou ou saiu, explicar o " +
      "investimento, o clima e a conta do exemplo de venda. Toque numa das perguntas prontas ou escreva a sua.",
  },
];

const FALLBACK =
  "Nesta demonstração offline eu respondo às perguntas do roteiro: por que uma cultura entrou ou saiu, investimento, clima, " +
  "fontes dos dados e a conta do lucro no exemplo simulado. Toque numa das perguntas prontas abaixo — ou pergunte com outras palavras.";

export function responderOffline(pergunta: string): { id: string; resposta: string } {
  const p = normalizar(pergunta);
  for (const regra of REGRAS) {
    if (regra.palavras.some((k) => p.includes(k))) return { id: regra.id, resposta: regra.resposta };
  }
  return { id: "fallback", resposta: FALLBACK };
}
