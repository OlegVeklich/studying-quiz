/**
 * Загружаем вопросы из questions.json (раздел История)
 */
async function loadQuestions() {
  const response = await fetch("questions.json");
  return await response.json();
}

/**
 * Получаем вопросы по теме (Греция, Рим или вся история)
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
 * Запуск теста по истории (общий раздел History)
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
          infoDiv.innerHTML = `<p><b>Неверно!</b> Правильный ответ: <u>${q.options[q.correct]}</u></p>`;
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

/**
 * Загружаем вопросы по истории искусства из questions_history_of_art.json
 */
async function loadArtHistoryQuestions() {
  const response = await fetch("questions_history_of_art.json");
  return await response.json(); // ожидаем объект { topics: [...] }
}

/**
 * Получить пул вопросов по теме истории искусства
 * topic === "ancient_greece" -> только Ancient Greece
 * topic === "all" или другое -> все темы
 */
function getArtHistoryQuestionsByTopic(allData, topic) {
  const topics = allData.topics || [];
  let questionsPool = [];
  if (topic === "ancient_greece") {
    const greeceTopic = topics.find(t => t.topic === "Ancient Greece");
    if (greeceTopic) {
      questionsPool = greeceTopic.questions;
    }
  } else if (topic === "ancient_rome") {
    const romeTopic = topics.find(t => t.topic === "Ancient Rome");
    if (romeTopic) {
      questionsPool = romeTopic.questions;
    }
  } else {
    topics.forEach(t => {
      if (Array.isArray(t.questions)) {
        questionsPool = questionsPool.concat(t.questions);
      }
    });
  }
  return questionsPool.sort(() => Math.random() - 0.5).slice(0, 10);
}

/**
 * Тест по истории искусства (1 вопрос за раз, 10 случайных)
 */
async function startArtHistoryQuiz(topic) {
  const quizDiv = document.getElementById("quiz");
  const infoDiv = document.getElementById("info");

  const allData = await loadArtHistoryQuestions();
  const questions = getArtHistoryQuestionsByTopic(allData, topic);

  function showQuestion(index) {
    quizDiv.innerHTML = "";
    infoDiv.innerHTML = "";

    if (index >= questions.length) {
      quizDiv.innerHTML = `
        <h2>Тест завершён!</h2>
        <button onclick="location.href='art-lectures.html'">Лекции по истории искусства</button>
        <button onclick="location.href='art.html'">Искусство</button>
        <button onclick="location.href='index.html'">Главная страница</button>
      `;
      return;
    }

    const q = questions[index];
    const div = document.createElement("div");
    div.className = "question";

    let content = `<h3>${index + 1}. ${q.text}</h3>`;
    if (q.image) {
      content += `<img src="${q.image}" alt="Вопрос" style="max-width:300px; display:block; margin:10px auto;">`;
    }
    div.innerHTML = content;

    q.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.innerText = opt;
      btn.onclick = () => {
        if (idx === q.correct) {
          btn.classList.add("correct");
          infoDiv.innerHTML = `<p><b>Верно:</b> ${q.info}</p>`;
        } else {
          btn.classList.add("wrong");
          infoDiv.innerHTML = `<p><b>Неверно!</b> Правильный ответ: <u>${q.options[q.correct]}</u><br>${q.info}</p>`;
        }

        const nextBtn = document.createElement("button");
        nextBtn.innerText = (index + 1 === questions.length) ? "Завершить тест" : "Следующий вопрос";
        nextBtn.onclick = () => showQuestion(index + 1);
        infoDiv.appendChild(nextBtn);

        Array.from(div.querySelectorAll("button")).forEach(b => b.disabled = true);
      };
      div.appendChild(btn);
    });

    quizDiv.appendChild(div);
  }

  showQuestion(0);
}
/**
 * Загружаем вопросы по картинам
 */
async function loadPaintings() {
  const response = await fetch("questions_art.json");
  return await response.json();
}

/**
 * Квиз по картинам (три вопроса на одну картину)
 */
async function startArtQuiz() {
  const quizDiv = document.getElementById("quiz");

  const allData = await loadPaintings();
  let paintings = allData.paintings;

  // перемешиваем и берём только 10 случайных картин
  paintings = paintings.sort(() => Math.random() - 0.5).slice(0, 10);

  let currentPainting = 0;

  function showPainting() {
    quizDiv.innerHTML = "";

    if (currentPainting >= paintings.length) {
      quizDiv.innerHTML = `
        <h2>Все картины пройдены!</h2>
        <button onclick="location.href='art.html'">Искусство</button>
        <button onclick="location.href='index.html'">Главная страница</button>
      `;
      return;
    }

    const painting = paintings[currentPainting];

    // картинка (увеличенная)
    const img = document.createElement("img");
    img.src = painting.image;
    img.alt = "Картина";
    img.className = "quiz-img"; // <-- добавили класс
    quizDiv.appendChild(img);

    let answeredCount = 0;

    // вопросы по картине
    painting.questions.forEach((q) => {
      const div = document.createElement("div");
      div.className = "question";
      div.innerHTML = `<h3>${q.text}</h3>`;

      const feedback = document.createElement("div"); // индивидуальный блок для ответа

      q.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.innerText = opt;
        btn.onclick = () => {
          if (idx === q.correct) {
            btn.classList.add("correct");
            feedback.innerHTML = `<p><b>Верно:</b> ${q.info}</p>`;
          } else {
            btn.classList.add("wrong");
            feedback.innerHTML = `<p><b>Неверно!</b> Правильный ответ: <u>${q.options[q.correct]}</u><br>${q.info}</p>`;
          }

          // блокируем кнопки этого вопроса
          Array.from(div.querySelectorAll("button")).forEach(b => b.disabled = true);

          answeredCount++;
          // когда на все вопросы картины ответили → показать кнопку
          if (answeredCount === painting.questions.length) {
            const nextBtn = document.createElement("button");
            nextBtn.innerText = "Следующая картина";
            nextBtn.onclick = () => {
              currentPainting++;
              showPainting();
            };
            quizDiv.appendChild(nextBtn);
          }
        };
        div.appendChild(btn);
      });

      div.appendChild(feedback);
      quizDiv.appendChild(div);
    });
  }

  showPainting();
}
