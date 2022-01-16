// Creating variables to store

const container = document.querySelector(".container");
const seats = document.querySelectorAll(".fa");
const count = document.getElementById("count");

// Updating the count in the text when toggled

function update() {
  const selected = document.querySelectorAll('.container .selected');
  const selectedCount = selected.length;
  count.innerText = selectedCount;
}

// Changing the id to selected when the seat is toggled in order to change the color

container.addEventListener('click', (i) => {
  if(i.target.classList.contains('fa') && !i.target.classList.contains('occupied')) {
    i.target.classList.toggle('selected');
  }

  update();
});

