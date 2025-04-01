const today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth()+1;


function createCalendar(year, month){
  const calendar = document.getElementById('calendarContainer');
  calendar.innerHTML = '';

  if(month + 1 < 10){
    document.getElementById("currentMonth").textContent = `${year}.0${month+1}월`;
  } else {
    document.getElementById("currentMonth").textContent = `${year}.${month+1}월`;
  }
  
  const date = new Date(year,month,1);
  const lastDay = new Date(year,month+1,0).getDate();
  const firstDay = date.getDay() 

  const weekDays = ['일','월','화','수','목','금','토'];
  const weekDaysContainer = document.createElement('div');
  weekDaysContainer.classList.add('weekDays');
  weekDays.forEach((day)=>{
    const dayDiv = document.createElement('div');
    dayDiv.textContent = day;
    weekDaysContainer.append(dayDiv);
  });
  calendar.append(weekDaysContainer)
}

createCalendar(currentYear,currentMonth);
