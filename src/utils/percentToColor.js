// thanks stackoverflow for this...
// https://stackoverflow.com/questions/17525215/calculate-color-values-from-green-to-red/17527156#17527156

function hslToRgb(h, s, l) {
  let r;
  let g;
  let b;

  function hue2rgb(p, q, t) {
    if (t < 0) t += 1; // eslint-disable-line
    if (t > 1) t -= 1; // eslint-disable-line
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  if (s === 0) {
    r = g = b = l; // eslint-disable-line
  } else {
    hue2rgb();
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
}

const percentToColor = (i) => {
  const hue = i * 1.2 / 360;
  const rgb = hslToRgb(hue, 1, 0.5);
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
};

export default percentToColor;
