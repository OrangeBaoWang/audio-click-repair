export const bufferSize = 1024
export const fftSize = bufferSize / 2
export const overlap = 50
export const clickLength = 1000 / (overlap ^ 2) // discovered through trial and error
