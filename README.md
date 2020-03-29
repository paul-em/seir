# SEIR Model in JavaScript

This is a JavaScript implementation of the classical infectious disease model SEIR (Susceptible → Exposed → Infected → Removed) used in epidemiology to simplify the modelling of infectious diseases. [Learn more](https://en.wikipedia.org/wiki/Compartmental_models_in_epidemiology#The_SEIR_model)

Most of this code was copied from the wonderfull [Epidemic Calculator](http://gabgoh.github.io/COVID/index.html) and rewritten in TypeScript and published on npm.

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

// [{ deaths: 0, hospitalized: 0, recovered: 0, totalInfected: 1, infected: 1, exposed: 2 }, ...]
console.log(timeline);
```

## Parameters

### SeorModel

| Name             | Required | Type   | Default | Example | Description |
| ---              | ---      | ---    | ---     | ---     | ---         |
| **r0**               | true     | Number | -       | 2.2     | Maximnum value of R0 if no measures are taken |
