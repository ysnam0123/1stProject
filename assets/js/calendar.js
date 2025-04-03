const today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const cancelBtn = document.querySelector('.cancelBtn');
const startday = document.getElementById("startday");
const endday = document.getElementById("endday");
let setMonth = '';
let dateInfo = 0;

leftBtn.addEventListener('click',(e)=>{
  e.preventDefault();
  currentMonth--;
  if(currentMonth < 0){
    currentMonth = 11;
    currentYear = currentYear - 1;
  }
  createCalendar(currentYear,currentMonth);
  bind();
});

rightBtn.addEventListener('click',(e)=>{
  e.preventDefault();
  currentMonth++;
  if(currentMonth > 11){
    currentMonth = 0;
    currentYear = currentYear + 1;
  }
  createCalendar(currentYear,currentMonth);
  bind();
});

createCalendar(currentYear,currentMonth);
bind();

function createCalendar(year, month){
  const calendar = document.getElementById('calendarWrapper');
  const calendarInfo = document.getElementById("calendarInfo");
  calendar.innerHTML = '';

  if(month + 1 < 10){
    calendarInfo.textContent = `${year}.0${month + 1}`;
    setMonth = `0${month + 1}`;
  } else {
    calendarInfo.textContent = `${year}.${month + 1}`;
    setMonth = `${month + 1}`;
  }
  
  const date = new Date(year,month,1);
  const lastDay = new Date(year,month + 1,0).getDay();
  const lastDate = new Date(year,month + 1,0).getDate();
  let firstDay = date.getDay();

  const weekDays = ['SUN','MON','TUE','WED','THU','FRI','SET'];
  const weekDaysContainer = document.createElement('div');
  weekDaysContainer.classList.add('weekDays');
  weekDays.forEach((day)=>{
    const dayDiv = document.createElement('div');
    dayDiv.textContent = day;
    if(day === 'SET') dayDiv.style.color = '#3389ff';
    if(day === 'SUN') dayDiv.style.color = '#ff0000';
    weekDaysContainer.appendChild(dayDiv);
  });

  calendar.appendChild(weekDaysContainer);

  const daysContainer = document.createElement('div');
  daysContainer.classList.add('days');

  for(let i = 0; i < firstDay; i++){
    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add('daysItem','emptyItem');
    daysContainer.appendChild(emptyDiv);
  }
  
  for(let i = 1; i <= lastDate; i++){
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('daysItem','selectItem');

    dayDiv.innerHTML = `
    <div>
    <span>${i < 10 ? "0"+i : i}</span>
    <button class="addPlanBtn hide">추가 +</button>
    </div>
    <ul class="planList"></ul>
    `;
    
        if(firstDay > 6) firstDay = 0;
        if(firstDay === 0) dayDiv.querySelector('span').style.color = '#ff0000';
        if(firstDay === 6) dayDiv.querySelector('span').style.color = '#3389ff';
        firstDay += 1;

    const planListEl = dayDiv.querySelector(".planList");
    let date = dayDiv.querySelector('span').textContent;
    
    dayDiv.dataset.dateInfo = `${year}${setMonth}${date}`;
    
    listItemAppend(dayDiv.dataset.dateInfo,planListEl);
    daysContainer.appendChild(dayDiv);
  }

  function listItemAppend(dateInfo,parenstEl){
    if(!JSON.parse(localStorage.getItem(dateInfo))) return;
  
    const datas = JSON.parse(localStorage.getItem(dateInfo)) || [];
    for(let i = 0; i < datas.length; i++){
      let { color, title } = datas[i] || [];
      if(color === '색상') color = "#3389ff";
      if(title === '') title = "제목을 지어주세요";
  
      const li = document.createElement("li");
      li.classList.add('planListItem');
      li.textContent = title;
      li.style.setProperty("--before-bg", color);
  
      parenstEl.appendChild(li);
    }
  }

  for(let i = lastDay; i < weekDays.length-1; i++){
    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add('daysItem','emptyItem');
    daysContainer.appendChild(emptyDiv);
  }

  calendar.appendChild(daysContainer);
}

function bind(){
  const selectItems = document.querySelectorAll('.selectItem');
  const addPlanBtns = document.querySelectorAll('.selectItem .addPlanBtn');
  const saveBtn = document.querySelector('.saveBtn');
  
  selectItems.forEach(item=>{
    item.addEventListener('mouseenter',()=>{
      item.querySelector('.addPlanBtn').classList.remove('hide');
    });
  });
  
  selectItems.forEach(item=>{
    item.addEventListener('mouseleave',()=>{
      item.querySelector('.addPlanBtn').classList.add('hide');
    });
  });
  
  addPlanBtns.forEach(btn=>{
    btn.addEventListener('click',(e)=>{
      e.preventDefault();
      const parentEl = e.target.parentElement.parentElement;
      dateInfo = parentEl.dataset.dateInfo;
      startday.value = dateInfo.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
      endday.value = dateInfo.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");

      document.querySelector('.shadow').classList.remove('hide');
      document.querySelector('.modal').classList.remove('hide');
    });
  });
  
  saveBtn.addEventListener('click',(e)=>{
    document.getElementById('warning').textContent = "";
    e.preventDefault();
    const title = document.getElementById("title");
    const color = document.getElementById("colorInput");
    const inputs = [title, startday, endday];

    if(!title.value){
      document.getElementById('warning')
      .textContent = "필수 입력 사항인 일정, 시작 날짜, 종료 날짜를 입력 하세요.";
      return
    }
    
    const titleValue = title.value.trim();
    const startdayValue = startday.value.split('-').join('');
    const enddayValue = endday.value.split('-').join('');
    const colorValue = color.value; 
  
    setStorage(titleValue,startdayValue,enddayValue,colorValue);
    
    clearValue();
  
    document.querySelector('.shadow').classList.add('hide');
    document.querySelector('.modal').classList.add('hide');
  
    createCalendar(currentYear,currentMonth);
    bind();
  });
  
  function clearValue(){
    document.getElementById("title").value = '';
    document.getElementById("startday").value = '';
    document.getElementById("endday").value = '';
    document.getElementById("colorInput").selectedIndex = 0;
  }
  
  function setStorage(title,startday,endday,color){
    const obj = {
      'title' : title,
      'startday' : startday,
      'endday' : endday,
      'color' : color,
    }
    if(+startday > +endday) return;
    //시작일~마감일까지 정보 로컬 스토리지에 추가
    for(let i = +obj['startday'];i <= +obj['endday'];i++){
      const temp = JSON.parse(localStorage.getItem(`${i}`)) || [];
      temp.push(obj);
      localStorage.setItem(`${i}`,JSON.stringify(temp));
    }
  }
  
  cancelBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    clearValue();
    document.getElementById('warning').textContent = "";
    document.querySelector('.shadow').classList.add('hide');
    document.querySelector('.modal').classList.add('hide');
  });
}