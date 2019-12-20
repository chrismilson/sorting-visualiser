const menu = document.getElementById('menu')
const canvas = document.getElementById('canvas')
canvas.setAttribute('width', screen.width)
canvas.setAttribute('height', screen.height)

document.getElementById('algorithm_list')
  .innerHTML = Object.keys(algorithms).reduce((total, next) => {
    return total + `
      <div
        id="${next.replace(' ', '_')}"
      >
        ${next}
      </div>
    `
  }, '')

Object.keys(algorithms).forEach(name => {
  document.getElementById(name.replace(' ', '_'))
    .onclick = () => setAlgorithm(name)
})

/**
 * Object for keeping track of the different settings.
 */
const buttons = {
  menuToggle: canvas,
  sort: document.getElementById('sort'),
  reset: document.getElementById('reset'),
  speedUp: document.getElementById('speed_up'),
  speedDown: document.getElementById('speed_down'),
  sizeUp: document.getElementById('size_up'),
  sizeDown: document.getElementById('size_down'),
  closeMenu: document.getElementById('close_menu')
}

const settings = {
  speed: {
    element: document.getElementById('speed'),
    value: 3
  },
  size: {
    element: document.getElementById('size'),
    value: 1024
  },
  algorithm: {
    element: document.getElementById('Bubble_Sort'),
    name: 'No Sort'
  }
}

/**
 * Holds the sort object. Initial value is Bubble Sort.
 */
var sort = new Sort(
  null, // set with empty algorithm
  settings.size.value,
  canvas.getContext('2d')
)

sort.render()

/**
 * Keeps track of the state of the menu
 */
var menuVisible = true

/**
 * Holds the value of the animation frame callback.
 *
 * Used when pausing the animation, and is set to zero when not animating.
 */
var sorting = 0

buttons.menuToggle.onclick = () => toggleMenu()

buttons.sort.onclick = () => toggleSort()

buttons.reset.onclick = () => {
  toggleSort(false)
  sort.reset()
  sort.render()
}

buttons.speedUp.onclick = () => speedUp()
buttons.speedDown.onclick = () => speedDown()
buttons.sizeUp.onclick = () => sizeUp()
buttons.sizeDown.onclick = () => sizeDown()

buttons.closeMenu.onclick = () => toggleMenu(false)

settings.speed.element.innerHTML = settings.speed.value
settings.size.element.innerHTML = settings.size.value
setAlgorithm('Quick Sort')

window.addEventListener('keydown', e => {
  console.log(e.keyCode)
  switch (e.keyCode) {
    // right arrow
    case 39:
      sort.next()
      sort.render()
      break

    // left arrow
    case 37:
      sort.prev()
      sort.render()
      break

    // space
    case 32:
      toggleSort()
      break

    // escape key
    case 27:
      toggleMenu()
      break

    // r key
    case 82:
      sort.reset()
      sort.render()
      break

    // up key
    case 38:
      speedUp()
      break

    // down key
    case 40:
      speedDown()
      break

    // n key
    case 78:
      sort.randomise()
      sort.render()
      break

    // i key
    case 73:
      sort.reverse()
      sort.render()
      break

    // w key
    case 87:
      sizeUp()
      break

    // s key
    case 83:
      sizeDown()
      break
  }
})

function toggleMenu (to = !menuVisible) {
  menuVisible = to
  menu.setAttribute(
    'class',
    menuVisible ? 'visible' : 'hidden'
  )
}

function toggleSort (to = !sorting) {
  if (sorting) {
    if (to) return
    buttons.sort.innerHTML = 'Sort'
    window.cancelAnimationFrame(sorting)
    sorting = 0
  } else {
    if (!to) return
    buttons.sort.innerHTML = 'Pause'
    toggleMenu(false)
    const draw = timeStamp => {
      for (var i = 0; i < (1 << settings.speed.value) && sort.next(); i++) sort.next()
      sort.render()
      if (sort.hasNext()) sorting = window.requestAnimationFrame(draw)
      else {
        buttons.sort.innerHTML = 'Sort'
        sorting = 0
      }
    }

    sorting = window.requestAnimationFrame(draw)
  }
}

function speedUp () {
  settings.speed.element.innerHTML = (
    settings.speed.value = Math.min(10, settings.speed.value + 1)
  )
}

function speedDown () {
  settings.speed.element.innerHTML = (
    settings.speed.value = Math.max(1, settings.speed.value - 1)
  )
}

function sizeUp () {
  if (settings.size.value < 1 << 12) {
    settings.size.element.innerHTML = (
      settings.size.value <<= 1
    )
    sort.resize(settings.size.value)
    sort.render()
  }
}

function sizeDown () {
  if (settings.size.value > 8) {
    settings.size.element.innerHTML = (
      settings.size.value >>= 1
    )
    sort.resize(settings.size.value)
    sort.render()
  }
}

function setAlgorithm (name) {
  if (settings.algorithm.name === name) return
  if (name in algorithms) {
    toggleSort(false)
    sort.setAlgorithm(algorithms[name])
    sort.render()

    // unset old
    settings.algorithm.element.setAttribute('class', '')

    // set new
    settings.algorithm.element = document.getElementById(name.replace(' ', '_'))
    settings.algorithm.element.setAttribute('class', 'selected')

    settings.algorithm.name = name
  }
}
