import SeirModel from './index';

// values 
export default new SeirModel({
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
