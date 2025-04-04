document.addEventListener('DOMContentLoaded', () => {
  // 처음 화면 구성
  // 문서들을 눌러야만 editmode로 전환
  const container = document.querySelector('.container');
  const docTitles = document.querySelectorAll('.projectListBox .docTitle');

  docTitles.forEach((doc) => {
    doc.addEventListener('click', () => {
      container.classList.add('editmode');
    });
  });

  // 모달 열고 닫기만
  const newProjectBtn = document.querySelector('.newProject');
  const newDocModal = document.querySelector('.newDocModal');
  const closeModalBtn = document.querySelector('.closeIcon');

  // newProjectBtn 클릭 시 newDocModal active 클래스 추가
  // 모달창 보여지도록 하기
  newProjectBtn.addEventListener('click', () => {
    newDocModal.classList.add('active');
  });

  // 닫기 버튼 클릭 시 모달 닫기
  closeModalBtn.addEventListener('click', () => {
    newDocModal.classList.remove('active');
  });

  // API 를 이용해 모달의 create 프로젝트 추가
  const createProjectBtn = document.querySelector('#createProjectBtn');
  const projectListBox = document.querySelector('.projectListBox');

  // API 이용해서 프로젝트 목록들 불러오기
  async function loadProjectListHandler() {
    try {
      const response = await fetch('https://kdt-api.fe.dev-cos.com/documents', {
        headers: {
          'Content-Type': 'application/json',
          'x-username': 'jijijiji',
        },
      });

      if (!response.ok)
        throw new Error('프로젝트 목록을 불러오는데 실패했습니다.');

      const projects = await response.json();
      projectListBox.innerHTML = ''; // 기존 목록 초기화

      // 부모ID 없는 (Root 프로젝트)
      const rootProjects = projects.filter((project) => !project.parent);

      rootProjects.forEach((project) => {
        const projectElement = createProjectElement(project, projects);
        projectListBox.appendChild(projectElement);
      });
    } catch (error) {
      console.error(error);
      alert('프로젝트 목록을 불러오는 중 오류가 발생했습니다.');
    }
  }

  // 프로젝트 HTML 요소 생성
  function createProjectElement(projectData, allProjects) {
    const projectItem = document.createElement('div');
    projectItem.classList.add('projectItem');
    projectItem.dataset.projectId = projectData.id; // 프로젝트 ID 저장

    projectItem.innerHTML = `
    <div class="projectHeader">
      <span class="projectIcon"></span>
      <span class="projectName">${projectData.title}</span>
      <button class="addDocBtn"></button>
      <div class="docDropdown">
        <div class="docOption" data-type="default">기본 문서</div>
        <div class="docOption" data-type="code">코드 문서</div>
      </div>
      <!-- 추가된 메뉴 아이콘 -->
      <div class="projectMenu">
        <span class="material-symbols-outlined">more_horiz</span>
      </div>
      <div class="projectMenuDropdown">
        <div class="menuOption" data-action="edit">수정</div>
        <div class="menuOption" data-action="delete">삭제</div>
      </div>
    </div>
    <div class="projectDocs">
      <div class="docList"></div>
    </div>
        
  `;

    const addDocBtn = projectItem.querySelector('.addDocBtn');
    const docDropdown = projectItem.querySelector('.docDropdown');
    const projectMenu = projectItem.querySelector('.projectMenu');
    const projectMenuDropdown = projectItem.querySelector(
      '.projectMenuDropdown'
    );

    // addDocBtn 클릭 시 해당 프로젝트의 드롭다운 메뉴 활성화
    addDocBtn.addEventListener('click', (event) => {
      event.stopPropagation(); // 다른 클릭 이벤트 영향 방지
      docDropdown.classList.toggle('active');
    });

    // 프로젝트 메뉴 클릭 시 드롭다운 메뉴 열기
    projectMenu.addEventListener('click', (event) => {
      event.stopPropagation();
      projectMenuDropdown.classList.toggle('active');
    });

    // 드롭 다운 메뉴의 수정 및 삭제 클릭 이벤트 처리

    const projectHeader = projectItem.querySelector('.projectHeader');

    // 폴더 클릭 이벤트 추가
    projectHeader.addEventListener('click', () => {
      projectItem.classList.toggle('open');

      if (projectItem.classList.contains('open')) {
        loadSubDocs(projectData);
      }
    });

    const docOptions = projectItem.querySelectorAll('.docOption');

    docOptions.forEach((option) => {
      option.addEventListener('click', (event) => {
        event.stopPropagation();

        const docType = option.dataset.type; // 기본 문서 or 코드 문서
        createNewDocument(docType, projectData.id);

        // 드롭다운 닫기
        docDropdown.classList.remove('active');
      });
    });

    // 하위 문서 불러오기
    function loadSubDocs(project) {
      // project.id 값만 가져옴 (객체가 아니라 숫자만 사용)
      const projectId = project.id;

      // 프로젝트 ID에 해당하는 요소 찾기
      const projectItem = document.querySelector(
        `[data-project-id="${projectId}"]`
      );

      if (!projectItem) {
        console.error(
          `🚨 프로젝트 ID(${projectId})에 해당하는 요소를 찾을 수 없습니다.`
        );
        return;
      }

      const docList = projectItem.querySelector('.docList');
      docList.innerHTML = ''; // 기존 목록 초기화

      // api 요청
      fetch(`https://kdt-api.fe.dev-cos.com/documents/${projectId}/`, {
        headers: {
          'Content-Type': 'application/json',
          'x-username': 'jijijiji',
        },
      })
        .then((response) => response.json())
        .then((projectData) => {
          console.log(`📂 API 응답 데이터:`, projectData);

          // projectData.documents 배열을 사용하여 하위 문서 리스트 표시
          projectData.documents.forEach((doc) => {
            const docElement = document.createElement('div');
            docElement.classList.add('docTitle');
            docElement.textContent = doc.title || '제목 없음'; // 제목이 없을 경우 기본값 설정
            docElement.dataset.docId = doc.id;

            // LocalStorage에서 type 가져와서 데이터 속성 추가
            const docType =
              localStorage.getItem(`docType-${doc.id}`) || 'default'; // 기본값은 'default'
            docElement.dataset.docType = docType;

            // 문서 클릭 시 편집기 열기
            docElement.addEventListener('click', () => {
              openEditor(doc.id, docType);
            });

            docList.appendChild(docElement);
          });
        })
        .catch((error) => {
          console.error('하위 문서 불러오기 오류:', error);
        });
    }

    // addDocBtn.addEventListener("click", addDocHandler);
    return projectItem;
  }

  createProjectBtn.addEventListener('click', async () => {
    const projectName = document.getElementById('docModalName').value;
    const projectDesc = document.getElementById('docModalDesc').value;

    // 프로젝트 이름이 없을 경우 입력하라고 경고창 띄우는데
    // 수정 필요
    if (!projectName.trim()) {
      alert('프로젝트 이름을 입력해주세요!');
      document.getElementById('docModalName').focus(); // 입력 필드에 포커스 주기
      return;
    }

    // API 프로젝트 생성 ( Root )
    try {
      const response = await fetch('https://kdt-api.fe.dev-cos.com/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-username': 'jijijiji',
        },
        body: JSON.stringify({
          title: projectName,
          content: projectDesc,
        }),
      });

      if (!response.ok) {
        throw new Error('프로젝트 생성에 실패했습니다');
      }

      // 프로젝트 생성 후 목록 갱신
      loadProjectListHandler();

      const projectData = await response.json();

      // 프로젝트 리스트에 추가
      const projectItem = document.createElement('div');
      projectItem.classList.add('projectItem');
      projectItem.innerHTML = `
          <div class="projectHeader">
              <span class="projectIcon">📁</span>
              <span class="projectName">${projectData.title}</span>
              <button class="addDocBtn"></button>
          </div>
          <div class="projectDocs">
            <div class="docList"></div>
          </div>
      `;

      // addDocBtn 클릭 시 하위 문서 생기도록 핸들러 연결
      const addDocBtn = projectItem.querySelector('.addDocBtn');
      addDocBtn.addEventListener('click', addDocHandler);

      projectListBox.appendChild(projectItem);

      // 모달 닫기 및 입력 필드 초기화
      document.querySelector('.newDocModal').style.display = 'none';
      document.getElementById('docModalName').value = '';
      document.getElementById('docModalDesc').value = '';
    } catch (error) {
      console.error(error);
      alert('프로젝트 생성 중 오류가 발생했습니다.');
    }
  });

  // 특정 프로젝트의 하위 문서 추가
  function addDocHandler(event) {
    event.stopPropagation();
    const projectItem = event.target.closest('.projectItem');
    const projectId = projectItem.dataset.projectId; // 프로젝트 ID 가져오기
    const docList = projectItem.querySelector('.docList');

    fetch('https://kdt-api.fe.dev-cos.com/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-username': 'jijijiji',
      },
      body: JSON.stringify({
        title: '새 문서',
        parent: projectId, // 프로젝트 ID를 parent로 설정
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('문서 생성에 실패했습니다');
        }
        return response.json();
      })
      .then((docData) => {
        // 생성된 문서 리스트에 추가
        // 추가된 문서 포함하여 다시 불러오기
        console.log('📄 새 문서 생성됨:', docData);
        loadSubDocs();
      })
      .catch((error) => {
        console.error(error);
        alert('문서 추가 중 오류가 발생했습니다.');
      });
  }

  // 문서 생성 시 type은 localStorage에 저장
  function createNewDocument(type, projectId) {
    const title = type === 'default' ? '새 기본 문서' : '새 코드 문서';
    fetch('https://kdt-api.fe.dev-cos.com/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-username': 'jijijiji',
      },
      body: JSON.stringify({
        title,
        parent: projectId,
      }),
    })
      .then((response) => response.json())
      .then((docData) => {
        // 여기에 문서 편집기 여는 로직 추가

        // LocalStorage에 type 저장 (문서 ID를 키로 사용)
        localStorage.setItem(`docType-${docData.id}`, type);

        // 문서 생성 후 편집기 열기
        openEditor(docData.id, type);
      })
      .catch((error) => console.error('문서 생성 오류:', error));
  }

  // 페이지 다른 곳 클릭 시 드롭다운 닫기
  document.addEventListener('click', () => {
    document.querySelectorAll('.docDropdown').forEach((menu) => {
      menu.classList.remove('active');
    });
  });

  // 문서 클릭 시 type 에 따라 편집기 나오도록
  function openEditor(docId, type) {
    const basicDocView = document.querySelector('.basicDocView');
    const codeShareView = document.querySelector('.codeShareView');
    const container = document.querySelector('.container');

    // editmode 클래스 추가 (문서 편집기가 열렸을 때)
    container.classList.add('editmode');

    // 기존 활성화된 뷰 닫기
    basicDocView.classList.remove('active');
    codeShareView.classList.remove('active');

    if (type === 'default') {
      basicDocView.classList.add('active');
    } else if (type === 'code') {
      codeShareView.classList.add('active');
    }
  }

  function applyStyle(button) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return; // 선택한 텍스트가 없으면 종료

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText.trim()) return; // 공백만 선택된 경우 무시

    let newNode;

    // 스타일 적용할 태그 결정
    if (button.classList.contains('formatBold')) {
      newNode = document.createElement('span');
      newNode.style.fontWeight = 'bold';
    } else if (button.classList.contains('formatItalic')) {
      newNode = document.createElement('span');
      newNode.style.fontStyle = 'italic';
    } else if (button.classList.contains('formatUnderLine')) {
      newNode = document.createElement('span');
      newNode.style.textDecoration = 'underline';
    } else if (button.classList.contains('formatHeader1')) {
      newNode = document.createElement('h1');
    } else if (button.classList.contains('formatHeader2')) {
      newNode = document.createElement('h2');
    } else if (button.classList.contains('formatHeader3')) {
      newNode = document.createElement('h3');
    } else if (button.classList.contains('formatHeader4')) {
      newNode = document.createElement('h4');
    } else if (button.classList.contains('formatAlignLeft')) {
      document.execCommand('justifyLeft');
      return;
    } else if (button.classList.contains('formatAlignCenter')) {
      document.execCommand('justifyCenter');
      return;
    } else if (button.classList.contains('formatAlignRight')) {
      document.execCommand('justifyRight');
      return;
    } else if (button.classList.contains('formatListBulleted')) {
      document.execCommand('insertUnorderedList');
      return;
    } else if (button.classList.contains('formatListNumber')) {
      document.execCommand('insertOrderedList');
      return;
    } else if (button.classList.contains('formatCode')) {
      newNode = document.createElement('code');
      newNode.style.backgroundColor = '#f4f4f4';
      newNode.style.padding = '2px 4px';
      newNode.style.borderRadius = '4px';
      newNode.style.fontFamily = 'monospace';
    }

    // 📌 newNode를 선택 영역에 적용하기
    if (newNode) {
      try {
        range.surroundContents(newNode); // 기존 텍스트를 유지하며 스타일만 추가
      } catch (e) {
        console.warn('텍스트 전체를 감쌀 수 없음. 직접 대체합니다.');
        newNode.textContent = selectedText;
        range.deleteContents(); // 기존 선택 영역 삭제
        range.insertNode(newNode); // 새 스타일 삽입
      }
    }
  }

  document.querySelectorAll('.docToolbar button').forEach((button) => {
    button.addEventListener('click', function () {
      applyStyle(button);
    });
  });

  // 탭메뉴 부분
  const tabs = document.querySelectorAll('.codeTabMenu'); // 탭 버튼들
  const editors = document.querySelectorAll('.codeEditor'); // 코드 에디터들

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const selectedLang = tab.dataset.lang; // data-lang 값 가져오기

      // 모든 탭에서 active 클래스 제거
      tabs.forEach((t) => t.classList.remove('active'));

      // 클릭한 탭에 active 클래스 추가
      tab.classList.add('active');

      // 모든 코드 에디터 숨기기
      editors.forEach((editor) => (editor.style.display = 'none'));

      // 선택한 언어의 코드 에디터만 보이도록 설정
      document.querySelector(`.codeEditor.${selectedLang}`).style.display =
        'block';
    });
  });

  // 페이지 로드 시 첫 번째 탭을 활성화
  tabs[0].classList.add('active');
  editors.forEach((editor, index) => {
    editor.style.display = index === 0 ? 'block' : 'none';
  });

  // 프로젝트 목록 불러오기 실행
  loadProjectListHandler();
});
