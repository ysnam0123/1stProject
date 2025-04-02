const today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

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

  if(month + 1 < 10){
    calendarInfo.textContent = `${year}.0${month + 1}`;
  } else {
    calendarInfo.textContent = `${year}.${month + 1}`;
  }
  
  const date = new Date(year,month,1);
  const lastDay = new Date(year,month + 1,0).getDay();
  console.log(lastDay)
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
    dayDiv.innerHTML = `
    <div>
    <span>${i}</span>
    <button class="addPlanBtn hide">+</button>
    </div>
    <div class="planList"></div>
    `;
    dayDiv.classList.add('daysItem','selectItem');
    daysContainer.appendChild(dayDiv);
  }

  for(let i = lastDay; i < weekDays.length-1; i++){
    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add('daysItem','emptyItem');
    daysContainer.appendChild(emptyDiv);
  }

  calendar.appendChild(daysContainer);
  
  const selectItems = document.querySelectorAll('.selectItem');
  const addPlanBtns = document.querySelectorAll('.selectItem .addPlanBtn');
  const xBox = document.querySelector('.xBox');
  
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

  addPlanBtns.forEach(Btn=>{
    Btn.addEventListener('click',(e)=>{
      e.preventDefault();
      document.querySelector('.shadow').classList.remove('hide');
      document.querySelector('.modal').classList.remove('hide');
    });
  });
  
  xBox.addEventListener('click',()=>{
    document.querySelector('.shadow').classList.add('hide');
    document.querySelector('.modal').classList.add('hide');
  });
}


