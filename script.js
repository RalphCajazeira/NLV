const apiKeyInput = document.getElementById("apiKey");
const gameSelect = document.getElementById("gameSelect");
const questionInput = document.getElementById("questionInput");
const askButton = document.getElementById("askButton");
const aiResponse = document.getElementById("aiResponse");
const form = document.getElementById("form");

// Função para fazer a pergunta ao Gemini
const questionAI = async () => {};

form.addEventListener("submit", (event) => {
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
});
