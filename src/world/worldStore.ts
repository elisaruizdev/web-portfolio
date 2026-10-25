/**
 * Estado compartido entre el scroll (WorldJourney) y la escena 3D. Es un objeto mutable a
 * propósito: la cámara lo lee en cada frame sin provocar renders de React.
 */
export const worldStore = {
  /** Índice continuo de parada: 2.4 = 40 % del tramo de la tercera parada */
  progress: 0,
  /** Lado de la tarjeta visible (-1 izquierda, 1 derecha): la isla se encuadra en el contrario */
  side: 0,
};
