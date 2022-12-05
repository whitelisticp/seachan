<p align="center"><img title="Logo by EgidoVal (https://egidoval.com/)" src="./frontend/assets/logo.png" width="80%"/></p>

<p align="center">
    🔗 <a href="https://sfjch-siaaa-aaaak-qarnq-cai.raw.ic0.app/">Seachan.org</a> | 
    📜 <a href="https://sfjch-siaaa-aaaak-qarnq-cai.raw.ic0.app/meta/thread/2">FAQ</a> | 
    🚑 <a href="https://github.com/seachan-dev/seachan/issues/new">Report an Issue</a> | 
    📨 <a href="mailto:seachan@dmail.ai">Contact</a>
</p>

## Table of Contents

- [Seachan](#seachan)
- [Links](#links)
- [Tech Stack](#tech-stack)
- [Roadmap](#roadmap)
- [Installation](#nstallation)
- [Contributing](#contributing)
- [License](#license)

# Seachan

A censorship resistant decentralized fileboard built on the Internet Computer.

# Links

Web2: <a href="https://seachan.org/">seachan.org</a></br>
ICNS: <a href="https://seachan.icp.xyz/">seachan.icp.xyz</a></br>
ICNaming: <a href="https://seachan.ic.bike/">seachan.ic.bike</a></br>
Asset Canister: <a href="https://sfjch-siaaa-aaaak-qarnq-cai.ic0.app/">sfjch-siaaa-aaaak-qarnq-cai</a></br>
Data Canister: <a href="https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.ic0.app/?id=y26ux-qiaaa-aaaag-aap3q-cai">y26ux-qiaaa-aaaag-aap3q-cai</a></br>

# Tech stack

Backend: <a href="https://internetcomputer.org/docs/current/developer-docs/build/cdks/motoko-dfinity/motoko/">Motoko</a></br>
Frontend: Javascript, TypeScript, <a href="https://reactjs.org/">React</a></br>
File Upload Storage: <a href="https://web3.storage/">Web3 Storage API</a></br>

# Roadmap

- [x] Q2 2022 - Development begins
- [x] Q3 2022 - Alpha release
- [ ] Q1 2023 - DAO formation

# Installation

To get Seachan up and running locally, follow these steps.

## Prerequisites

- Psychadelic (for DAB.js NFT registry)

  - <a href="https://github.com/Psychedelic/DAB-js/pkgs/npm/dab-js#interaction-guide">Installation guide</a>

- Web3.storage (required for IPFS file uploads)

  - Create a <a href="https://web3.storage/login/">web3.storage account</a> and paste the generated <a href="https://web3.storage/tokens/">API key</a> to the VITE_WEB3_STORAGE_API variable within .env

- DFX SDK

  - <a href="https://internetcomputer.org/docs/current/developer-docs/build/install-upgrade-remove">Installation guide</a>

- Internet ID running locally
  - <a href="https://github.com/dfinity/internet-identity">Installation guide</a></br>

## Install Steps

1. Clone the repo

   ```sh
   git clone https://github.com/seachan-dev/seachan
   ```

2. Install required NPM packages

   ```sh
   npm install
   ```

3. Start a clean dfx replica in the background

   ```sh
   dfx start --clean --background
   ```

4. Set identity if you need to

   ```sh
   dfx identity new me && dfx identity use me
   ```

5. Deploy the canisters to the replica and generate the candid interface

   ```sh
   dfx deploy
   ```

6. Use the seachan_frontend canister id from .dfx/local/canister_ids.json in the below URL.

   ```
   http://localhost:8000?canisterId=<seachan_frontend>
   ```

7. Start a front-end development server if required

   ```sh
   npm start
   ```

8. Access the development server at the below URL.

   ```
   http://localhost:8000?canisterId=<seachan_frontend>
   ```

# Contributing

Contributions to Seachan are greatly appreciated.

1. Fork the project by clicking the "Fork" button on https://github.com/seachan-dev/seachan

2. Create a Feature Branch

   ```sh
   git checkout -b feature/Feature
   ```

3. Commit your Changes

   ```sh
   git commit -m 'Added a Feature'
   ```

4. Push to the Branch

   ```sh
   git push origin feature/Feature
   ```

5. Open a Pull Request

# License

Distributed under the GNU GENERAL PUBLIC LICENSE License. See LICENSE for more information.
