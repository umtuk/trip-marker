const DELIM = '_'
const TRIP_MARKER = ['TRIP', 'MARKER'].join(DELIM);
const PLAN = [TRIP_MARKER, 'PLAN'].join(DELIM);
const INDEXES = [TRIP_MARKER, 'INDEXES'].join(DELIM);
const PLAN_SELECTED = [TRIP_MARKER, 'PLAN_SELCETED'].join(DELIM);

function getPlanIndexes() {
    let indexes = window.localStorage.getItem(INDEXES);
    if (!indexes) {
        return [];
    }
    return JSON.parse(indexes);
}

function getPlanKey(index) {
    return [PLAN, index].join(DELIM);
}

function getPlan(index) {
    let key = getPlanKey(index);
    let plan = window.localStorage.getItem(key);
    return JSON.parse(plan);
}

function addPlan(plan) {
    let indexes = getPlanIndexes();
    let index = 0;
    if (indexes.length != 0) {
        console.log()
        index = Number(indexes[indexes.length - 1]) + 1;
    }
    let key = getPlanKey(index);
    indexes.push(index);
    plan.index = index;
    window.localStorage.setItem(INDEXES, JSON.stringify(indexes));
    window.localStorage.setItem(key, JSON.stringify(plan));
}

function selectPlan(index) {
    let key = getPlanKey(index);
    window.localStorage.setItem(PLAN_SELECTED, key);
}

function createPlanClicked(e) {

    getPlanIndexes();

    let parent = document.querySelector('#create-plan-input');
    console.log(parent);

    let info = {}
    let valiated = [];
    parent.querySelectorAll('input').forEach(input => {
        if (!input.value) {
            valiated.push(input.name);
        }
        info[input.name] = input.value;
    });

    let data = [];

    let plan = {
        info: info,
        data: data,
    };

    if (valiated.length == 0) {
        addPlan(plan);
        selectPlan(plan.index);
        location.href = './map.html';
    }
    else {
        alert('빈 항목을 모두 입력해주세요.');
    }
}

function createPlanImgElement(plan) {
    let img = document.createElement('img');
    img.className = 'card-img-top cursor-pointer';
    img.src = './assets/beach-nature.png';
    img.setAttribute('art', 'card-img');
    img.setAttribute = './assets/beach-nature.png';
    img.addEventListener('click', forwardPlan);
    return img;
}

function createPlanBodyElement(plan) {
    let body = document.createElement('div');
    body.className = 'card-body';

    let inputindex = createInputIndexElement(plan);
    let cardTitle = createCardTitlElement(plan);
    let cardText = createCardTextElement(plan);;

    body.appendChild(inputindex);
    body.appendChild(cardTitle);
    body.appendChild(cardText);

    return body;
}

function createInputIndexElement(plan) {
    let inputIndex = document.createElement('input');
    inputIndex.className = 'plan-input';
    inputIndex.setAttribute('type', 'hidden')
    inputIndex.name = 'index'
    inputIndex.value = plan.index;
    return inputIndex;
}

function createCardTitlElement(plan) {
    let cardTitle = document.createElement('div');
    cardTitle.className = 'card-title';

    let title = document.createElement('a');
    cardTitle.appendChild(title);
    title.href = '#';
    title.addEventListener('click', forwardPlan);

    let bold = document.createElement('b');
    title.appendChild(bold);
    bold.className = 'plan-input'
    bold.name = 'title'
    bold.value = plan.info.title;
    bold.appendChild(document.createTextNode(plan.info.title));

    return cardTitle;
}

function createCardTextElement(plan) {
    let cardText = document.createElement('div');
    cardText.className = 'card-text';

    let dates = createCardDates(plan);
    cardText.appendChild(dates);

    let includes = document.createElement('small')
    cardText.appendChild(includes);
    includes.className = 'text-muted';
    includes.appendChild(document.createTextNode('포함: '))
    includes.appendChild(document.createTextNode(plan.data.length));
    includes.appendChild(document.createTextNode('개의 항목'))

    return cardText;
}

function createCardDates(plan) {

    let dates = document.createElement('div')

    for (var i of ['begin', 'end']) {
        if (i != 'begin') {
            dates.appendChild(document.createTextNode('~'));
        }

        for (var j of ['year', 'month', 'day']) {
            if (j != 'year') {
                dates.appendChild(document.createTextNode('-'));
            }

            let span = document.createElement('span');
            let key = i + '-' + j;
            dates.appendChild(span);
            span.className = 'plan-input';
            span.name = key;
            span.value = plan.info[key];
            span.appendChild(document.createTextNode(plan.info[key]));
        }
    }

    return dates;
}


function createPlanElement(plan) {
    let card = document.createElement('div');
    card.className = 'm-2 p-0 card plan-card col'

    card.appendChild(createPlanImgElement(plan));
    card.appendChild(createPlanBodyElement(plan));

    return card;
}

function forwardPlan(e) {
    let parent = e.target;
    while (!parent.className.includes('plan-card')) {
        parent = parent.parentNode;
    }
    let index = parent.querySelector("input[name='index']");
    selectPlan(index.value);
    location.href = './map.html';
}

async function createPlanByFile(e) {
    let parent = e.target.parentNode;
    let value = parent.querySelector('input').value;
    let str = await parent.querySelector('input').files[0]?.text();
    let plan = JSON.parse(str);
    addPlan(plan);
    selectPlan(plan.index);
    location.href = './map.html';
}

function openTextFile() {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = "text/plain"; // 확장자가 xxx, yyy 일때, ".xxx, .yyy"
    input.onchange = function (event) {
        processFile(event.target.files[0]);
    };
    input.click();
}
function processFile(file) {
    return new Promise((resolve, reject) => {

        let reader
    })
}

function initPlans() {
    let indexes = getPlanIndexes();
    let parent = document.querySelector('#plan-list');
    for (var index of indexes) {
        let plan = getPlan(index);
        let element = createPlanElement(plan);
        parent.appendChild(element);
    }
}

function init() {
    document.querySelector('#create-plan-by-file')
        .addEventListener('click', createPlanByFile);

    document.querySelector('#create-plan')
        .addEventListener('click', createPlanClicked);

    initPlans();
}

document.onload = init();