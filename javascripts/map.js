const DELIM = '_'
const TRIP_MARKER = ['TRIP', 'MARKER'].join(DELIM);
const PLAN = [TRIP_MARKER, 'PLAN'].join(DELIM);
const INDEXES = [TRIP_MARKER, 'INDEXES'].join(DELIM);
const PLAN_SELECTED = [TRIP_MARKER, 'PLAN_SELCETED'].join(DELIM);

let plan;
let map;
let marker;

function getPlanIndexes() {
    let indexes = window.localStorage.getItem(INDEXES);
    if (!indexes) {
        return [];
    }
    return JSON.parse(indexes);
}

function getPlanKey() {
    return window.localStorage.getItem(PLAN_SELECTED);
}

function getPlan() {
    let key = getPlanKey();
    plan = window.localStorage.getItem(key);
    return JSON.parse(plan);
}

function updatePlan(plan) {
    let index = plan.index;
    let key = getPlanKey(index);
    window.localStorage.setItem(key, JSON.stringify(plan));
}

function removePlan() {
    console.log(plan);
    let index = plan.index;
    let key = getPlanKey();
    let indexes = getPlanIndexes();
    for (var i = 0; i < indexes.length; i++) {
        if (indexes[i] === index) {
            indexes.splice(i, 1);
            break;
        }
    }
    window.localStorage.setItem(INDEXES, JSON.stringify(indexes));
    window.localStorage.removeItem(key);
    location.href = './plan.html';
}

function createPlanInfoHeaderElement(info) {
    let header = document.createElement('div');
    header.className = 'row justify-content-between p-4';

    let emptyDiv = document.createElement('div');
    header.appendChild(emptyDiv);
    emptyDiv.className = 'col col-sm-auto';

    let setting = createSettingElement(info);
    header.appendChild(setting);

    return header;
}

function createSettingElement(info) {
    let div = document.createElement('div');
    div.className = 'col col-sm-auto';

    let setting = document.createElement('div');
    setting.className = 'setting cursor-pointer p-0 m-0';
    div.appendChild(setting);

    let dropDownButton = createDropDownButtonElement(info);
    let dropDown = createDropDownElement(info);

    setting.appendChild(dropDownButton);
    setting.appendChild(dropDown);

    return div;
}

function createDropDownButtonElement(info) {
    let dropDownButton = document.createElement('a');
    dropDownButton.className = 'cursor-pointer';
    dropDownButton.href = '#';
    dropDownButton.role = 'button';
    dropDownButton.setAttribute('data-bs-toggle', 'dropdown');
    dropDownButton.setAttribute('aria-expanded', 'false');

    dropDownButton.appendChild(createSettingSvgElement());

    return dropDownButton;
}

function createSettingSvgElement() {
    return htmlToElement('<svg viewBox="0 0 24 24" width="1.25em" height="1.25em" class="d Vb UmNoP" x="0" y="0"><circle cx="4.5" cy="11.9" r="2.5"></circle><circle cx="19.5" cy="11.9" r="2.5"></circle><circle cx="12" cy="11.9" r="2.5"></circle></svg>');
}

function createDropDownElement(info) {
    let dropDown = document.createElement('ul');
    dropDown.className = 'dropdown-menu p-2';

    let li = document.createElement('li');
    dropDown.appendChild(li);
    let a = document.createElement('a');
    li.appendChild(a);
    a.href = '#';
    a.setAttribute('data-bs-toggle', 'modal');
    a.setAttribute('data-bs-target', '#exampleModal');
    a.addEventListener('click', initChangePlan);
    a.appendChild(document.createTextNode('여행 수정'));

    li = document.createElement('li');
    dropDown.appendChild(li);
    a = document.createElement('a');
    li.appendChild(a);
    a.href = '#';
    a.addEventListener('click', removePlan);
    a.appendChild(document.createTextNode('여행 삭제'));

    return dropDown;
}

function initChangePlan() {
  let modal = document.querySelector('#exampleModal');
  modal.querySelectorAll('input').forEach(input => {
    input.value = plan.info[input.name];
  })
}

function updatePlanClicked(e) {

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

  plan = {
      info: info,
      data: plan.data,
  };

  if (valiated.length == 0) {
      updatePlan(plan);

  }
  else {
      alert('빈 항목을 모두 입력해주세요.');
  }
}

function createPlanInfoTitleElement(info) {
    let title = document.createElement('div');
    title.className = 'card-title ps-4';

    let span = document.createElement('span');
    title.appendChild(span);
    span.className = 'fs-4';

    let b = document.createElement('b');
    span.appendChild(b);
    b.className = 'plan-info-input';
    b.name = 'title'
    b.value = info.title;
    b.setAttribute('value', info.title);
    b.appendChild(document.createTextNode(info.title));

    return title;
}

function createPlanInfoTextElement(info) {
    let text = document.createElement('div');
    text.className = 'card-text ps-4 pe-4';
    text.appendChild(createCardDates(info));
    return text;
}

function createCardDates(info) {

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
            span.setAttribute('value', info[key]);
            span.appendChild(document.createTextNode(info[key]));
        }
    }

    return dates;
}

function createPlanInfoFooterElement(info) {
    let footer = document.createElement('div');
    footer.className = 'footer text-gray p-4';

    let dropdownButton = createFooterDropdownButton();
    let dropdown = createFooterDropdown();

    footer.appendChild(dropdownButton);
    footer.appendChild(dropdown);

    return footer;
}

function createFooterDropdownButton() {
    let dropdownButton = document.createElement('a');
    dropdownButton.className = 'cursor-pointer';
    dropdownButton.href = '#';
    dropdownButton.role = 'button';
    dropdownButton.setAttribute('data-bs-toggle', 'dropdown');
    dropdownButton.setAttribute('aria-expanded', 'false');

    let div = document.createElement('div');
    dropdownButton.appendChild(div);
    div.className = 'fs-6 row p-0 share cursor-pointer';

    div.appendChild(createShareSvg());

    let innerDiv = document.createElement('div');
    innerDiv.className = 'col align-self-center col-sm-auto p-0';
    div.appendChild(document.createTextNode('공유'));

    return dropdownButton;
}

function createShareSvg() {
    return htmlToElement('<svg class="col align-self-center col-sm-auto pe-1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="1em" height="1em"><path d="M 23 3 A 4 4 0 0 0 19 7 A 4 4 0 0 0 19.09375 7.8359375 L 10.011719 12.376953 A 4 4 0 0 0 7 11 A 4 4 0 0 0 3 15 A 4 4 0 0 0 7 19 A 4 4 0 0 0 10.013672 17.625 L 19.089844 22.164062 A 4 4 0 0 0 19 23 A 4 4 0 0 0 23 27 A 4 4 0 0 0 27 23 A 4 4 0 0 0 23 19 A 4 4 0 0 0 19.986328 20.375 L 10.910156 15.835938 A 4 4 0 0 0 11 15 A 4 4 0 0 0 10.90625 14.166016 L 19.988281 9.625 A 4 4 0 0 0 23 11 A 4 4 0 0 0 27 7 A 4 4 0 0 0 23 3 z"/></svg>');
}

function createFooterDropdown() {
    let ul = document.createElement('ul');
    ul.className = 'dropdown-menu p-2';

    let li = document.createElement('li');
    ul.appendChild(li);

    let a = document.createElement('a');
    li.appendChild(a);
    a.href = '#';
    a.appendChild(document.createTextNode('파일로 공유하기'));
    a.addEventListener('click', shareByFile);

    return ul;
}

function shareByFile() {
    let element = document.createElement('a');
    let text = JSON.stringify(plan);
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', plan.info.title + '.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function changePlanInfo() {

}

function createPlanInfoElement(info) {
    let planInfo = document.createElement('div');
    planInfo.className = 'card rounded-0 m-0 p-0 mb-3';

    let header = createPlanInfoHeaderElement(info);
    let title = createPlanInfoTitleElement(info);
    let text = createPlanInfoTextElement(info);
    let footer = createPlanInfoFooterElement(info);

    planInfo.appendChild(header);
    planInfo.appendChild(title);
    planInfo.appendChild(text);
    planInfo.appendChild(footer);

    return planInfo;
}

function initPlanInfo(plan) {
    let parent = document.querySelector('#ui');
    parent.appendChild(createPlanInfoElement(plan.info));
}

function initPlanActivities(plan) {
  for (var data of plan.data) {
    initPlace(data.placeId);
  }
}


function initActivity(formatted) {
  return {
    placeId: formatted.placeId,

    'begin-year': '',
    'begin-day': '',
    'begin-month': '',
    'begin-hour': '',
    'begin-minute': '',

    'end-year': '',
    'end-day': '',
    'end-month': '',
    'end-hour': '',
    'end-minute': '',

    'description': '',
  };
}

async function initMap() {
  // Request needed libraries.
  //@ts-ignore
  const [{ Map }, { AdvancedMarkerElement }] = await Promise.all([
    google.maps.importLibrary("marker"),
    google.maps.importLibrary("places"),
  ]);

  // Initialize the map.
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37.59523, lng: 127.08600 },
    zoom: 13,
    mapId: "4504f8b37365c3d0",
    mapTypeControl: false,
  });

  // Create the input HTML element, and add it to the map as a custom control.
  const input = document.createElement("input");

  input.id = "pac-input";

  //@ts-ignore
  const pac = new google.maps.places.PlaceAutocompleteElement({
    inputElement: input,
  });
  const card = document.getElementById("pac-card");

  card.appendChild(pac.element);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);
  // Create the marker and infowindow
  marker = new google.maps.marker.AdvancedMarkerElement({
    map,
  });

  initPlanActivities(plan);

  // Add the gmp-placeselect listener, and display the results on the map.
  pac.addListener("gmp-placeselect", async ({ place }) => {
    await place.fetchFields({
      fields: ["location"],
    });
    // If the place has a geometry, then present it on a map.
    if (place.viewport) {
      map.fitBounds(place.viewport);
    } else {
      map.setCenter(place.location);
      map.setZoom(17);
    }

    let placeJson = place.toJSON();
    let placeId = placeJson.id;

    addPlace(placeId);

    marker.position = place.location;
  });
}

function addPlace(placeId) {
  var request = {
    placeId: placeId,
    fields: [
      'place_id',
      'name', 
      'photos',
      'rating', 
      'formatted_address', 
      'geometry',
      'user_ratings_total',
    ]
  };
  
  let service = new google.maps.places.PlacesService(map);
  service.getDetails(request, addPlanActivity);
}

function addPlanActivity(place, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    let formatted = formatPlace(place);

    let activityElement = createActivity(formatted);
    document.querySelector('#ui').appendChild(activityElement);
    plan.data.push(initActivity(formatted));
    updatePlan(plan);
  }
}

function initPlace(placeId) {
  var request = {
    placeId: placeId,
    fields: [
      'place_id',
      'name', 
      'photos',
      'rating', 
      'formatted_address', 
      'geometry',
      'user_ratings_total',
    ]
  };
  
  let service = new google.maps.places.PlacesService(map);
  service.getDetails(request, initPlanActivity);
}

function initPlanActivity(place, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    let formatted = formatPlace(place);

    for (var data of plan.data) {
      if (data.placeId == formatted.placeId) {
        formatted['begin-year'] = data['begin-year'];
        formatted['begin-month'] = data['begin-month'];
        formatted['begin-day'] = data['begin-day'];
        formatted['begin-hour'] = data['begin-hour'];
        formatted['begin-minute'] = data['begin-minute'];

        formatted['end-year'] = data['end-year'];
        formatted['end-month'] = data['end-month'];
        formatted['end-day'] = data['end-day'];
        formatted['end-hour'] = data['end-hour'];
        formatted['end-minute'] = data['end-minute'];

        formatted['description'] = data['description'];
      }
    }

    let activityElement = createActivity(formatted);
    document.querySelector('#ui').appendChild(activityElement);
  }
}

function formatPlace(place) {
  return {
    placeId: place.place_id,
    formattedAddress: place.formatted_address,
    lat: place.geometry.location.lat(),
    lng: place.geometry.location.lng(),
    name: place.name,
    photo: place.photos?.length != 0 ? place.photos[0].getUrl() : './assets/beach-nature.png',
    rating: place.rating,
    userRatingsTotal: place.user_ratings_total,
  }
}

function createActivityHeader(formatted) {
  let header = document.createElement('div');
  header.className = 'row justify-content-between px-4 pt-4';

  let title = createActivityTitle(formatted);
  let setting = createAcitivitySetting(formatted);

  header.appendChild(title);
  header.appendChild(setting);

  return header;
}

function createActivityTitle(formatted) {
  let div = document.createElement('div');
  div.className = 'col col-sm-auto';

  let title = document.createElement('div');
  div.appendChild(title);
  title.className = 'card-title';

  let span = document.createElement('span');
  title.appendChild(span);
  span.className = 'fs-4';

  let b = document.createElement('b');
  span.appendChild(b);
  b.className = 'plan-activity-input'
  b.name = 'name';
  b.value = formatted.name;
  b.appendChild(document.createTextNode(formatted.name));

  return div;
}

function createAcitivitySetting(formatted) {
  let div = document.createElement('div');
  div.className = 'col col-sm-auto';

  let setting = document.createElement('div');
  div.appendChild(setting);
  setting.className = 'setting cursor-pointer p-0 m-0';

  let dropdownButton = createActivityDropdownButton(formatted);
  let dropdown = createActivictDropdown(formatted);

  setting.appendChild(dropdownButton);
  setting.appendChild(dropdown);

  return div;
}

function createActivityDropdownButton(formatted) {
  let dropdownButton = document.createElement('a');
  dropdownButton.className = 'cursor-pointer';
  dropdownButton.href = '#'
  dropdownButton.role = 'button'
  dropdownButton.setAttribute('data-bs-toggle', 'dropdown');
  dropdownButton.setAttribute('aria-expanded', 'false');

  dropdownButton.appendChild(createSettingSvg());

  return dropdownButton;
}

function htmlToElement(html) {
  var template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

function createSettingSvg() {
  return htmlToElement('<svg viewBox="0 0 24 24" width="1.25em" height="1.25em" class="d Vb UmNoP" x="0" y="0"><circle cx="4.5" cy="11.9" r="2.5"></circle><circle cx="19.5" cy="11.9" r="2.5"></circle><circle cx="12" cy="11.9" r="2.5"></circle></svg>');
}

function createActivictDropdown(formatted) {
  let dropdown = document.createElement('ui');
  dropdown.className = 'dropdown-menu p-2';

  let li = document.createElement('li');
  // dropdown.appendChild(li);
  let a = document.createElement('a');
  li.appendChild(a);
  a.href = '#';
  a.setAttribute('data-bs-toggle', 'offcanvas');
  a.setAttribute('data-bs-target', '#offcanvasScrolling');
  a.setAttribute('aria-controls', 'offcanvasScrolling');
  a.appendChild(document.createTextNode('메모 수정'));
  a.addEventListener('click', changePlanActivity);

  li = document.createElement('li');
  dropdown.appendChild(li);
  a = document.createElement('a');
  li.appendChild(a);
  a.href = '#';
  a.setAttribute('value', formatted.placeId);
  a.appendChild(document.createTextNode('메모 삭제'));
  a.addEventListener('click', removePlanActivity);

  return dropdown;
}

function changePlanActivity(e) {

}

function getplanActivityIndex(node) {
  return Array.prototype.indexOf.call(node.parentNode.childNodes, node) - 2;
}

function removePlanActivity(e) {
  let card = e.target;
  while (!card.className.includes('card')) {
    card = card.parentNode;
  }
  let index = getplanActivityIndex(card);

  plan.data.splice(index, 1);
  updatePlan(plan);
  location.href = './map.html'
}

function createActivityBody(formatted) {
  let body = document.createElement('div');
  body.className = 'card-text pb-3 ps-4';

  let rating = createActivityRating(formatted);
  body.appendChild(rating);

  let address = document.createElement('div');
  address.className = 'text-muted plan-activity-input'
  address.appendChild(document.createTextNode(formatted.formattedAddress));
  body.appendChild(address);

  let date = createActivityDate(formatted);
  body.appendChild(date);

  let desc = document.createElement('div');
  body.appendChild(desc);
  desc.className = 'description plan-activity-input'
  desc.name = 'description';
  desc.setAttribute('value', '');
  if (formatted.description) {
    desc.setAttribute('value', formatted.description);
    desc.appendChild(document.createTextNode(formatted.description));
  }

  return body;
}

function createActivityRating(formatted) {
  let rating = document.createElement('div');
  rating.className = 'row ps-2';

  let ratingStar = document.createElement('div');
  rating.appendChild(ratingStar);
  ratingStar.className = 'rate d-inline-block col-sm-auto p-0';

  let span = document.createElement('span');
  ratingStar.appendChild(span);
  span.style = 'width: ' + formatted.rating / 5.0 * 100 + "%;";

  let visited = document.createElement("span");
  rating.appendChild(visited);
  visited.className = 'visited col-sm-auto plan-activity-input'

  return rating;
}

function createActivityDate(formatted) {
  let date = document.createElement('div');
  date.className = 'row ps-2';

  for (var i of ['begin', 'end']) {
    if (i != 'begin' && formatted.hasDate) {
      date.appendChild(document.createTextNode('~'));
    }
    for (var j of ['year', 'month', 'day', 'hour', 'moinute']) {
      if (j == 'year') {
        continue;
      }
      else if ((j == 'month' || j == 'day') && formatted.hasDate) {
        date.appendChild(document.createTextNode('-'));
      }
      else if (j == 'hour' && formatted.hasDate) {
        date.appendChild(document.createTextNode(':'));
      }

      let span = document.createElement('span');
      let key = i + '-' + j;
      date.appendChild(span);
      span.className = 'plan-activity-input';
      span.name = key;

      span.setAttribute('value', '');
      if (!formatted.hasDate) {
        continue;
      }
      span.value = info[key];
      span.setAttribute('value', info[key]);
      span.appendChild(document.createTextNode(info[key]));
    }
  }

  return date;
}

function createActivity(formatted) {
  let activity = document.createElement('div');
  activity.className = 'card rounded-0 m-0 p-0 mb-3'

  let img = document.createElement('img')
  activity.appendChild(img);
  img.src = formatted.photo;
  img.className = 'card-img-top card-img-height-2';
  img.alt = 'card-img';

  let header = createActivityHeader(formatted);
  let body = createActivityBody(formatted);

  activity.appendChild(header);
  activity.appendChild(body);

  return activity;
}

initMap();

function init() {
  document.querySelector('#update-plan')
        .addEventListener('click', updatePlanClicked);

  plan = getPlan();
  initPlanInfo(plan);
}

document.onload = init();
