![Github Actions](https://github.com/hyperledger-labs/fablo/actions/workflows/test.yml/badge.svg?branch=main)

<h1><img src="./logo.svg" alt="Fablo"/></h1>

Fablo supports:

* Environment: Docker
* RAFT and solo consensus protocols
* Multiple organizations and channels
* Chaincode installation and upgrade
* REST API client for CA and chaincodes ([Fablo REST](https://github.com/fablo-io/fablo-rest))
* [Blockchain Explorer](https://github.com/hyperledger/blockchain-explorer) which can be enabled for each organization

## See it in action

[![How to use](https://img.youtube.com/vi/JqPNozCtHkQ/0.jpg)](https://www.youtube.com/watch?v=JqPNozCtHkQ)

## Installation

Fablo is distributed as a single shell script which uses Docker image to generate the network config.
You may keep the script in the root directory of your project or install it globally in your file system

--markdown
# ⚙️ Fablo Network - Secure EHR Blockchain Setup

This folder contains the full Hyperledger Fabric blockchain network configuration powered by **[Fablo](https://github.com/hyperledger-labs/fablo)**. It is customized for a **Secure Electronic Health Record (EHR) System** built using blockchain and IPFS.

---

## 🏥 Project Blockchain Network Overview

The Fabric network includes five organizations representing medical roles:

| Organization | Role         | Peer           | Chaincode Namespace |
|--------------|--------------|----------------|----------------------|
| Org1         | 👩‍⚕️ Doctor   | `peer0.org1`   | `hospitalcc`         |
| Org2         | 🧪 Lab       | `peer0.org2`   | `hospitalcc`         |
| Org3         | 💊 Pharmacy  | `peer0.org3`   | `hospitalcc`         |
| Org4         | 🏦 Insurance | `peer0.org4`   | `hospitalcc`         |
| Org5         | 🧑‍💻 Patient   | `peer0.org5`   | `hospitalcc`         |

All data is securely stored and exchanged via smart contracts on the blockchain, and medical reports are stored in **IPFS**, with metadata in **MongoDB**.

---

## 📂 Key Structure

```

fablo/
├── fablo-config.json          # Main Fablo network config
├── fablo.sh                   # Fablo CLI script
├── fablo-target/              # Auto-generated Docker setup
├── chaincodes/hospitalcc      # Chaincode (Go) for EHR system
├── ipfs/                      # Optional IPFS integration
├── channel-artifacts/         # Channel blocks and anchor peers
├── system-genesis-block/      # Genesis block
├── mychannel.block            # Channel block
├── installed\_\*.txt            # Installed chaincodes log
└── README.md                  # 📄 You're here!

````

---

## ⚙️ Setup & Commands

### ✅ 1. Generate Network

```bash
./fablo.sh generate
````

### 🚀 2. Start Network

```bash
./fablo.sh start
```

### 🔗 3. Deploy Chaincode

```bash
./fablo.sh deploy-chaincode hospitalcc 1.0
```

### 🧼 4. Stop & Clean

```bash
./fablo.sh stop         # Stops all containers
./fablo.sh destroy      # Removes all generated files and containers
```

---

## 🛠 Technologies Used

* **Hyperledger Fabric** (2.x)
* **Fablo** (network orchestration)
* **Go Chaincode**
* **IPFS** (decentralized file storage)
* **MongoDB** (user info & metadata)
* **Docker & Docker Compose**

---

## 🙋‍♀️ Contribution

This network setup is part of my **Secure EHR Blockchain Project**
📍 **Internship at National Institute of Technology, Warangal**

* 🧑‍💻 Built & configured by: **Boga Sushmita**
* 📧 Email: [SushmitaBoga373@gmail.com](mailto:SushmitaBoga373@gmail.com)
* 🔗 GitHub: [github.com/Susmitha123205](https://github.com/Susmitha123205)

---

> 💡 This Fablo setup powers the backend for my full-stack secure EHR system, supporting decentralized identity, role-based access, and encrypted medical report storage using IPFS.

````

---

### ✅ Next Steps

To upload this to your GitHub repo:

```bash
cd ~/sus123
nano fablo/README.md     # (Paste this content and save)
git add fablo/README.md
git commit -m "Add final professional Fablo README"
git push origin main
````

## Kubernetes support

TODO

## Other features

### Connection profiles

Fablo will generate the connection profiles for each organization defined in the configuration.
You can find them in `fablo-target/fablo-config/connection-profiles` directory in `json` and `yaml` format.

### REST API

Fablo is integrated with simple REST API for CA and chaincodes, supported by [Fablo REST](https://github.com/fablo-io/fablo-rest).
If you want to use it, provide for your organization `"tools": { "fabloRest": true }`.
Visit the [Fablo REST](https://github.com/fablo-io/fablo-rest) project for more documentation.

### Blockchain Explorer

Fablo can run [Blockchain Explorer](https://github.com/hyperledger/blockchain-explorer) for you.
Provide for your organization `"tools": { "explorer": true }`, if you want to use it per organization, or provide the same value in `global` section of the config, if you want to use one global Explorer for all organizations.

## Contributing

We'd love to have you contribute! Please refer to our [contribution guidelines](https://github.com/hyperledger-labs/fablo/blob/main/CONTRIBUTING.md) for details.


## Testimonials

Fablo was originally created at [SoftwareMill](https://softwaremill.com) by [@Hejwo](https://github.com/Hejwo/) and [@dzikowski](https://github.com/dzikowski/).
In December 2021, Fablo joined [Hyperledger Labs](https://labs.hyperledger.org/).

