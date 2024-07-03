// DOM 요소들을 변수로 선언합니다.
let taskInput = document.getElementById("task-input"); // 할 일 입력 input 요소
let categoryInput = document.getElementById("category-input"); // 카테고리 입력 input 요소
let addTButton = document.getElementById("add-task-btn"); // 할 일 추가 버튼
let addCButton = document.getElementById("add-categories-btn"); // 카테고리 추가 버튼
let tabsContainer = document.querySelector(".task-tabs"); // 할 일 필터링 탭들을 포함하는 컨테이너
let categoryListContainer = document.getElementById("category-list"); // 사이드바 카테고리 목록 컨테이너

let taskList = []; // 할 일 목록 배열
let filteredTasks = []; // 필터링된 할 일 목록 배열
let categories = ["General"]; // 초기 카테고리 목록 배열 (기본값: General)

let mode = 'all'; // 초기 모드 설정 (기본값: 모든 할 일 보기)

// 카테고리를 추가하는 함수입니다.
function addCategory() {
    let categoryContent = categoryInput.value.trim();

    if (categoryContent === "") {
        alert("카테고리 이름을 입력하세요.");
        return;
    }

    if (categories.includes(categoryContent)) {
        alert("이미 존재하는 카테고리입니다.");
        return;
    }

    categories.push(categoryContent);

    // 카테고리 탭과 사이드바의 카테고리 목록을 업데이트합니다.
    updateCategoryTabs();
    updateSidebarCategories();

    // 입력 필드를 비웁니다.
    categoryInput.value = "";

    // 모달 창을 닫습니다.
    let categoryModal = bootstrap.Modal.getInstance(document.getElementById('categoryModal'));
    if (categoryModal) {
        categoryModal.hide();
    }

    render();
}

// 카테고리 탭을 업데이트하는 함수입니다.
function updateCategoryTabs() {
    let tabsHTML = `<div id="filtering-tabs">`;

    // 필터링 탭 추가
    tabsHTML += `<div id="all">All</div>`;
    tabsHTML += `<div id="ongoing">Not Done</div>`;
    tabsHTML += `<div id="done">Done</div>`;

    // 각 카테고리 탭 추가
    categories.forEach(category => {
        tabsHTML += `<div id="${category}">${category}</div>`;
    });

    tabsHTML += `</div>`;
    tabsContainer.innerHTML = tabsHTML;

    // 각 탭에 클릭 이벤트 리스너를 추가합니다.
    tabsContainer.querySelectorAll("div").forEach(tab => {
        tab.addEventListener("click", function (event) {
            filterTasks(event.target.id); // 클릭된 탭에 따라 할 일 목록을 필터링합니다.
        });
    });
}

// 사이드바의 카테고리 목록을 업데이트하는 함수입니다.
function updateSidebarCategories() {
    categoryListContainer.innerHTML = '';

    categories.forEach(category => {
        addCategoryToSidebar(category);
    });
}

// 카테고리를 사이드바에 추가하는 함수입니다.
function addCategoryToSidebar(category) {
    if (category === "General") return;

    let categoryItem = document.createElement('li');
    categoryItem.className = 'nav-item';

    let linkElement = document.createElement('a');
    linkElement.className = 'nav-link';
    linkElement.href = '#';
    linkElement.textContent = category;

    categoryItem.appendChild(linkElement);

    linkElement.addEventListener('click', function () {
        deleteCategory(category);
    });

    categoryListContainer.appendChild(categoryItem);
}

// 카테고리를 삭제하는 함수입니다.
function deleteCategory(category) {
    if (category === "General") {
        alert("기본 카테고리는 삭제할 수 없습니다.");
        return;
    }

    categories = categories.filter(cat => cat !== category);
    taskList = taskList.filter(task => task.category !== category);

    updateCategoryTabs();
    updateSidebarCategories();
    render();
}

// 할 일을 추가하는 함수입니다.
function addTask() {
    let taskContent = taskInput.value.trim();

    if (taskContent === "") {
        alert("할 일을 입력하세요.");
        return;
    }

    let task = {
        id: randomIDGenerate(),
        taskContent: taskContent,
        isComplete: false,
        category: "General" // 기본적으로 General 카테고리로 설정하지 않음
    };

    taskList.push(task);

    // 할 일을 추가한 후 바로 render 함수 호출
    render();

    taskInput.value = "";
}


// 할 일 목록을 렌더링하는 함수입니다.
function render() {
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
                                <button onclick="toggleComplete('${task.id}')">${task.isComplete ? '취소' : '완료'}</button>
                                <button onclick="deleteTask('${task.id}')">삭제</button>
                            </div>
                        </div>`;
    });

    document.getElementById("task-board").innerHTML = resultHTML;
}

// 할 일 완료 상태를 토글하는 함수입니다.
function toggleComplete(id) {
    let task = taskList.find(task => task.id === id);
    if (task) {
        task.isComplete = !task.isComplete;
        render();
    }
}

// 할 일을 삭제하는 함수입니다.
function deleteTask(id) {
    taskList = taskList.filter(task => task.id !== id);
    render();
}

// 할 일 필터링 함수
function filterTasks(mode) {
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

    render();
}


// 랜덤 ID를 생성하는 함수입니다.
function randomIDGenerate() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// 이벤트 리스너 설정을 초기화합니다.
function setupEventListeners() {
    addTButton.addEventListener('click', addTask);
    addCButton.addEventListener('click', addCategory);
}

setupEventListeners();
updateCategoryTabs();
updateSidebarCategories();
render();
