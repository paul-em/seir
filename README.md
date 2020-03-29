# SEIR Model in JavaScript

This is a JavaScript implementation of the classical infectious disease model SEIR (Susceptible → Exposed → Infected → Removed) used in epidemiology to simplify the modelling of infectious diseases. [Learn more](https://en.wikipedia.org/wiki/Compartmental_models_in_epidemiology#The_SEIR_model)

Most of this code was copied from the wonderfull [Epidemic Calculator](http://gabgoh.github.io/COVID/index.html) and rewritten in TypeScript and published on npm.

> Can be used in node.js and in the browser.

Zero dependencies.

## Getting started

```npm install seir```

## Usage

```js
import SeirModel from 'seir';

const covid19 = new SeirModel({
  r0: 2.2,
  dDeath: 32 - 2.9,
  dIncubation: 5.2,
  dInfectious: 2.9,
  dRecoveryMild: 14 - 2.9,
  dRecoveryServere: 31.5 - 2.9,
  dHospitalLag: 5,
  cfr: 0.02,
  pServere: 0.2,
  dt: 2,
});

const timeline = covid19.calculate({
  population,
  r0ReductionPercent: 10,
  r0ReductionDay: 5,
  days: 300,
});

/*
[
  { deaths: 0, hospitalized: 0, recovered: 0, totalInfected: 1, infected: 1, exposed: 2 },
  { deaths: 0, hospitalized: 0, recovered: 1, totalInfected: 4, infected: 3, exposed: 5 },
  ...
]
*/
console.log(timeline);
```

## Parameters

### new SeirModel

| Name                 | Required | Type   | Default | Description |
| ---                  | ---      | ---    | ---     | ---         |
| **r0**               | true     | Number | -       | Maximnum value of R0 if no measures are taken |
| **dDeath**           | true     | Number | -       | Time from start of infection to death |
| **dIncubation**      | true     | Number | -       | Length of incubation period |
| **dInfectious**      | true     | Number | -       | Duration patient is infectious |
| **dRecoveryMild**    | true     | Number | -       | Recovery time for mild cases |
| **dRecoveryServere** | true     | Number | -       | Recovery time for servere cases |
| **dHospitalLag**     | true     | Number | -       | Time to hospitalization |
| **cfr**              | true     | Number | -       | Case fatality rate |
| **pServere**         | true     | Number | -       | Hospitalization rate |
| **duration**         | false    | Number | 7 \* 12 \* 1e10 | Duration of simulation |
| **dt**               | false    | Number | 1       | Time step size (days) |
| **integrator**       | false    | String | RK4     | Integrator to use. Available are Euler, Midpoint, Heun, K3, SSP33, SSP43, RK4, RK38 |

### model.calculate

| Name                   | Required | Type   | Default | Description |
| ---                    | ---      | ---    | ---     | ---         |
| **population**         | true     | Number | -       | Population of the location to run the simulation on |
| **initiallyInfected**  | false    | Number | 1       | Number of initially infected people |
| **initiallyExposed**   | false    | Number | 0       | Number of initially exposed people |
| **r0ReductionPercent** | false    | Number | 0       | How much the r0 value should be reduced (for example because of measures) |
| **r0ReductionDay**     | false    | Number | 0       | On which the the reduction should take place |
| **days**               | false    | Number | 110     | For how many days the calculation should return a value |

## Credits

[Gabriel Goh](https://github.com/gabgoh) for creating the [Epidemic Calculator](http://gabgoh.github.io/COVID/index.html) and therefore implementing pretty much all of these calculations. He also acknowledged
[Steven De Keninck](https://enkimute.github.io/) for RK4 Integrator. [Chris Olah](https://twitter.com/ch402), [Shan Carter](https://twitter.com/shancarter) and [Ludwig Schubert](https://twitter.com/ludwigschubert) wonderful feedback. [Nikita Jerschov](https://twitter.com/NikitaJer) for improving clarity of text. Charie Huang for context and discussion.

## Licence

MIT
