import { invertValue, scaleValue } from "../utils/scale-values";

describe('test scaling fns', () => {
  it('scales to the correct value', () => {
    const freq0 = 10;
    const scaled0 = scaleValue(freq0);
    const inv0 = invertValue(scaled0);

    expect(Math.floor(inv0)).toEqual(freq0);

    const freqA = 440;
    const scaledA = scaleValue(freqA);
    const invA = invertValue(scaledA);
    expect(Math.floor(invA)).toEqual(freqA);


    const freqB = 2200;
    const scaledB = scaleValue(freqB);
    const invB = invertValue(scaledB);
    expect(Math.floor(invB)).toEqual(freqB);
  });
});
