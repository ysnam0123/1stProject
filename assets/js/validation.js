document.addEventListener('DOMContentLoaded', () => {
  const form = document.forms['register'];
  const nameInput = document.getElementById('name');
  const idInput = document.getElementById('id');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const emailInput = document.getElementById('email');
  const emailDomainInput = document.getElementById('email-domain');
  const checkIdButton = document.querySelector('.check-btn');
  let isIdChecked = false;

  // localStorage에서 등록된 아이디 목록 가져오기
  let registeredIds = JSON.parse(localStorage.getItem('registeredIds')) || [];

  const showError = (input, message) => {
    let errorSpan = input.parentNode.querySelector('.error-message');
    if (!errorSpan) {
      errorSpan = document.createElement('span');
      errorSpan.classList.add('error-message');
      input.parentNode.appendChild(errorSpan);
    }
    errorSpan.textContent = message;
  };

  const clearError = (input) => {
    let errorSpan = input.parentNode.querySelector('.error-message');
    if (errorSpan) {
      errorSpan.textContent = '';
    }
  };

  const validateInput = (input) => {
    let idPattern, passwordPattern, emailPattern, fullEmail;

    switch (input.id) {
      case 'name':
        if (input.value.trim() === '') {
          showError(input, '이름을 입력하세요.');
        } else {
          clearError(input);
        }
        break;
      case 'id':
        idPattern = /^[a-zA-Z0-9]{6,12}$/;
        if (!idPattern.test(input.value)) {
          showError(input, '아이디는 6~12자의 영문 또는 숫자로 입력하세요.');
        } else {
          clearError(input);
        }
        break;
      case 'password':
        passwordPattern = /^(?=.*[A-Za-z])(?=.*\d|.*[^A-Za-z0-9]).{8,20}$/;
        if (!passwordPattern.test(input.value)) {
          showError(
            input,
            '비밀번호는 영문, 숫자, 특수문자 중 2가지 이상 조합 (8~20자)이어야 합니다.'
          );
        } else {
          clearError(input);
        }
        break;
      case 'confirm-password':
        if (input.value !== passwordInput.value) {
          showError(input, '비밀번호가 일치하지 않습니다.');
        } else {
          clearError(input);
        }
        break;
      case 'email':
      case 'email-domain':
        emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        fullEmail = `${emailInput.value}@${emailDomainInput.value}`;
        if (!emailPattern.test(fullEmail)) {
          showError(emailInput, '올바른 이메일 주소를 입력하세요.');
        } else {
          clearError(emailInput);
        }
        break;
    }
  };

  checkIdButton.addEventListener('click', () => {
    const idValue = idInput.value.trim();
    let idPattern = /^[a-zA-Z0-9]{6,12}$/;

    isIdChecked = false;

    if (registeredIds.includes(idValue)) {
      showError(idInput, '이미 사용 중인 아이디입니다.');
    } else if (idValue === '') {
      showError(idInput, '아이디를 입력하세요.');
    } else if (idPattern.test(idInput.value)) {
      clearError(idInput);
      alert('사용 가능한 아이디입니다.');
      idInput.classList.add('pass');
      isIdChecked = true;
    }
  });
  idInput.addEventListener('input', () => {
    idInput.classList.remove('pass');
    isIdChecked = false;
  });

  [
    nameInput,
    idInput,
    passwordInput,
    confirmPasswordInput,
    emailInput,
    emailDomainInput,
  ].forEach((input) => {
    input.addEventListener('input', () => validateInput(input));
    input.addEventListener('blur', () => validateInput(input));
  });

  form.addEventListener('submit', (event) => {
    let isValid = true;

    // 입력값 유효성 검사
    [
      nameInput,
      idInput,
      passwordInput,
      confirmPasswordInput,
      emailInput,
      emailDomainInput,
    ].forEach((input) => {
      if (input.parentNode.querySelector('.error-message')?.textContent) {
        isValid = false;
      }
    });

    if (!isIdChecked) {
      showError(idInput, '아이디 중복확인을 하셔야 합니다.');
      isValid = false;
    }

    if (!isValid) {
      event.preventDefault(); // 폼 제출 방지
    } else {
      const userData = {
        name: nameInput.value.trim(),
        id: idInput.value.trim(),
        password: passwordInput.value.trim(), // 실제 환경에서는 암호화 필수
        email: `${emailInput.value.trim()}@${emailDomainInput.value.trim()}`,
      };

      let registeredUsers =
        JSON.parse(localStorage.getItem('registeredUsers')) || [];
      registeredUsers.push(userData);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

      console.log(userData);
      alert('회원가입이 완료되었습니다.');
    }
  });
});
