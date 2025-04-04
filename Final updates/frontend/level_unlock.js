// Save progress in localStorage
function getUserId() {
    const user = firebase.auth().currentUser;
    return user ? user.uid : null;
}

function getProgress() {
    const uid = getUserId();
    const progress = localStorage.getItem(`levelProgress_${uid}`);
    return progress ? JSON.parse(progress) : { unlocked: ["ls", "commandOfTheDay"] };
}

function saveProgress(progress) {
    const uid = getUserId();
    if (uid) {
        localStorage.setItem(`levelProgress_${uid}`, JSON.stringify(progress));
    }
}

// Control visibility based on progress
function applyLevelLocks() {
    const progress = getProgress();
    const buttons = document.querySelectorAll("[data-level-id]");
  
    buttons.forEach(button => {
      const levelId = button.getAttribute("data-level-id");
      if (!progress.unlocked.includes(levelId)) {
        button.disabled = true;
        button.classList.add("opacity-50", "cursor-not-allowed");
      }
    });
  }

  function unlockNextLevel(currentLevel) {
    const order = ["ls", "cd", "pwd", "mkdir", "rmdir", "cp", "mv", "rm", "touch", "find", "cat", "grep", "sed", "awk", "cut"];
    const progress = getProgress();
    const currentIndex = order.indexOf(currentLevel);
    const next = order[currentIndex + 1];

    if (next && !progress.unlocked.includes(next)) {
        progress.unlocked.push(next);
        saveProgress(progress);

        // ✅ Immediately unlock the button in the sidebar visually
        const nextBtn = document.querySelector(`button[data-level-id="${next}"]`);
        if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.classList.remove("opacity-50", "cursor-not-allowed");
        }
    }
}


// Modify check-answer button logic
function setupCheckAnswerButtons() {
    document.querySelectorAll(".check-answer").forEach(button => {
        button.addEventListener("click", function () {
        const container = this.closest(".question-container");
        const input = container.querySelector(".answer-input");
        const command = input.value.trim();
        const match = container.innerHTML.match(/<!-- Correct answer: (.*?) -->/);
        const correctAnswer = match ? match[1].trim() : null;

        if (command === correctAnswer) {
            alert("Correct! Well done!");
            const nextBtn = container.querySelector(".next-level-button");
            nextBtn.classList.remove("hidden");
        } else {
            alert("Try again.");
        }
        });
    });
}

// Modify next-level button logic
function setupNextLevelButtons() {
    document.querySelectorAll(".next-level-button").forEach(button => {
        button.addEventListener("click", function () {
        const currentSection = this.closest(".content-section");
        const currentId = currentSection.id.replace("content-", "");
        unlockNextLevel(currentId);

        const allSections = document.querySelectorAll(".content-section");
        let nextFound = false;

        for (let i = 0; i < allSections.length; i++) {
            if (nextFound) {
            allSections[i].classList.remove("hidden");
            break;
            }
            if (allSections[i] === currentSection) {
            currentSection.classList.add("hidden");
            nextFound = true;
            }
        }

        applyLevelLocks();
        });
    });
}

// Sidebar buttons should be disabled if not unlocked
function setupSidebarLocks() {
    document.querySelectorAll("button[data-level-id]").forEach(btn => {
        btn.addEventListener("click", function () {
        if (btn.disabled) return;
        const id = btn.getAttribute("data-level-id");
        showContent(`content-${id}`);
        });
    });
}

// Run on page load
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        applyLevelLocks();
        setupCheckAnswerButtons();
        setupNextLevelButtons();
        setupSidebarLocks();
    }
});
