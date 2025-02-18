## Doitring Ring Analyzkit

This package is used for data analysis of BlueberryRing in moonchain. For information on how to obtain BlueberryRing, please refer to the contract documentation of the project [doitring/solidity](https://github.com/MXCzkEVM/doitring/tree/main/packages/solidity).

## What is it for?

Health data is a piece of abstract data that cannot be understood without specific rules for interpretation. This package consists of three main modules: grouping, rating, and statistics. Through these functions, you can quickly analyze the detailed contents of data packets.

## Install

```sh
pnpm add @doitring/analyzkit
```

## Sync Ring Data

The ring data is stored in the chain's events, and `contracts/DoitRingDevice.sol` is the contract related to ring binding and data synchronization. By querying events, you can obtain a list of the data you have synchronized, where the memo represents the synchronized data.

```typescript
const filter = DoitRingDevice.filters.Claimed(token, tokenId)
const events = await DoitRingDevice.queryFilter(filter)

events // { rewards, memo... }[]
```

## Memo Data

The memo is data in the [MEP-3355](https://github.com/MXCzkEVM/MEPs/blob/main/proposals/mep-3355.md) format. MEP-3355 proposes a standard format for transaction memos on Moonchain that is optimized for processing by large language models (LLMs). The standard leverages the Brotli compression algorithm to efficiently compress memo data before sending it to Moonchain. This allows for more expressive and detailed memos while minimizing transaction costs. The standard memo format enables powerful LLM-based applications built on Moonchain transaction data.

If you need to parse the memo data, you need to install Brotli and use decompress to parse the data inside:

```typescript
import { decompress } from 'brotli-wasm'

const mep3355Json = JSON.parse(events[0].memo)

// mep3355Json { format, version, metadata, data }

const content = Buffer.from(mep3355Json.data[0].content, 'base64')
const dataPackets = brotli.decompress(content)

dataPackets // { sleeps, steps, rates, oxygens }
```


## Groupings

The Groupings module is used to group data based on time nodes or time continuity, applied to any data packet for grouping.

To take data for a day according to day:

```ts
import { groupings } from '@doitring/analyzkit'
// Here, data can be sleeps, steps, rates, oxygens
const day = groupings.day('2024-08-22', data)
day // { date, ytd, day, data }
```

To group data for each day according to daily:

```ts
import { groupings } from '@doitring/analyzkit'
const days = groupings.day('2024-08-22', data)
days // { date, ytd, day, data }[]
```

To get data for a week according to week:

```ts
import { groupings } from '@doitring/analyzkit'
const filterData = groupings.week('2024-08-22', data)
filterData // All data for this week
```

To get data for a month according to month:

```ts
import { groupings } from '@doitring/analyzkit'
const filterData = groupings.month('2024-08-22', data)
filterData // All data for this month
```

Grouping based on time continuity:

```ts
import { groupings } from '@doitring/analyzkit'
// Group continuous data within one hour
const filterData = groupings.diffs(data, 3600)
filterData // all data for diffs
```

By default, `diffs` filters repetitive data by day and retains the data with the longest length. You can disable this filtering by enabling the third parameter. Note that if filtering is disabled, duplicate data for the same day may occur.

```ts
import { groupings } from '@doitring/analyzkit'
// Group continuous data within one hour
const filterData = groupings.diffs(data, 3600, true)
filterData // [{ ytd: '2024-08-22', ... }, { ytd: '2024-08-22', ... }]
```

Selecting data based on time continuity and time nodes:

```ts
import { groupings } from '@doitring/analyzkit'
// Find continuous data within one hour at the specified time node
const filterData = groupings.diff('2024-08-22', data, 3600)
filterData // all data for diff
```

You can define the difference of the base point through the third parameter. For example, if you need to find sleep data, you can reduce the time by half a day:

```ts
import { groupings } from '@doitring/analyzkit'
groupings.month('2024-08-22', sleeps, { difference: -43200 })
```

## Ratings

The Ratings module is used to rate and evaluate each data item in a data packet and provide basic statistics for correct assessment.

### Sleeps

Analysis is only performed on a day's sleep data. Analysis beyond a day will lead to inaccurate results.

```ts
import { ratings } from '@doitring/analyzkit'
const result = ratings.sleeps(data)
```

| Data Item | Meaning     |
|-----------|-------------|
| dep       | Deep Sleep  |
| lig       | Light Sleep |
| rem       | REM Sleep   |
| tol       | Total Sleep |
| act       | Total Sleep excluding wakefulness |
| com       | Total Evaluation |

```ts
interface Result {
  // Durations of each stage (seconds)
  durations: {
    dep: number
    lig: number
    rem: number
    act: number
    tol: number
  }
  // Percentages of each stage
  percents: {
    dep: number
    lig: number
    rem: number
  }
  // Sleep scores for each stage (0~100)
  scores: {
    lig: number
    dep: number
    dur: number
  }
  // Total score (0~100)
  score: number
  // Evaluation for each stage
  evals: {
    com: 'high' | 'normal' | 'low'
    dep: 'high' | 'normal' | 'low'
    lig: 'high' | 'normal' | 'low'
    rem: 'high' | 'normal' | 'low'
  }
}
```

### Steps

Analysis of movement data. Analysis and statistics can be conducted on data spanning more than a day by adjusting the second parameter as the scoring standard.

```ts
import { ratings } from '@doitring/analyzkit'

// Analyze and statistically evaluate data for a day with a target step count of 10000
const result = ratings.steps(dayData, 10000)

// Analyze and statistically evaluate data for a week with a target step count of 10000 * 7
const result = ratings.steps(dayData, 10000 * 7)
```

```ts
interface Result {
  // Total steps
  total: number
  // Calories burnt (to two decimal places)
  kcal: string
  // Kilometers covered (to two decimal places)
  km: string
  // Score (0~100)
  score: number
  // Evaluation
  eval: 'lack' | 'low' | 'high'
}
```

### Heart Rates

Analysis of heart rates. Analysis and statistics can be conducted on data spanning more than a day.

```ts
import { ratings } from '@doitring/analyzkit'
const result = ratings.rates(data)
```

```ts
interface Result {
  // Average
  average: number
  // Minimum
  min: string
  // Maximum
  max: string
  // Score (0~100)
  score: number
  // Evaluation
  eval: 'normal' | 'abnormal'
}
```

### Blood Oxygens

Analysis of blood oxygen levels. Analysis and statistics can be conducted on data spanning more than a day.

```ts
import { ratings } from '@doitring/analyzkit'
const result = ratings.oxygens(data)
```

```ts
interface Result {
  // Average
  average: number
  // Minimum
  min: string
  // Maximum
  max: string
  // Score (0~100)
  score: number
  // Evaluation
  eval: 'normal' | 'abnormal' | 'danger'
}
```

## Statistics

The Statistics module utilizes Groupings and Ratings to perform statistical analysis on each data item in the form of daily, day, week, and month.

### Sleeps

```ts
import { statistics } from '@doitring/analyzkit'

// Analyze and statistically evaluate sleep data for the current day
statistics.sleeps.day('2024-02-22', data)
// { durations, percents, scores, score, data, ... }

// Analyze and statistically evaluate sleep data for each day in the provided data
statistics.sleeps.daily(data)
// { eval, score, daily, duration, times }

// Analyze and statistically evaluate data for the current week and provide daily statistics and analysis
statistics.sleeps.week(data)
// { eval, score, daily, duration, times, data }

// Analyze and statistically evaluate data for the current month and provide daily statistics and analysis
statistics.sleeps.month(data)
// { eval, score, daily, duration, times, data }
```

### Steps

```ts
import { statistics } from '@doitring/analyzkit'

// Analyze and statistically evaluate movement data for the current day
statistics.steps.day('2024-02-22', data)
// { hours, eval, kcal, km, data, ... }

// Analyze and statistically evaluate movement data for each day in the provided data
statistics.steps.daily(data)
// { avers, daily }

// Analyze and statistically evaluate data for the current week and provide daily statistics and analysis
statistics.steps.week(data)
// { eval, kcal, total, daily, score, avers, daily }

// Analyze and statistically evaluate data for the current month and provide daily statistics and analysis
statistics.steps.month(data)
// { eval, kcal, total, daily, score, avers, daily }

// Set the daily step goal globally. You can also set this by passing the last parameter
statistics.steps.setup(20000)
```

### Heart Rates

```ts
import { statistics } from '@doitring/analyzkit'

// Analyze and statistically evaluate heart rate data for the current day
statistics.steps.day('2024-02-22', data)
// { hours, eval, average, min, max, score, ... }

// Analyze and statistically evaluate heart rate data for each day in the provided data
statistics.steps.daily(data)
// { average, max, min, daily }

// Analyze and statistically evaluate data for the current week and provide daily statistics and analysis
statistics.steps.week(data)
// { average, max, min, daily, data }

// Analyze and statistically evaluate data for the current month and provide daily statistics and analysis
statistics.steps.month(data)
// { average, max, min, daily, data }
```

### Blood Oxygens

```ts
import { statistics } from '@doitring/analyzkit'

// Analyze and statistically evaluate blood oxygen data for the current day
statistics.oxygens.day('2024-02-22', data)
// { hours, eval, average, min, max, score, ... }

// Analyze and statistically evaluate blood oxygen data for each day in the provided data
statistics.oxygens.daily(data)
// { average, max, min, daily }

// Analyze and statistically evaluate data for the current week and provide daily statistics and analysis
statistics.oxygens.week(data)
// { average, max, min, daily, data }

// Analyze and statistically evaluate data for the current month and provide daily statistics and analysis
statistics.oxygens.month(data)
// { average, max, min, daily, data }
```
