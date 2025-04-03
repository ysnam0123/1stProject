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
    e.target.classList.remove('pass', 'fail'); // 기존 클래스 제거
    password.value === e.target.value
      ? e.target.classList.add('pass') // 일치하면 pass 추가
      : e.target.classList.add('fail'); // 불일치하면 fail 추가
  };

  // 이벤트 리스너 추가 (focus, blur)
  password.addEventListener('focus', removeErrorHighlighter);
  password.addEventListener('blur', setErrorHighlighter);
  passwordConfirm.addEventListener('focus', removeErrorHighlighter);
  passwordConfirm.addEventListener('blur', passwordsMatch);
})();
