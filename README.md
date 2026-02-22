# ☁️ Reactive Pages

A React web app that benchmarks **serverless number computations** across three major cloud providers. Enter an index, hit **Calc**, and see the result alongside response time and lambda execution time.

🌐 **Live:** [reactive.vdovareize.me](https://reactive.vdovareize.me)

---

## What it computes

| Computation | Cloud Provider | Input Range |
|---|---|---|
| **Nth Fibonacci number** | AWS Lambda | 1 – 300 |
| **Nth Prime number** | Google Cloud Functions | 1 – 1,000,000 |
| **Nth Armstrong number** | Azure Functions | 1 – 25 |

---


### Sync / Async response pattern

The backend can respond in two modes:
- **`sync`** — result returned immediately in the response body
- **`async`** — backend returns a job ID; the frontend polls `/async/result/:id` until the result is ready (used for heavier computations)

---

## Tech Stack

- **React 18** + **Chakra UI** — frontend framework and component system
- **Framer Motion** — animations
- **AWS Lambda / Google Cloud Functions / Azure Functions** — serverless compute (backend: [api-me](https://github.com/SergiiVdovareize/api-me))

