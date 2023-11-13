class Platanete {

  grados = 0

  pixeles = []

  width = 0
  height = 0

  xMinima = 0
  yMinima = 0
  xMaxima = 0
  yMaxima = 0

  constructor (x, y) {
    this.agregarPixel(x, y)

    this.xMinima = x
    this.xMaxima = x
    this.yMinima = y
    this.yMaxima = y

    this.width = 1
    this.height = 1
  }

  agregarPixel (x, y) {
    this.pixeles.push({ x, y })

    this.xMinima = x < this.xMinima ? x : this.xMinima
    this.xMaxima = x > this.xMaxima ? x : this.xMaxima
    this.yMinima = y < this.yMinima ? y : this.yMinima
    this.yMaxima = y > this.yMaxima ? y : this.yMaxima

    this.width = this.xMaxima - this.xMinima
    this.height = this.yMaxima - this.yMinima
  }

  dibujar (ctx) {
    const x = this.xMinima
    const y = this.yMinima

    ctx.strokeStyle = '#f00'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.rect(x, y, this.width, this.height)
    ctx.stroke()

    let centroX = x + (this.width / 2)
    let centroY = y + (this.height / 2)

    ctx.beginPath()
    ctx.fillStyle = '#00f'
    ctx.arc(centroX, centroY, 5, 0, 2 * Math.PI)
    ctx.fill()

    let sumaYIzq = 0
    let sumaYDer = 0
    let cuentaYIzq = 0
    let cuentaYDer = 0

    this.pixeles.forEach(pixel => {
      if (pixel.x <= (x + (this.width * 0.1))) {
        sumaYIzq += pixel.y
        cuentaYIzq++
      } else if (pixel.x >= (x + (this.width * 0.9))) {
        sumaYDer += pixel.y
        cuentaYDer++
      }
    })

    let yIzq = sumaYIzq / cuentaYIzq
    let yDer = sumaYDer / cuentaYDer

    ctx.beginPath()
    ctx.fillStyle = '#00f'
    ctx.arc(x, yIzq, 5, 0, 2 * Math.PI)
    ctx.fill()

    ctx.beginPath()
    ctx.fillStyle = '#00f'
    ctx.arc(this.xMaxima, yDer, 5, 0, 2 * Math.PI)
    ctx.fill()

    ctx.beginPath()
    ctx.strokeStyle = '#0f0'
    ctx.moveTo(this.xMinima, yIzq)
    ctx.lineTo(this.xMaxima, yDer)
    ctx.stroke()

    let diffY = yDer - yIzq
    let diffX = this.xMaxima - this.xMinima
    let radianes = Math.atan(diffY / diffX)
    let grados = radianes * (180 / Math.PI)
    this.grados = Math.round(grados)
  }

  estaCerca (x, y) {
    let estaCerca = false

    if (x >= this.xMinima && x <= this.xMaxima
      && y >= this.yMinima && y <= this.yMaxima) {
      estaCerca = true
    } else {
      let distX = 0
      let distY = 0

      if (x < this.xMinima) {
        distX = this.xMinima - x
      } else if (x > this.xMaxima) {
        distX = x - this.xMaxima
      }

      if (y < this.yMinima) {
        distY = this.yMinima - y
      } else if (y > this.yMaxima) {
        distY = y - this.yMaxima
      }

      estaCerca = distX + distY < 50
    }

    return estaCerca
  }

  getArea () {
    return this.width * this.height
  }

  seIntersecta (otroPlatanete) {
    return this.xMinima < otroPlatanete.xMaxima
      && this.xMaxima > otroPlatanete.xMinima
      && this.yMinima < otroPlatanete.yMaxima
      && this.yMaxima > otroPlatanete.yMinima
  }
}