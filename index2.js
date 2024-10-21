var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzhXzyNMepTzIZRKtvOHVzQmj8gKHKaXzuFSk7tbWM_fw2614f-E6dyh2osAqo70xndmQ/exec'; // スクリプトURLを置き換える

let previousData = {};
let currentPage = 0;
const entriesPerPage = 10;

// データを取得し保存する
function fetchData() {
  console.log('Fetching data...'); // デバッグ用のログ
  fetch(SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'action=getData'
  })
  .then(response => {
    console.log('Response received:', response); // デバッグ用のログ
    return response.json();
  })
  .then(data => {
    console.log('Fetched data:', data); // デバッグ用のログ
    let currentDateUTC = new Date();
    let jstOffset = 9 * 60;
    currentDateUTC.setMinutes(currentDateUTC.getMinutes() + jstOffset);
    let currentDateJST = currentDateUTC.toISOString().split('T')[0];
    if (JSON.stringify(data) !== JSON.stringify(previousData[currentDateJST])) {
      previousData[currentDateJST] = data;
      saveDataByDate(currentDateJST, data);
      displayLatestData();
    }
  })
  .catch(error => console.error('Error:', error));
}

// 日付ごとのデータを保存する
function saveDataByDate(date, data) {
  let allData = JSON.parse(localStorage.getItem('dataByDate')) || {};
  allData[date] = data;
  localStorage.setItem('dataByDate', JSON.stringify(allData));
  console.log('Data saved by date:', allData); // デバッグ用のログ
}

// 最新のデータを表示する
function displayLatestData() {
  let allData = JSON.parse(localStorage.getItem('dataByDate')) || {};
  let dates = Object.keys(allData).sort().slice(-30);
  let latestData = [];

  dates.reverse().forEach(date => {
    if (Array.isArray(allData[date])) {
      allData[date].forEach(row => {
        latestData.push({ date, ...row });
      });
    }
  });

  console.log('Latest data to display:', latestData); // デバッグ用のログ
  filterAndDisplayData(latestData);
}

// データをフィルタリングして表示する
function filterAndDisplayData(data) {
  let childName = localStorage.getItem('currentChildName');
  let childNumber = localStorage.getItem('currentChildNumber');
  console.log('Current childName:', childName); // デバッグ用のログ
  console.log('Current childNumber:', childNumber); // デバッグ用のログ
  if (childName && childNumber) {
    document.title = childName;
    document.getElementById('child-name-title').textContent = childName;
    let filteredData = data.filter(row => row.childNumber && row.childNumber.toString() === childNumber && row.childName === childName);
    console.log('Filtered data:', filteredData); // デバッグ用のログ
    paginateAndDisplayData(filteredData);
  } else {
    paginateAndDisplayData([]);
  }
}

// データをページングして表示する
function paginateAndDisplayData(data) {
  let totalPages = Math.ceil(data.length / entriesPerPage);
  currentPage = Math.min(currentPage, totalPages - 1);

  let start = currentPage * entriesPerPage;
  let end = start + entriesPerPage;
  let paginatedData = data.slice(start, end);

  displayData(paginatedData);
}

// データを表示する
function displayData(data) {
  var table = document.getElementById('data-table').getElementsByTagName('tbody')[0];
  table.innerHTML = '';
  console.log('Displaying data:', data); // デバッグ用のログ
  data.forEach(function(row) {
    var tr = document.createElement('tr');
    Object.values(row).forEach(function(cell) {
      var td = document.createElement('td');
      td.textContent = cell;
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  console.log('Data displayed:', data); // デバッグ用のログ
}

// 前のページを表示する
function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    displayLatestData();
  }
}

// 次のページを表示する
function nextPage() {
  let allData = JSON.parse(localStorage.getItem('dataByDate')) || {};
  let dates = Object.keys(allData).sort().slice(-30);
  let latestData = [];

  dates.reverse().forEach(date => {
    if (Array.isArray(allData[date])) {
      allData[date].forEach(row => {
        latestData.push({ date, ...row });
      });
    }
  });

  let childName = localStorage.getItem('currentChildName');
  let childNumber = localStorage.getItem('currentChildNumber');
  let filteredData = childName && childNumber ? latestData.filter(row => row.childNumber && row.childNumber.toString() === childNumber && row.childName === childName) : [];

  let totalPages = Math.ceil(filteredData.length / entriesPerPage);
  if (currentPage < totalPages - 1) {
    currentPage++;
    displayLatestData();
  }
}

// 一定間隔でデータを自動更新する
function startAutoUpdate(interval) {
  fetchData();
  setInterval(fetchData, interval);
}

// ページ読み込み時に初期化する
document.addEventListener('DOMContentLoaded', function() {
  startAutoUpdate(5000);
  displayLatestData();
});
