let video
let canvas
let modal
let controlesInvertidos = 1
let distanciaAceptableColor = 150
let sensibilidadGiro = 1.9

let inputSensibilidad
let spanSensibilidad
let spanComando

let ultimaURL = null

const CAM_HEIGHT = 720
const CAM_WIDTH = 720

const comandos = {
  NINGUNO: 0,
  IZQUIERDA: 1,
  DERECHA: 2,
  ARRIBA: 3,
  ABAJO: 4,
  BOTON_A: 5,
  BOTON_B: 6,
  BOTON_START: 7
}

const AMARILLO = {
  r: 255,
  g: 255,
  b: 0
}

function init () {
  modal = {
    self: new bootstrap.Modal(document.getElementById('modal')),
    body: document.getElementById('modal-body'),
    title: document.getElementById('modal-title')
  }

  inputSensibilidad = document.getElementById('inp-sensibilidad')
  spanSensibilidad = document.getElementById('spn-sensibilidad')
  spanComando = document.getElementById('p-comando')

  inputSensibilidad.addEventListener('change', () => {
    const val = inputSensibilidad.value / 1000
    sensibilidadGiro = val
    spanSensibilidad.innerText = `Sensibilidad: ${val}`
  })

  document.getElementById('inp-invertido').addEventListener('change', () => {
    controlesInvertidos = document.getElementById('inp-invertido').checked ? -1 : 1
  })

  mostrarCamara()
}

async function enviarMovimiento (platanete) {
  let grados = platanete.grados
  let yMinima = platanete.yMinima
  let movimiento = null
  spanComando.innerText = "Comando: "

  // Moverse izquierda-derecha
  if (grados <= -15) {
    spanComando.innerText += "DERECHA"
    movimiento = comandos.DERECHA
  } else if (grados >= 15) {
    spanComando.innerText += "IZQUIERDA"
    movimiento = comandos.IZQUIERDA
  } else {
    spanComando.innerText += "NINGUNO"
    movimiento = comandos.NINGUNO
  }

  // Saltar
  let saltar = 0
  if (yMinima <= 45 * sensibilidadGiro) {
    saltar = 1
  }

  let ancho = platanete.xMaxima - platanete.xMinima
  let acelerar = 0
  if (ancho >= 200) {
    acelerar = 1
  }

  let url = `http://localhost:3000?move=${movimiento}&jump=${saltar}&accel=${acelerar}`

  if (ultimaURL != url) {
    ultimaURL = url
    await fetch(ultimaURL)
  }

  
}

async function mostrarCamara () {
  video = document.getElementById('video')
  canvas = document.getElementById('canvas')

  const opciones = {
    audio: false,
    video: {
      width: CAM_WIDTH,
      height: CAM_HEIGHT
    }
  }

  if (navigator.mediaDevices.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(opciones)
      video.srcObject = stream
      procesarCamara()
    } catch (err) {
      modal.title.innerText = 'Error'
      modal.body.innerHTML = `<p>Ooops! Ocurrió un error:<br>${err}</p>`
      modal.self.show()
    }
  } else {
    modal.title.innerText = 'Error'
    modal.body.innerHTML = `<p>Tu navegador no soporta el uso de webcams</p>`
    modal.self.show()
  }
}

function procesarCamara () {
  const ctx = canvas.getContext('2d')

  ctx.drawImage(video, 0, 0, CAM_WIDTH, CAM_HEIGHT, 0, 0, canvas.width, canvas.height)

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const pixeles = imgData.data

  let platanetes = []

  for (var i = 0; i < pixeles.length; i += 4) {
    const rojo = pixeles[i]
    const verde = pixeles[i + 1]
    const azul = pixeles[i + 2]

    const distancia = Math.sqrt(
      Math.pow(AMARILLO.r - rojo, 2) 
      + Math.pow(AMARILLO.g - verde, 2) 
      + Math.pow(AMARILLO.b - azul, 2)
    )

    if (distancia < distanciaAceptableColor) {
      const y = Math.floor(i / 4 / canvas.width)
      const x = (i / 4) % canvas.width

      if (platanetes.length == 0) {
        platanetes.push(new Platanete(x, y))
      } else {
        let encontrado = false

        for (var j = 0; j < platanetes.length; j++) {
          if (platanetes[j].estaCerca(x, y)) {
            platanetes[j].agregarPixel(x, y)
            encontrado = true
            break
          } 
        }

        if (!encontrado) {          
          platanetes.push(new Platanete(x, y))
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0)

  platanetes = unirPlatanetes(platanetes)

  let masGrande = null
  let mayorTamano = 0

  platanetes.forEach(x => {
    let area = x.getArea()
    if (area > 1500 && area > mayorTamano) {
      masGrande = x
      mayorTamano = area
    }
  })

  if (masGrande != null) {
    masGrande.dibujar(ctx)

    let grados = 270 - (masGrande.grados * controlesInvertidos) * sensibilidadGiro
    document.getElementById('p-angulo').innerHTML = `Ángulo: ${masGrande.grados}`
    document.getElementById('carrito').style.transform = `rotate(${grados}deg)`
    enviarMovimiento(masGrande)
  }

  setTimeout(procesarCamara, 20)
}

function unirPlatanetes (platanetes) {
  let salir = false

  for (var i = 0; i < platanetes.length; i ++) {
    for (var j = 0; j < platanetes.length; j ++) {
      if (i == j) continue

      let platanete1 = platanetes[i]
      let platanete2 = platanetes[j]

      if (platanete1.seIntersecta(platanete2)) {
        for (var k = 0; k < platanete2.pixeles.length; k++) {
          let pixel = platanete2.pixeles[k]
          platanete1.agregarPixel(pixel.x, pixel.y)
        }

        platanetes.splice(j, 1)
        salir = true
        break
      }
    }

    if (salir) break
  }

  if (salir) {
    return unirPlatanetes(platanetes)
  } else {
    return platanetes
  }
}

window.addEventListener('load', init)