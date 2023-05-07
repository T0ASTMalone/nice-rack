const a = 50; // adjust as needed
const b = 1; // adjust as needed

// Calculate the scaled x-value using the logarithmic function
export function scaleValue(x: number) {
  return a * Math.log(b * x + 1);
}

// Calculate the inverted x-value using the inverse of the logarithmic function
export function invertValue(scaledValue: number) {
  return (Math.exp(scaledValue / a) - 1) / b;
}
