// Pump.fun paper-trading bot for make.fun (pumpfun-replay/v2).
// Dip rider on proven curves: buy 25-70% pullbacks on coins that drew 30+ SOL,
// exit +15%/-15% fast. See strategy.ts for the full design.
// Runs as `node /bot/main.ts` on Node 22.

import { runBot } from './vendor/makefun-bot.ts';
import { createStrategy, DEFAULT_PARAMS } from './strategy.ts';

await runBot(createStrategy(DEFAULT_PARAMS));
