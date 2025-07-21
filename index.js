console.log("Menu Recommender initialized");

const checkboxes = document.querySelectorAll('.exclusive-checkbox');

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', function () {
    if (this.checked) {
      checkboxes.forEach((otherCheckbox) => {
        if (otherCheckbox !== this) {
          otherCheckbox.checked = false;
        }
      });
    }
  });
});