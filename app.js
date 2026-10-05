const STORAGE_KEY = "glass-todo-tasks";

const welcomeScreen = document.querySelector("#welcomeScreen");
const todoScreen = document.querySelector("#todoScreen");
const startButton = document.querySelector("#startButton");
const resetButton = document.querySelector("#resetButton");
const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const emptyState = document.querySelector("#emptyState");
const formMessage = document.querySelector("#formMessage");
const totalCount = document.querySelector("#totalCount");
const completedCount = document.querySelector("#completedCount");
const taskCount = document.querySelector("#taskCount");
const progressPercent = document.querySelector("#progressPercent");
const progressBar = document.querySelector("#progressBar");
const progressRing = document.querySelector("#progressRing");
const motivationMessage = document.querySelector("#motivationMessage");
const celebration = document.querySelector("#celebration");

let tasks = loadTasks();
let celebrationTimer;

function loadTasks() {
    try {
        const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(savedTasks) ? savedTasks : [];
    }
    catch {
        return [];
    }
}

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createTask(text) {
    return { id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`, text, completed: false };
}

function renderTasks() {
    taskList.innerHTML = "";
    emptyState.hidden = tasks.length > 0;

    tasks.forEach((task) => {
        const item = document.createElement("li");
        item.className = `task-item${task.completed ? " completed" : ""}`;
        item.dataset.id = task.id;

    const checkButton = document.createElement("button");
    checkButton.className = "task-check";
    checkButton.type = "button";
    checkButton.setAttribute("aria-label", `${task.completed ? "Mark incomplete" : "Complete"} ${task.text}`);
    checkButton.addEventListener("click", () => toggleTask(task.id));

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-task";
    deleteButton.type = "button";
    deleteButton.title = "Delete task";
    deleteButton.setAttribute("aria-label", `Delete ${task.text}`);
    deleteButton.innerHTML = "&#215;";
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    item.append(checkButton, text, deleteButton);
    taskList.append(item);
    });

    updateProgress();
}

function updateProgress() {
    const completed = tasks.filter((task) => task.completed).length;
    const total = tasks.length;
    const percentage = total ? Math.round((completed / total) * 100) : 0;

    completedCount.textContent = completed;
    totalCount.textContent = total;
    taskCount.textContent = total;
    progressPercent.textContent = `${percentage}%`;
    progressBar.style.width = `${percentage}%`;
    progressRing.style.setProperty("--progress", `${percentage * 3.6}deg`);
    progressRing.setAttribute("aria-label", `${percentage}% complete`);
    motivationMessage.textContent = total > 0 && completed === total ? "You did it!" : completed > 0 ? "Keep it Up!" : "Keep it Up!";
}

function addTask() {
    const text = taskInput.value.trim();
    if (!text) {
        formMessage.textContent = "Please enter a task";
        taskInput.focus();
        return;
    }

    tasks.push(createTask(text));
    saveTasks();
    renderTasks();
    taskInput.value = "";
    formMessage.textContent = "";
    taskInput.focus();
}

function toggleTask(taskId) {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;

    task.completed = !task.completed;
    saveTasks();
    renderTasks();
    if (tasks.length > 0 && tasks.every((item) => item.completed)) showCelebration();
}

function deleteTask(taskId) {
    tasks = tasks.filter((task) => task.id !== taskId);
    saveTasks();
    renderTasks();
}

function showCelebration() {
    clearTimeout(celebrationTimer);
    celebration.classList.add("show");
    celebration.setAttribute("aria-hidden", "false");
    celebrationTimer = setTimeout(() => {
    celebration.classList.remove("show");
    celebration.setAttribute("aria-hidden", "true");
    }, 2600);
}

startButton.addEventListener("click", () => {
    welcomeScreen.classList.add("hidden");
    todoScreen.classList.remove("hidden");
    taskInput.focus();
});

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addTask();
});

resetButton.addEventListener("click", () => {
    if (!tasks.length) return;
    tasks = [];
    saveTasks();
    renderTasks();
});

taskInput.addEventListener("input", () => {
    if (formMessage.textContent) formMessage.textContent = "";
});

renderTasks();
