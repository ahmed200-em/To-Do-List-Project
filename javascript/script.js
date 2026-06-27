const form = document.querySelector(".the-form");
const input = document.querySelector("#task-input");
const alertMessage = document.querySelector(".alert-message");

const todoList = document.querySelector("#list-div");
const doingList = document.querySelector("#doing-list");
const doneList = document.querySelector("#done-list");

const count = document.querySelector(".counter");
const doingCount = document.querySelector("#doing-counter");
const doneCount = document.querySelector("#done-counter");
const totCount = document.querySelector(".tot-counter");

const doneCountSide = document.querySelector(".done-task");
const remainCountSide = document.querySelector(".remain-task");

let tasks = [];

function updateCounters() {
  const todoCounter = tasks.filter((task) => task.status === "todo").length;
  const doingCounter = tasks.filter((task) => task.status === "doing").length;
  const doneCounter = tasks.filter((task) => task.status === "done").length;

  count.textContent = todoCounter;
  doingCount.textContent = doingCounter;
  doneCount.textContent = doneCounter;
  totCount.textContent = tasks.length;

  doneCountSide.textContent = doneCounter;
  remainCountSide.textContent = doingCounter;
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  } else {
    tasks = [];
  }
}

function appendToCorrectList(list, status) {
  if (status === "todo") {
    todoList.appendChild(list);
  } else if (status === "doing") {
    doingList.appendChild(list);
  } else if (status === "done") {
    doneList.appendChild(list);
  }
}

function createTask(task) {
  const list = document.createElement("li");
  list.dataset.status = task.status;

  const taskInfo = document.createElement("div");
  taskInfo.className = "task-info";

  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.className = "task-checkbox";

  const taskText = document.createElement("span");
  taskText.textContent = task.title;
  taskText.className = "span-delete";

  const dateInput = document.createElement("input");
  dateInput.type = "date";
  dateInput.className = "task-date";
  dateInput.value = task.date;

  taskInfo.append(taskText, dateInput);
  taskText.appendChild(checkBox);

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.innerHTML = '<i class="fa-regular fa-trash-can delete-icon"></i>';

  const doneBtn = document.createElement("button");
  doneBtn.className = "done-btn";
  doneBtn.innerHTML = '<i class="fa-solid fa-clipboard-check done-icon"></i>';
  doneBtn.style.display = task.status === "doing" ? "block" : "none";

  if (task.status === "doing") {
    checkBox.checked = true;
    list.style.borderColor = "#fbbf24";
    list.style.margin = "10px 0 0 0";
    list.style.padding = "8px 12px";
    deleteBtn.style.margin = "-10px 0 0 0";
    checkBox.style.backgroundColor = "#fbbf24";
    checkBox.style.borderColor = "#fbbf24";
  } else if (task.status === "done") {
    checkBox.checked = true;
    checkBox.disabled = true;
    list.style.borderColor = "#4ade80";
    list.style.margin = "10px 0 0 0";
    deleteBtn.style.margin = "5px 0 0 0";
    list.style.padding = "12px 12px";
    checkBox.style.backgroundColor = "#4ade80";
    checkBox.style.borderColor = "#4ade80";
  }

  const actionDiv = document.createElement("div");
  actionDiv.className = "task-actions";
  actionDiv.append(deleteBtn, doneBtn);

  list.append(taskInfo, actionDiv);
  appendToCorrectList(list, task.status);

  deleteBtn.addEventListener("click", function () {
    list.remove();
    tasks = tasks.filter((t) => t.id !== task.id);
    saveTasks();
    updateCounters();
  });

  checkBox.addEventListener("change", function () {
    if (list.dataset.status === "done") {
      this.checked = true;
      return;
    }
    if (this.checked) {
      list.dataset.status = "doing";
      task.status = "doing";
      doingList.appendChild(list);
      list.style.borderColor = "#fbbf24";
      list.style.margin = "10px 0 0 0";
      list.style.padding = "8px 12px";
      deleteBtn.style.margin = "-10px 0 0 0";
      checkBox.style.backgroundColor = "#fbbf24";
      checkBox.style.borderColor = "#fbbf24";
      doneBtn.style.display = "block";
    } else {
      list.dataset.status = "todo";
      task.status = "todo";
      todoList.appendChild(list);
      list.style.borderColor = "#8b5cf6";
      list.style.padding = "12px 12px";
      checkBox.style.backgroundColor = "transparent";
      checkBox.style.borderColor = "#8b5cf6";
      doneBtn.style.display = "none";
    }
    saveTasks();
    updateCounters();
  });

  doneBtn.addEventListener("click", function () {
    if (list.dataset.status !== "doing") return;
    list.dataset.status = "done";
    task.status = "done";
    doneList.appendChild(list);
    list.style.borderColor = "#4ade80";
    list.style.margin = "10px 0 0 0";
    deleteBtn.style.margin = "5px 0 0 0";
    list.style.padding = "12px 12px";
    checkBox.checked = true;
    checkBox.disabled = true;
    checkBox.style.backgroundColor = "#4ade80";
    checkBox.style.borderColor = "#4ade80";
    doneBtn.style.display = "none";
    saveTasks();
    updateCounters();
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const inputValue = input.value.trim();

  if (!inputValue) {
    alertMessage.textContent = "⚠ Task cannot be empty!";
    return;
  }

  alertMessage.textContent = "";

  const task = {
    id: Date.now(),
    title: inputValue,
    date: new Date().toISOString().split("T")[0],
    status: "todo",
  };

  tasks.push(task);
  saveTasks();
  createTask(task);
  updateCounters();

  input.value = "";
});

loadTasks();
tasks.forEach((task) => {
  createTask(task);
});
updateCounters();
