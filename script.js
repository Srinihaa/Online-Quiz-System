
"use strict";

/* =========================================
   INNOVEXA - HAUNTED TREASURE QUEST
   Browser storage: Local Storage
========================================= */

const STORAGE_KEY = "innovexaHauntedQuest_v1";

const defaultGame = {
  player: { name: "", email: "" },
  pumpkins: 0,
  completed: [],
  unlocked: 0,
  avatar: {
    skin: "#f5c6a5",
    hair: "long",
    hairColor: "#24162d",
    outfit: "witch",
    accessory: "✨",
    pet: "🐈‍⬛"
  },
  treasureClaimed: false
};

let game = loadGame();
let currentStage = null;
let currentQuestionIndex = 0;
let selectedAnswer = null;
let questionAnswered = false;
let hintsUsed = 0;
let timerInterval = null;
let timeLeft = 0;
let questionsForStage = [];

/* =========================================
   QUESTION BANK
   Topics: HTML and CSS
========================================= */

const questionBank = {
  easy: [
    [
      { q: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Tool Multi Language", "Home Text Markup Language"], answer: 0, hint: "It is the standard markup language used to create web pages." },
      { q: "Which HTML tag is used to create a paragraph?", options: ["<h1>", "<p>", "<br>", "<div>"], answer: 1, hint: "The tag starts with the letter p." },
      { q: "Which tag is used for the largest heading?", options: ["<h6>", "<head>", "<h1>", "<title>"], answer: 2, hint: "It is the first heading level." }
    ],
    [
      { q: "Which tag creates a hyperlink?", options: ["<link>", "<a>", "<href>", "<url>"], answer: 1, hint: "It is called the anchor tag." },
      { q: "Which HTML tag inserts an image?", options: ["<picture>", "<image>", "<img>", "<src>"], answer: 2, hint: "The tag is short and has three letters." },
      { q: "Which attribute specifies an image location?", options: ["href", "src", "alt", "link"], answer: 1, hint: "It stands for source." }
    ],
    [
      { q: "Which tag creates an unordered list?", options: ["<ol>", "<li>", "<ul>", "<list>"], answer: 2, hint: "It stands for unordered list." },
      { q: "Which tag creates a table row?", options: ["<td>", "<tr>", "<th>", "<table>"], answer: 1, hint: "The abbreviation refers to a table row." },
      { q: "Which tag is used to create a form?", options: ["<input>", "<form>", "<label>", "<button>"], answer: 1, hint: "It has the same name as the feature." }
    ],
    [
      { q: "What does CSS stand for?", options: ["Creative Style System", "Cascading Style Sheets", "Computer Style Syntax", "Colorful Style Sheets"], answer: 1, hint: "The first word is Cascading." },
      { q: "Which CSS property changes text colour?", options: ["font-color", "text-style", "color", "background"], answer: 2, hint: "It is a very short property name." },
      { q: "Which symbol selects an HTML element by ID in CSS?", options: [".", "#", "*", "&"], answer: 1, hint: "It is the hash symbol." }
    ],
    [
      { q: "Which CSS property changes the background colour?", options: ["background-color", "color", "font-size", "border"], answer: 0, hint: "It contains the word background." },
      { q: "Which CSS property controls text size?", options: ["font-style", "text-size", "font-size", "size"], answer: 2, hint: "It begins with font." },
      { q: "Which selector is used for a class?", options: ["#", ".", "*", ":"], answer: 1, hint: "It uses a dot." }
    ],
    [
      { q: "Which HTML tag contains visible page content?", options: ["<head>", "<meta>", "<body>", "<title>"], answer: 2, hint: "It is the main visible section of a page." },
      { q: "Which CSS property adds space inside an element's border?", options: ["margin", "padding", "outline", "gap"], answer: 1, hint: "It is the opposite of outside spacing." },
      { q: "Which HTML element creates a button?", options: ["<button>", "<click>", "<inputbutton>", "<press>"], answer: 0, hint: "The element is named after the control." }
    ]
  ],

  medium: [
    [
      { q: "Which declaration tells the browser that the document uses HTML5?", options: ["<html5>", "<!DOCTYPE html>", "<head html>", "<version=5>"], answer: 1, hint: "It appears at the very beginning of an HTML document." },
      { q: "Which attribute provides alternative text for an image?", options: ["title", "alt", "name", "description"], answer: 1, hint: "It is useful when an image cannot load and for accessibility." },
      { q: "Which element is commonly used to group block-level content?", options: ["<span>", "<div>", "<em>", "<strong>"], answer: 1, hint: "It is a generic container." }
    ],
    [
      { q: "Which attribute opens a link in a new tab?", options: ['target="_blank"', 'open="new"', 'tab="new"', 'href="_blank"'], answer: 0, hint: "It uses the target attribute." },
      { q: "Which HTML element represents a navigation section?", options: ["<navigate>", "<nav>", "<menuitem>", "<links>"], answer: 1, hint: "It is a short semantic tag." },
      { q: "Which input type is suitable for an email address?", options: ['type="text"', 'type="mailbox"', 'type="email"', 'type="address"'], answer: 2, hint: "The type has the same name as the information." }
    ],
    [
      { q: "Which tag defines a table header cell?", options: ["<td>", "<tr>", "<th>", "<theadcell>"], answer: 2, hint: "It begins with the letter t and stands for header." },
      { q: "Which attribute makes a form field mandatory?", options: ["validate", "required", "must", "mandatory"], answer: 1, hint: "It is a built-in HTML attribute." },
      { q: "Which element is used to collect multi-line text?", options: ["<input>", "<textarea>", "<paragraph>", "<text>"], answer: 1, hint: "It is commonly used for comments." }
    ],
    [
      { q: "Which CSS layout system is designed for one-dimensional layouts?", options: ["Grid", "Flexbox", "Float", "Position"], answer: 1, hint: "It arranges items along a row or column." },
      { q: "What does the CSS box model include?", options: ["Content, padding, border, margin", "Text, image, link, colour", "Header, body, footer, nav", "Width, font, colour, shadow"], answer: 0, hint: "Think of the layers around an element." },
      { q: "Which property rounds the corners of an element?", options: ["corner-style", "border-radius", "round-edge", "border-curve"], answer: 1, hint: "It contains the word radius." }
    ],
    [
      { q: "Which CSS unit is relative to the root element's font size?", options: ["px", "em", "rem", "%"], answer: 2, hint: "It begins with the letter r." },
      { q: "Which pseudo-class applies a style when the pointer is over an element?", options: [":focus", ":active", ":hover", ":visited"], answer: 2, hint: "It describes the pointer moving over an element." },
      { q: "Which property controls the space between grid columns?", options: ["column-gap", "column-space", "grid-margin", "column-width"], answer: 0, hint: "It contains the word gap." }
    ],
    [
      { q: "Which CSS property controls the stacking order of positioned elements?", options: ["order", "z-index", "layer", "stack"], answer: 1, hint: "It starts with the letter z." },
      { q: "Which declaration hides an element and removes its layout space?", options: ["visibility: hidden", "opacity: 0", "display: none", "position: hidden"], answer: 2, hint: "It removes the element from the layout." },
      { q: "Which at-rule is used to apply styles at different screen sizes?", options: ["@screen", "@responsive", "@media", "@device"], answer: 2, hint: "It is used for responsive design." }
    ]
  ],

  hard: [
    [
      { q: "What is the purpose of the HTML lang attribute?", options: ["Set the page language", "Set the page layout", "Set the page title", "Set the text size"], answer: 0, hint: "It helps browsers and assistive technologies identify the language." },
      { q: "Which element is intended for self-contained content such as a blog post?", options: ["<section>", "<article>", "<aside>", "<div>"], answer: 1, hint: "It represents an independent piece of content." },
      { q: "Which attribute connects a label to a form control?", options: ["name", "for", "connect", "target"], answer: 1, hint: "Its value should match the control's ID." }
    ],
    [
      { q: "What is the purpose of the rel attribute in a link element?", options: ["Defines the relationship to the linked resource", "Changes the font", "Sets the page title", "Creates a form"], answer: 0, hint: "It describes how the current document relates to the linked resource." },
      { q: "Which attribute can prevent a form from being submitted without a valid input?", options: ["required", "placeholder", "autocomplete", "autofocus"], answer: 0, hint: "It marks a field as compulsory." },
      { q: "Which HTML element is used to embed another webpage?", options: ["<framepage>", "<iframe>", "<embedpage>", "<window>"], answer: 1, hint: "It is an inline frame." }
    ],
    [
      { q: "What is the purpose of the HTML data-* attributes?", options: ["Store custom data on elements", "Create database tables", "Load CSS files", "Make elements invisible"], answer: 0, hint: "They allow extra information to be stored in markup." },
      { q: "Which attribute helps a browser suggest previously entered values?", options: ["required", "autocomplete", "pattern", "multiple"], answer: 1, hint: "It contains the word complete." },
      { q: "Which element provides a caption for a figure?", options: ["<caption>", "<figcaption>", "<legend>", "<summary>"], answer: 1, hint: "It is specifically associated with the figure element." }
    ],
    [
      { q: "What does box-sizing: border-box do?", options: ["Includes padding and border in the declared width and height", "Removes the border", "Adds margin to the width", "Makes the element circular"], answer: 0, hint: "The declared dimensions include more than just content." },
      { q: "Which selector has the highest specificity?", options: ["Element selector", "Class selector", "ID selector", "Universal selector"], answer: 2, hint: "It targets one element using its unique identifier." },
      { q: "Which CSS property creates space outside an element's border?", options: ["padding", "margin", "outline", "line-height"], answer: 1, hint: "It controls external spacing." }
    ],
    [
      { q: "What is the main purpose of CSS Grid?", options: ["Two-dimensional page layout", "Only text formatting", "Database storage", "Image compression"], answer: 0, hint: "It manages rows and columns together." },
      { q: "What does position: absolute position an element relative to?", options: ["Always the browser window", "Its nearest positioned ancestor", "The previous sibling", "The document title"], answer: 1, hint: "Look for the nearest ancestor with a positioning value other than static." },
      { q: "Which function is commonly used to create responsive grid columns?", options: ["repeat()", "rotate()", "translate()", "opacity()"], answer: 0, hint: "It repeats a track definition." }
    ],
    [
      { q: "What does the CSS clamp() function do?", options: ["Sets a value within a minimum and maximum range", "Hides overflowing content", "Creates a grid", "Changes an element's position"], answer: 0, hint: "It accepts a minimum, preferred and maximum value." },
      { q: "Which property controls how content is handled when it overflows an element?", options: ["overflow", "visibility", "content", "display"], answer: 0, hint: "It can be hidden, visible, scroll or auto." },
      { q: "What is the purpose of a CSS transition?", options: ["Smoothly changes property values over time", "Creates HTML elements", "Stores user information", "Loads a webpage"], answer: 0, hint: "It makes style changes less abrupt." }
    ]
  ]
};

const stageNames = [
  "Old House",
  "Dark Forest",
  "Graveyard",
  "Spider Cave",
  "Fire Mountain",
  "Haunted Castle"
];

/* =========================================
   STORAGE
========================================= */

function loadGame() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return structuredClone(defaultGame);

    return {
      ...structuredClone(defaultGame),
      ...saved,
      player: { ...defaultGame.player, ...(saved.player || {}) },
      avatar: { ...defaultGame.avatar, ...(saved.avatar || {}) },
      completed: Array.isArray(saved.completed) ? saved.completed : []
    };
  } catch (error) {
    console.warn("Could not load saved game:", error);
    return structuredClone(defaultGame);
  }
}

function saveGame() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(game));
  updateDashboard();
  updateProgress();
  updateLeaderboard();
  updatePumpkinCount();
  updateTreasure();
}

function updatePumpkinCount() {
  document.getElementById("pumpkinCount").textContent = game.pumpkins;
}

/* =========================================
   REGISTRATION
========================================= */

document.getElementById("registerForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("playerName").value.trim();
  const email = document.getElementById("playerEmail").value.trim();

  if (!name || !email) return;

  game.player.name = name;
  game.player.email = email;
  saveGame();

  document.getElementById("avatarName").textContent = name;
  document.getElementById("welcomeMessage").textContent =
    `Welcome, ${name}! Your haunted adventure begins now.`;

  document.getElementById("register").scrollIntoView({ behavior: "smooth" });
});

/* Restore registration details */
if (game.player.name) {
  document.getElementById("playerName").value = game.player.name;
  document.getElementById("playerEmail").value = game.player.email;
  document.getElementById("avatarName").textContent = game.player.name;
  document.getElementById("welcomeMessage").textContent =
    `Welcome back, ${game.player.name}!`;
}

/* =========================================
   MAP AND PROGRESS
========================================= */

function renderMap() {
  document.querySelectorAll(".checkpoint").forEach(button => {
    const stage = Number(button.dataset.stage);
    button.classList.toggle("locked", stage > game.unlocked);
    button.classList.toggle("completed", game.completed.includes(stage));
    button.classList.toggle("active", stage === game.unlocked && !game.completed.includes(stage));
    button.disabled = stage > game.unlocked;
  });
}

function updateProgress() {
  const count = game.completed.length;
  document.getElementById("completedCount").textContent = count;
  document.getElementById("progressBar").style.width = `${(count / 6) * 100}%`;
  document.getElementById("progressText").textContent =
    count === 6 ? "All checkpoints completed! The treasure is yours." :
    `${6 - count} checkpoint(s) remaining. Keep exploring!`;

  renderMap();
}

document.querySelectorAll(".checkpoint").forEach(button => {
  button.addEventListener("click", () => {
    const stage = Number(button.dataset.stage);

    if (stage > game.unlocked) {
      alert("This checkpoint is still locked. Complete the previous checkpoint first!");
      return;
    }

    startStage(stage);
  });
});

/* =========================================
   QUIZ
========================================= */

function startStage(stage) {
  if (!game.player.name) {
    alert("Please register your player name before starting the quest.");
    document.getElementById("register").scrollIntoView({ behavior: "smooth" });
    return;
  }

  if (game.completed.includes(stage)) {
    document.getElementById("quizFeedback").textContent =
      "You have already completed this checkpoint. Choose the next unlocked location!";
    return;
  }

  stopTimer();

  currentStage = stage;
  currentQuestionIndex = 0;
  selectedAnswer = null;
  questionAnswered = false;
  hintsUsed = 0;

  const difficulty = document.getElementById("difficulty").value;
  questionsForStage = questionBank[difficulty][stage].map(q => ({ ...q }));

  document.getElementById("stageLabel").textContent =
    `CHECKPOINT ${stage + 1} OF 6`;
  document.getElementById("quizTitle").textContent = stageNames[stage];
  document.getElementById("quizDifficulty").textContent =
    `Difficulty: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`;

  showQuestion();
  document.getElementById("quiz").scrollIntoView({ behavior: "smooth" });
}

function showQuestion() {
  const question = questionsForStage[currentQuestionIndex];
  if (!question) return;

  selectedAnswer = null;
  questionAnswered = false;

  document.getElementById("questionNumber").textContent =
    `Question ${currentQuestionIndex + 1}/${questionsForStage.length}`;
  document.getElementById("questionText").textContent = question.q;
  document.getElementById("quizFeedback").textContent = "";
  document.getElementById("nextButton").disabled = true;
  document.getElementById("nextButton").textContent =
    currentQuestionIndex === questionsForStage.length - 1 ? "Complete Checkpoint" : "Next Question";
  document.getElementById("hintButton").disabled = hintsUsed >= 2;

  const optionsContainer = document.getElementById("answerOptions");
  optionsContainer.innerHTML = "";

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-option";
    button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
    button.addEventListener("click", () => chooseAnswer(index));
    optionsContainer.appendChild(button);
  });

  startTimer();
}

function chooseAnswer(index) {
  if (questionAnswered) return;

  selectedAnswer = index;
  questionAnswered = true;
  stopTimer();

  const question = questionsForStage[currentQuestionIndex];
  const buttons = document.querySelectorAll(".answer-option");
  const correct = index === question.answer;

  buttons.forEach((button, i) => {
    button.disabled = true;
    if (i === question.answer) button.classList.add("correct");
    if (i === index && !correct) button.classList.add("wrong");
  });

  if (correct) {
    const reward = getQuestionReward();
    game.pumpkins += reward;
    document.getElementById("quizFeedback").textContent =
      `Correct answer! You earned ${reward} 🎃 pumpkins.`;
    saveGame();
  } else {
    document.getElementById("quizFeedback").textContent =
      `Not quite! The correct answer is: ${question.options[question.answer]}`;
  }

  document.getElementById("nextButton").disabled = false;
}

function getQuestionReward() {
  const difficulty = document.getElementById("difficulty").value;
  if (difficulty === "hard") return 15;
  if (difficulty === "medium") return 10;
  return 5;
}

document.getElementById("nextButton").addEventListener("click", () => {
  if (currentStage === null || !questionAnswered) return;

  if (currentQuestionIndex < questionsForStage.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  } else {
    completeStage();
  }
});

function completeStage() {
  stopTimer();

  if (!game.completed.includes(currentStage)) {
    game.completed.push(currentStage);
    game.unlocked = Math.min(5, Math.max(game.unlocked, currentStage + 1));

    const completionBonus = 10;
    game.pumpkins += completionBonus;

    document.getElementById("quizFeedback").textContent =
      `Checkpoint completed! Bonus: ${completionBonus} 🎃 pumpkins.`;

    saveGame();
  }

  document.getElementById("questionText").textContent =
    `You conquered ${stageNames[currentStage]}!`;
  document.getElementById("answerOptions").innerHTML = "";
  document.getElementById("questionNumber").textContent = "Checkpoint completed";
  document.getElementById("nextButton").disabled = true;
  document.getElementById("hintButton").disabled = true;

  currentStage = null;
}

function startTimer() {
  stopTimer();

  const difficulty = document.getElementById("difficulty").value;
  timeLeft = difficulty === "hard" ? 20 : difficulty === "medium" ? 30 : 45;

  document.getElementById("timer").textContent = `${timeLeft}s`;

  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = `${timeLeft}s`;

    if (timeLeft <= 0) {
      stopTimer();
      if (!questionAnswered) {
        questionAnswered = true;
        const question = questionsForStage[currentQuestionIndex];
        document.querySelectorAll(".answer-option").forEach((button, i) => {
          button.disabled = true;
          if (i === question.answer) button.classList.add("correct");
        });
        document.getElementById("quizFeedback").textContent =
          `Time is up! Correct answer: ${question.options[question.answer]}`;
        document.getElementById("nextButton").disabled = false;
      }
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

document.getElementById("hintButton").addEventListener("click", () => {
  if (currentStage === null || questionAnswered || hintsUsed >= 2) return;

  const question = questionsForStage[currentQuestionIndex];
  hintsUsed++;

  document.getElementById("quizFeedback").textContent =
    `Hint ${hintsUsed}/2: ${question.hint}`;

  if (hintsUsed >= 2) {
    document.getElementById("hintButton").disabled = true;
  }
});

/* =========================================
   DIFFICULTY CHANGE
========================================= */

document.getElementById("difficulty").addEventListener("change", () => {
  if (currentStage !== null) {
    stopTimer();
    currentStage = null;
    document.getElementById("timer").textContent = "--";
    document.getElementById("quizTitle").textContent = "Difficulty changed";
    document.getElementById("questionText").textContent =
      "Select your checkpoint again to start the new difficulty.";
    document.getElementById("answerOptions").innerHTML = "";
    document.getElementById("nextButton").disabled = true;
    document.getElementById("hintButton").disabled = true;
    document.getElementById("quizFeedback").textContent = "";
  }

  document.getElementById("quizDifficulty").textContent =
    `Difficulty: ${document.getElementById("difficulty").value}`;
});

/* =========================================
   AVATAR STUDIO
========================================= */

function updateAvatarPreview() {
  const avatar = game.avatar;
  const character = document.getElementById("avatarCharacter");
  const face = document.getElementById("previewFace");
  const hair = document.getElementById("previewHair");
  const body = document.getElementById("previewOutfit");

  face.style.backgroundColor = avatar.skin;
  document.querySelector(".avatar-neck").style.backgroundColor = avatar.skin;

  hair.dataset.hair = avatar.hair;
  hair.style.backgroundColor = avatar.hairColor;
  hair.style.color = avatar.hairColor;

  body.dataset.outfit = avatar.outfit;
  document.getElementById("previewAccessory").textContent = avatar.accessory;
  document.getElementById("previewPet").textContent = avatar.pet;

  character.dataset.hair = avatar.hair;
  character.dataset.outfit = avatar.outfit;

  document.getElementById("avatarName").textContent =
    game.player.name || "Your Adventurer";

  updateSelectedAvatarButtons();
}

function updateSelectedAvatarButtons() {
  document.querySelectorAll(".skin-swatch").forEach(button => {
    button.classList.toggle("selected", button.dataset.skin === game.avatar.skin);
  });

  document.querySelectorAll(".color-swatch").forEach(button => {
    button.classList.toggle("selected", button.dataset.color === game.avatar.hairColor);
  });

  document.querySelectorAll("#hairChoices .choice").forEach(button => {
    button.classList.toggle("selected", button.dataset.hair === game.avatar.hair);
  });

  document.querySelectorAll("#outfitChoices .choice").forEach(button => {
    button.classList.toggle("selected", button.dataset.outfit === game.avatar.outfit);
  });

  document.querySelectorAll("#accessoryChoices .choice").forEach(button => {
    button.classList.toggle("selected", button.dataset.accessory === game.avatar.accessory);
  });

  document.querySelectorAll("#petChoices .choice").forEach(button => {
    button.classList.toggle("selected", button.dataset.pet === game.avatar.pet);
  });
}

/* Skin tone */
document.querySelectorAll(".skin-swatch").forEach(button => {
  button.addEventListener("click", () => {
    game.avatar.skin = button.dataset.skin;
    updateAvatarPreview();
  });
});

/* Hair colour */
document.querySelectorAll(".color-swatch").forEach(button => {
  button.addEventListener("click", () => {
    game.avatar.hairColor = button.dataset.color;
    updateAvatarPreview();
  });
});

/* Hairstyle - each choice changes the actual CSS hair shape */
document.querySelectorAll("#hairChoices .choice").forEach(button => {
  button.addEventListener("click", () => {
    game.avatar.hair = button.dataset.hair;
    updateAvatarPreview();
  });
});

/* Outfit */
document.querySelectorAll("#outfitChoices .choice").forEach(button => {
  button.addEventListener("click", () => {
    game.avatar.outfit = button.dataset.outfit;
    updateAvatarPreview();
  });
});

/* Accessory */
document.querySelectorAll("#accessoryChoices .choice").forEach(button => {
  button.addEventListener("click", () => {
    game.avatar.accessory = button.dataset.accessory;
    updateAvatarPreview();
  });
});

/* Pet */
document.querySelectorAll("#petChoices .choice").forEach(button => {
  button.addEventListener("click", () => {
    game.avatar.pet = button.dataset.pet;
    updateAvatarPreview();
  });
});

/* Save avatar */
document.getElementById("saveAvatar").addEventListener("click", () => {
  saveGame();
  document.getElementById("avatarMessage").textContent =
    "Your avatar has been saved successfully!";
});

/* =========================================
   LEADERBOARD
========================================= */

function updateLeaderboard() {
  const rows = document.getElementById("leaderboardRows");
  const players = [
    { name: "Phantom Player", pumpkins: 95, demo: true },
    { name: "Mystery Hunter", pumpkins: 70, demo: true },
    { name: "Shadow Explorer", pumpkins: 45, demo: true }
  ];

  if (game.player.name) {
    players.push({
      name: game.player.name,
      pumpkins: game.pumpkins,
      demo: false
    });
  }

  players.sort((a, b) => b.pumpkins - a.pumpkins);

  rows.innerHTML = "";

  players.forEach((player, index) => {
    const row = document.createElement("div");
    row.className = "leaderboard-row" + (!player.demo ? " current" : "");

    const rank = document.createElement("span");
    rank.textContent = ["🥇", "🥈", "🥉"][index] || `#${index + 1}`;

    const name = document.createElement("span");
    name.textContent = player.name + (!player.demo ? " (You)" : "");

    const score = document.createElement("span");
    score.textContent = `🎃 ${player.pumpkins}`;

    row.append(rank, name, score);
    rows.appendChild(row);
  });
}

/* =========================================
   TREASURE
========================================= */

function updateTreasure() {
  const allCompleted = game.completed.length === 6;
  const chest = document.getElementById("treasureChest");
  const button = document.getElementById("claimTreasure");
  const message = document.getElementById("treasureMessage");

  if (game.treasureClaimed) {
    chest.textContent = "🎁";
    message.textContent = "You discovered the hidden treasure. Congratulations, adventurer!";
    button.textContent = "Treasure Claimed";
    button.disabled = true;
  } else if (allCompleted) {
    chest.textContent = "🔓";
    message.textContent = "All six checkpoints are complete. The legendary treasure is unlocked!";
    button.disabled = false;
  } else {
    chest.textContent = "🔒";
    message.textContent =
      `Complete all six checkpoints to unlock the treasure. ${game.completed.length}/6 completed.`;
    button.disabled = true;
  }
}

document.getElementById("claimTreasure").addEventListener("click", () => {
  if (game.completed.length !== 6 || game.treasureClaimed) return;

  game.treasureClaimed = true;
  game.pumpkins += 50;
  saveGame();

  alert("🎉 Congratulations! You unlocked the hidden treasure and earned 50 bonus pumpkins!");
});

/* =========================================
   ADMIN DASHBOARD
========================================= */

function updateDashboard() {
  document.getElementById("adminPlayer").textContent =
    game.player.name ? "1" : "0";

  document.getElementById("adminCompleted").textContent =
    game.completed.length;

  document.getElementById("adminPumpkins").textContent =
    game.pumpkins;

  document.getElementById("adminDetails").textContent =
    game.player.name
      ? `Player: ${game.player.name} | Email: ${game.player.email} | Unlocked checkpoint: ${game.unlocked + 1}`
      : "No player has registered yet.";
}

document.getElementById("refreshAdmin").addEventListener("click", () => {
  updateDashboard();
  alert("Admin dashboard refreshed!");
});

/* =========================================
   RESET PROGRESS
========================================= */

document.getElementById("resetProgress").addEventListener("click", () => {
  const confirmed = confirm(
    "Are you sure you want to reset your quest progress, pumpkins and avatar?"
  );

  if (!confirmed) return;

  stopTimer();
  game = structuredClone(defaultGame);
  localStorage.removeItem(STORAGE_KEY);

  currentStage = null;
  currentQuestionIndex = 0;
  selectedAnswer = null;
  questionAnswered = false;
  hintsUsed = 0;
  questionsForStage = [];

  document.getElementById("registerForm").reset();
  document.getElementById("welcomeMessage").textContent = "";
  document.getElementById("avatarMessage").textContent = "";
  document.getElementById("timer").textContent = "--";
  document.getElementById("stageLabel").textContent = "NO CHECKPOINT SELECTED";
  document.getElementById("quizTitle").textContent = "Your challenge awaits";
  document.getElementById("questionNumber").textContent = "Question 0/0";
  document.getElementById("questionText").textContent =
    "Select a checkpoint from the island map to start your quiz.";
  document.getElementById("answerOptions").innerHTML = "";
  document.getElementById("quizFeedback").textContent = "";
  document.getElementById("nextButton").disabled = true;
  document.getElementById("hintButton").disabled = true;

  updateAvatarPreview();
  saveGame();
});

/* =========================================
   INITIAL PAGE SETUP
========================================= */

function initializeGame() {
  updateAvatarPreview();
  updatePumpkinCount();
  updateProgress();
  updateLeaderboard();
  updateTreasure();
  updateDashboard();

  document.getElementById("quizDifficulty").textContent =
    "Difficulty: " + document.getElementById("difficulty").value;

  document.getElementById("timer").textContent = "--";
}

initializeGame();
// INNOVEXA - EPIC TREASURE REVEAL

const treasureButton = document.getElementById("claim-treasure");

const treasureOverlay = document.createElement("div");
treasureOverlay.className = "treasure-overlay";

treasureOverlay.innerHTML = `
    <div class="treasure-content">

        <h1>🏆 YOU WON! 🏆</h1>

        <p>You have conquered the Haunted Treasure Quest!</p>

        <div class="big-chest" id="big-chest">
            🎁
        </div>

        <p id="treasure-status">Your mysterious treasure awaits...</p>

        <div class="treasure-prizes" id="treasure-prizes">
            💎 💎 👑 💰 💎
            <br>
            🪙 🟡 💍 🟢 🪙
            <br>
            ✨ GOLD • GEMS • DIAMONDS ✨
        </div>

        <button class="treasure-close" id="treasure-close">
            Continue Adventure
        </button>

    </div>
`;

document.body.appendChild(treasureOverlay);


// Create falling confetti
function launchConfetti() {
    const symbols = ["✨", "🎉", "💎", "⭐", "🪙", "🎊"];

    for (let i = 0; i < 100; i++) {
        const piece = document.createElement("span");

        piece.className = "confetti";
        piece.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];

        piece.style.left = Math.random() * 100 + "vw";
        piece.style.animationDuration = (2 + Math.random() * 3) + "s";
        piece.style.animationDelay = Math.random() * 2 + "s";

        treasureOverlay.appendChild(piece);

        setTimeout(() => piece.remove(), 6000);
    }
}


// Open the treasure
treasureButton.addEventListener("click", function () {

    // The existing game logic must unlock this button first.
    if (treasureButton.disabled) return;

    treasureOverlay.classList.add("show");

    const chest = document.getElementById("big-chest");
    const status = document.getElementById("treasure-status");
    const prizes = document.getElementById("treasure-prizes");

    status.textContent = "Something magical is happening...";

    // Stage 1: Chest shakes
    setTimeout(() => {
        status.textContent = "The treasure chest is opening!";
        chest.classList.add("open");
    }, 1500);

    // Stage 2: Reveal treasure
    setTimeout(() => {
        chest.textContent = "🧰";
        status.textContent = "You discovered the legendary treasure!";
        prizes.classList.add("show");
        launchConfetti();
    }, 2800);

    // Stage 3: Celebration
    setTimeout(() => {
        status.textContent = "Congratulations, Treasure Hunter!";
        launchConfetti();
    }, 4500);

});


// Close celebration
document.getElementById("treasure-close").addEventListener("click", () => {
    treasureOverlay.classList.remove("show");
});