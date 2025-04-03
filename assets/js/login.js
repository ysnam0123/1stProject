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
});
