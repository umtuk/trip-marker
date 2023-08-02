function createPlan(e) {
    location.href = './map.html';
}

function getPlan(e) {
    location.href = './map.html';
}

document.querySelectorAll('button.create-btn').forEach(el => {
    el.addEventListener('click', createPlan);
});

document.querySelectorAll('div.saved-plan-card').forEach(el => {
    el.addEventListener('click', getPlan);
});