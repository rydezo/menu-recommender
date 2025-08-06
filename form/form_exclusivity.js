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

// Chick-fil-A menu data (sample, simplified)
const menu = [
    {
        name: "Original Chicken Sandwich",
        calories: 440,
        carb: 41,
        sodium: 1370,
        protein: 28,
        grilled: false,
        vegetarian: false,
        dairyFree: false,
        nutFree: true,
        glutenFree: false,
        price: 4.99
    },
    {
        name: "Grilled Chicken Sandwich",
        calories: 380,
        carb: 44,
        sodium: 770,
        protein: 28,
        grilled: true,
        vegetarian: false,
        dairyFree: true,
        nutFree: true,
        glutenFree: false,
        price: 5.49
    },
    {
        name: "Spicy Deluxe Sandwich",
        calories: 550,
        carb: 50,
        sodium: 1750,
        protein: 32,
        grilled: false,
        vegetarian: false,
        dairyFree: false,
        nutFree: true,
        glutenFree: false,
        price: 5.79
    },
    {
        name: "Grilled Nuggets (8 ct)",
        calories: 130,
        carb: 1,
        sodium: 440,
        protein: 25,
        grilled: true,
        vegetarian: false,
        dairyFree: true,
        nutFree: true,
        glutenFree: true,
        price: 4.99
    },
    {
        name: "Market Salad",
        calories: 540,
        carb: 41,
        sodium: 690,
        protein: 28,
        grilled: true,
        vegetarian: true,
        dairyFree: false,
        nutFree: false,
        glutenFree: false,
        price: 9.19
    },
    {
        name: "Waffle Potato Fries",
        calories: 420,
        carb: 50,
        sodium: 240,
        protein: 5,
        grilled: false,
        vegetarian: true,
        dairyFree: true,
        nutFree: true,
        glutenFree: true,
        price: 2.19
    },
    {
        name: "Cookies & Cream Milkshake",
        calories: 630,
        carb: 99,
        sodium: 440,
        protein: 13,
        grilled: false,
        vegetarian: true,
        dairyFree: false,
        nutFree: false,
        glutenFree: false,
        price: 4.29
    }
];

// Utility to get checked values
function getCheckedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(i => i.value);
}

// Utility to get selected radio value
function getRadioValue(name) {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : null;
}

// Recommendation logic
function recommendMenuItems(formData) {
    let filtered = menu.slice();

    // Dietary restrictions
    if (!formData.dietaryRestrictions.includes("None")) {
        if (formData.dietaryRestrictions.includes("Nut-Free")) filtered = filtered.filter(i => i.nutFree);
        if (formData.dietaryRestrictions.includes("Dairy-Free")) filtered = filtered.filter(i => i.dairyFree);
        if (formData.dietaryRestrictions.includes("Gluten-Free")) filtered = filtered.filter(i => i.glutenFree);
        if (formData.dietaryRestrictions.includes("Vegetarian")) filtered = filtered.filter(i => i.vegetarian);
    }

    // Nutritional preferences
    if (!formData.nutritionalPreferences.includes("None")) {
        if (formData.nutritionalPreferences.includes("Low-Calories")) filtered = filtered.filter(i => i.calories < 500);
        if (formData.nutritionalPreferences.includes("High-Calories")) filtered = filtered.filter(i => i.calories > 1000);
        if (formData.nutritionalPreferences.includes("Low-Carb")) filtered = filtered.filter(i => i.carb < 30);
        if (formData.nutritionalPreferences.includes("Low-Sodium")) filtered = filtered.filter(i => i.sodium < 800);
        if (formData.nutritionalPreferences.includes("High-Protein")) filtered = filtered.filter(i => i.protein > 20);
    }

    // Chicken preference
    if (formData.chickenPreference === "Original") filtered = filtered.filter(i => !i.grilled && !i.vegetarian);
    if (formData.chickenPreference === "Grilled") filtered = filtered.filter(i => i.grilled && !i.vegetarian);

    // Budget
    if (formData.budget === "Low") filtered = filtered.filter(i => i.price < 10);
    if (formData.budget === "Medium") filtered = filtered.filter(i => i.price >= 10 && i.price <= 20);
    if (formData.budget === "High") filtered = filtered.filter(i => i.price > 20);

    // Hunger level (just for fun: more hungry = higher calories)
    if (formData.hungerLevel === "Somewhat Hungry") filtered = filtered.filter(i => i.calories < 500);
    if (formData.hungerLevel === "Hungry") filtered = filtered.filter(i => i.calories >= 500 && i.calories < 800);
    if (formData.hungerLevel === "Very Hungry") filtered = filtered.filter(i => i.calories >= 800);

    // Dessert preference
    if (formData.dessertPreference === "Yes") {
        filtered = filtered.filter(i => i.name.toLowerCase().includes("milkshake") || i.name.toLowerCase().includes("dessert"));
    } else if (formData.dessertPreference === "No") {
        filtered = filtered.filter(i => !i.name.toLowerCase().includes("milkshake") && !i.name.toLowerCase().includes("dessert"));
    }

    // If no results, fallback to top 3 by calories
    if (filtered.length === 0) {
        filtered = menu.slice().sort((a, b) => b.calories - a.calories);
    }

    // Return top 3
    return filtered.slice(0, 3);
}

// Show recommendations below the form
function showRecommendations(items) {
    let container = document.getElementById('recommendations');
    if (!container) {
        container = document.createElement('div');
        container.id = 'recommendations';
        container.style.margin = "32px auto";
        container.style.maxWidth = "480px";
        container.style.background = "#fffdfa";
        container.style.border = "2px solid #f7c59f";
        container.style.borderRadius = "14px";
        container.style.boxShadow = "0 2px 12px rgba(229,22,54,0.08)";
        container.style.padding = "24px";
        container.style.textAlign = "center";
        document.body.appendChild(container);
    }
    container.innerHTML = `<h2 style="color:#e51636;">Top 3 Menu Recommendations</h2>` +
        items.map(item => `
            <div style="margin-bottom:18px;">
                <strong style="font-size:1.15em;">${item.name}</strong><br>
                <span style="color:#555;">Calories: ${item.calories} | Protein: ${item.protein}g | $${item.price.toFixed(2)}</span>
            </div>
        `).join('');
}

// Handle form submit
document.getElementById('menu-recommender-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = {
        dietaryRestrictions: getCheckedValues("dietary-restrictions"),
        nutritionalPreferences: getCheckedValues("nutritional-preferences"),
        chickenPreference: getRadioValue("chicken-preference"),
        budget: getRadioValue("budget"),
        hungerLevel: getRadioValue("hunger-level"),
        dessertPreference: getRadioValue("dessert-preference")
    };
    const recommendations = recommendMenuItems(formData);
    showRecommendations(recommendations);
});