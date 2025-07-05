const questions = [
  {
    id: 1,
    type: "true-false",
    question: "Xét các phát biểu sau:",
    statements: [
      {
        text: "1. Nước sôi ở 100°C.",
        answer: "true",
        explanation: "Nước sôi ở 100°C trong điều kiện áp suất khí quyển tiêu chuẩn."
      },
      {
        text: "2. Kim loại nở ra khi lạnh đi.",
        answer: "false",
        explanation: "Sai. Kim loại nở ra khi nóng lên, co lại khi lạnh đi."
      }
    ]
  },
  {
    id: 2,
    type: "fill-in",
    question: "Điền vào chỗ trống: 7 × ___ = 35",
    answer: "5",
    explanation: "Vì 7 × 5 = 35 nên đáp án là 5."
  },
  {
    id: 3,
    type: "drag-drop",
    question: "Kéo thả các số vào chỗ trống:",
    text: "Nước đóng băng ở [___]°C và sôi ở [___]°C.",
    blanks: 2,
    choices: ["0", "50", "100"],
    answer: ["0", "100"],
    explanation: "Nước đóng băng ở 0°C và sôi ở 100°C trong điều kiện thường."
  }
];

function renderQuestions() {
  const container = document.getElementById("questions-container");
  questions.forEach((q, idx) => {
    const div = document.createElement("div");
    div.className = "question";
    let html = `<strong>Câu ${idx + 1}:</strong><p>${q.question}</p>`;

    if (q.type === "true-false") {
      q.statements.forEach((s, i) => {
        html += `
        <p style="margin-bottom:5px;">☐ ${s.text}</p>
        <label><input type="radio" name="q${q.id}_${i}" value="true"> Đúng</label>
        <label><input type="radio" name="q${q.id}_${i}" value="false"> Sai</label>
        <hr style="margin:10px 0;">
        `;
      });
    }

    else if (q.type === "fill-in") {
      html += `<input type="text" id="q${q.id}" placeholder="Điền số vào đây">`;
    }

    else if (q.type === "drag-drop") {
      let parts = q.text.split("[___]");
      html += `<p>`;
      for (let i = 0; i < parts.length; i++) {
        html += parts[i];
        if (i < q.blanks)
          html += `<span class="drop-blank" id="q${q.id}_blank${i}" ondrop="drop(event)" ondragover="allowDrop(event)"></span>`;
      }
      html += `</p><div class="drag-zone">`;
      q.choices.forEach((c, i) => {
        html += `<div class="drag-choice" draggable="true" ondragstart="drag(event)" id="drag${q.id}_${i}">${c}</div>`;
      });
      html += `</div>`;
    }

    div.innerHTML = html;
    container.appendChild(div);
  });
}

// Drag-drop logic
function allowDrop(ev) {
  ev.preventDefault();
}
function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.innerText);
}
function drop(ev) {
  ev.preventDefault();
  ev.target.innerText = ev.dataTransfer.getData("text");
}

function submitExam() {
  let score = 0;
  let resultHTML = "<h3>Kết quả:</h3><ul>";

  questions.forEach((q) => {
    let correct = false;

    if (q.type === "true-false") {
      correct = true;
      q.statements.forEach((s, i) => {
        const user = document.querySelector(`input[name="q${q.id}_${i}"]:checked`);
        if (!user || user.value !== s.answer) correct = false;
      });
      if (correct) score++;
      resultHTML += `<li>Câu ${q.id}: ${correct ? "✅" : "❌"}</li>`;
      if (!correct) {
        resultHTML += `<div class="result-answer">`;
        q.statements.forEach((s, i) => {
          resultHTML += `<p><b>${s.text}</b><br>Đáp án đúng: <span class="correct">${s.answer === "true" ? "Đúng" : "Sai"}</span><br>📝 ${s.explanation}</p>`;
        });
        resultHTML += `</div>`;
      }
    }

    else if (q.type === "fill-in") {
      const input = document.getElementById(`q${q.id}`);
      if (input && input.value.trim() === q.answer) {
        score++;
        correct = true;
      }
      resultHTML += `<li>Câu ${q.id}: ${correct ? "✅" : "❌"}</li>`;
      if (!correct) {
        resultHTML += `<div class="result-answer"><b>Đáp án đúng:</b> ${q.answer}<br>📝 ${q.explanation}</div>`;
      }
    }

    else if (q.type === "drag-drop") {
      correct = true;
      for (let i = 0; i < q.blanks; i++) {
        const blank = document.getElementById(`q${q.id}_blank${i}`);
        if (blank.innerText.trim() !== q.answer[i]) correct = false;
      }
      if (correct) score++;
      resultHTML += `<li>Câu ${q.id}: ${correct ? "✅" : "❌"}</li>`;
      if (!correct) {
        resultHTML += `<div class="result-answer"><b>Đáp án đúng:</b> ${q.answer.join(" / ")}<br>📝 ${q.explanation}</div>`;
      }
    }
  });

  resultHTML += `</ul><h3>Điểm: ${score} / ${questions.length}</h3>`;
  document.getElementById("result").innerHTML = resultHTML;
}

window.onload = renderQuestions;
