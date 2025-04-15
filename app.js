// Payment Prompt App - Personalized Version with Persistent Storage
// Now greets user by name, allows setting of reminder time/day, and saves job entries

let userName = localStorage.getItem('userName') || '';
let reminderTime = localStorage.getItem('reminderTime') || '09:00';
let reminderDay = localStorage.getItem('reminderDay') || 'Sunday';
const jobs = [];

function setPreferences() {
  userName = document.getElementById('nameInput').value;
  reminderTime = document.getElementById('reminderTime').value;
  reminderDay = document.getElementById('reminderDay').value;
  localStorage.setItem('userName', userName);
  localStorage.setItem('reminderTime', reminderTime);
  localStorage.setItem('reminderDay', reminderDay);
  document.getElementById('greeting').innerText = `Hello, ${userName}`;
  document.getElementById('setup').style.display = 'none';
  document.getElementById('mainApp').style.display = 'block';
}

function addJob() {
  const customer = document.getElementById('customer').value;
  const horse = document.getElementById('horse').value;
  const service = document.getElementById('service').value;
  const price = document.getElementById('price').value;
  const paid = document.getElementById('paid').checked;

  if (customer && horse && service && price) {
    jobs.push({
      id: Date.now(),
      customer,
      horse,
      service,
      price,
      paid
    });
    localStorage.setItem('jobs', JSON.stringify(jobs));
    renderJobs();
    clearForm();
  }
}

function togglePaid(id) {
  const job = jobs.find(j => j.id === id);
  if (job) {
    job.paid = !job.paid;
    localStorage.setItem('jobs', JSON.stringify(jobs));
    renderJobs();
  }
}

function renderJobs() {
  const container = document.getElementById('jobList');
  container.innerHTML = '';
  jobs.forEach(job => {
    const jobItem = document.createElement('div');
    jobItem.className = 'job-item';
    jobItem.innerHTML = `
      <div class="card">
        <p>${job.customer} – ${job.horse}<br>
        ${job.service} – £${job.price}</p>
        <label>Paid: <input type="checkbox" ${job.paid ? 'checked' : ''} onchange="togglePaid(${job.id})"></label>
      </div>
    `;
    container.appendChild(jobItem);
  });
}

function clearForm() {
  document.getElementById('customer').value = '';
  document.getElementById('horse').value = '';
  document.getElementById('service').value = '';
  document.getElementById('price').value = '';
  document.getElementById('paid').checked = false;
}

function checkUnpaidReminders() {
  const today = new Date();
  const dayName = today.toLocaleDateString('en-GB', { weekday: 'long' });
  const currentTime = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;

  if (dayName === reminderDay && currentTime === reminderTime) {
    const unpaid = jobs.filter(job => !job.paid);
    if (unpaid.length > 0) {
      alert(`You have ${unpaid.length} unpaid job(s) to follow up.`);
    }
  }
}

window.onload = () => {
  const storedJobs = localStorage.getItem('jobs');
  if (storedJobs) {
    jobs.push(...JSON.parse(storedJobs));
  }
  if (!userName) {
    document.getElementById('setup').style.display = 'block';
    document.getElementById('mainApp').style.display = 'none';
  } else {
    document.getElementById('greeting').innerText = `Hello, ${userName}`;
    document.getElementById('setup').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
  }
  renderJobs();
  setInterval(checkUnpaidReminders, 60000); // check every minute
};
