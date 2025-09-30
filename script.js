document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("taskForm");
  const list = document.getElementById("taskList");

  // Defensive: try-catch for localStorage
  let tasks = [];
  try {
    tasks = JSON.parse(localStorage.getItem("studyTasks") || "[]");
  } catch (e) {
    alert("Could not load your tasks. Local storage might be blocked.");
    tasks = [];
  }

  function renderTasks() {
    list.innerHTML = "";
    if (tasks.length === 0) {
      list.innerHTML = `<li>No tasks yet — add a study goal!</li>`;
      return;
    }
    tasks.forEach((task, i) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div>
          <strong>${task.title}</strong>
          <div class="timeline">${formatTime(task.time)} • ${task.date}</div>
        </div>
        <span class="remove" data-idx="${i}">&times;</span>
      `;
      list.appendChild(li);
    });
    document.querySelectorAll(".remove").forEach(btn => {
      btn.addEventListener("click", () => {
        tasks.splice(btn.dataset.idx, 1);
        localStorage.setItem("studyTasks", JSON.stringify(tasks));
        renderTasks();
      });
    });
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const title = document.getElementById("taskTitle").value.trim();
    const time = document.getElementById("taskTime").value;
    const date = document.getElementById("taskDate").value;
    if (!title || !time || !date) return;
    tasks.push({ title, time, date, notified: false });
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
    form.reset();
    renderTasks();
  });

  setInterval(() => {
    const now = new Date();
    tasks.forEach((task, i) => {
      if (!task.notified) {
        const taskTime = new Date(`${task.date}T${task.time}:00`);
        if (now >= taskTime) {
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Study Reminder", { body: `Time for: ${task.title}` });
          } else {
            alert(`Reminder: ${task.title}`);
          }
          tasks[i].notified = true;
          localStorage.setItem("studyTasks", JSON.stringify(tasks));
        }
      }
    });
  }, 15000);

  function formatTime(v) {
    if (!v) return "";
    const [h, m] = v.split(":");
    let hr = parseInt(h);
    const ampm = hr >= 12 ? "PM" : "AM";
    hr = ((hr + 11) % 12) + 1;
    return `${hr}:${m} ${ampm}`;
  }

  renderTasks();
});

  
