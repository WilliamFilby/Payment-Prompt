const jobs = [];

function addJob() {
  const date = document.getElementById('date').value;
  const customer = document.getElementById('customer').value;
  const horse = document.getElementById('horse').value;
  const service = document.getElementById('service').value;
  const price = document.getElementById('price').value;

  if (date && customer && horse && service && price) {
    jobs.push({
      id: Date.now(),
      date,
      customer,
      horse,
      service,
      price,
      paid: false
    });
    renderJobs();
    clearForm();
  }
}

function togglePaid(id) {
  const job = jobs.find(j => j.id === id);
  if (job) {
    job.paid = !job.paid;
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
        <p><strong>${job.date}</strong><br>${job.customer} (${job.horse})<br>${job.service} – £${job.price}</p>
        <label>Paid: <input type="checkbox" ${job.paid ? 'checked' : ''} onchange="togglePaid(${job.id})"></label>
      </div>
    `;
    container.appendChild(jobItem);
  });
}

function clearForm() {
  document.getElementById('date').value = '';
  document.getElementById('customer').value = '';
  document.getElementById('horse').value = '';
  document.getElementById('service').value = '';
  document.getElementById('price').value = '';
}

function checkUnpaidReminders() {
  const today = new Date();
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 7);

  const unpaid = jobs.filter(job => !job.paid && new Date(job.date) >= lastWeek);
  if (unpaid.length > 0) {
    alert(`You have ${unpaid.length} unpaid jobs this week. Time to follow up!`);
  }
}

function setupReminder() {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  if (day === 0 && hour === 9) {
    checkUnpaidReminders();
  }
}

window.onload = () => {
  renderJobs();
  setupReminder();
};