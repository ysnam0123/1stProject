const modal = document.querySelector(".confirm-modal");
const testModal = document.querySelector(".test-modal");
const columnsContainer = document.querySelector(".columns");
const columns = columnsContainer.querySelectorAll(".column");

let currentTask = null;

//* functions

const handleDragover = (event) => {
  event.preventDefault(); // allow drop

  const draggedTask = document.querySelector(".dragging");
  const target = event.target.closest(".task, .tasks");

  if (!target || target === draggedTask) return;

  if (target.classList.contains("tasks")) {
    // target is the tasks element
    const lastTask = target.lastElementChild;
    if (!lastTask) {
      // tasks is empty
      target.appendChild(draggedTask);
    } else {
      const { bottom } = lastTask.getBoundingClientRect();
      event.clientY > bottom && target.appendChild(draggedTask);
    }
  } else {
    // target is another
    const { top, height } = target.getBoundingClientRect();
    const distance = top + height / 2;

    if (event.clientY < distance) {
      target.before(draggedTask);
    } else {
      target.after(draggedTask);
    }
  }
};

// const addBtn = document.getElementById("addBtn");

// addBtn.addEventListener("click", () => {
//   testModal.showModal();
// });

testModal
  .querySelector("#cancel")
  .addEventListener("click", () => testModal.close());

const enableTaskEditing = (task) => {
  task.addEventListener("dblclick", handleEdit);
};

const handleDrop = (event) => {
  event.preventDefault();
};

const handleDragend = (event) => {
  event.target.classList.remove("dragging");
  event.target.style.display = "block";
};

const handleDragstart = (event) => {
  event.dataTransfer.effectsAllowed = "move";
  event.dataTransfer.setData("text/plain", "");

  requestAnimationFrame(() => event.target.classList.add("dragging"));
};

const handleDelete = (event) => {
  currentTask = event.target.closest(".task");

  modal.showModal();
};

const handleEdit = (event) => {
  const task = event.target.closest(".task");
  const input = createTaskInput(task.innerText);
  task.replaceWith(input);
  input.focus();

  // move cursor to the end
  const selection = window.getSelection();
  selection.selectAllChildren(input);
  selection.collapseToEnd();
};

const handleBlur = (event) => {
  const input = event.target;
  const content = input.innerText.trim() || "제목 없음";
  const task = createTask(content.replace(/\n/g, "<br>"));
  input.replaceWith(task);
};

const handleAdd = (event) => {
  const tasksEl = event.target.closest(".column").lastElementChild;
  const input = createTaskInput();
  tasksEl.appendChild(input);
  input.focus();
};

const updateTaskCount = (column) => {
  const tasks = column.querySelector(".tasks").children;
  const taskCount = tasks.length;
  column.querySelector(".column-title h3").dataset.tasks = taskCount;
};

const observeTaskChanges = () => {
  for (const column of columns) {
    const observer = new MutationObserver(() => updateTaskCount(column));
    observer.observe(column.querySelector(".tasks"), { childList: true });
  }
};

observeTaskChanges();

const createTask = (content) => {
  const task = document.createElement("div");
  task.className = "task";
  task.draggable = true;
  task.innerHTML = `
        <div>${content}</div>
        <button class="delete-task-btn"><i class="fa-solid fa-minus"></i></button>
    `;
  task.addEventListener("dragstart", handleDragstart);
  task.addEventListener("dragend", handleDragend);
  enableTaskEditing(task);

  task.querySelector(".delete-task-btn").addEventListener("click", (event) => {
    event.stopPropagation();
    task.remove();
  });
  return task;
};

const createTaskInput = (text = "") => {
  const input = document.createElement("div");
  input.className = "task-input";
  input.dataset.placeholder = "테스크 이름";
  input.contentEditable = true;
  input.innerText = text;

  input.addEventListener("blur", handleBlur);

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      input.blur(); // Blur 이벤트를 트리거하여 태스크 추가
    }
  });

  return input;
};

//* event listeners

// dragover and drop
tasksElements = columnsContainer.querySelectorAll(".tasks");
for (const tasksEl of tasksElements) {
  tasksEl.addEventListener("dragover", handleDragover);
  tasksEl.addEventListener("drop", handleDrop);
}

// add, edit and delete task
columnsContainer.addEventListener("click", (event) => {
  if (event.target.closest("button[data-add]")) {
    handleAdd(event);
  } else if (event.target.closest("button[data-edit]")) {
    handleEdit(event);
  } else if (event.target.closest("button[data-delete]")) {
    handleDelete(event);
  }
});

// confirm deletion
modal.addEventListener("#confirm", () => currentTask && currentTask.remove());

// let columnParent = event.target.closest(".column"); // 가장 가까운 .column 찾기
// if (columnParent) {
//   columnParent.remove(); // 컬럼 삭제
//   applyColumnStyles(); // 삭제 후 스타일 재적용
// }

// cancel deletion
modal.querySelector("#cancel").addEventListener("click", () => modal.close());

// clear current task
modal.addEventListener("close", () => (currentTask = null));

//* placeholder tasks

let tasks = [
  ["개발", "발표 준비", "문서 정리"],
  ["디자인 설계"],
  ["와이어프레임 제작", "4주차 WTL"],
  ["와이어프레임 제작", "기능명세서 작성"],
];

tasks.forEach((col, idx) => {
  for (const item of col) {
    columns[idx].querySelector(".tasks").appendChild(createTask(item));
  }
});

const columnColors = [
  "#fcebce",
  "#e1effe",
  "#daf3e2",
  "#fed7d6",
  "#d6e3fc",
  "#fcd6ea",
];
const bulletColors = [
  "#FFB638",
  "#77B8FF",
  "#7AEA9D",
  "#FF8C8C",
  "#6A9BFF",
  "#FF5E5E",
];

// 컬럼의 색상을 적용하는 함수
const applyColumnStyles = () => {
  const columns = document.querySelectorAll(".column");

  // 기존 스타일 제거
  document
    .querySelectorAll("[id^='column-style-']")
    .forEach((style) => style.remove());

  columns.forEach((column) => {
    let columnColor = column.dataset.color;
    let bulletColor = column.dataset.bulletColor;

    // 새로 추가된 컬럼이라면 색상을 지정
    if (!columnColor || !bulletColor) {
      const usedColors = [...document.querySelectorAll(".column")].map(
        (col) => col.dataset.color
      );
      const availableColors = columnColors.filter(
        (color) => !usedColors.includes(color)
      );

      columnColor =
        availableColors.length > 0
          ? availableColors[0] // 사용되지 않은 색상 중 첫 번째 선택
          : columnColors[Math.floor(Math.random() * columnColors.length)]; // 모든 색이 사용되었다면 랜덤

      bulletColor =
        bulletColors[columnColors.indexOf(columnColor) % bulletColors.length];

      column.dataset.color = columnColor;
      column.dataset.bulletColor = bulletColor;
    }

    column.style.backgroundColor = columnColor;

    // 새로운 스타일 추가 (ID 기반)
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.id = `column-style-${column.id}`;
    styleSheet.innerText = `#${column.id} .task::before { color: ${bulletColor}; }`;
    document.head.appendChild(styleSheet);
  });
};

// DOM 로드 시 초기 컬럼 스타일 적용
document.addEventListener("DOMContentLoaded", applyColumnStyles);

const addBoardBtn = document.getElementById("addBtn");
let columnCount = document.querySelectorAll(".column").length; // 초기 컬럼 개수

addBoardBtn.addEventListener("click", () => {
  columnCount++; // 컬럼 개수 증가

  const column = document.createElement("div");
  column.className = "column";
  column.id = `column${columnCount}`; // 고유한 ID 부여

  column.innerHTML = `
    <div class="column-title">
      <h3>새로운 보드</h3>
      <div>
        <button data-add><i class="fa-solid fa-plus"></i></button>
        <button data-delete><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>
    <div class="tasks" id="tasks${columnCount}"></div>
  `;

  // 새로운 컬럼을 columnsContainer 안에 추가
  columnsContainer.appendChild(column);

  applyColumnStyles(); // 컬럼 추가 후 스타일 적용

  // 새롭게 추가된 컬럼 제목에도 더블 클릭 이벤트 추가
  enableColumnTitleEditing(column.querySelector(".column-title h3"));

  // 드래그 앤 드롭 이벤트 추가
  const tasksEl = column.querySelector(".tasks");
  tasksEl.addEventListener("dragover", handleDragover);
  tasksEl.addEventListener("drop", handleDrop);
});

document.addEventListener("DOMContentLoaded", function () {
  let targetColumn = null; // 삭제할 컬럼을 저장할 변수
  // 컬럼 삭제 이벤트 등록
  document.addEventListener("click", function (event) {
    if (event.target.closest("[data-delete]")) {
      targetColumn = event.target.closest("[data-delete]").closest(".column"); // 삭제할 컬럼 저장
      modal.showModal();
    }
  });

  document.querySelector("#confirm").addEventListener("click", function () {
    if (targetColumn) {
      targetColumn.remove(); // 컬럼 삭제
      targetColumn = null; // 삭제 후 초기화
      applyColumnStyles(); // 컬럼 삭제 후 스타일 재적용
    }
    modal.close(); // 모달 닫기
  });
});

// dblclick으로 task title 변경 기능
document.addEventListener("DOMContentLoaded", function () {
  // 초기 로드 시 모든 컬럼 타이틀에 이벤트 연결
  const columnTitles = document.querySelectorAll(".column-title h3");
  columnTitles.forEach(enableColumnTitleEditing);
});

// 재사용 가능한 타이틀 편집 함수
function enableColumnTitleEditing(titleElement) {
  titleElement.addEventListener("dblclick", function () {
    const originalText = this.textContent.trim();
    const input = document.createElement("input");

    input.type = "text";
    input.value = originalText;
    input.className = "column-title-input";

    this.replaceWith(input);
    input.focus();

    // 커서를 텍스트 끝으로 이동
    input.setSelectionRange(originalText.length, originalText.length);

    input.addEventListener("blur", function () {
      const newText = input.value.trim() || originalText;
      const newH3 = document.createElement("h3");
      newH3.textContent = newText;
      newH3.dataset.tasks = titleElement.dataset.tasks;

      // 다시 더블 클릭 이벤트 연결
      enableColumnTitleEditing(newH3);

      input.replaceWith(newH3);
    });

    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        input.blur();
      }
    });
  });
}
