if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker
      .register(window.location.href + 'sw.js')
      .then((res) => console.log('service worker registered'))
      .catch((err) => console.log('service worker not registered', err));
  });
}

// if (
//   navigator.mediaDevices &&
//   typeof navigator.mediaDevices.getUserMedia === 'function'
// ) {
async function request(lat, lon) {
  const responseRaw = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=6c33a3749e5e40898eed1e50fe694d60&units=metric`
  );

  const response = await responseRaw.json();

  return response;
}

function setAlerts(response) {
  const containerAlert = document.querySelector('[data-alerts]');

  if (!response?.alerts?.length) {
    const div = document.createElement('div');
    div.classList.add('alert');
    div.classList.add('alert-success');

    div.innerHTML = 'Não há alertas para a sua localização';
    containerAlert.appendChild(div);

    return;
  }

  for (let index = 0; index < response?.alerts?.length; index++) {
    const element = response.alerts[index];
    const div = document.createElement('div');
    div.classList.add('alert');
    div.classList.add('alert-danger');

    div.innerHTML = element.description;
    containerAlert.appendChild(div);
  }
}

function setTemperature(response) {
  const containerAlert = document.querySelector('[data-temperature]');

  const div = document.createElement('div');

  div.innerHTML = `
      <p>Temperatura atual: ${response.current.temp}°C</p>
      <p>Sensação térmica: ${response.current.feels_like}°C</p>
    `;
  containerAlert.appendChild(div);
}

function setLocation(response) {
  const containerAlert = document.querySelector('[data-location]');

  const div = document.createElement('div');

  div.innerHTML = `latitude: ${response.lat}, longitude: ${response.lon}`;
  containerAlert.appendChild(div);
}

async function getPosition(geolocation) {
  const { coords } = geolocation;

  localStorage.setItem(
    'coords',
    JSON.stringify({
      latitude: coords.latitude,
      longitude: coords.longitude,
    })
  );
  appends(coords);
}

function clear() {
  document.querySelector('[data-location]').innerHTML = '';
  document.querySelector('[data-temperature]').innerHTML = '';
  document.querySelector('[data-alerts]').innerHTML = '';

  document.querySelector('[data-main]').classList.add('opacity-0');
  document.querySelector('[data-loading]').classList.remove('d-none');

  document.querySelector('[data-error]').classList.add('d-none');
}

function error() {
  document.querySelector('[data-main]').classList.add('opacity-0');
  document.querySelector('[data-loading]').classList.add('d-none');
  document.querySelector('[data-error]').classList.remove('d-none');
}

async function appends(coords) {
  try {
    const response = await request(coords.latitude, coords.longitude);

    document.querySelector('[data-error]').classList.add('d-none');
    document.querySelector('[data-main]').classList.remove('opacity-0');
    document.querySelector('[data-loading]').classList.add('d-none');

    setAlerts(response);
    setTemperature(response);
    setLocation(response);

    document.querySelector('[data-reload]').classList.add('d-none');
  } catch (e) {
    console.log('e:::', e);
    error();
  }
}

async function main() {
  const coords = localStorage.getItem('coords');
  // const coords = JSON.stringify({
  //   latitude: -23.5937959,
  //   longitude: -48.0175139,
  // });

  if (coords) {
    appends(JSON.parse(coords));
  } else if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getPosition);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  main();
});

document.querySelector('[data-reload]').addEventListener('click', function () {
  clear();
  main();
});
// }
