const today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
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
});

rightBtn.addEventListener('click',(e)=>{
  e.preventDefault();
  currentMonth++;
  if(currentMonth > 11){
    currentMonth = 0;
    currentYear = currentYear + 1;
  }
  createCalendar(currentYear,currentMonth);
});

createCalendar(currentYear,currentMonth);

function createCalendar(year, month){
  const calendar = document.getElementById('calendarWrapper');
  const calendarInfo = document.getElementById("calendarInfo");
  calendar.innerHTML = '';
  // let setMonth = '';
  // let dateInfo = 0;

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
  const firstDay = date.getDay();

  const weekDays = ['일','월','화','수','목','금','토'];
  const weekDaysContainer = document.createElement('div');
  weekDaysContainer.classList.add('weekDays');
  weekDays.forEach((day)=>{
    const dayDiv = document.createElement('div');
    dayDiv.textContent = day;
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
    <span>${i}</span>
    <button class="addPlanBtn hide">추가 +</button>
    </div>
    <ul class="planList"></ul>
    `;

    const planListEl = dayDiv.querySelector(".planList");
    let date = dayDiv.querySelector('span').textContent;

    if(date < 10) date = `0${date}`;

    dayDiv.dataset.dateInfo = `${year}${setMonth}${date}`;

    listItemAppend(dayDiv.dataset.dateInfo,planListEl);
    daysContainer.appendChild(dayDiv);
  }

  function listItemAppend(dateInfo,parenstEl){
    if(!JSON.parse(localStorage.getItem(dateInfo))) return;
  
    const datas = JSON.parse(localStorage.getItem(dateInfo)) || [];
    let { color, title = "무제"} = datas[0] || [];
    if(color === '색상') color = "#3389ff";

    const li = document.createElement("li");
    li.classList.add('planListItem');
    li.textContent = title;
    li.style.backgroundColor = color;

    parenstEl.appendChild(li);
  }

  for(let i = lastDay; i < weekDays.length-1; i++){
    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add('daysItem','emptyItem');
    daysContainer.appendChild(emptyDiv);
  }

  calendar.appendChild(daysContainer);
}

const selectItems = document.querySelectorAll('.selectItem');
const addPlanBtns = document.querySelectorAll('.selectItem .addPlanBtn');
const saveBtn = document.querySelector('.saveBtn');
const cancelBtn = document.querySelector('.cancelBtn');

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
    document.querySelector('.shadow').classList.remove('hide');
    document.querySelector('.modal').classList.remove('hide');
  });
});

saveBtn.addEventListener('click',(e)=>{
  e.preventDefault();
  const title = document.getElementById("title");
  const startday = document.getElementById("startday");
  const endday = document.getElementById("endday");
  const color = document.getElementById("colorInput");

  const titleValue = title.value;
  const startdayValue = startday.value.split('-').join('');
  const enddayValue = endday.value.split('-').join('');
  const colorValue = color.value; 

  // inputValidation(title, startday, endday, color);

  setStorage(dateInfo,titleValue,startdayValue,enddayValue,colorValue);
  
  clearValue();

  document.querySelector('.shadow').classList.add('hide');
  document.querySelector('.modal').classList.add('hide');

  createCalendar(currentYear,currentMonth);
});

// function inputValidation(title, startday, endday, color){
//   if(title.value === '' || color.value === '' || startday.value === '' || endday.value === ''){

//   }
// }

function clearValue(){
  document.getElementById("title").value = '';
  document.getElementById("startday").value = '';
  document.getElementById("endday").value = '';
  document.getElementById("colorInput").selectedIndex = 0;
}

function setStorage(dataInfo,title,startday,endday,color){
  const obj = {
    'title' : title,
    'startday' : startday,
    'endday' : endday,
    'color' : color,
  }
  const temp = JSON.parse(localStorage.getItem(dataInfo)) || [];
  temp.push({...obj});
  //시작일~마감일까지 정보 로컬 스토리지에 추가
  for(let i = +temp[temp.length-1].startday;i <= +temp[temp.length-1].endday;i++){
    localStorage.setItem(`${i}`,JSON.stringify(temp));
    console.log(i,temp);
  }
}

cancelBtn.addEventListener('click',(e)=>{
  e.preventDefault();
  clearValue();
  document.querySelector('.shadow').classList.add('hide');
  document.querySelector('.modal').classList.add('hide');
});

// 인풋 값을 로컬 스토리지에 저장 -> calendar 함수 실행 -> daydiv.dataset으로 로컬 스토리지 키값에 접근-> []안의 객체에 접근 title color값 구조분해 배열의 길이만큼 daydiv안에 div 넣고 스타일링