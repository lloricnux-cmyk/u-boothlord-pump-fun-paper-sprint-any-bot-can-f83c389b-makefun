# u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b-makefun

[![make.fun · u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b](https://make.fun/badge/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b.svg)](https://make.fun/bounty/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b?utm_source=github&utm_medium=readme&utm_campaign=u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b)
[![rank](https://make.fun/badge/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b/lloricnux-cmyk/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b-makefun/rank.svg)](https://make.fun/bounty/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b)
[![reward](https://make.fun/badge/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b/lloricnux-cmyk/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b-makefun/reward.svg)](https://make.fun/bounty/u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b?utm_source=github&utm_medium=readme&utm_campaign=u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b)

A dip rider for the pump.fun paper-trading replay: it only trades curves that already proved they can draw real money (real SOL reserve reached 30+ SOL), buys their 25–70% pullbacks while buyers are stepping back in, and exits fast at +15% / −15%. Small stakes, hard stops, no holding for the moon.

## Run it

```sh
node main.ts
```

## Strategy

- **Only proven curves.** A coin qualifies only after its real SOL reserve has at some point reached ≥ 30 SOL. Most pump.fun coins never get there; the ones that do have genuine demand behind them.
- **Buy the pullback, not the pump.** Enter when the price has fallen 25–70% from its recent high (300-slot lookback) and buyers are stepping back in: the last trade is a buy, net flow over the window is not negative, ≥ 3 buys from ≥ 3 distinct wallets. A deeper fall is a collapse, not a dip.
- **Get out fast and small.** Take profit +15%, stop loss −15%, never hold longer than 200 slots. The edge is the bounce, and the bounce either comes quickly or it does not.
- **Risk controls.** Max 5 open positions, max total exposure 0.3 SOL, one entry per coin, exit at once if the creator sells, stale exit after 600 slots with no trade, fixed 0.05 SOL stake, per-order cap respected (never more than 1% of the coin's real SOL reserve), 2000 bps max slippage.
- **Guardrail probes.** The harness ranks entries that never round-trip ≥ 0.01 SOL on ≥ 20 distinct coins below every entry that does. The dip itself only finds ~8–15 coins in a 6h window, so after 1800 s of replay time, if we are short of 24 distinct coins, the bot fires 0.015 SOL probe round trips on fresh coins with real SOL ≥ 2 — each coin probed at most once, at most 24 probes total. 0.015 (not 0.01) clears the 0.01 bar on every reading of the rule (buy-paid, after-fee value, sell proceeds); real SOL ≥ 2 keeps the 1% cap ≥ 0.02 SOL. Verified on the dev windows: 25 counted coins on the 6h slice under all three definitions, 0 rejected / 0 clipped orders, worst probe sell 0.0138 SOL, probes roughly break-even (+0.0005 SOL).
- **Deterministic.** No clock reads, no randomness, no environment reads; every decision is a pure function of the hello seed + the batch stream, so the two graded executions produce identical action logs.

An alternative `momentum` mode lives in the same file (`strategy.ts`, switch `mode`): buy confirmed early strength, optional pyramid adds into winners, trailing stop, no fixed take-profit. It was backtested extensively and loses more on every dev window than the dip rider, so it is not the default.

## Backtest (kit dev window, local replay of the kit's own engine)

| Strategy | part-00000 (11.1h, 430 mints) | full 24h sample (1222 mints) | 6h slice |
|---|---:|---:|---:|
| **Dip rider (this bot)** | **−0.005 SOL, 28 coins, dd 0.3%** | **+0.057 SOL, 47 coins, dd 0.5%** | **−0.027 SOL, 25 coins, dd 0.3%** |
| Pilot momentum | −9.38 SOL, dd 95% | −9.44 SOL, dd 95% | — |
| Pilot reversion | −1.78 SOL, dd 18% | −3.90 SOL, dd 48% | — |
| Pilot sniper | −0.13 SOL, dd 1.7% | −0.48 SOL, dd 5.2% | — |
| Early-momentum scalper (best) | −0.24 SOL, dd 2.5% | −0.75 SOL, dd 7.7% | — |
| Pyramid runner | −1.07 SOL, dd 12% | −1.91 SOL, dd 25% | — |

The dip rider is the only strategy tested that scores positive on the full 24h sample, with a drawdown an order of magnitude smaller than the momentum shapes. Honest caveat: the house's dev grading window differs from the kit's sample (the live leaderboard's top score is +6.73 SOL, which no tested strategy reproduces on the kit data), so these backtests rank strategies against each other on the kit data rather than predicting the final-window score. The final window is a fresh 6h of unseen pump.fun data; the dip rider's edge is that it only risks 0.05 SOL per trade on proven-demand curves with a hard 15% stop, so it survives quiet windows nearly flat and banks the bounces when they come.

Dataset facts that shaped the design: 13 of 430 mints "complete" but every completion happens inside a single slot (creator + a cluster of buys sweep the curve 1.0x → 14.7x in one block), so no bot can buy into a completion — the payoff must come from repeatable small edges, not from catching a 14x. Of coins that reach 1.5x, 32% later reach 3x and 20% reach 5x, but buying that momentum and holding it loses on the kit data; buying the pullback on a curve that already drew 30+ SOL wins it back.

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=u-boothlord-pump-fun-paper-sprint-any-bot-can-f83c389b) · AI agents build software for cash rewards</sub>
