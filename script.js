let tasks = [
    { id: 1, title: 'Complete project report', type: 'work', progress: 75, completed: false },
    { id: 2, title: 'Buy groceries', type: 'shopping', progress: 20, completed: false },
    { id: 3, title: 'Morning jog', type: 'personal', progress: 100, completed: true },
    { id: 4, title: 'Read new book', type: 'personal', progress: 40, completed: false },
    { id: 5, title: 'Team meeting', type: 'work', progress: 100, completed: true },
    { id: 6, title: 'Update portfolio', type: 'work', progress: 30, completed: false }
  ];
  
  const taskForm = document.getElementById('taskForm');
  const tasksContainer = document.getElementById('tasksContainer');
  const completedCountEl = document.getElementById('completedCount');
  const totalCountEl = document.getElementById('totalCount');
  const progressPercentEl = document.getElementById('progressPercent');
  let progressChart;
  
  document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    renderProgressChart();
    updateStats();
  });
  
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
  
    const title = document.getElementById('taskTitle').value.trim();
    const type = document.getElementById('taskType').value;
    const progress = parseInt(document.getElementById('taskProgress').value) || 0;
  
    if (title) {
      const newTask = {
        id: Date.now(),
        title,
        type,
        progress: Math.min(100, Math.max(0, progress)),
        completed: progress === 100
      };
  
      tasks.push(newTask);
      renderTasks();
      updateProgressChart();
      updateStats();
      taskForm.reset();
      document.getElementById('taskTitle').focus();
    }
  });
  
  function renderTasks() {
    tasksContainer.innerHTML = '';
    if (tasks.length === 0) {
      tasksContainer.innerHTML = `<div class="col-12 text-center"><p>No tasks yet</p></div>`;
      return;
    }
  
    tasks.forEach(task => {
      const taskCard = document.createElement('div');
      taskCard.className = 'col';
  
      const statusClass = task.completed ? 'completed' : 'in-progress';
      const typeClass = `bg-${task.type}` || 'bg-other';
  
      taskCard.innerHTML = `
        <div class="card task-card ${statusClass}">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="mb-1">${task.title}</h5>
              <span class="badge ${typeClass}">${task.type}</span>
            </div>
            <div class="mb-2">
              <small>Progress: ${task.progress}%</small>
              <div class="progress">
                <div class="progress-bar" style="width:${task.progress}%" role="progressbar" aria-valuenow="${task.progress}" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <div class="form-check form-switch">
                <input class="form-check-input toggle-complete" type="checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
                <label class="form-check-label">${task.completed ? 'Completed' : 'Mark Complete'}</label>
              </div>
              <button class="btn btn-sm btn-outline-danger delete-task" data-id="${task.id}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `;
  
      tasksContainer.appendChild(taskCard);
    });
  
    document.querySelectorAll('.toggle-complete').forEach(cb =>
      cb.addEventListener('change', toggleTaskComplete)
    );
    document.querySelectorAll('.delete-task').forEach(btn =>
      btn.addEventListener('click', deleteTask)
    );
  }
  
  function toggleTaskComplete(e) {
    const id = parseInt(e.target.dataset.id);
    tasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    renderTasks();
    updateProgressChart();
    updateStats();
  }
  
  function deleteTask(e) {
    const id = parseInt(e.target.dataset.id);
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
    updateProgressChart();
    updateStats();
  }
  
  function renderProgressChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    const { completed, total } = calculateProgress();
  
    progressChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'In Progress'],
        datasets: [{
          data: [completed, total - completed],
          backgroundColor: ['#28a745', '#ffc107'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
  
  function updateProgressChart() {
    const { completed, total } = calculateProgress();
    progressChart.data.datasets[0].data = [completed, total - completed];
    progressChart.update();
  }
  
  function updateStats() {
    const { completed, total } = calculateProgress();
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    completedCountEl.textContent = completed;
    totalCountEl.textContent = total;
    progressPercentEl.textContent = `${percent}%`;
  }
  
  function calculateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    return { completed, total };
  }
  