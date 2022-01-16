// Creating variables to store

const container2 = document.querySelector(".dining-container");
const seats2 = document.querySelectorAll(".fas");
const count2 = document.getElementById("count2");

// Updating the count in the text when toggled

function update2() {
  const selected2 = document.querySelectorAll('.dining-container .select');
  const selectedCount2 = selected2.length;
  count2.innerText = selectedCount2;
}

// Changing the id to selected when the seat is toggled in order to change the color

container2.addEventListener('click', (e) => {
  if(e.target.classList.contains('fas') && !e.target.classList.contains('occupy')) {
    e.target.classList.toggle('select');
  }

  update2();
});