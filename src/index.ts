type Integrator = number[][]
interface IntegratorMap {
  [key:string]:Integrator;
}

export default class SeirModel {
  /** Maximnum value of R0 if no measures are taken */
  r0:number;
  /** Time from start of infection to death */
  dDeath:number;
  /** Length of incubation period */
  dIncubation:number;
  /** Duration patient is infectious */
  dInfectious:number;
  /** Recovery time for mild cases */
  dRecoveryMild:number;
  /** Recovery time for servere cases */
  dRecoveryServere:number;
  /** Time to hospitalization */
  dHospitalLag:number;
  /** Case fatality rate */
  cfr:number;
  /** Hospitalization rate */
  pServere:number;
  /** Duration of simulation */
  duration:number;
  /** Time step size (days) */
  dt:number;
  integrator:string;
  constructor(data:{
    r0:number,
    dDeath:number,
    dIncubation:number,
    dInfectious:number,
    dRecoveryMild:number,
    dRecoveryServere:number,
    dHospitalLag:number,
    cfr:number,
    pServere:number,
    duration?:number,
    dt?:number,
    integrator?:string,
  }) {
    this.r0 = data.r0;
    this.dDeath = data.dDeath;
    this.dIncubation = data.dIncubation;
    this.dInfectious = data.dInfectious;
    this.dRecoveryMild = data.dRecoveryMild;
    this.dRecoveryServere = data.dRecoveryServere;
    this.dHospitalLag = data.dHospitalLag;
    this.cfr = data.cfr;
    this.pServere = data.pServere;
    this.dt = data.dt || 1;
    this.duration = data.duration || 7 * 12 * 1e10;
    this.integrator = data.integrator || 'RK4';
  }

  static Integrators:IntegratorMap = {
    Euler: [[1]],
    Midpoint: [[0.5, 0.5], [0, 1]],
    Heun: [[1, 1], [0.5, 0.5]],
    Ralston: [[2 / 3, 2 / 3], [0.25, 0.75]],
    K3: [[0.5, 0.5], [1, -1, 2], [1 / 6, 2 / 3, 1 / 6]],
    SSP33: [[1, 1], [0.5, 0.25, 0.25], [1 / 6, 1 / 6, 2 / 3]],
    SSP43: [[0.5, 0.5], [1, 0.5, 0.5], [0.5, 1 / 6, 1 / 6, 1 / 6], [1 / 6, 1 / 6, 1 / 6, 1 / 2]],
    RK4: [[0.5, 0.5], [0.5, 0, 0.5], [1, 0, 0, 1], [1 / 6, 1 / 3, 1 / 3, 1 / 6]],
    RK38: [[1 / 3, 1 / 3], [2 / 3, -1 / 3, 1], [1, 1, -1, 1], [1 / 8, 3 / 8, 3 / 8, 1 / 8]],
  };

  static integrate(m:Integrator, f:Function, y:number[], t:number, h:number):number[] {
    let _y:number[] = [];
    let k:number[][] = [];
    let ki:number = 0;
    for (; ki < m.length; ki++) {
      _y = y.slice();
      const dt = ki ? ((m[ki - 1][0]) * h) : 0;
      for (let l = 0; l < _y.length; l++) {
        for (let j = 1; j <= ki; j++) {
          _y[l] = _y[l] + h * (m[ki - 1][j]) * (k[ki - 1][l]);
        }
      }
      k[ki] = f(t + dt, _y, dt);
    }
    for (var r = y.slice(), l = 0; l < _y.length; l++) {
      for (var j = 0; j < k.length; j++) {
        r[l] = r[l] + h * (k[j][l]) * (m[ki - 1][j]);
      }
    };
    return r;
  };

  calculate({
    population,
    initiallyInfected = 1,
    initiallyExposed = 0,
    r0ReductionPercent = 0,
    r0ReductionDay = 0,
    days = 110,
  }:{
    population:number,
    initiallyInfected?:number,
    initiallyExposed?:number,
    r0ReductionPercent?:number,
    r0ReductionDay?:number,
    days?:number,
  }) {
    const interpolationSteps = 40;
    let steps = days * interpolationSteps;
    const _dt = this.dt / interpolationSteps;
    const sampleStep = interpolationSteps;
    const f = (t:number, x:number[]) => {
      let beta;
      if (t > r0ReductionDay && t < r0ReductionDay + this.duration) {
        beta = ((100 - r0ReductionPercent) / 100) * this.r0 / (this.dInfectious);
      } else if (t > r0ReductionDay + this.duration) {
        beta = 0.5 * this.r0 / (this.dInfectious);
      } else {
        beta = this.r0 / (this.dInfectious);
      }
      const a = 1 / this.dIncubation;
      const gamma = 1 / this.dInfectious;
  
      const S = x[0]; // Susectable
      const E = x[1]; // Exposed
      const I = x[2]; // Infectious
      const Mild = x[3]; // Recovering (Mild)
      const Severe = x[4]; // Recovering (Severe at home)
      const Severe_H = x[5]; // Recovering (Severe in hospital)
      const Fatal = x[6]; // Recovering (Fatal)
      // const R_Mild = x[7]; // Recovered
      // const R_Severe = x[8]; // Recovered
      // const R_Fatal = x[9]; // Dead
  
      const pMild = 1 - this.pServere - this.cfr;
  
      const dS = -beta * I * S;
      const dE = beta * I * S - a * E;
      const dI = a * E - gamma * I;
      const dMild = pMild * gamma * I - (1 / this.dRecoveryMild) * Mild;
      const dSevere = this.pServere * gamma * I - (1 / this.dHospitalLag) * Severe;
      const dSevere_H = (1 / this.dHospitalLag) * Severe - (1 / this.dRecoveryServere) * Severe_H;
      const dFatal = this.cfr * gamma * I - (1 / this.dDeath) * Fatal;
      const dR_Mild = (1 / this.dRecoveryMild) * Mild;
      const dR_Severe = (1 / this.dRecoveryServere) * Severe_H;
      const dR_Fatal = (1 / this.dDeath) * Fatal;
      //      0   1   2   3      4        5          6       7        8          9
      return [dS, dE, dI, dMild, dSevere, dSevere_H, dFatal, dR_Mild, dR_Severe, dR_Fatal];
    }
  
    let v = [1, initiallyExposed / (population - initiallyExposed), initiallyInfected / (population - initiallyInfected), 0, 0, 0, 0, 0, 0, 0];
    let t = 0;
  
    const timeline = [];
    while (steps--) {
      if ((steps + 1) % (sampleStep) === 0) {
        timeline.push({
          deaths: Math.round(population * v[9]),
          hospitalized: Math.round(population * (v[5] + v[6])),
          recovered: Math.round(population * (v[7] + v[8])),
          totalInfected: Math.round(population * (1 - v[0])),
          infected: Math.round(population * v[2]),
          exposed: Math.round(population * v[1]),
        });
      }
      v = SeirModel.integrate(SeirModel.Integrators[this.integrator], f, v, t, _dt);
      t += _dt;
    }
    return timeline;
  }
}