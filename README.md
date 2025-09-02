# 🔐 DecryptPay – Decentralized Pay-Per-Download Content dApp

## 📌 Short Description
DecryptPay is a decentralized marketplace where creators can **upload encrypted content**, store it permanently on **Filecoin via Synapse**, and sell access using **Filecoin Pay**.  
Users pay in FIL/USDFC, retrieve files from Filecoin storage, and decrypt them trustlessly — ensuring **creators are paid fairly** and **buyers always get access**.

You can find the full product design doc here: [Notion Link](https://www.notion.so/DecryptPay-Decentralized-Pay-Per-Download-Content-dApp-2621f92f5b51800183d8f75c9955d1d7?source=copy_link)
---

## 🚀 Problem
Today’s digital content economy relies on **centralized platforms** (Patreon, Gumroad, Substack). These introduce:
- High fees (10–30%) and delayed payouts.
- Censorship and takedowns based on platform policy.
- Single points of failure for file hosting.
- No guarantee that buyers actually get the content they pay for.

---

## 💡 Solution
DecryptPay leverages **Filecoin Onchain Cloud** to create a **trustless, censorship-resistant, and transparent content marketplace**:
- Files are encrypted client-side and stored on **Filecoin via Synapse**.
- Payments are handled through **Filecoin Pay**, ensuring SLA-based trust.
- Buyers only receive the **decryption key** after payment is verified.
- Immutable storage guarantees that content is permanent and tamper-proof.

---

## 🏗️ System Design

### 🔹 Creator Flow
1. Encrypts file locally.  
2. Uploads via **Synapse SDK** → Filecoin storage.  
3. Publishes listing with price + file metadata.  

### 🔹 User Flow
1. Browses content listings.  
2. Pays with **FIL/USDFC** via Filecoin Pay.  
3. Smart contract verifies payment.  
4. User downloads encrypted file + receives key for decryption.  

### 🔹 Architecture Diagram

```mermaid
flowchart TD
    C[Creator Wallet] -->|Encrypts + Uploads| F[Filecoin Storage via Synapse SDK]
    C -->|Set Price + Metadata| SC[Marketplace Smart Contract]
    U[User Wallet] -->|Browse + Select Content| DApp[Frontend]
    U -->|Pay with FIL/USDFC| FP[Filecoin Pay]
    FP -->|Verify Payment| SC
    SC -->|Release Decryption Key| U
    U -->|Download Encrypted File| F
    U -->|Decrypt Locally| Device[User Device]
````

---

## 🛠️ Tech Stack

* **Frontend**: Next.js + Tailwind + Wagmi/ethers v6
* **Storage**: Filecoin via **Synapse SDK** (`@filoz/synapse-sdk`)
* **Payments**: **Filecoin Pay** (USDFC/FIL)
* **Encryption**: AES-GCM (client-side)
* **Future or later Contracts**: Marketplace registry + key escrow

---



## 📅 Milestones

| Wave   | Deliverable  | Details                                        |
| ------ | ------------ | ---------------------------------------------- |
| Wave 1 | Design Doc   | Problem, solution, design, diagrams, feedback  |
| Wave 2 | MVP          | Upload + Pay + Download + Decrypt (demo link) |
| Wave 3 | Enhancements | Subscriptions, multi-file bundles, dashboards  |
| Wave 4 | Final        | Polished UI, analytics, SLA dashboards         |

---

## ⚡ Filecoin Onchain Cloud Features Used

* **Synapse SDK** → file uploads, retrieval, storage usage.
* **Filecoin Pay** → escrow & SLA-native trustless payments.
* **Contracts** (future extension) → registry & decryption key escrow.

---


## 📖 Setup Instructions (Wave 1)

This repo currently contains **design documentation** and **starter directories** for `frontend/` and `contracts/`.

* `docs/` folder → contains architecture + design diagrams.
* Full implementation will be delivered in **Wave 2**.
