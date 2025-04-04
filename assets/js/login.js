document.addEventListener('DOMContentLoaded', () => {
  const body = document.querySelector('body');
  const container = document.querySelector('.container');

  // 라이트 다크모드 토글
  const lightModeLogo = document.querySelector('.lightModeLogo');
  const darkModeLogo = document.querySelector('.darkModeLogo');
  const toggleCircle = document.getElementById('toggleCircle');
  const toggleBar = document.querySelector('.modeToggleBar');
  const moon = document.querySelector('.moon');
  const sun = document.querySelector('.sun');
  const modeCircle = document.querySelector('.modeCircle');

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
      document.body.classList.toggle('dark-mode');
      //모드 원 이동
      toggleCircle.style.left = '50px';
      sun.classList.add('invisible');
      moon.classList.remove('invisible');
      modeCircle.style.color = '#F6DF12';
      toggleCircle.classList.remove('lightMode');
      toggleCircle.classList.add('darkMode');
      // 로고 변경
      lightModeLogo.classList.add('invisible');
      darkModeLogo.classList.remove('invisible');
    } else {
      // 라이트 모드로 전환
      document.body.classList.toggle('dark-mode');
      toggleCircle.style.left = '9px';
      sun.classList.remove('invisible');
      moon.classList.add('invisible');
      modeCircle.style.color = '#0064ff';
      toggleCircle.classList.remove('darkMode');
      toggleCircle.classList.add('lightMode');

      // 로고 변경 (사이드바 상태에 따라 다르게)

      lightModeLogo.classList.remove('invisible');
      darkModeLogo.classList.add('invisible');
    }
  }
  const moveForward = document.querySelector('.moveForward');
  moveForward.addEventListener('click', () => {
    window.location.href = 'beforeLogin.html';
  });

  const idInput = document.getElementById('inputId');
  const pwInput = document.getElementById('inputPassword');
  const loginBtn = document.querySelector('.signinBtn');
  const rememberMeCheckbox = document.getElementById('rememberMe');
  const signupBtn = document.querySelector('.signupBtn');
  signupBtn.addEventListener('click', () => {
    window.location.href = 'signup.html';
  });
  loginBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const enteredId = idInput.value.trim();
    const enteredPw = pwInput.value.trim();

    // 로컬스토리지에서 유저 정보 가져오기
    const registeredUsers =
      JSON.parse(localStorage.getItem('registeredUsers')) || [];

    const matchedUser = registeredUsers.find(
      (user) => user.id === enteredId && user.password === enteredPw
    );

    if (matchedUser) {
      alert(`환영합니다, ${matchedUser.name}님!`);

      if (rememberMeCheckbox.checked) {
        localStorage.setItem('rememberedId', enteredId);
      } else {
        localStorage.removeItem('rememberedId');
      }

      // 로그인 성공 시 다음 화면으로 이동
      window.location.href = '/DocMate.html';
    } else {
      alert('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
  });

  // 아이디 저장 체크박스 기능
  const savedId = localStorage.getItem('rememberedId');
  if (savedId) {
    idInput.value = savedId;
    rememberMeCheckbox.checked = true;
  }
});
