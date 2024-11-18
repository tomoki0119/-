function showOrHide() {
  let showPass = document.getElementById("pass");
  let check = document.getElementById("showPassword");
  if (check.checked) {
    showPass.type = "text";
  } else {
    showPass.type = "password";
  }
}

function login() {
  const mailAddress = document.getElementById('mailAddress').value;
  const pass = document.getElementById('pass').value;

  const data = new URLSearchParams();
  data.append('action', 'login');
  data.append('mailAddress', mailAddress);
  data.append('password', pass);

  fetch('https://script.google.com/macros/s/AKfycbw8_4QaVizVfkx7cF7ghADMC1mCqUFNSN6nc-WRWyuZYam54jRLE47-H3fKotNrSt0Lgw/exec', {
    method: 'POST',
    body: data
  })
  .then(response => response.json())
  .then(response => {
    if (response.status === 'success') {
      localStorage.setItem('currentChildName', response.childName);
      localStorage.setItem('currentChildNumber', response.childNumber);
      console.log('ログイン成功:', response);
      window.location.href = 'safeKids.html'; // ログイン後に表示するページ
    } else {
      alert('ログイン失敗: ' + response.message);
      console.error('ログイン失敗:', response);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('ログイン中にエラーが発生しました。');
  });
}
