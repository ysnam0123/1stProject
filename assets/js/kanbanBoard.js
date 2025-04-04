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
  updateTaskUnderlineColor(event.target); // 드래그가 끝난 후 밑줄 색 업데이트
};
const updateTaskUnderlineColor = (task) => {
  setTimeout(() => {
    const beforeStyle = window.getComputedStyle(task, "::before");
    const beforeColor = beforeStyle.color || "black"; // 기본값 black
    // 밑줄 색상 업데이트
    const underline = task.querySelector("div:last-child");
    if (underline) {
      underline.style.backgroundColor = beforeColor;
    }
  }, 0); // setTimeout을 사용해 DOM 업데이트 후 실행
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
  if (document.activeElement === input) {
    return;
  }
  const content = input.innerText.trim();
  if (!content) {
    input.remove();
    return;
  }
  const task = createTask(content.replace(/\n/g, "<br>"));
  const column = input.closest(".column");
  if (column) {
    const bulletColor =
      getComputedStyle(column).getPropertyValue("--bullet-color");
    addUnderline(task, bulletColor); // 밑줄 스타일 추가
  }
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
  column.querySelector(
    ".column-title .task-count"
  ).innerText = `${taskCount}`;
};
const observeTaskChanges = () => {
  for (const column of columns) {
    const observer = new MutationObserver(() => updateTaskCount(column));
    observer.observe(column.querySelector(".tasks"), { childList: true });
  }
};
observeTaskChanges();
// 밑줄 스타일 추가 함수
const addUnderline = (task, color) => {
  task.style.position = "relative";
  task.style.paddingBottom = "30px";
  const underline = document.createElement("div");
  underline.style.position = "absolute";
  underline.style.left = "0";
  underline.style.bottom = "0";
  underline.style.width = "100%";
  underline.style.height = "5px";
  underline.style.backgroundColor = color;
  task.appendChild(underline);
};
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
    const column = task.closest(".column");
    if (column) updateTaskCount(column); // 삭제 시에도 count 업데이트
  });
  // 밑줄 스타일 적용
  task.style.position = "relative";
  task.style.paddingBottom = "30px";
  const underline = document.createElement("div");
  underline.style.position = "absolute";
  underline.style.left = "0";
  underline.style.bottom = "0";
  underline.style.width = "100%";
  underline.style.height = "5px";
  // ::before의 color 값을 가져오기
  setTimeout(() => {
    const beforeStyle = window.getComputedStyle(task, "::before"); // ::before 스타일 가져오기
    const beforeColor = beforeStyle.color || "black"; // color 값이 없으면 기본값 black 적용
    underline.style.backgroundColor = beforeColor;
  }, 0); // task가 DOM에 추가된 후 실행되도록 setTimeout 사용
  task.appendChild(underline);
  const column = document.querySelector(".column"); // 현재 task가 속한 컬럼 찾기
  if (column) updateTaskCount(column); // 생성될 때도 count 업데이트
  return task;
};
observeTaskChanges();
const createTaskInput = (text = "") => {
  const input = document.createElement("div");
  input.className = "task-input";
  input.dataset.placeholder = "할 일을 입력해 보세요.";
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
    // 밑줄 색상
    const tasks = column.querySelectorAll(".task");
    tasks.forEach((task) => {
      const underline = task.querySelector("div:last-child");
      underline.style.backgroundColor = bulletColor;
    });
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
      <h3>새로운 보드 <span class="task-count">(0)</span></h3> <!-- ✅ task count을 h3 안에 추가 -->
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
  // ✅ 새 컬럼에서도 task 개수 자동 업데이트
  const observer = new MutationObserver(() => updateTaskCount(column));
  observer.observe(tasksEl, { childList: true });
  updateTaskCount(column); // 처음 생성 시 count 업데이트
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
  const columnTitles = document.querySelectorAll(".column-title h3");
  columnTitles.forEach(enableColumnTitleEditing);
});
function enableColumnTitleEditing(titleElement) {
  titleElement.addEventListener("dblclick", function () {
    const originalText = [...this.childNodes]
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent.trim())
      .join(""); // 텍스트 노드만 가져옴
    const input = document.createElement("input");
    input.type = "text";
    input.value = originalText;
    input.className = "column-title-input";
    this.replaceWith(input);
    input.focus();
    input.setSelectionRange(originalText.length, originalText.length);
    input.addEventListener("blur", function () {
      const newText = input.value.trim() || originalText;
      const newH3 = titleElement.cloneNode(true); // 기존 h3 복사
      // 기존 h3의 텍스트 노드만 변경
      newH3.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          node.textContent = newText;
        }
      });
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

document.addEventListener("DOMContentLoaded", () => {
  const dropdownToggle = document.getElementById("dropdown-toggle");
  const projectHeader = document.querySelector(".project-header");

  // 프로젝트 리스트 컨테이너 생성
  const projectList = document.createElement("div");
  projectList.className = "project-list";
  projectList.style.display = "none"; // 처음에는 숨김

  projectList.innerHTML = `
    <button class="project-btn" id="project1">프로그래머스 데브코스 1차 프로젝트</button>
    <button class="project-btn" id="project2">프로그래머스 데브코스 2차 프로젝트</button>
    <button class="project-btn add-project">프로젝트 추가하기</button>
  `;

  // project-header 아래에 삽입
  projectHeader.insertAdjacentElement("afterend", projectList);

  // 드롭다운 버튼 클릭 시 리스트 토글
  dropdownToggle.addEventListener("click", (event) => {
    event.stopPropagation(); // 이벤트 버블링 방지

    // 프로젝트 헤더의 넓이를 가져와서 적용
    projectList.style.width = `${projectHeader.offsetWidth - 20}px`;
    projectList.style.display =
      projectList.style.display === "none" ? "block" : "none";
  });

  // 드롭다운 외부 클릭 시 닫힘
  document.addEventListener("click", (event) => {
    if (
      !projectHeader.contains(event.target) &&
      !projectList.contains(event.target)
    ) {
      projectList.style.display = "none";
    }
  });

  // 창 크기 변경 시 리스트 width 업데이트
  window.addEventListener("resize", () => {
    projectList.style.width = `${projectHeader.offsetWidth}px`;
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const addProjectBtn = document.querySelector(".add-project");

  addProjectBtn.addEventListener("click", () => {
    // 모달이 이미 존재하면 아무것도 안 함
    if (document.querySelector(".new_project_wrapper")) return;

    // 드롭다운 리스트가 열려 있다면 닫기
    const projectList = document.querySelector(".project-list");
    if (projectList) {
      projectList.style.display = "none";
    }

    // 전체 모달을 감싸는 래퍼
    const newProjectWrapper = document.createElement("div");
    newProjectWrapper.classList.add("new_project_wrapper");

    // 프로젝트 모달창
    const newProjectModal = document.createElement("div");
    newProjectModal.classList.add("newProjectModal");

    // 프로젝트 모달창 안내 제목
    const npTitle = document.createElement("h1");
    npTitle.classList.add("npTitle");
    npTitle.textContent = "프로젝트 생성하기";

    // 안내 코멘트
    const npComment = document.createElement("h3");
    npComment.classList.add("npComment");
    npComment.innerHTML =
      "새로운 프로젝트를 위한 첫걸음을 내딛어보세요! <br />아래 입력란에 프로젝트 이름과 팀원을 추가하고, 새로운 프로젝트를 시작해보세요";

    // 프로젝트 인풋창 div
    const projectInput = document.createElement("div");
    projectInput.classList.add("projectInput");

    // 프로젝트 제목 라벨
    const projectNameLabel = document.createElement("label");
    projectNameLabel.setAttribute("for", "projectName");
    projectNameLabel.classList.add("projectInputLabel");
    projectNameLabel.textContent = "프로젝트명";

    // 프로젝트 제목 input
    const pjTitle = document.createElement("input");
    pjTitle.type = "text";
    pjTitle.id = "projectName";
    pjTitle.classList.add("pjInput");
    pjTitle.placeholder = "제목을 입력하세요";

    // 프로젝트 설명 라벨
    const projectDescriptionLabel = document.createElement("label");
    projectDescriptionLabel.setAttribute("for", "projectDescription");
    projectDescriptionLabel.classList.add("projectInputLabel");
    projectDescriptionLabel.textContent = "프로젝트 설명(선택사항)";

    // 프로젝트 설명 input
    const pjDescription = document.createElement("input");
    pjDescription.type = "text";
    pjDescription.id = "projectDescription";
    pjDescription.classList.add("pjInput");
    pjDescription.placeholder = "설명을 입력하세요";

    // 멤버 추가하기
    const addMember = document.createElement("div");
    addMember.classList.add("addMember");

    // 멤버 추가 라벨
    const addMemberLabel = document.createElement("div");
    addMemberLabel.classList.add("addMemberLabel");

    // 팀원추가하기 제목
    const addMemberTitle = document.createElement("h3");
    addMemberTitle.classList.add("addMemberTitle");
    addMemberTitle.textContent = "팀원 추가하기";

    // 팀원 추가 버튼
    const addMemberBtn = document.createElement("button");
    addMemberBtn.classList.add("addMemberBtn");
    addMemberBtn.textContent = "팀원 추가";

    // 팀원 상자
    const memberBox = document.createElement("div");
    memberBox.classList.add("memberBox");
    memberBox.textContent = "여기에 추가됩니다";

    // 모달창 버튼
    const newProjectBtnBox = document.createElement("div");
    newProjectBtnBox.classList.add("newProjectBtnBox");

    // cancel 버튼
    const newProjectCancel = document.createElement("button");
    newProjectCancel.classList.add("newProjectModalBtn", "newProjectCancel");
    newProjectCancel.textContent = "취소";

    // 추가 버튼
    const newProjectOkay = document.createElement("button");
    newProjectOkay.classList.add("newProjectModalBtn", "newProjectOkay");
    newProjectOkay.textContent = "생성";

    // 요소들 계층 구조 맞게 추가
    projectInput.append(
      projectNameLabel,
      pjTitle,
      projectDescriptionLabel,
      pjDescription
    );
    addMemberLabel.append(addMemberTitle, addMemberBtn);
    addMember.append(addMemberLabel, memberBox);
    newProjectBtnBox.append(newProjectOkay, newProjectCancel);
    newProjectModal.append(
      npTitle,
      npComment,
      projectInput,
      addMember,
      newProjectBtnBox
    );
    newProjectWrapper.appendChild(newProjectModal);
    document.body.appendChild(newProjectWrapper); // container 대신 body에 추가

    // 취소 버튼 클릭 시 모달 닫기
    newProjectCancel.addEventListener("click", () => {
      newProjectModal.style.animation = "slideUp 0.3s ease-out";
      newProjectModal.addEventListener(
        "animationend",
        () => {
          newProjectWrapper.remove();
        },
        { once: true }
      ); // 이벤트 중복 방지
    });

    // 멤버 추가하기 모달 창 생성
    addMemberBtn.addEventListener("click", () => {
      const addMemberModal = document.createElement("div");
      addMemberModal.classList.add("addMemberModal");

      const findMemberBox = document.createElement("div");
      findMemberBox.classList.add("findMemberBox");

      const searchIcon = document.createElement("img");
      searchIcon.classList.add("searchIcon");
      searchIcon.src = "/assets/images/Search.svg";
      searchIcon.alt = "searchIcon";

      const findMemberInput = document.createElement("input");
      findMemberInput.type = "text";
      findMemberInput.classList.add("findMemberInput");
      findMemberInput.placeholder = "아이디 또는 이메일 입력";

      const findMemberBtn = document.createElement("button");
      findMemberBtn.classList.add("findMember");
      findMemberBtn.textContent = "추가";

      const memberLiBox = document.createElement("div");
      memberLiBox.classList.add("memberLiBox");

      const memberLi = document.createElement("div");
      memberLi.classList.add("memberLi");

      const memberLiUl = document.createElement("ul");
      memberLiUl.classList.add("memberLiUl");

      findMemberBox.append(searchIcon, findMemberInput, findMemberBtn);
      addMemberModal.append(findMemberBox, memberLiBox, memberLi);
      newProjectModal.appendChild(addMemberModal);

      setTimeout(() => {
        document.addEventListener("click", closeModal);
      });

      function closeModal(event) {
        if (!addMemberModal.contains(event.target)) {
          addMemberModal.remove();
          document.removeEventListener("click", closeModal);
        }
      }
    });
  });
});