(function () {
  const password = document.getElementById('password'); // 비밀번호 입력창
  const passwordConfirm = document.getElementById('confirm-password'); // 비밀번호 확인 입력창

  // 비밀번호 입력창 오류 하이라이터 제거
  const removeErrorHighlighter = (e) => {
    if (e.target.classList.contains('fail')) {
      e.target.classList.remove('fail');
    }
  };

  // 비밀번호 입력창 오류 하이라이터 설정
  const setErrorHighlighter = (e) => {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*[\d\W])[A-Za-z\d\W]{8,20}$/;
    e.target.classList.remove('pass', 'fail'); // 기존 클래스 제거
    !passwordPattern.test(e.target.value)
      ? e.target.classList.add('fail') // 8자 미만이면 fail 추가
      : e.target.classList.add('pass'); // 8자 이상이면 pass 추가
  };

  // 비밀번호 확인 (8자 이상 & 일치 여부 검사)
  const passwordsMatch = (e) => {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*[\d\W])[A-Za-z\d\W]{8,20}$/;
    e.target.classList.remove('pass', 'fail'); // 기존 클래스 제거
    password.value === e.target.value && passwordPattern.test(e.target.value)
      ? e.target.classList.add('pass') // 일치하면 pass 추가
      : e.target.classList.add('fail'); // 불일치하면 fail 추가
  };

  // 이벤트 리스너 추가 (focus, blur)
  password.addEventListener('focus', removeErrorHighlighter);
  password.addEventListener('blur', setErrorHighlighter);
  passwordConfirm.addEventListener('focus', removeErrorHighlighter);
  passwordConfirm.addEventListener('blur', passwordsMatch);
})();

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
  } else {
    // 라이트 모드로 전환
    document.body.classList.toggle('dark-mode');
    toggleCircle.style.left = '9px';
    sun.classList.remove('invisible');
    moon.classList.add('invisible');
    modeCircle.style.color = '#0064ff';
    toggleCircle.classList.remove('darkMode');
    toggleCircle.classList.add('lightMode');
  }
}
