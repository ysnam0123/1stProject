document.addEventListener('DOMContentLoaded', () => {
	const toggleCircle = document.getElementById('toggleCircle');
	const toggleBar = document.querySelector('.modeToggleBar');
	const moon = document.querySelector('.moon');
	const sun = document.querySelector('.sun');
	const modeCircle = document.querySelector('.modeCircle');
	const sidebar = document.querySelector('.sidebar');
	const container = document.querySelector('.container');
	const lightModeLogo = document.querySelector('.lightModeLogo');
	const darkModeLogo = document.querySelector('.darkModeLogo');
	toggleCircle.addEventListener('click', (event) => {
		event.preventDefault();
		changeMode();
	});

	function changeMode() {
		if (toggleCircle.classList.contains('lightMode')) {
			// 다크 모드로 전환
			toggleCircle.style.left = '50px';
			sun.classList.add('invisible');
			moon.classList.remove('invisible');
			modeCircle.style.color = '#F6DF12';
			toggleCircle.classList.remove('lightMode');
			toggleCircle.classList.add('darkMode');
			sidebar.style.backgroundColor = 'var(--dmbg-color)';
			container.style.backgroundColor = 'var(--dmbg-color)';
			// toggleBar.style.color = 'var(--toggleBar-color)';
			lightModeLogo.classList.add('invisible');
			darkModeLogo.classList.remove('invisible');
		} else if (toggleCircle.classList.contains('darkMode')) {
			// 라이트 모드로 전환
			toggleCircle.style.left = '9px';
			sun.classList.remove('invisible');
			moon.classList.add('invisible');
			modeCircle.style.color = '#0064ff';
			toggleCircle.classList.remove('darkMode');
			toggleCircle.classList.add('lightMode');
			document.body.style.color = '#222';
			// toggleBar.style.color = '#222';
			sidebar.style.backgroundColor = 'var(--bg-color)';
			container.style.backgroundColor = 'var(--bg-color)';
			lightModeLogo.classList.remove('invisible');
			darkModeLogo.classList.add('invisible');
		}
	}
});
