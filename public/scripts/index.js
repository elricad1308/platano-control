/**
 * Referencia al elemento <video> que captura la imagen de la cámara.
 * 
 * @type {HTMLVideoElement}
 */
let video

/**
 * Referencia al elemento <canvas> dónde se dibuja la imagen de la
 * cámara y la línea de control del juego.
 * 
 * @type {HTMLCanvasElement}
 */
let canvas

/**
 * Objeto con la referencia al modal de Bootstrap.
 * 
 * @type {Object}
 */
let modal

let controlesInvertidos = 1

/**
 * Umbral de distancia aceptable para que un píxel sea considerado
 * como del color que se está detectando.
 * 
 * @type {Number}
 */
let distanciaAceptableColor = 150


/**
 * Umbral de distancia aceptable hacia la parte superior e inferior
 * de la pantalla. Si el centro del platanete se encuentra dentro del
 * área definida por este umbral, se aplica el comando apropiado para
 * el juego.
 * 
 * @type {Number}
 */
let sensibilidadVertical = 1.9


/**
 * Umbral de distancia aceptable hacia la parte izquierda y derecha
 * de la pantalla. Si el centro del platanete se encuentra dentro del
 * área definida por este umbral, se aplica el comando apropiado para
 * el juego.
 * 
 * @type {Number}
 */
let sensibilidadHorizontal = 1.9

/**
 * Juego que se está emulando. Los comandos utilizados son
 * diferentes dependiendo del juego.
 * 
 * @type {String}
 */
let game = 'world'

/**
 * Umbral de distancia aceptable hacia las partes  izquierda y derecha 
 * de la pantalla. Este valor se combina con la sensibilidad  horizontal
 * para determinar el área sensible.
 * 
 * @type {Number}
 */
let umbralHorizontal = Math.floor(45 * 1.9)

/**
 * Umbral de distancia aceptable hacia las partes superior e inferior
 * de la pantalla. Este valor se combina con la sensibilidad vertical
 * para determinar el área sensible.
 * 
 * @type {Number}
 */
let umbralVertical = Math.floor(45 * 1.9)

let inputSensibilidadY
let inputSensibilidadX
let spanSensibilidad
let spanComando

/**
 * Referencia a la URL a la que se realizó una solicitud por última
 * vez.
 * 
 * Para mejorar la eficiencia, si un comando se repite constantemente,
 * no es necesario realizar una nueva solicitud para continuar con su
 * ejecución.
 * 
 * @type {String}
 */
let ultimaURL = null

/**
 * Altura del área en dónde se dibuja la imagen capturada por la cámara.
 * 
 * @type {Number}
 */
const CAM_HEIGHT = 720

/**
 * Ancho del área en dónde se dibuja la imagen capturada por la cámara.
 * 
 * @type {Number}
 */
const CAM_WIDTH = 720

/**
 * Objeto con los comandos que se pueden realizar en el juego.
 * Estos corresponden al gamepad de un Game Boy Advance (cruceta
 * direccional, A, B y Start).
 * 
 * @type {Object}
 */
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

/**
 * Color que el programa está configurado para detectar en la imagen
 * de la cámara.
 * 
 * @type {Object}
 */
const COLOR_DETECTABLE = {
  r: 255,
  g: 255,
  b: 0
}


function init () {
  // Crea el modal de bootstrap
  modal = {
    self: new bootstrap.Modal(document.getElementById('modal')),
    body: document.getElementById('modal-body'),
    title: document.getElementById('modal-title')
  }

  inputSensibilidadY = document.getElementById('inp-sensibilidad-y')
  inputSensibilidadX = document.getElementById('inp-sensibilidad-x')
  spanSensibilidad = document.getElementById('spn-sensibilidad')
  spanComando = document.getElementById('p-comando')

  document.getElementById('inp-invertido').addEventListener('change', () => {
    controlesInvertidos = document.getElementById('inp-invertido').checked ? -1 : 1
  })

  mostrarCamara()
  events()
}

/**
 * Cambia los componentes del color detectable (rojo, verde y azul)
 * para detectar un color diferente en la imagen de la cámara.
 */
function cambiarColorDetectable () {
  const color = document
    .querySelector('input[name="rad-color"]:checked').value

  switch (color) {
    case 'yellow':
      COLOR_DETECTABLE.r = 255
      COLOR_DETECTABLE.g = 255
      COLOR_DETECTABLE.b = 0
      break

    case 'green':
      COLOR_DETECTABLE.r = 0
      COLOR_DETECTABLE.g = 255
      COLOR_DETECTABLE.b = 0
      break

    case 'red':
      COLOR_DETECTABLE.r = 255
      COLOR_DETECTABLE.g = 0
      COLOR_DETECTABLE.b = 0
      break

    case 'blue':
      COLOR_DETECTABLE.r = 0
      COLOR_DETECTABLE.g = 0
      COLOR_DETECTABLE.b = 255
      break
  }
}

/**
 * Envía un movimiento al servidor para ejecutarlo en el juego.
 * 
 * El movimiento se determina a partir del "platanete", que es un objeto
 * detectado por la cámara que tiene, entre otras cosas, un área,
 * posición e inclinación. Estos atributos se usan para crear una
 * URL que se envía al servidor mediante GET, y que contiene los
 * movimientos a realizar como parámetros de la solicitud.
 * 
 * @param {Platanete} platanete - Platanete detectado por la cámara.
 *   Usualmente, este es el platanete más grande detectado.
 * 
 * @returns {Promise} - Promesa que se resuelve cuando la solicitud
 *  al servidor se ha completado.
 */
async function enviarMovimiento (platanete) {
  // Obtiene los atributos del platanete que se transformarán en
  // comandos para el juegos.
  let grados = platanete.grados
  let xCentro = platanete.xCentro
  let yCentro = platanete.yCentro


  let movimiento = {
    x: comandos.NINGUNO,
    y: comandos.NINGUNO,
    a: comandos.NINGUNO,
    b: comandos.NINGUNO,
    start: comandos.NINGUNO
  }
  spanComando.innerText = "Comando: "

  // Inclinación
  if (grados <= -15) {
    spanComando.innerText += "A"
    movimiento.a = comandos.BOTON_A
  } else if (grados >= 15) {
    spanComando.innerText += "B"
    movimiento.b = comandos.BOTON_B
  } 

  // Movimiento horizontal
  if (xCentro <= umbralHorizontal) {
    spanComando.innerText += " DERECHA"
    movimiento.x = comandos.DERECHA
  } else if (xCentro >= canvas.width - umbralHorizontal) {
    spanComando.innerText += " IZQUIERDA"
    movimiento.x = comandos.IZQUIERDA
  }

  // Movimiento vertical
  let saltar = 0
  if (yCentro <= umbralVertical) {
    spanComando.innerText += " ARRIBA"
    movimiento.y = comandos.ARRIBA
  } else if (yCentro >= canvas.height - umbralVertical) {
    spanComando.innerText += " ABAJO"
    movimiento.y = comandos.ABAJO
  }

  // Start
  let ancho = platanete.xMaxima - platanete.xMinima
  if (ancho > 1000) {
    spanComando.innerText += " START"
    movimiento.start = comandos.BOTON_START
  }

  let url = `http://localhost:3000`
    + `?game=${game}`
    + `&x=${movimiento.x}`
    + `&y=${movimiento.y}`
    + `&a=${movimiento.a}`
    + `&b=${movimiento.b}`
    + `&start=${movimiento.start}`

  if (ultimaURL != url) {
    ultimaURL = url
    await fetch(ultimaURL)
  }  
}

/**
 * Asigna a los componentes de la interfaz sus manejadores de eventos.
 */
function events () {
  // Cambia el color detectable al seleccionar un radio de color
  document.querySelectorAll('input[name="rad-color"]')
    .forEach(radio => {
      radio.addEventListener('change', cambiarColorDetectable)
    })

  // Cambia el conjunto de comandos al seleccionar un radio de juevo
  document.querySelectorAll('input[name="rad-game"]')
    .forEach(radio => {
      radio.addEventListener('change', () => {
        game = document
          .querySelector('input[name="rad-game"]:checked').value
      })
    })

  // Ajusta la sensibilidad vertical
  inputSensibilidadY.addEventListener('change', () => {
    const val = inputSensibilidadY.value / 1000
    sensibilidadVertical = val
    umbralVertical = Math.floor(45 * val)
    spanSensibilidad.innerText = `Sensibilidad: ${sensibilidadHorizontal}x, ${sensibilidadVertical}y`
  })
  
  // Ajusta la sensibilidad horizontal
  inputSensibilidadX.addEventListener('change', () => {
    const val = inputSensibilidadX.value / 1000
    sensibilidadHorizontal = val
    umbralHorizontal = Math.floor(45 * val)
    spanSensibilidad.innerText = `Sensibilidad: ${sensibilidadHorizontal}x, ${sensibilidadVertical}y`
  })
}

/**
 * Inicializa la captura de imágenes desde la cámara del dispositivo
 */
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

  // Verifica si el navegador cuenta con soporte para el uso de la cámara
  if (navigator.mediaDevices.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(opciones)
      video.srcObject = stream

      // Inicia con el procesamiento de la imagen
      procesarImagen()
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

/**
 * Realiza el procesamiento de la imagen
 */
function procesarImagen () {
  // El contexto es usado para dibujar en el canvas
  const ctx = canvas.getContext('2d')

  // Dibuja la imagen de la cámara en el canvas
  ctx.drawImage(video, 0, 0, CAM_WIDTH, CAM_HEIGHT, 0, 0, canvas.width, canvas.height)

  // Extrae los píxeles de la imagen. La imagen se representa como un
  // arreglo de enteros, dónde cada 4 números representan los componentes
  // de color de un píxel (rojo, verde, azul y alfa).
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const pixeles = imgData.data

  // Este arreglo almacena los 'platanetes', u objetos del color 
  // detectable que serán reconocidos en la imagen
  let platanetes = []

  // Procesa cada píxel de la imagen
  for (var i = 0; i < pixeles.length; i += 4) {
    const rojo = pixeles[i]
    const verde = pixeles[i + 1]
    const azul = pixeles[i + 2]   

    // Calcula qué tan parecido es el pixel al color detectable, usando
    // el error cuadrático medio (MSE)
    const distancia = Math.sqrt(
      Math.pow(COLOR_DETECTABLE.r - rojo, 2) 
      + Math.pow(COLOR_DETECTABLE.g - verde, 2) 
      + Math.pow(COLOR_DETECTABLE.b - azul, 2)
    )

    // Si el píxel se encuentra dentro de la distancia aceptable al color
    // detectable, se procesa. De lo contrario, se descarta.
    if (distancia < distanciaAceptableColor) {
      // Calcula la coordenada (x, y) del pixel
      const y = Math.floor(i / 4 / canvas.width)
      const x = (i / 4) % canvas.width

      // Si no hay platanetes, significa que es el primer pixel del color
      // detectable encontrado. Se crea un nuevo platanete.
      if (platanetes.length == 0) {
        platanetes.push(new Platanete(x, y))
      // Si ya existen platanetes, hay que determinar si el píxel
      // detectado se encuentra lo suficientemente cerca de un platanete,
      // o de lo contrario, debe considerarse como un platanete distinto.
      } else {
        let encontrado = false

        // Recorre todos los platanetes detectados.
        for (var j = 0; j < platanetes.length; j++) {
          // Si el píxel se encuentra cerca de un platanete, se agrega
          // a éste como un pixel más
          if (platanetes[j].estaCerca(x, y)) {
            platanetes[j].agregarPixel(x, y)
            encontrado = true
            break
          } 
        }

        // Si el pixel detectado se encuentra lo suficientemente lejos
        // de todos los platanetes, se considera un platanete distinto.
        if (!encontrado) {          
          platanetes.push(new Platanete(x, y))
        }
      }
    }
  }

  // Dibuja los platanetes en el canvas
  ctx.putImageData(imgData, 0, 0)

  // Dibuja el área sensible horizontal de la pantalla
  ctx.fillStyle = 'rgba(0, 0, 255, 0.15)'
  ctx.fillRect(0, 0, umbralHorizontal, canvas.height)
  ctx.fillRect(canvas.width - umbralHorizontal, 0, canvas.width, canvas.height)

  // Dibuja el área sensible vertical de la pantalla
  ctx.fillStyle = 'rgba(255, 0, 0, 0.15)'
  ctx.fillRect(0, 0, canvas.width, umbralVertical)
  ctx.fillRect(0, canvas.height - umbralVertical, canvas.width, canvas.height)

  // Analiza todos los platanetes encontrados para combinar aquellos que
  // se intersectan, y hacer más eficiente el procesamiento.
  platanetes = unirPlatanetes(platanetes)

  let masGrande = null
  let mayorTamano = 0

  // Busca el platanete más grande, que será el que se use para el
  // control del juego.
  platanetes.forEach(x => {
    let area = x.getArea()
    // Sólo los platanetes con un área mayor a 1500 píxeles cuadrados
    // son considerados.
    if (area > 1500 && area > mayorTamano) {
      masGrande = x
      mayorTamano = area
    }
  })

  // Si se encuentra un platanete con las características deseadas, se
  // dibuja en el canvas para representar el área de control.
  if (masGrande != null) {
    masGrande.dibujar(ctx)

    // Calcula el ángulo de giro a partir de la orientación del platanete
    // más grande, tomando en cuenta si los controles están invertidos
    // y la sensibilidad deseada.
    let grados = 270 - (masGrande.grados * controlesInvertidos) * sensibilidadVertical

    // Despliega la información del control en la interfaz
    document.getElementById('p-angulo').innerHTML = `Ángulo: ${masGrande.grados}`
    document.getElementById('carrito').style.transform = `rotate(${grados}deg)`

    // Envía el movimiento al servidor para que se ejecute en el juego
    enviarMovimiento(masGrande)
  }

  // To-Do: probar qué función tiene un mejor desempeño!
  requestAnimationFrame(procesarImagen)
  // setTimeout(procesarImagen, 20)
}

/**
 * Combina los platanetes que se intersectan.
 * 
 * Este método se llama recursivamente, combinando platanetes que se
 * intersectan hasta que todos los platanetes sean independientes.
 * 
 * @param {Array} platanetes - Arreglo de platanetes a combinar
 * 
 * @returns {Array} - Arreglo de platanetes independientes
 */
function unirPlatanetes (platanetes) {
  let salir = false

  // Recorre todos los platanetes
  for (var i = 0; i < platanetes.length; i ++) {
    for (var j = 0; j < platanetes.length; j ++) {
      // Todo platanete se intersecta consigo mismo
      if (i == j) continue

      let platanete1 = platanetes[i]
      let platanete2 = platanetes[j]

      // Si dos platanetes se intersectan, se combinan en uno solo
      if (platanete1.seIntersecta(platanete2)) {
        // Agrega al primer platanete todos los pixeles del segundo
        for (var k = 0; k < platanete2.pixeles.length; k++) {
          let pixel = platanete2.pixeles[k]
          platanete1.agregarPixel(pixel.x, pixel.y)
        }

        // Elimina al segundo platanete del arreglo
        platanetes.splice(j, 1)
        salir = true
        break
      }
    }

    // Para mayor eficiencia, si ya se combinaron dos platanetes, se
    // sale del ciclo para empezar de nuevo
    if (salir) break
  }

  // Si se combinaron dos platanetes, se vuelve a llamar a la función
  // para combinar los platanetes restantes de manera recursiva
  if (salir) {
    return unirPlatanetes(platanetes)
  // De lo contrario, se considera que ya todos los platanetes son
  // independientes, por lo que la ejecución termina
  } else {
    return platanetes
  }
}

window.addEventListener('load', init)
