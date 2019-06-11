function mount() {
  document.getElementById('app-a').innerHTML = 'Hello, App A'
}

function unmount() {
  document.getElementById('app-a').innerHTML = ''
}

window['lifecycle'] = {
  mount: mount,
  unmount: unmount
}
