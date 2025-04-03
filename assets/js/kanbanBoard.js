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

const addBtn = document.getElementById("addBtn");

addBtn.addEventListener('click', () => {
    testModal.showModal();
});

testModal.querySelector("#cancel").addEventListener("click", () => testModal.close());

const handleDrop = (event) => {
    event.preventDefault();
};

const handleDragend = (event) => {
    event.target.classList.remove("dragging");
    event.target.style.display = "block";

    const task = event.target;
    const column = task.closest('.column');
    if (column) {
        const bulletColor = getComputedStyle(column).getPropertyValue('--bullet-color');
        task.style.setProperty('--bullet-color', bulletColor);

        // 밑줄 색상 업데이트
        const underline = task.querySelector('div:last-child');
        underline.style.backgroundColor = bulletColor;
    }
};

const handleDragstart = (event) => {
    event.dataTransfer.effectsAllowed = "move";
    event.dataTransfer.setData("text/plain", "");

    requestAnimationFrame(() => event.target.classList.add("dragging"));
};

const handleDelete = (event) => {
    currentTask = event.target.closest(".task");

    // show preview
    modal.querySelector(".preview").innerText = currentTask.innerText.substring(
        0,
        100
    );

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
    const column = input.closest('.column');
    if (column) {
        const bulletColor = getComputedStyle(column).getPropertyValue('--bullet-color');
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
    column.querySelector(".column-title .task-count").innerText = `(${taskCount})`;
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
    task.style.position = 'relative';
    task.style.paddingBottom = '30px';

    const underline = document.createElement('div');
    underline.style.position = 'absolute';
    underline.style.left = '0';
    underline.style.bottom = '0';
    underline.style.width = '100%';
    underline.style.height = '5px';
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

    task.querySelector('.delete-task-btn').addEventListener('click', (event) => {
        event.stopPropagation();
        task.remove();
    });

    // 밑줄 스타일 적용
    task.style.position = 'relative';
    task.style.paddingBottom = '30px';

    const underline = document.createElement('div');
    underline.style.position = 'absolute';
    underline.style.left = '0';
    underline.style.bottom = '0';
    underline.style.width = '100%';
    underline.style.height = '5px';
    task.appendChild(underline);
    return task;
};

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
            input.blur();
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
modal.addEventListener("submit", () => currentTask && currentTask.remove());

// cancel deletion
modal.querySelector("#cancel").addEventListener("click", () => modal.close());

// clear current task
modal.addEventListener("close", () => (currentTask = null));

//* placeholder tasks

let tasks = [
    [
        "개발",
        "발표 준비",
        "문서 정리",
    ],
    [
        "디자인 설계",
    ],
    [
        "와이어프레임 제작",
        "4주차 WTL",
    ],
    [
        "와이어프레임 제작",
        "기능명세서 작성",
    ],
];

tasks.forEach((col, idx) => {
    for (const item of col) {
        columns[idx].querySelector(".tasks").appendChild(createTask(item));
    }
});


document.addEventListener('DOMContentLoaded', function () {
    const columns = document.querySelectorAll('.column');
    const columnColors = ['#fcebce', '#e1effe', '#daf3e2', '#fed7d6'];
    const bulletColors = ['#FFB638', '#77B8FF', '#7AEA9D', '#FF8C8C'];

    columns.forEach((column, index) => {
        column.style.backgroundColor = columnColors[index % columnColors.length];

        // 글머리표 색상
        const bulletColor = bulletColors[index % bulletColors.length];
        column.style.setProperty('--bullet-color', bulletColor);

        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = `
            .column:nth-child(${index + 1}) .task::before { color: ${bulletColor}; }
        `;
        document.head.appendChild(styleSheet);

        // 밑줄 색상
        const tasks = column.querySelectorAll('.task');
        tasks.forEach(task => {
            const underline = task.querySelector('div:last-child');
            underline.style.backgroundColor = bulletColor;
        });
    });

    // 초기 태스크에 밑줄 추가
    const allTasks = document.querySelectorAll('.task');
    allTasks.forEach(task => {
        const column = task.closest('.column');
        if (column) {
            const bulletColor = getComputedStyle(column).getPropertyValue('--bullet-color');
            addUnderline(task, bulletColor);
        }
    });
});