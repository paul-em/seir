import SeirModel from '../src/index';


test('SeirModel', () => {
  const model = new SeirModel({
    r0: 2.2,
    dDeath: 32 - 2.9,
    dIncubation: 5.2,
    dInfectious: 2.9,
    dRecoveryMild: 14 - 2.9,
    dRecoveryServere: 31.5 - 2.9,
    dHospitalLag: 5,
    cfr: 0.02,
    pServere: 0.2,
    dt:2,
  });
  const result = model.calculate({
    population: Math.exp(Math.log(7e6)),
    initiallyInfected: 1,
    r0ReductionDay: 100,
    r0ReductionPercent: 2/3 * 100,
  });
  expect(result.length).toBe(110);
  const lastItem = result[result.length - 1];
  expect(lastItem.deaths).toBe(16479);
  expect(lastItem.hospitalized).toBe(9007);
  expect(lastItem.recovered).toBe(832702);
});