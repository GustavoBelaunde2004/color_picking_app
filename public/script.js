window.onload = function () {
    const form = document.getElementById('dataForm');
    const confirmBox = document.getElementById('confirm-box');
    const confirmMessage = document.getElementById('confirm-message');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const responseWrapper = document.getElementById('response-wrapper');
    const responseText = document.getElementById('response-text');
    const colorWrapper = document.getElementById('color-result-wrapper');
    const colorText = document.getElementById('color-result');
  
    let pendingName = '';
    let pendingNewColor = '';
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const formData = {
        name: form.name.value,
        favoriteColor: form.favoriteColor.value,
      };
  
      const res = await fetch('/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const result = await res.json();
  
      if (result.type === 'new' || result.type === 'same') {
        responseText.innerText = result.message;
        responseWrapper.style.display = 'block';
        confirmBox.style.display = 'none';
        form.reset();
      } else if (result.type === 'exists') {
        confirmBox.style.display = 'block';
        confirmMessage.innerText = `${result.name}, your favorite color is currently "${result.oldColor}". Do you want to change it to "${result.newColor}"?`;
        pendingName = result.name;
        pendingNewColor = result.newColor;
      }
    });
  
    yesBtn.addEventListener('click', async () => {
      const res = await fetch('/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: pendingName, newColor: pendingNewColor }),
      });
  
      const result = await res.json();
      responseText.innerText = result.message;
      responseWrapper.style.display = 'block';
      confirmBox.style.display = 'none';
      form.reset();
    });
  
    noBtn.addEventListener('click', () => {
      responseText.innerText = `${pendingName}, your favorite color remains unchanged.`;
      responseWrapper.style.display = 'block';
      confirmBox.style.display = 'none';
      form.reset();
    });
  
    // dropdown
    fetch('/users')
      .then(res => res.json())
      .then(users => {
        const select = document.getElementById('user-select');
        users.forEach(user => {
          const option = document.createElement('option');
          option.value = user.name;
          option.textContent = user.name;
          select.appendChild(option);
        });
      });
  
    // color by user
    document.getElementById('fetch-color').addEventListener('click', async () => {
      const name = document.getElementById('user-select').value;
      if (!name) return;
  
      const res = await fetch(`/color/${name}`);
      const result = await res.json();
  
      if (result.color) {
        colorText.innerText = `${name}'s favorite color is ${result.color}`;
        colorWrapper.style.display = 'block';
      } else {
        colorText.innerText = `User not found.`;
        colorWrapper.style.display = 'block';
      }
    });
  
    // x buttons
    document.getElementById('close-response').addEventListener('click', () => {
      responseWrapper.style.display = 'none';
    });
  
    document.getElementById('close-color').addEventListener('click', () => {
      colorWrapper.style.display = 'none';
    });
  };
  