const sheetId = '15TFOc-3VDBy15W33K8u5yIc2ozOpNVwYQVl-gvTuInM';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=`;

async function fetchData(sheetName) {
  const res = await fetch(base + sheetName);
  const text = await res.text();
  const json = JSON.parse(text.substring(47).slice(0, -2));
  const headers = json.table.cols.map(col => col.label);
  const rows = json.table.rows.map(row => row.c.map(cell => cell ? cell.v : ''));
  return { headers, rows };
}

function renderTable(tableId, data) {
  const table = document.getElementById(tableId);
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');

  thead.innerHTML = '<tr>' + data.headers.map(h => `<th>${h}</th>`).join('') + '</tr>';
  tbody.innerHTML = data.rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('');
}

function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  document.getElementById(tabName).style.display = 'block';
}

function filterTable() {
  const input = document.getElementById("transportadoraInput").value.toLowerCase();
  document.querySelectorAll("table tbody tr").forEach(row => {
    const cellText = row.cells[0].textContent.toLowerCase();
    row.style.display = cellText.includes(input) ? "" : "none";
  });
}

async function init() {
  const preventivaData = await fetchData("Preventivas");
  const calibragemData = await fetchData("Calibragens");
  renderTable("preventivaTable", preventivaData);
  renderTable("calibragemTable", calibragemData);
}

init();
