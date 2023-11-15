const headerList = ['序號', '班級', '學號', '姓名', 'GitHub', '作業一', '作業二', '作業三', '作業四', '作業五', '作業六', '作業七', '作業八',	'作業九',	'作業十'];
const classes = ['資工系', '資工所', '電資AI', '電資資安', '創新AI'];
const charac= '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  function ID(){
    const idF = ["111", "112"];
    const idS = ["590", "598", "C52", "C53", "C71"];
    const ID1 = idF[Math.floor(Math.random() * idF.length)];
    const ID2 = idS[Math.floor(Math.random() * idS.length)];
    const ID3 = (Math.floor(Math.random() * 999) + 1).toString().padStart(3, '0');
    
    return ID1+ID2+ID3;
  }

  function Username() {
    let username = '';
  
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * charac.length);
      username += charac.charAt(randomIndex);
    }
  
    return username;
  }

  function randomclass(){
    
    return classes[parseInt(Math.random() * classes.length)];
    
  }

  function ScoreList() {
    const scoreList = [];
  
    for (let i = 0; i < 10; i++) {
      scoreList.push(Math.floor(Math.random() * 10));
    }
  
    return scoreList;
  }
  
  function generateDummyCsvTable() {
    let divElement = document.getElementById("dummy-csv-table");
    let table = document.createElement("table");
  
    let header = table.createTHead();
    let headerRow = header.insertRow();
  
    for (let i = 0; i < headerList.length; i++) {
      headerRow.insertCell().innerHTML = headerList[i];
    }
  
    for (let index = 1; index <= 120; index++) {
      let row = table.insertRow();
      let className = randomclass();
      let studentId = ID();
      let studentName = "User";
      let githubId = Username();
      let scoreList = ScoreList();
  
      let rowItems = [index, className, studentId, studentName, githubId];
  
      for (let j = 0; j < rowItems.length; j++) {
        var cell = row.insertCell();
        cell.innerHTML = rowItems[j];
      }
      for (let j = 0; j < scoreList.length; j++) {
        var cell = row.insertCell();
        cell.innerHTML = scoreList[j];
      }
    } 
  
    divElement.appendChild(table);
  }
  
  function generateAppleScoreboardTable() {
    let divElement = document.getElementById("apple-scoreboard-table");
    let table = document.createElement("table");
  
    let header = table.createTHead();
    let headerRow = header.insertRow();
  
    for (let i = 0; i < headerList.length; i++) {
      headerRow.insertCell().innerHTML = headerList[i];
    }
  
    for (let index = 1; index <= 120; index++) {
      let row = table.insertRow();
      let className = randomclass();
      let studentId = ID();
      let studentName = "User";
      let githubId = Username();
      let scoreList = ScoreList();
  
      let rowItems = [index, className, studentId, studentName, githubId];
  
      for (let j = 0; j < rowItems.length; j++) {
        var cell = row.insertCell();
        cell.innerHTML = rowItems[j];
      }
      for (let j = 0; j < scoreList.length; j++) {
        var cell = row.insertCell();
        cell.innerHTML = `<img src='../score/${scoreList[j]}.svg' width='40' height='40'>`;
      }
    } 
  
    divElement.appendChild(table);
  }