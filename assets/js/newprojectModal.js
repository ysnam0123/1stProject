document.addEventListener('DOMContentLoaded', () => {
  // 새 프로젝트 생성 모달창
  // 새 프로젝트 생성 모달창
  const makeProjectBtn = document.querySelector('.makeProjectBtn');
  makeProjectBtn.addEventListener('click', () => {
    // 모달이 이미 존재하면 아무것도 안 함
    if (document.querySelector('.new_project_wrapper')) return;
    // 전체 모달을 감싸는 래퍼
    const newProjectWrapper = document.createElement('div');
    newProjectWrapper.classList.add('new_project_wrapper');

    // 프로젝트 모달창
    const newProjectModal = document.createElement('div');
    newProjectModal.classList.add('newProjectModal');

    // 프로젝트 모달창 안내 제목

    const npTitle = document.createElement('h1');
    npTitle.classList.add('npTitle');
    npTitle.textContent = '프로젝트 생성하기';

    // 안내 코멘트
    const npComment = document.createElement('h3');
    npComment.classList.add('npComment');
    npComment.innerHTML =
      '새로운 프로젝트를 위한 첫걸음을 내딛어보세요! <br />아래 입력란에 프로젝트 이름과 팀원을 추가하고, 새로운 프로젝트를 시작해보세요';

    // 프로젝트 인풋창 div
    const projectInput = document.createElement('div');
    projectInput.classList.add('projectInput');

    // 프로젝트 제목 라벨
    const projectNameLabel = document.createElement('label');
    projectNameLabel.setAttribute('for', 'projectName');
    projectNameLabel.classList.add('projectInputLabel');
    projectNameLabel.textContent = '프로젝트명';

    // 프로젝트 제목 input
    const pjTitle = document.createElement('input');
    pjTitle.type = 'text';
    pjTitle.id = 'projectName';
    pjTitle.classList.add('pjInput');
    pjTitle.placeholder = '제목을 입력하세요';

    // 프로젝트 설명 라벨
    const projectDescriptionLabel = document.createElement('label');
    projectDescriptionLabel.setAttribute('for', 'projectDescription');
    projectDescriptionLabel.classList.add('projectInputLabel');
    projectDescriptionLabel.textContent = '프로젝트 설명(선택사항)';

    // 프로젝트 설명 input
    const pjDescription = document.createElement('input');
    pjDescription.type = 'text';
    pjDescription.id = 'projectDescription';
    pjDescription.classList.add('pjInput');
    pjDescription.placeholder = '설명을 입력하세요';

    // 멤버 추가하기
    const addMember = document.createElement('div');
    addMember.classList.add('addMember');

    // 멤버 추가 라벨
    const addMemberLabel = document.createElement('div');
    addMemberLabel.classList.add('addMemberLabel');

    // 팀원추가하기 제목
    const addMemberTitle = document.createElement('h3');
    addMemberTitle.classList.add('addMemberTitle');
    addMemberTitle.textContent = '팀원 추가하기';

    // 팀원 추가 버튼
    const addMemberBtn = document.createElement('button');
    addMemberBtn.classList.add('addMemberBtn');
    addMemberBtn.textContent = '팀원 추가';

    // 팀원 상자
    const memberBox = document.createElement('div');
    memberBox.classList.add('memberBox');
    memberBox.textContent = '여기에 추가됩니다';

    // 모달창 버튼
    const newProjectBtnBox = document.createElement('div');
    newProjectBtnBox.classList.add('newProjectBtnBox');

    // cancel 버튼
    const newProjectCancel = document.createElement('button');
    newProjectCancel.classList.add('newProjectModalBtn', 'newProjectCancel');
    newProjectCancel.textContent = '취소';

    // 추가 버튼
    const newProjectOkay = document.createElement('button');
    newProjectOkay.classList.add('newProjectModalBtn', 'newProjectOkay');
    newProjectOkay.textContent = '생성';

    // 요소들 계층 구조 맞게 추가
    projectInput.appendChild(projectNameLabel);
    projectInput.appendChild(pjTitle);
    projectInput.appendChild(projectDescriptionLabel);
    projectInput.appendChild(pjDescription);

    addMemberLabel.appendChild(addMemberTitle);
    addMemberLabel.appendChild(addMemberBtn);

    addMember.appendChild(addMemberLabel);
    addMember.appendChild(memberBox);

    newProjectBtnBox.appendChild(newProjectOkay);
    newProjectBtnBox.appendChild(newProjectCancel);

    newProjectModal.appendChild(npTitle);
    newProjectModal.appendChild(npComment);
    newProjectModal.appendChild(projectInput);
    newProjectModal.appendChild(addMember);
    newProjectModal.appendChild(newProjectBtnBox);

    newProjectWrapper.appendChild(newProjectModal);
    container.appendChild(newProjectWrapper);

    // 취소 버튼 클릭 시 모달 닫기
    newProjectCancel.addEventListener('click', () => {
      newProjectModal.style.animation = 'slideUp 0.3s ease-out';
      newProjectModal.addEventListener('animationend', () => {
        newProjectWrapper.remove();
      });
    });
    // 멤버 추가하기 모달 창 생성
    addMemberBtn.addEventListener('click', () => {
      const addMemberModal = document.createElement('div');
      addMemberModal.classList.add('addMemberModal');

      const findMemberBox = document.createElement('div');
      findMemberBox.classList.add('findMemberBox');

      const searchIcon = document.createElement('img');
      searchIcon.classList.add('searchIcon');
      searchIcon.src = '/assets/images/Search.svg';
      searchIcon.alt = 'searchIcon';
      const findMemberInput = document.createElement('input');
      findMemberInput.type = 'text';
      findMemberInput.classList.add('findMemberInput');
      findMemberInput.placeholder = '아이디 또는 이메일 입력';

      const findMemberBtn = document.createElement('button');
      findMemberBtn.classList.add('findMember');
      findMemberBtn.textContent = '추가';

      const memberLiBox = document.createElement('div');
      memberLiBox.classList.add('memberLiBox');

      const memberLi = document.createElement('div');
      memberLi.classList.add('memberLi');

      const memberLiUl = document.createElement('ul');
      memberLiUl.classList.add('memberLiUl');

      findMemberBox.appendChild(searchIcon);
      findMemberBox.appendChild(findMemberInput);
      findMemberBox.appendChild(findMemberBtn);

      newProjectModal.appendChild(addMemberModal);
      addMemberModal.appendChild(findMemberBox);
      addMemberModal.appendChild(memberLiBox);
      addMemberModal.appendChild(memberLi);

      setTimeout(() => {
        // setTimeout을 사용해 클릭 이벤트 버블링 방지
        document.addEventListener('click', closeModal);
      });

      function closeModal(event) {
        if (!addMemberModal.contains(event.target)) {
          addMemberModal.remove();
          document.removeEventListener('click', closeModal); // 이벤트 제거
        }
      }
    });
  });
});
