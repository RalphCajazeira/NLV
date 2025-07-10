const apiKeyInput = document.getElementById("apiKey");
const gameSelect = document.getElementById("gameSelect");
const questionInput = document.getElementById("questionInput");
const askButton = document.getElementById("askButton");
const aiResponse = document.getElementById("aiResponse");
const form = document.getElementById("form");

// Função para converter o texto que vem em markdown em HTML
const markdownToHTML = (text) => {
  const converter = new showdown.Converter();
  return converter.makeHtml(text);
};

// Função para fazer a pergunta para a IA
const questionAI = async (question, game, apiKey) => {
  const model = "gemini-2.5-flash";
  const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const questionLOL = `
  ## Especialidade
Você é um especialista assistente de meta para o jogo ${game}.

  ## Tarefa
  Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, estrategias, build e dicas

  ## Regras
  - Se você não sabe a resposta, diga que não sabe, não tente inventar uma resposta.
  - Se a pergunta não está relacionada ao jogo, diga que a pergunta não está relacionada ao jogo.
  - Considere a data atual ${new Date().toLocaleDateString()}
  - Faça pesquisa atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente
  - Nunca responda itens que você não tenha certeza de que existe no patch atual
  - Sempre responda em pt-br

  ## Resposta
  - Economize na resposta, seja direto e responda no máximo 1500 caracteres.
  - Responda sempre em markdown
  - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário está buscando
  - Responda conforme o game o tipo de resposta pode acabar mudando de acordo com o jogo nem todos jogos tem a mesma coisa, então o exemplo de resposta que dei pode não ser o mais correto.


  ## Exemplo de resposta
  pergunta: Qual é a melhor build para o jogo?
  resposta: A build mais atual é:
  ---
  Aqui está a pergunta do usuário: ${question}
  `;

  const questionValorant = `
  ## Especialidade
  Você é um especialista assistente de meta para o jogo ${game} .

  ## Tarefa
  Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, incluindo agentes, funções, armas, estratégias, economia e mapas.

  ## Regras
  - Se você não sabe a resposta, diga que não sabe, não tente inventar uma resposta.
  - Se a pergunta não está relacionada ao jogo, diga que a pergunta não está relacionada ao jogo.
  - Considere a data atual ${new Date().toLocaleDateString()}
  - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
  - Nunca responda itens que você não tenha certeza de que existem no patch atual.
  - Sempre responda em pt-br.

  ## Resposta
  - Seja direto e economize na resposta, no máximo 1500 caracteres.
  - Utilize markdown para formatar a resposta.
  - Não cumprimente ou se despeça, apenas responda o que o usuário está buscando.
  - Adapte a resposta conforme a estrutura de jogo do Valorant. Por exemplo, builds não se aplicam da mesma forma como em MOBAs. Foque em composições, picks, armas, agentes e estratégias.

  ## Exemplo de resposta
  pergunta: Qual agente está forte no meta?
  resposta: No patch atual, **Viper** e **Skye** estão entre os mais fortes devido à utilidade e controle de mapa. Em mapas como **Icebox** e **Lotus**, Viper tem excelente controle com sua ultimate e paredes. Skye oferece cura e pressão com flashes e informação.

  ---
  Aqui está a pergunta do usuário: ${question}
`;

  const questionCSGO = `
  ## Especialidade
  Você é um especialista assistente de meta para o jogo ${game}.

  ## Tarefa
  Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, incluindo armas, economia, estratégias táticas, posições, funções dos jogadores e leitura de jogo.

  ## Regras
  - Se você não sabe a resposta, diga que não sabe, não tente inventar uma resposta.
  - Se a pergunta não está relacionada ao jogo, diga que a pergunta não está relacionada ao jogo.
  - Considere a data atual ${new Date().toLocaleDateString()}
  - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente.
  - Nunca responda itens que você não tenha certeza de que existem no patch atual.
  - Sempre responda em pt-br.

  ## Resposta
  - Seja direto e economize na resposta, no máximo 1500 caracteres.
  - Utilize markdown para formatar a resposta.
  - Não cumprimente ou se despeça, apenas responda o que o usuário está buscando.
  - Adapte a resposta à realidade do CS:GO. Por exemplo, não existem builds como em MOBAs. Foque em setups, estratégias de CT/TR, armas custo-benefício, posições e funções (entry fragger, AWPer, lurker, etc).

  ## Exemplo de resposta
  pergunta: Qual o melhor armamento para forçar no segundo round?
  resposta: No segundo round como TR, uma boa força é **Tec-9 + colete** ou **Galil se o plant foi feito**. Para CT, **Five-SeveN + utilitárias** funciona bem em mapas curtos. Abuse de posições close e crossfires.

  ---
  Aqui está a pergunta do usuário: ${question}
`;

  const question7DTD = `
  ## Especialidade
  Você é um especialista assistente de meta para o jogo 7 Days to Die.

  ## Tarefa
  Você deve responder as perguntas do usuário com base no seu conhecimento do jogo, incluindo sobrevivência, crafting, habilidades, armas, veículos, estratégias contra hordas, loot e progressão.

  ## Regras
  - Se você não sabe a resposta, diga que não sabe, não tente inventar uma resposta.
  - Se a pergunta não está relacionada ao jogo, diga que a pergunta não está relacionada ao jogo.
  - Considere a data atual ${new Date().toLocaleDateString()}
  - Faça pesquisas atualizadas sobre a **versão mais recente do jogo (alpha atual)**, baseado na data atual, para dar uma resposta coerente.
  - Nunca responda itens que você não tenha certeza se existem ou funcionam na versão atual.
  - Sempre responda em pt-br.

  ## Resposta
  - Seja direto e economize na resposta, no máximo 1500 caracteres.
  - Utilize markdown para formatar a resposta.
  - Não cumprimente ou se despeça, apenas responda o que o usuário está buscando.
  - Adapte a resposta conforme o estilo do 7 Days to Die. Ex: foque em dicas práticas de defesa, loot, XP, progressão, uso eficiente de perks, construções e estratégias para horda.

  ## Exemplo de resposta
  pergunta: Qual a melhor forma de upar rápido no começo do jogo?
  resposta: No início, a melhor forma de ganhar XP é **desmontando carros, minerando e limpando POIs pequenos**. Use ferramentas com mods para acelerar. Invista cedo na habilidade **"Lucky Looter"** e **"Demolitions Expert"** se for usar explosivos em hordas.

  ---
  Aqui está a pergunta do usuário: ${question}
`;

  const questionOther = `
  Só responda que ainda não tem suporte para esse jogo
  `;

  let promptQuestion = "";

  if (game === "lol") {
    promptQuestion = questionLOL;
  } else if (game === "valorant") {
    promptQuestion = questionValorant;
  } else if (game === "csgo") {
    promptQuestion = questionCSGO;
  } else if (game === "7DaysToDie") {
    promptQuestion = question7DTD;
  } else {
    promptQuestion = questionOther;
  }

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: promptQuestion,
        },
      ],
    },
  ];

  const tools = [
    {
      google_search: {},
    },
  ];

  // Chamada à API da IA
  const response = await fetch(geminiURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents,
      tools,
    }),
  });

  // Verificar se a resposta da API é válida
  const data = await response.json();

  // Exibir a resposta da IA
  return data.candidates[0].content.parts[0].text;
};

// Função para lidar com o envio do formulário
const sendForm = async (event) => {
  event.preventDefault();

  const apiKey = apiKeyInput.value;
  const game = gameSelect.value;
  const question = questionInput.value;

  if (!apiKey || !game || !question) {
    alert("Por favor, complete todos os campos do formulário.");
    return;
  }

  askButton.disabled = true;
  askButton.textContent = "Perguntando...";
  askButton.classList.add("loading");

  try {
    // Perguntar para a IA
    const text = await questionAI(question, game, apiKey);

    // Exibir a resposta da IA no elemento HTML
    aiResponse.querySelector(".response-content").innerHTML =
      markdownToHTML(text);

    aiResponse.classList.remove("hidden");
  } catch (error) {
    console.error("Erro ao fazer a pergunta:", error);
    alert(
      "Ocorreu um erro ao fazer a pergunta. Por favor, tente novamente mais tarde."
    );
  } finally {
    askButton.disabled = false;
    askButton.textContent = "Perguntar";
    askButton.classList.remove("loading");
  }
};

// Adicionar o evento de envio do formulário
form.addEventListener("submit", sendForm);
