let userInput = document.querySelector(".task-input");
let categoryInput = document.getElementById("category-name");
let dateInput = document.getElementById("date-input");
let addButton = document.getElementById("add-task-btn");
let addCategoryButton = document.getElementById("add-category-btn");
let tabs = document.querySelectorAll(".task-tabs div");
let underLine = document.getElementById("underline");
let taskList = [];
let mode = "all";
let filterList = [];
let categoryList = ["General"];

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

window.addEventListener("DOMContentLoaded", function () {
    underLine.style.width = `${tabs[0].offsetWidth}px`;
    underLine.style.left = `${tabs[0].offsetLeft}px`;
    renderCategories();
});

function addTask() {
    let taskValue = userInput.value;
    let dateValue = dateInput.value;

    if (taskValue === "") 
        return alert("할일을 입력해주세요.");
    let task = {
        text: taskValue,
        date: dateValue,
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
        result += `<div class="task ${task.done
            ? 'task-done'
            : ''}" id="${task.id}">
            <span>${task.text}</span>
            <div class="button-box">
                <button onclick="toggleDone('${task.id}')"><i class="${task.done
                ? 'fas fa-undo-alt'
                : 'fa fa-check'}"></i></button>
                <button onclick="deleteTask('${task.id}')"><i class="fa fa-trash"></i></button>
            </div>
        </div>`;
    }

    document
        .getElementById("task-board")
        .innerHTML = result;
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
    return "_" + Math
        .random()
        .toString(36)
        .substr(2, 9);
}

// 카테고리 추가 함수
function addCategory() {

    let categoryValue = categoryInput
        .value
        .trim();

    if (categoryValue === "") 
        return alert("카테고리명을 입력해주세요.");
    
    if (categoryList.includes(categoryValue)) {
        return alert("이미 존재하는 카테고리입니다.");
    }

    categoryList.push(categoryValue);
    categoryInput.value = "";
    renderCategories();
}

// 카테고리 목록 렌더링 함수
function renderCategories() {
    let categoryBoard = document.getElementById("category-board");
    categoryBoard.innerHTML = "";

    categoryList.forEach(category => {
        let div = document.createElement("div");
        div
            .classList
            .add("nav-menu");
        div.textContent = category;
        div.onclick = function () {
            filterByCategory(category);
        };

        categoryBoard.appendChild(div);
    });
}

addCategoryButton.addEventListener("click", function () {
    $('#categoryModal').modal('show');
});

let saveCategoryBtn = document.getElementById("save-category-btn");
saveCategoryBtn.addEventListener("click", function () {
    addCategory();
    $('#categoryModal').modal('hide');
});

// 카테고리 토글 함수
function toggleCategory(categoryId) {
    let category = document.getElementById(categoryId);
    if (category) {
        if (category.style.display === 'none') {
            category.style.display = 'block';
        } else {
            category.style.display = 'none';
        }
    } else {
        console.error("Element with ID '" + categoryId + "' not found.");
    }
}

// 현재 날짜를 가져오는 함수
function getTodayDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

// date-input에 현재 날짜 입력
window.addEventListener('DOMContentLoaded', function () {
    let todayDate = getTodayDate();
    dateInput.value = todayDate;
});