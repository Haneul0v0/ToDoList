let taskInput = document.getElementById("task-input");
let addTButton = document.getElementById("add-task-btn");
let categoryInput = document.getElementById("category-input");
let addCButton = document.getElementById("add-categories-btn");

let taskList = [];
let categoryList = ["General"];
let mode = "all";
let filteredTasks = [];

function render() {
    updateSidebarCategories();
    renderTasks();
}

function addTask() {
    let taskContent = taskInput.value.trim();
    if (taskContent !== "") {
        let task = {
            id: randomIDGenerate(),
            taskContent: taskContent,
            isComplete: false,
            category: "General"
        };
        taskList.push(task);
        taskInput.value = "";
        render();
    }
}

function addCategory() {
    let categoryName = categoryInput.value.trim();
    if (categoryName !== "" && !categoryList.includes(categoryName)) {
        categoryList.push(categoryName);
        categoryInput.value = "";
        render();
    }
}

function updateSidebarCategories() {
    let categoryListHTML = "";
    categoryList.forEach(category => {
        categoryListHTML += `<li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" role="button" id="categoryDropdown-${category}" data-bs-toggle="dropdown" aria-expanded="false">
                                    ${category}
                                </a>
                                <ul class="dropdown-menu" aria-labelledby="categoryDropdown-${category}">
                                    <li><a class="dropdown-item" href="#" onclick="editCategory('${category}')">수정</a></li>
                                    <li><a class="dropdown-item" href="#" onclick="deleteCategory('${category}')">삭제</a></li>
                                </ul>
                            </li>`;
    });
    document.getElementById("category-list").innerHTML = categoryListHTML;
}

function editCategory(categoryName) {
    let newCategoryName = prompt("새 카테고리 이름을 입력하세요:", categoryName);
    if (newCategoryName !== null && newCategoryName.trim() !== "" && !categoryList.includes(newCategoryName.trim())) {
        let index = categoryList.indexOf(categoryName);
        if (index !== -1) {
            categoryList[index] = newCategoryName.trim();
            taskList.forEach(task => {
                if (task.category === categoryName) {
                    task.category = newCategoryName.trim();
                }
            });
            render();
        }
    }
}

function deleteCategory(categoryName) {
    if (confirm(`정말로 '${categoryName}' 카테고리를 삭제하시겠습니까?`)) {
        categoryList = categoryList.filter(category => category !== categoryName);
        taskList.forEach(task => {
            if (task.category === categoryName) {
                task.category = "General";
            }
        });
        render();
    }
}

function renderTasks() {
    switch (mode) {
        case 'all':
            filteredTasks = taskList;
            break;
        case 'ongoing':
            filteredTasks = taskList.filter(task => !task.isComplete);
            break;
        case 'done':
            filteredTasks = taskList.filter(task => task.isComplete);
            break;
        default:
            filteredTasks = taskList.filter(task => task.category === mode);
            break;
    }

    let resultHTML = '';

    filteredTasks.forEach(task => {
        resultHTML += `<div class="task">
                            <div class="task-content">${task.taskContent}</div>
                            <div>
                                <button onclick="toggleComplete('${task.id}')">
                                    ${task.isComplete ? '<i class="fa-solid fa-rotate-left"></i>' : '<i class="fa-solid fa-check"></i>'}
                                </button>
                                <button onclick="deleteTask('${task.id}')">
                                    <i class="fa-solid fa-delete-left"></i>
                                </button>
                            </div>
                        </div>`;
    });

    document.getElementById("task-board").innerHTML = resultHTML;
}

function toggleComplete(id) {
    let task = taskList.find(task => task.id === id);
    if (task) {
        task.isComplete = !task.isComplete;
        render();
    }
}

function deleteTask(id) {
    taskList = taskList.filter(task => task.id !== id);
    render();
}

function filterTasks(selectedMode) {
    mode = selectedMode;
    renderTasks();
}

function randomIDGenerate() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function setupEventListeners() {
    addTButton.addEventListener('click', addTask);
    addCButton.addEventListener('click', addCategory);

    taskInput.addEventListener('focus', function () {
        taskInput.value = "";
    });

    categoryInput.addEventListener('focus', function () {
        categoryInput.value = "";
    });

    document.getElementById('all').addEventListener('click', function () {
        filterTasks('all');
    });

    document.getElementById('ongoing').addEventListener('click', function () {
        filterTasks('ongoing');
    });

    document.getElementById('done').addEventListener('click', function () {
        filterTasks('done');
    });

    render();
}

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();

    const taskTabs = document.querySelectorAll("#all, #ongoing, #done");
    const underLine = document.getElementById("underline");
    
    taskTabs.forEach(tab => {
        tab.addEventListener("click", taskTabsIndicator);
    });

    taskTabs[0].click();
});

function taskTabsIndicator(e) {
    const taskTabs = document.querySelectorAll("#all, #ongoing, #done");
    taskTabs.forEach(tab => tab.classList.remove('active-tab'));
    
    const currentTab = e.currentTarget;
    currentTab.classList.add('active-tab');
    
    const underLine = document.getElementById("underline");
    underLine.style.left = currentTab.offsetLeft + "px";
    underLine.style.width = currentTab.offsetWidth + "px";
    underLine.style.top = currentTab.offsetTop + currentTab.offsetHeight + "px";
}
