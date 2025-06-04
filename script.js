const form = document.getElementById('itinerary-form');
const list = document.getElementById('itinerary-list');

let itinerary = JSON.parse(localStorage.getItem('itinerary')) || [];

function saveItinerary() {
  localStorage.setItem('itinerary', JSON.stringify(itinerary));
}

function renderItinerary() {
  list.innerHTML = '';
  
  const grouped = itinerary.reduce((acc, item) => {
    (acc[item.date] = acc[item.date] || []).push(item);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort();

  sortedDates.forEach(date => {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'itinerary-day';

    const dateHeader = document.createElement('h3');
    dateHeader.textContent = date;
    dayDiv.appendChild(dateHeader);

    grouped[date].sort((a, b) => a.time.localeCompare(b.time)).forEach((item, index) => {
      const entry = document.createElement('div');
      entry.className = 'entry';

      const text = document.createElement('span');
      text.textContent = `${item.time} - ${item.description}`;
      entry.appendChild(text);

      const delBtn = document.createElement('button');
      delBtn.textContent = 'X';
      delBtn.onclick = () => {
        itinerary = itinerary.filter(i => !(i.date === item.date && i.time === item.time && i.description === item.description));
        saveItinerary();
        renderItinerary();
      };
      entry.appendChild(delBtn);

      dayDiv.appendChild(entry);
    });

    list.appendChild(dayDiv);
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const description = document.getElementById('description').value;

  itinerary.push({ date, time, description });
  saveItinerary();
  renderItinerary();
  form.reset();
});

renderItinerary();
