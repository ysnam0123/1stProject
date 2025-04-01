document.addEventListener('DOMContentLoaded', () => {
	const sidebar = document.querySelector('.sidebar');
	const sbToggle = document.querySelector('.sb_toggle');
	const sidebarLogo = document.querySelector('.sidebar_logo');
	const iconBox = document.querySelectorAll('.iconBox');
	const sidebarIcon = document.querySelectorAll('.sidebar_icon');
	const btnText = document.querySelectorAll('.btn_text');
	const msToggle = document.querySelector('.ms_toggle');
	const msLogo = document.querySelector('.ms_logo');
	const msIcon = document.querySelectorAll('.ms_icon');

	// 첫 번째 클릭 시 사이드바 축소
	sbToggle.addEventListener('click', () => {
		// 사이드바 상태 업데이트
		sidebar.classList.add('ms'); // ms 클래스를 추가
		sidebar.classList.remove('sidebar'); // sidebar 클래스 제거

		// 토글 버튼들 상태 변경
		sbToggle.classList.add('invisible');
		msToggle.classList.remove('invisible');

		// 로고 변경
		sidebarLogo.classList.add('invisible');
		msLogo.classList.remove('invisible');

		// 아이콘 박스 및 아이콘 상태 변경
		iconBox.forEach((box) => box.classList.add('ms_iconBox'));
		sidebarIcon.forEach((icon) => icon.classList.add('invisible'));
		msIcon.forEach((icon) => icon.classList.remove('invisible'));
		btnText.forEach((text) => text.classList.add('invisible'));
	});

	// 두 번째 클릭 시 사이드바 원래 상태로 되돌리기
	msToggle.addEventListener('click', () => {
		// 사이드바 상태 업데이트
		sidebar.classList.remove('ms'); // ms 클래스 제거
		sidebar.classList.add('sidebar'); // sidebar 클래스 추가

		// 토글 버튼들 상태 변경
		msToggle.classList.add('invisible');
		sbToggle.classList.remove('invisible');

		// 로고 변경
		msLogo.classList.add('invisible');
		sidebarLogo.classList.remove('invisible');

		// 아이콘 박스 및 아이콘 상태 변경
		iconBox.forEach((box) => box.classList.remove('ms_iconBox'));
		sidebarIcon.forEach((icon) => icon.classList.remove('invisible'));
		msIcon.forEach((icon) => icon.classList.add('invisible'));
		btnText.forEach((text) => text.classList.remove('invisible'));
	});
});
