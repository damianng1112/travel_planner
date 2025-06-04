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

    grouped[date].sort((a, b) => a.time.localeCompare(b.time)).forEach((item) => {
      const entry = document.createElement('div');
      entry.className = 'entry';

      const text = document.createElement('span');
      text.innerHTML = `${item.time} - ${item.description}`;
      entry.appendChild(text);

      if (item.location) {
        const link = document.createElement('a');
        link.href = item.location;
        link.target = '_blank';
        link.textContent = '📍';
        entry.appendChild(link);
      }

      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.onclick = () => {
        document.getElementById('date').value = item.date;
        document.getElementById('time').value = item.time;
        document.getElementById('description').value = item.description;
        document.getElementById('location').value = item.location || '';
        // Remove current entry
        itinerary = itinerary.filter(i => !(i.date === item.date && i.time === item.time && i.description === item.description && i.location === item.location));
        saveItinerary();
        renderItinerary();
      };
      entry.appendChild(editBtn);

      const delBtn = document.createElement('button');
      delBtn.textContent = 'X';
      delBtn.onclick = () => {
        itinerary = itinerary.filter(i => !(i.date === item.date && i.time === item.time && i.description === item.description && i.location === item.location));
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
  const location = document.getElementById('location').value;

  itinerary.push({ date, time, description, location });
  saveItinerary();
  renderItinerary();
  form.reset();
});

renderItinerary();
