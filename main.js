let userInput = document.querySelector(".task-input");
let addButton = document.getElementById("add-task-btn");
let tabs = document.querySelectorAll(".task-tabs div");
let underLine = document.getElementById("underline");
let taskList = [];
let mode = "all";
let filterList = [];

addButton.addEventListener("click", addTask);
userInput.addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
        addTask(event);
    }
});
for (let i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", function (event) {
        filter(event);
    });
}

// 초기 로딩 시 underline 초기화
window.addEventListener("DOMContentLoaded", function () {
    underLine.style.width = `${tabs[0].offsetWidth}px`;
    underLine.style.left = `${tabs[0].offsetLeft}px`;
});

function addTask() {
    let taskValue = userInput.value;
    if (taskValue === "") 
        return alert("할일을 입력해주세요.");
    let task = {
        text: taskValue,
        done: false,
        id: randomIDGenerator()
    };

    taskList.push(task);
    userInput.value = "";
    render();
}

function render() {
    let result = "";
    let list = [];
    if (mode === "all") {
        list = taskList;
    } else {
        list = filterList;
    }

    for (let i = 0; i < list.length; i++) {
        let task = list[i];
        result += `<div class="task ${task.done ? 'task-done' : ''}" id="${task.id}">
            <span>${task.text}</span>
            <div class="button-box">
                <button onclick="toggleDone('${task.id}')"><i class="${task.done ? 'fas fa-undo-alt' : 'fa fa-check'}"></i></button>
                <button onclick="deleteTask('${task.id}')"><i class="fa fa-trash"></i></button>
            </div>
        </div>`;
    }

    document.getElementById("task-board").innerHTML = result;
}

function toggleDone(id) {
    let task = taskList.find(task => task.id === id);
    if (task) {
        task.done = !task.done;
    }
    filter();
}

function deleteTask(id) {
    taskList = taskList.filter(task => task.id !== id);
    filter();
}

function filter(event) {
    if (event) {
        mode = event.target.id;
        underLine.style.width = `${event.target.offsetWidth}px`;
        underLine.style.left = `${event.target.offsetLeft}px`;
    }

    filterList = [];
    if (mode === "ongoing") {
        filterList = taskList.filter(task => !task.done);
    } else if (mode === "done") {
        filterList = taskList.filter(task => task.done);
    }
    render();
}

function randomIDGenerator() {
    return "_" + Math.random().toString(36).substr(2, 9);
}
