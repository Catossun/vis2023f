// Function to toggle image display for a specific floor
function toggleImage(floorId) {
    const floorElement = document.getElementById(floorId);
    const checkbox = floorElement.querySelector('.show-image');
    const img = floorElement.querySelector('img');
  
    if (checkbox.checked) {
      img.src = `../svg/new${floorId.slice(-1)}F.svg`;  // Change to new image
    } else {
      img.src = `../svg/no${floorId.slice(-1)}F.svg`;  // Change to initial image
    }
  }
  
  // Event listener for checkbox changes
  document.addEventListener('change', function(event) {
    if (event.target.classList.contains('show-image')) {
      const floorId = event.target.closest('.grid-item').id;
      toggleImage(floorId);
    }
  });