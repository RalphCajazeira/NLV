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
  const prompt = `
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

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: prompt,
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
