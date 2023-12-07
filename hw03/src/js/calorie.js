const jsonUrl02 = '../json/AerobicData.json';

let calorieIndex = 0;
let calorieData = null;

function loadjson() {
  fetch(jsonUrl02)
    .then(response => response.json())
    .then(data => {
      calorieData = data;
    })
    .catch(error => console.error('Error fetching JSON:', error));
}

function updatePage() {
  if (calorieIndex < calorieData.length) {
    const point = calorieData[calorieIndex];
    updateIconPosition(point.X, point.Y);
    updateInfo(point.Time, point.Floor, point.Distance, point.Calorie);
    calorieIndex++;
  } else {
    calorieIndex = 0;
  }
  setTimeout(updatePage, document.getElementById('rangeBar').value);
}

// 新增一個函數用來更新資訊
function updateInfo(time, floor, distance, calorie) {
  const timeInfo = document.getElementById('time-info');
  const distanceInfo = document.getElementById('distance-info');
  const calorieInfo = document.getElementById('calories-info');

  // 在這裡可以加上計算速度、卡路里等其他相關邏輯
  const speed = distance / time;

  timeInfo.textContent = `Time: ${time} seconds`;
  distanceInfo.textContent = `Distance: ${distance} meters`;
  calorieInfo.textContent = `Calories: ${calorie} calories`;

  // 這裡可以加上其他相關邏輯
}