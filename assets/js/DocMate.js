document.addEventListener('DOMContentLoaded', () => {
  const body = document.querySelector('body');
  const sidebar = document.querySelector('.sidebar');
  const sbToggle = document.querySelector('.sb_toggle');
  const sidebarLogo = document.querySelectorAll('.sidebar_logo');
  const iconContainer = document.querySelector('.iconContainer');
  const iconBox = document.querySelectorAll('.iconBox');
  const sidebarIcon = document.querySelectorAll('.sidebar_icon');
  const btnText = document.querySelectorAll('.btn_text');
  const msToggle = document.querySelector('.ms_toggle');
  const msLogo = document.querySelector('.ms_logo');
  const msIcon = document.querySelectorAll('.ms_icon');
  const container = document.querySelector('.container');

  // 라이트 다크모드 토글
  const lightModeLogo = document.querySelector('.lightModeLogo');
  const darkModeLogo = document.querySelector('.darkModeLogo');
  const toggleCircle = document.getElementById('toggleCircle');
  const toggleBar = document.querySelector('.modeToggleBar');
  const moon = document.querySelector('.moon');
  const sun = document.querySelector('.sun');
  const modeCircle = document.querySelector('.modeCircle');

  // 첫 번째 클릭 시 사이드바 축소
  sbToggle.addEventListener('click', () => {
    sidebar.classList.add('ms');
    sidebar.classList.remove('sidebar');

    sbToggle.classList.add('invisible');
    msToggle.classList.remove('invisible');

    sidebarLogo.forEach((logo) => logo.classList.add('invisible'));

    // 다크모드인지 확인 후 작은 로고 관리
    if (toggleCircle.classList.contains('darkMode')) {
      msLogo.classList.remove('invisible'); // 다크 모드일 때 작은 로고 보이게
    } else {
      msLogo.classList.remove('invisible'); // 라이트 모드일 때 작은 로고 보이게
    }

    iconContainer.style.marginTop = '0px';
    iconBox.forEach((box) => box.classList.add('ms_iconBox'));
    sidebarIcon.forEach((icon) => icon.classList.add('invisible'));
    msIcon.forEach((icon) => icon.classList.remove('invisible'));
    btnText.forEach((text) => text.classList.add('invisible'));
  });

  msToggle.addEventListener('click', () => {
    sidebar.classList.remove('ms');
    sidebar.classList.add('sidebar');

    msToggle.classList.add('invisible');
    sbToggle.classList.remove('invisible');

    msLogo.classList.add('invisible');

    // 다크모드인지 확인 후 큰 로고 관리
    if (toggleCircle.classList.contains('darkMode')) {
      lightModeLogo.classList.add('invisible');
      darkModeLogo.classList.remove('invisible');
    } else {
      lightModeLogo.classList.remove('invisible');
      darkModeLogo.classList.add('invisible');
    }

    iconContainer.style.marginTop = '180px';
    iconBox.forEach((box) => box.classList.remove('ms_iconBox'));
    sidebarIcon.forEach((icon) => icon.classList.remove('invisible'));
    msIcon.forEach((icon) => icon.classList.add('invisible'));
    btnText.forEach((text) => text.classList.remove('invisible'));
  });

  // 다크/라이트 모드 토글
  toggleCircle.addEventListener('click', (event) => {
    event.preventDefault();
    changeMode();
  });
  function changeMode() {
    // root = 문서 전체 요소 선택
    const root = document.documentElement;

    // 라이트 모드일때 버튼을 누르면
    if (toggleCircle.classList.contains('lightMode')) {
      // 다크 모드로 전환
      toggleCircle.style.left = '50px';
      sun.classList.add('invisible');
      moon.classList.remove('invisible');
      modeCircle.style.color = '#F6DF12';
      toggleCircle.classList.remove('lightMode');
      toggleCircle.classList.add('darkMode');
      sidebar.style.backgroundColor = 'var(--dm-bg-color)';
      container.style.backgroundColor = 'var(--dm-bg-color)';
      root.style.setProperty('--light--text-black', 'var(--dm-text-color)');

      // 로고 변경 (사이드바 상태에 따라 다르게)
      if (sidebar.classList.contains('ms')) {
        msLogo.classList.remove('invisible'); // 작은 사이드바 로고 보이게
        sidebarLogo.forEach((logo) => logo.classList.add('invisible')); // 큰 로고 숨기기
      } else {
        lightModeLogo.classList.add('invisible');
        darkModeLogo.classList.remove('invisible');
      }
    } else {
      // 라이트 모드로 전환
      toggleCircle.style.left = '9px';
      sun.classList.remove('invisible');
      moon.classList.add('invisible');
      modeCircle.style.color = '#0064ff';
      toggleCircle.classList.remove('darkMode');
      toggleCircle.classList.add('lightMode');
      document.body.style.color = '#222';
      sidebar.style.backgroundColor = 'var(--light-bg-color)';
      container.style.backgroundColor = 'var(--light-bg-color)';
      root.style.setProperty('--text-color', 'var(--light-text-black)');

      // 로고 변경 (사이드바 상태에 따라 다르게)
      if (sidebar.classList.contains('ms')) {
        msLogo.classList.remove('invisible'); // 작은 사이드바 로고 보이게
        sidebarLogo.forEach((logo) => logo.classList.add('invisible')); // 큰 로고 숨기기
      } else {
        lightModeLogo.classList.remove('invisible');
        darkModeLogo.classList.add('invisible');
      }
    }
  }

  //  로그아웃 모달창
  const profileIcon = document.querySelector('.profile_icon');

  profileIcon.addEventListener('click', () => {
    // 모달이 이미 존재하면 아무것도 안 함
    if (document.querySelector('.profileModal')) return;

    logoutModal();
  });

  function logoutModal() {
    const profileModal = document.createElement('div');
    profileModal.classList.add('profileModal');

    const closeModal = document.createElement('img');
    closeModal.classList.add('closeModal');
    closeModal.setAttribute('src', './assets/images/closeModal.svg');
    closeModal.setAttribute('alt', '닫기 버튼');

    const userImgbox = document.createElement('div');
    userImgbox.classList.add('userImgbox');
    const userImg = document.createElement('div');
    userImg.classList.add('userImg');

    const username = document.createElement('div');
    username.classList.add('username');
    username.textContent = 'user';

    const userEmail = document.createElement('div');
    userEmail.classList.add('userEmail');
    userEmail.textContent = 'user0000@naver.com';

    const logoutBox = document.createElement('div');
    logoutBox.classList.add('logoutBox');

    const logoutBtn = document.createElement('button');
    logoutBtn.classList.add('logoutBtn');
    logoutBtn.textContent = '로그아웃';

    closeModal.addEventListener('click', () => {
      profileModal.style.animation = 'slideUp 0.3s ease-out';

      // 애니메이션이 끝난 후 모달 삭제
      profileModal.addEventListener('animationend', () => {
        profileModal.remove();
      });
    });

    logoutBtn.addEventListener('click', () => {
      confirm('로그아웃 하시겠습니까?');
    });

    profileModal.appendChild(closeModal);
    userImgbox.appendChild(userImg);
    logoutBox.appendChild(logoutBtn);
    profileModal.appendChild(userImgbox);
    profileModal.appendChild(username);
    profileModal.appendChild(userEmail);
    profileModal.appendChild(logoutBox);

    // body에 추가해서 표시
    document.body.appendChild(profileModal);
  }
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
      newProjectWrapper.remove();
    });
  });
});
