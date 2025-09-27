const questionsDB = {
  history: [
    { text: "В каком году пал Западный Рим?", options: ["410", "476", "622", "1453"], correct: 1 },
    { text: "Кто был первым императором Рима?", options: ["Юлий Цезарь", "Октавиан Август", "Нерон", "Калигула"], correct: 1 }
  ],
  art: [
    { text: "Кто написал «Мону Лизу»?", options: ["Микеланджело", "Да Винчи", "Рафаэль", "Тициан"], correct: 1 }
  ],
  python: [
    { text: "Как обозначается список в Python?", options: ["{}", "()", "[]", "<>"], correct: 2 }
  ],
  probability: [
    { text: "Вероятность выпадения орла при подбрасывании монеты?", options: ["0.25", "0.5", "0.75", "1"], correct: 1 }
  ]
};

function startQuiz(section) {
  const quizDiv = document.getElementById("quiz");
  quizDiv.innerHTML = ""; 
  const shuffled = questionsDB[section].sort(() => Math.random() - 0.5);

  shuffled.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "question";
    div.innerHTML = `<h3>${i+1}. ${q.text}</h3>`;
    q.options.forEach((opt, idx) => {
      const btn = document.createElement("button");
      btn.innerText = opt;
      btn.onclick = () => {
        if (idx === q.correct) {
          btn.classList.add("correct");
        } else {
          btn.classList.add("wrong");
        }
      };
      div.appendChild(btn);
    });
    quizDiv.appendChild(div);
  });
}