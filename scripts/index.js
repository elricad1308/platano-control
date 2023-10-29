
let video
let canvas

const CAM_HEIGHT = 720
const CAM_WIDTH = 720
const amarillo = {
  r: 255,
  g: 255,
  b: 0
}

let distanciaAceptableColor = 150
let sensibilidadGiro = 1.7

function init () {
  mostrarCamara()
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
      console.log('Ooops, hubo un error', err)
    }
  } else {
    console.log('Tu navegador no soporta multimedia')
  }
}

function procesarCamara () {
  const ctx = canvas.getContext('2d')

  ctx.drawImage(video, 0, 0, CAM_WIDTH, CAM_HEIGHT, 0, 0, canvas.width, canvas.height)

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const pixeles = imgData.data

  let pixelMasAmarillo = null
  let menorDistancia = (2 ** 32)

  //let sumaX = 0
  //let sumaY = 0
  //let cuenta = 0

  let platanetes = []

  for (var i = 0; i < pixeles.length; i += 4) {
    const rojo = pixeles[i]
    const verde = pixeles[i + 1]
    const azul = pixeles[i + 2]

    const distancia = Math.sqrt(
      Math.pow(amarillo.r - rojo, 2) 
      + Math.pow(amarillo.g - verde, 2) 
      + Math.pow(amarillo.b - azul, 2)
    )

    

    /*if (distancia < menorDistancia) {
      menorDistancia = distancia

      

      pixelMasAmarillo = { x, y }
    }*/
    if (distancia < distanciaAceptableColor) {
      //pixeles[i] = 255
      //pixeles[i + 1] = 0
      //pixeles[i + 2] = 0

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
      //cuenta++
      //sumaX += x
      //sumaY += y
    }
  }

  ctx.putImageData(imgData, 0, 0)

  platanetes = unirPlatanetes(platanetes)

  let masGrande = null
  let mayorTamano = 0
  platanetes.forEach(x => {
    let area = x.getArea()
    if (area > mayorTamano) {
      masGrande = x
      mayorTamano =  area
    }
  })

  if (masGrande != null) {
    masGrande.dibujar(ctx)
    document.getElementById('info').innerHTML = masGrande.grados

    let base = 270 - (masGrande.grados * -1) * sensibilidadGiro

    document.getElementById('carrito').style.transform = `rotate(${base}deg)`
  }

  /*if (cuenta > 0) {
    ctx.fillStyle = '#00f'
    ctx.beginPath()
    ctx.arc(sumaX / cuenta, sumaY / cuenta, 10, 0, 2 * Math.PI)
    ctx.fill()
  }*/

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
        for (var k = 0; k < platanete2.pixeles.length; k ++) {
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