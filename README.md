# Stallion Run

Decentralized play-to-earn Horse Racing game with custom Stallion Horse NFTs and fairly implemented race mechanics. 

## Authors

- [Umair Mirza - @umair-mirza](https://github.com/umair-mirza)
- [Marvellous - @literallymarvellous](https://github.com/literallymarvellous)
- [John Nguyen - @jooohneth](https://github.com/jooohneth)

## Description

Stallion Run is a game built on top of Ethereum blockchain, where users earn by competing in races.
Players purchase a Stallion Horse NFT to participate in races. Race results are generated randomly, but horse levels alter the probability of the win. The higher the horse level, the higher the chances of winning. The winner gets rewarded with entrance fees from all of the participating players.

## Features

- Custom NFT-collection consisting of 9000 NFT Horses.
- 3 Level of Horses.
- Each horse level has a unique speed buff.
- Chainlink VRF used for random horse speeds 
- Chainlink Keepers used to automate the smart-contract functionality.
- No centralized entity in charge of in-game functionality.

## Tech Stack

**Client(Under development):** React, TailwindCSS

**Smart-contract:** Solidity 

**Testing and deployment:** Hardhat

## Installation

### Clone repository: 

```bash
  git clone https://github.com/MDJ-Labs/stallion-run
  cd stallion-run
```

### Install dependencies: 

```bash
  npm install
```

## Deployment

### Compile:

```bash
  npx hardhat compile
```

### Deploy contract to Goerli Network:

```bash
  npx hardhat deploy --network goerli
```

### Deploy contract to hardhat local network:

```bash 
  npx hardhat node
```

- change 'defaultNetwork' to 'hardhat' in hardhat.config.js file

```bash
  npx hardhat deploy
```
## Run Web App

### Navigate to 'new-frontend' branch:

```bash
  git checkout new-frontend
```

### Run app in development mode: 

```bash
  npm run dev 
```