// Typed.js animation
new Typed('#typed', {
  strings: [
    "Focus. Plan. Achieve.",
    "Gentle reminders for study time.",
    "Tasks saved offline locally."
  ],
  typeSpeed: 40,
  backSpeed: 20,
  backDelay: 1500,
  loop: true,
  cursorChar: "|"
});

// Particles.js background
particlesJS('particles-js', {
  "particles": {
    "number": { "value": 60 },
    "color": { "value": "#88d1ff" },
    "shape": { "type": "circle" },
    "size": { "value": 5, "random": true },
    "line_linked": { "enable": true, "opacity": 0.2 },
    "move": { "enable": true, "speed": 1.5 }
  },
  "interactivity": {
    "events": { "onhover": { "enable": true, "mode": "grab" } }
  }
});

const form = document.getElementById('taskForm');
const list = document.getElementById('taskList');
let tasks = JSON.parse(localStorage.getItem('studyTasks') || '[]');

// Request notification permission
if ('Notification' in window && Notification.permission !== 'granted') {
  Notification.requestPermission();
}

function renderTasks() {
  list.innerHTML = '';
  if (tasks.length === 0) {
    let li = document.createElement('li');
    li.style.justifyContent = 'center';
    li.textContent = "No tasks yet — add a study goal!";
    list.appendChild(li);
    return;
  }
  tasks.forEach((task, i) => {
    let li = document.createElement('li');
    li.innerHTML = `
      <div>
        <strong>${task.title}</strong>
        <div class="timeline">${formatTime(task.time)} • ${task.date}</div>
      </div>
      <span class="remove" onclick="removeTask(${i})">&times;</span>
    `;
    list.appendChild(li);
  });
}

function removeTask(i) {
  tasks.splice(i,1);
  localStorage.setItem('studyTasks', JSON.stringify(tasks));
  renderTasks();
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('taskTitle').value.trim();
  const time = document.getElementById('taskTime').value;
  const date = document.getElementById('taskDate').value;
  if (!title || !time || !date) return;
  tasks.push({ title, time, date, notified: false });
  localStorage.setItem('studyTasks', JSON.stringify(tasks));
  form.reset();
  renderTasks();
});

// --- EmailJS function ---
function sendEmailReminder(task) {
  emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
    task_title: task.title,
    task_time: ${formatTime(task.time)} on ${task.date},
    to_email: "your_email@example.com" // replace with your email
  }).then(
    () => console.log("✅ Email sent successfully"),
    err => console.error("❌ Email send error:", err)
  );
}

// Check reminders every 15s
setInterval(() => {
  const now = new Date();
  tasks.forEach((task, idx) => {
    if (!task.notified) {
      const taskTime = new Date(${task.date}T${task.time}:00);
      if (now >= taskTime) {
        // Browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification("Study Reminder", { body: Time for: ${task.title} });
        } else {
          alert(Reminder: ${task.title});
        }

        // Send Email notification
        sendEmailReminder(task);

        tasks[idx].notified = true;
        localStorage.setItem('studyTasks', JSON.stringify(tasks));
      }
    }
  });
}, 15000);

function formatTime(v) {
  if (!v) return '';
  const [h, m] = v.split(':');
  let hr = parseInt(h);
  const ampm = hr >= 12 ? 'PM' : 'AM';
  hr = ((hr + 11) % 12) + 1;
  return ${hr}:${m} ${ampm};
}

renderTasks();
window.removeTask = removeTask;