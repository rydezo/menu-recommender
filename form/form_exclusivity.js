console.log("Menu Recommender initialized");

// Exclusivity for dietary restrictions
document.getElementById('no-restrictions').addEventListener('change', function() {
    if (this.checked) {
        document.querySelectorAll('input[name="dietary-restrictions"]:not(#no-restrictions)').forEach(cb => cb.checked = false);
    }
});
document.querySelectorAll('input[name="dietary-restrictions"]:not(#no-restrictions)').forEach(cb => {
    cb.addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('no-restrictions').checked = false;
        }
    });
});

// Exclusivity for nutritional preferences
document.getElementById('no-preferences').addEventListener('change', function() {
    if (this.checked) {
        document.querySelectorAll('input[name="nutritional-preferences"]:not(#no-preferences)').forEach(cb => cb.checked = false);
    }
});
document.querySelectorAll('input[name="nutritional-preferences"]:not(#no-preferences)').forEach(cb => {
    cb.addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('no-preferences').checked = false;
        }
    });
});

// Prevent selecting both "Low Calories" and "High Calories"
const lowCalories = document.getElementById('low-calories');
const highCalories = document.getElementById('high-calories');

lowCalories.addEventListener('change', function() {
    if (this.checked) {
        highCalories.checked = false;
    }
});
highCalories.addEventListener('change', function() {
    if (this.checked) {
        lowCalories.checked = false;
    }
});
