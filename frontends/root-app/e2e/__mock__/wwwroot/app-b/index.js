function mount() {
  document.getElementById('app-b').innerHTML = 'Hello, App B'
}

function unmount() {
  document.getElementById('app-b').innerHTML = ''
}

window['lifecycle'] = {
  mount: mount,
  unmount: unmount
}
