/**
 * Загружаем вопросы из questions.json
 */
async function loadQuestions() {
  const response = await fetch("questions.json");
  return await response.json();
}

/**
 * Получаем вопросы по теме (Греция, Рим или все)
 */
function getQuestionsByTopic(allQuestions, topic) {
  let pool = [];
  if (topic === "greece") pool = allQuestions.greece;
  else if (topic === "rome") pool = allQuestions.rome;
  else pool = [...allQuestions.greece, ...allQuestions.rome];

  // Перемешиваем и берём первые 10
  return pool.sort(() => Math.random() - 0.5).slice(0, 10);
}

/**
 * Запуск теста
 */
async function startHistoryQuiz(topic) {
  const quizDiv = document.getElementById("quiz");
  const infoDiv = document.getElementById("info");

  const allQuestions = await loadQuestions();
  const questions = getQuestionsByTopic(allQuestions, topic);

  function showQuestion(index) {
    quizDiv.innerHTML = "";
    infoDiv.innerHTML = "";

    if (index >= questions.length) {
      quizDiv.innerHTML = `
        <h2>Тест завершён!</h2>
        <button onclick="location.href='history.html'">История</button>
        <button onclick="location.href='index.html'">Главная страница</button>
      `;
      return;
    }

    const q = questions[index];
    const div = document.createElement("div");
    div.className = "question";

    // Вопрос + картинка (если есть)
    let content = `<h3>${index + 1}. ${q.text}</h3>`;
    if (q.image) {
      content += `<img src="${q.image}" alt="Вопрос" style="max-width:300px; display:block; margin:10px auto;">`;
    }
    div.innerHTML = content;

    // Варианты ответа
    q.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.innerText = opt;
      btn.onclick = () => {
        if (idx === q.correct) {
          btn.classList.add("correct");
          infoDiv.innerHTML = `<p><b>Верно:</b> ${q.info}</p>`;
        } else {
          btn.classList.add("wrong");
          infoDiv.innerHTML = `<p><b>Неверно!</b></p>`;
        }

        // Кнопка "следующий вопрос" или "завершить тест"
        const nextBtn = document.createElement("button");
        nextBtn.innerText = (index + 1 === questions.length) ? "Завершить тест" : "Следующий вопрос";
        nextBtn.onclick = () => showQuestion(index + 1);
        infoDiv.appendChild(nextBtn);

        // Блокируем остальные кнопки
        Array.from(div.querySelectorAll("button")).forEach(b => b.disabled = true);
      };
      div.appendChild(btn);
    });

    quizDiv.appendChild(div);
  }

  showQuestion(0);
}