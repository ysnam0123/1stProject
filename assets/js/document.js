document.addEventListener('DOMContentLoaded', () => {
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
    const menuOptions = projectMenuDropdown.querySelectorAll('.menuOption');
    menuOptions.forEach((option) => {
      option.addEventListener('click', (event) => {
        const action = option.dataset.action;
        if (action === 'edit') {
          editProject(projectData.id);
        } else if (action === 'delete') {
          deleteProject(projectData.id);
        }
        projectMenuDropdown.classList.remove('active');
      });
    });

    // api로 수정
    function editProject(projectId) {
      const newTitle = prompt('새 프로젝트 이름 : ');
      if (newTitle && newTitle.trim()) {
        // API 호출해서 title 수정
        fetch(`https://kdt-api.fe.dev-cos.com/documents/${projectId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'x-username': 'jijijiji',
          },
          body: JSON.stringify({ title: newTitle }),
        })
          .then((response) => response.json())
          .then((updatedProject) => {
            // 프로젝트 목록 업데이트
            loadProjectListHandler();
          })
          .catch((error) => console.error('수정 오류:', error));
      }
    }
    // api로 삭제
    function deleteProject(projectId) {
      const confirmDelete = confirm('정말로 이 프로젝트를 삭제하시겠습니까?');
      if (confirmDelete) {
        fetch(`https://kdt-api.fe.dev-cos.com/documents/${projectId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-username': 'jijijiji',
          },
        })
          .then(() => {
            // 프로젝트 삭제 후 목록 갱신
            loadProjectListHandler();
          })
          .catch((error) => console.error('삭제 오류:', error));
      }
    }

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
        // 수정사항
        loadSubDocs({ id: projectId }); // 최소한 id만 넘겨도 OK
        // loadSubDocs();
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
        loadSubDocs({ id: projectId });
      })
      .catch((error) => console.error('문서 생성 오류:', error));
  }

  // 페이지 다른 곳 클릭 시 드롭다운 닫기
  document.addEventListener('click', () => {
    document.querySelectorAll('.docDropdown').forEach((menu) => {
      menu.classList.remove('active');
    });
    document.querySelectorAll('.projectMenuDropdown').forEach((menu) => {
      menu.classList.remove('active');
    });
  });

  // 문서 클릭 시 type 에 따라 편집기 나오도록
  function openEditor(docId, type) {
    document.body.dataset.currentDocId = docId;
    document.body.dataset.currentDocType = type;

    const basicDocView = document.querySelector('.basicDocView');
    const codeShareView = document.querySelector('.codeShareView');
    const container = document.querySelector('.container');

    // editmode 클래스 추가 (문서 편집기가 열렸을 때)
    container.classList.add('editmode');

    // 기존 활성화된 뷰 닫기
    basicDocView.classList.remove('active');
    codeShareView.classList.remove('active');

    // 추가
    // 에디터의 타이틀 영역 가져오기
    const editorTitle = document.querySelector('.docTitleBox .docTitle');
    if (editorTitle) {
      editorTitle.dataset.docId = docId;
      editorTitle.dataset.docType = type;
    }

    if (type === 'default') {
      basicDocView.classList.add('active');
      // 수정된 부분
      loadDocumentData(docId, type); // 기본 문서 로드
    } else if (type === 'code') {
      codeShareView.classList.add('active');
      loadDocumentData(docId, type); // 코드 공유 문서 로드
    }
  }

  function loadDocument(doc) {
    const type = doc.type;
    document.body.dataset.currentDocId = doc.id;
    document.body.dataset.currentDocType = type;

    if (type === 'default') {
      document.querySelector('.docEditPage').innerHTML = doc.content;
    } else {
      const code = JSON.parse(doc.content || '{}');
      document.querySelector('.codeInput.html').textContent = code.html;
      document.querySelector('.codeInput.css').textContent = code.css;
      document.querySelector('.codeInput.javascript').textContent = code.js;
    }
  }

  //
  function loadDocumentData(docId, type) {
    fetch(`https://kdt-api.fe.dev-cos.com/documents/${docId}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-username': 'jijijiji',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // 문서 이름 공통 적용
        const titleEls = document.querySelectorAll('.editor .docTitle');
        titleEls.forEach((el) => {
          el.textContent = data.title || '제목 없음';
        });

        if (type === 'default') {
          // 기본 문서 표시
          document.querySelector('.basicDocView').style.display = 'block';
          document.querySelector('.codeShareView').style.display = 'none';

          const contentArea = document.querySelector(
            '.basicDocView .docEditPage'
          );
          contentArea.innerHTML = data.content || '';
        } else if (type === 'code') {
          // 코드 문서 표시
          document.querySelector('.basicDocView').style.display = 'none';
          document.querySelector('.codeShareView').style.display = 'block';

          // JSON 파싱
          let codeContent = { html: '', css: '', js: '' };
          try {
            codeContent = JSON.parse(data.content || '{}');
          } catch (err) {
            console.error('코드 문서 내용 파싱 실패', err);
          }
          document.querySelector('.codeInput.html').value = codeContent.html;
          document.querySelector('.codeInput.css').value = codeContent.css;
          document.querySelector('.codeInput.javascript').value =
            codeContent.js;

          // 미리보기 iframe 렌더링
          const iframe = document.querySelector('.codeOutput');
          const iframeDoc =
            iframe.contentDocument || iframe.contentWindow.document;
          iframeDoc.open();
          iframeDoc.write(`
            <!DOCTYPE html>
            <html lang="ko">
              <head>
                <style>${codeContent.css || ''}</style>
              </head>
              <body>
                ${codeContent.html || ''}
                <script>${codeContent.js || ''}<\/script>
              </body>
            </html>
          `);
          iframeDoc.close();
        }
      })
      .catch((err) => {
        console.error('문서 로딩 실패', err);
        alert('문서를 불러오는 중 오류가 발생했습니다.');
      });
  }

  // toolbar 부분
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

    // newNode를 선택 영역에 적용하기
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

  // 기본 문서에서 입력된 내용 가져오기
  const basicDocContent = document.querySelector('.docEditPage');
  basicDocContent.addEventListener('input', () => {
    console.log('기본 문서 입력 내용:', basicDocContent.innerHTML);
  });

  // 코드 공유 문서에서 입력된 HTML, CSS, JS 코드 가져오기
  const htmlCodeInput = document.querySelector('.codeInput.html');
  const cssCodeInput = document.querySelector('.codeInput.css');
  const jsCodeInput = document.querySelector('.codeInput.javascript');

  htmlCodeInput.addEventListener('input', () => {
    console.log('HTML 코드 입력 내용:', htmlCodeInput.innerHTML);
  });

  cssCodeInput.addEventListener('input', () => {
    console.log('CSS 코드 입력 내용:', cssCodeInput.innerHTML);
  });

  jsCodeInput.addEventListener('input', () => {
    console.log('JavaScript 코드 입력 내용:', jsCodeInput.innerHTML);
  });

  function getCodeEditorContent() {
    return JSON.stringify({
      html: document.querySelector('.codeInput.html').textContent,
      css: document.querySelector('.codeInput.css').textContent,
      js: document.querySelector('.codeInput.javascript').textContent,
    });
  }

  // 문서 편집 후 저장 기능
  // function saveDocument(docId, type) {
  //   const title = document.querySelector(".editor .docTitle").value;

  //   let content;
  //   if (type === "default") {
  //     content = document.querySelector(".docEditPage").innerHTML;
  //   } else {
  //     content = JSON.stringify({
  //       html: document.querySelector(".codeInput.html").textContent,
  //       css: document.querySelector(".codeInput.css").textContent,
  //       js: document.querySelector(".codeInput.javascript").textContent,
  //     });
  //   }

  //   fetch(`https://kdt-api.fe.dev-cos.com/documents/${docId}`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "x-username": "jijijiji",
  //     },
  //     body: JSON.stringify({
  //       title,
  //       content,
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log("문서 저장 완료", data);
  //     })
  //     .catch((err) => {
  //       console.error("문서 저장 실패:", err);
  //     });
  // }
  const editor = document.querySelector('.editor');

  editor.addEventListener(
    'input',
    debounce(async () => {
      const updatedContent = editor.innerHTML;
      const updatedTitle = document.querySelector(
        '.docTitleBox .docTitle'
      ).value;

      if (!currentDocId) return;

      try {
        await fetch(
          `https://kdt-api.fe.dev-cos.com/documents/${currentDocId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'x-username': 'jijijiji',
            },
            body: JSON.stringify({
              title: updatedTitle,
              content: updatedContent,
            }),
          }
        );
        console.log('자동 저장 완료');
      } catch (err) {
        console.error('자동 저장 실패:', err);
      }
    }, 1000)
  );

  // 자동 저장
  // let autoSaveTimeout;

  // document.querySelector(".docEditPage").addEventListener("input", () => {
  //   clearTimeout(autoSaveTimeout);
  //   autoSaveTimeout = setTimeout(() => {
  //     const docId = document.body.dataset.currentDocId;
  //     const type = document.body.dataset.currentDocType;
  //     saveDocument(docId, type);
  //   }, 2000); // 2초 후 자동 저장
  // });
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // 문서 부분 드롭다운중
  document.addEventListener('click', (e) => {
    const docMenu = e.target.closest('.docMenu');

    // docMenu 클릭 시 드롭 다운 열기
    if (docMenu) {
      const dropdown = docMenu.querySelector('.docDropdown');
      dropdown.classList.toggle('active');
      e.stopPropagation(); // 외부 클릭 이벤트 차단
      return;
    }
    // 외부 클릭 시 드롭다운 닫기
    document.querySelectorAll('.docDropdown.active').forEach((dropdown) => {
      dropdown.classList.remove('active');
    });
  });

  document.addEventListener('click', (e) => {
    const dropdownItem = e.target.closest('.docDropdown li');
    if (!dropdownItem) return;

    const action = dropdownItem.classList.contains('editTitleBtn')
      ? 'edit'
      : dropdownItem.classList.contains('deleteDocBtn')
      ? 'delete'
      : null;

    if (!action) return;

    // 추가 수정
    // ⭐ 우선 editor에서 클릭한 경우를 먼저 확인
    const editorTitle = document.querySelector('.docTitleBox .docTitle');
    const docId = editorTitle?.dataset?.docId;
    if (!docId) {
      console.warn('문서 ID를 찾을 수 없습니다.');
      return;
    }

    // const docItem = dropdownItem.closest(".docItem");
    // const docId = docItem.dataset.docId;

    if (action === 'edit') {
      // updateDocumentTitle(editorTitle, docId);
      updateDocumentTitle(docId, editorTitle);
    } else if (action === 'delete') {
      deleteDocument(editorTitle, docId);
    }
  });

  function updateDocumentTitle(docId, docItem) {
    const newTitle = prompt('새 문서의 제목을 입력 : ', docItem.textContent);

    if (!newTitle) return;

    fetch(`https://kdt-api.fe.dev-cos.com/documents/${docId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-username': 'jijijiji',
      },
      body: JSON.stringify({ title: newTitle }),
    })
      .then((res) => res.json())
      .then((updatedDoc) => {
        // 제목 업뎃
        docItem.textContent = updatedDoc.title;
      })
      .catch((err) => console.error('문서 제목 변경 실패:', err));
  }

  function deleteDocument(docItem, docId) {
    if (!confirm('이 문서를 삭제하시겠습니까?')) return;

    fetch(`https://kdt-api.fe.dev-cos.com/documents/${docId}`, {
      method: 'DELETE',
      headers: {
        'x-username': 'jijijiji',
      },
    })
      .then((res) => {
        if (res.ok) {
          // 문서 제목만 삭제하고 편집 영역 초기화
          docItem.textContent = '';

          // editmode 해제 및 notYet 화면 표시
          const container = document.querySelector('.container');
          container.classList.remove('editmode');
        } else {
          alert('문서 삭제 실패');
        }
      })
      .catch((err) => console.error('문서 삭제 오류:', err));
  }

  // 문서 아이템 클릭 시
  document.querySelectorAll('.docList .docTitle').forEach((item) => {
    item.addEventListener('click', async (e) => {
      const docId = e.currentTarget.dataset.id;
      try {
        const res = await fetch(
          `https://kdt-api.fe.dev-cos.com/documents/${docId}`
        );
        const data = await res.json();

        // 제목과 내용 세팅
        document.querySelector('.editor .docTitle').value = data.title;
        document.querySelector('.editor .docEditPage').innerHTML = data.content;

        // 현재 문서 ID 저장 (자동 저장용)
        currentDocId = docId;
      } catch (err) {
        console.error('문서 불러오기 실패:', err);
      }
    });
  });

  // 프로젝트 목록 불러오기 실행
  loadProjectListHandler();
});
