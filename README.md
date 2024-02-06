# Workshop Blockchain

## Requirements
- [Ganache](https://trufflesuite.com/ganache/)
- [NodeJs](https://nodejs.org/en/download/current)
- [Postman](https://www.postman.com/downloads/)
- [Code Editor Visual Studio](https://code.visualstudio.com/) atau [Zed](https://zed.dev/)
- [Download Postman Collection](Workshop-Blockchain-Fordigi-BUMN.postman_collection.json)

## Folder structure
- api               // folder express server
- prisma            // folder prisma model schema dengan sqlite
- src               // folder vite react project
- truffle           // folder truffle project

## Step menjalankan project
Step 1: Jalankan [Ganache](https://trufflesuite.com/ganache), copy pubKey dan privKey akun #1 ke `./api/utils.js`

Step 2: Install dependencies dengan menjalankan perintah `$ yarn install`

Step 3: Compile & deploy smart contract dengan menjalankan perintah `$ yarn deploy`

Step 4: Migrasi database dengan menjalankan perintah `$ npx prisma db push`

Step 5: Buka database explorer dengan menjalankan perintah `$ npx prisma studio`

Step 6: Jalankan API server dengan menjalankan perintah `$ yarn server`

Step 7: Jalankan React dev server dengan menjalankan perintah `$ yarn dev`

## Project Check
- [x] Blockchain NodeJS API
    - [x] get blocks
    - [x] add blocks
- [x] Blockchain NodeJS Client
- [x] Ballot Voting dApps API
    - [x] create ballot
    - [x] cast ballot
    - [x] get ballot by id
    - [x] get ballot winner
- [x] Ballot Voting Client
- [x] Wallet API
    - [x] show ethers balance
    - [x] show erc20/token balance
    - [x] transfer ethers
    - [x] transfer erc20/token
- [x] Event API
    - [x] get events
- [x] Wallet Client
- [x] NFT Marketplace API
    - [x] create token
    - [x] my nft
    - [x] my nft list
    - [x] nft market items
    - [x] buy nft
- [x] NFT Marketplace Client
- [x] pChain Client
