// 유저가 값을 입력한다.
// + 버튼을 클릭하면, 할 일이 추가된다.
// delete버튼을 누르면 할 일이 삭제된다.
// check버튼을 누르면 할 일이 끝나면서 밑줄이 간다.
// 진행중 끝남 탭을 누르면, 언더바가 이동한다.
// 끝남탭은, 끝난 아이템만, 진행중탭은 진행중인 아이템만 출력.
// 전체탭을 누르면 다시 전체아이템으로 돌아옴.

let taskInput = document.getElementById("task-input");
let addButton = document.getElementById("add-button");
addButton.addEventListener("click", addTask)

function addTask(){
    console.log("clicked");
}