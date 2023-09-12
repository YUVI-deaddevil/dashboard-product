const inputBox = document.getElementById("input-box");
const dueDateInput = document.getElementById("due-date");
const categorySelect = document.getElementById("category-select");
const searchBox = document.getElementById("search-box");
const listContainer = document.getElementById("list-container");

let tasks = []; 

function addTask() {
    if (inputBox.value === "") {
        alert("You must write something!!");
        return;
    }

    const task = {
        text: inputBox.value,
        dueDate: dueDateInput.value || "9999-12-31",
        category: categorySelect.value,
    };

    tasks.push(task);
    renderTasks();

    inputBox.value = "";
    dueDateInput.value = "";
    saveData();
}


function renderTasks(filteredTasks = tasks) {
    listContainer.innerHTML = ""; 

    for (const task of filteredTasks) {
        const taskCard = document.createElement("div");
        taskCard.className = "task-card " + task.category;

        const taskDetails = document.createElement("div");
        taskDetails.className = "task-details";

        const taskText = document.createElement("div");
        taskText.className = "task-text"; 
        taskText.textContent = task.text;
             
        const dueDate = document.createElement("div");
        dueDate.className = "due-date";
        dueDate.textContent = "Due: " + task.dueDate;

        const closeButton = document.createElement("div");
        closeButton.className = "close-button";
        closeButton.innerHTML = "\u00d7";
        closeButton.onclick = function () {
            const index = tasks.indexOf(task);
            if (index !== -1) {
                tasks.splice(index, 1);
                renderTasks();
                saveData();
            }
        };
        const editButton = document.createElement("button");
        editButton.className = "edit-button";
        editButton.textContent = "Edit";
        editButton.onclick = function () {
            editTask(task, taskText);
        };

        taskDetails.appendChild(taskText);
        taskDetails.appendChild(dueDate);

        taskCard.appendChild(taskDetails);
        taskCard.appendChild(editButton);
        taskCard.appendChild(closeButton);

        listContainer.appendChild(taskCard);
    }
}

function saveData() {
    localStorage.setItem("data", JSON.stringify(tasks));
}

function showTask() {
    const storedData = localStorage.getItem("data");
    if (storedData) {
        tasks = JSON.parse(storedData);
        tasks = sortTasks(tasks);
        renderTasks();
    }
}

function searchTasks() {
    const keyword = searchBox.value.toLowerCase();
    const taskCards = listContainer.getElementsByClassName("task-card");

    for (const taskCard of taskCards) {
        const taskText = taskCard.querySelector(".task-text").textContent.toLowerCase();
        if (taskText.includes(keyword)) {
            taskCard.style.display = "block";
        } else {
            taskCard.style.display = "none";
        }
    }
}
function editTask(task, taskTextElement) {
    const newText = prompt("Edit the task:", task.text);
    if (newText !== null) {
        task.text = newText;
        taskTextElement.textContent = newText;
        saveData();
    }
}

searchBox.addEventListener("keyup", searchTasks);

showTask();
