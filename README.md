# 🚀 SECURE-EHR-HYPERLEDGER-IPFS

A **Decentralized, Secure Medical Record Management System** that integrates **Hyperledger Fabric**, **IPFS**, **MongoDB**, and **React.js** to ensure tamper-proof, privacy-respecting storage and sharing of electronic health records (EHR). Patients, doctors, labs, pharmacies, and insurance companies interact securely through role-based access control powered by blockchain.

---

## 📌 Key Features

- 🔐 Tamper-proof storage using **Hyperledger Fabric**
- 🌐 Decentralized file storage using **IPFS**
- 🧾 Role-based access and permissions
- 📁 Secure sharing of sensitive medical records
- 🖥️ Simple and responsive **React UI**
- ☁️ Real-time file upload and record verification via **Node.js backend**
- 🧠 MongoDB for user metadata and linking blockchain references

---

## 🏗️ System Architecture

```

React Frontend (UI)
↳ Uploads to IPFS
↳ Sends metadata to Backend
↓
Node.js Backend (Express)
↳ Interacts with IPFS and Fabric SDK
↳ Persists metadata to MongoDB
↓
Hyperledger Fabric
↳ Multi-org, multi-peer ledger
↳ Chaincode: hospitalcc (Go)
↓
IPFS (Infura / Local)
↳ Decentralized report storage

````

---

## 🧰 Technology Stack

| Layer       | Technology                                  |
|-------------|---------------------------------------------|
| Blockchain  | Hyperledger Fabric, Fabric CA               |
| Chaincode   | Go (Golang)                                 |
| Backend     | Node.js, Express.js, Fabric SDK             |
| Frontend    | React.js                                    |
| Database    | MongoDB                                     |
| Storage     | IPFS (via Infura or local node)             |
| Auth & Wallets | FileSystem-based Wallets (for each org) |

---

### 👥 🌐 Organizations (Fabric Orgs)
- `Org1` → 🧑‍⚕️ **Doctor**
- `Org2` → 👩‍🔬 **Patient**
- `Org3` → 🏥 **Lab**
- `Org4` → 💊 **Pharmacy**
- `Org5` → 💼 **Insurance**
- `chaincode name` → **hospitalcc**
- `channel name` → **healthcare-channel**

### 🧾 Roles and Permissions

| Role      | Organization | Permissions |
|-----------|--------------|-------------|
| Patient   | Org2         | Upload and view medical reports |
| Doctor    | Org1         | View patient records, write prescriptions |
| Lab       | Org3         | Upload lab test reports |
| Pharmacy  | Org4         | View prescriptions issued by doctors |
| Insurance | Org5         | Verify patient records for insurance claims |

---

## 📦 Folder Structure

```bash
SECURE-EHR-HYPERLEDGER-IPFS/
├── backend/           # Express.js backend (IPFS + Fabric SDK + MongoDB)
├── frontend/          # React-based UI
├── chaincode/         # Go smart contracts (hospitalcc)
├── fablo/             # Fabric network setup
├── organizations/     # Crypto material (Fabric CA, MSPs, Peers)
├── README.md
````

---
🚀 Project ⚙️Setup & Running Instructions
✅ Prerequisites
    Node.js v18.x+
    MongoDB (local)
    Docker + Docker Compose
    Hyperledger Fabric binaries
    IPFS (local or Infura setup)
    Git LFS (git lfs install)
    fablo tool (optional Fabric launcher)

---
### 🔧 Clone and Navigate

```bash
git clone https://github.com/Susmitha123205/SECURE-EHR-HYPERLEDGER-IPFS.git
cd SECURE-EHR-HYPERLEDGER-IPFS
```

---

### 🔧 1. Setup Backend

```bash
cd backend
npm install
node app.js
```

> Runs at `http://localhost:4000`

---

### 🔧 2. Setup Frontend

```bash
cd ../frontend
npm install
npm start
```

> Opens at `http://localhost:3000`

---

### 🔧 3. Launch Hyperledger Fabric Network

```bash
cd ../fablo
./fablo up
```

Initialize ledger:

```bash
peer chaincode invoke \
  -o localhost:7030 \
  -C healthcare-channel \
  -n hospitalcc \
  --peerAddresses localhost:7061 \
  --peerAddresses localhost:7041 \
  --peerAddresses localhost:7081 \
  --peerAddresses localhost:7101 \
  --peerAddresses localhost:7121 \
  -c '{"Args":["HospitalContract:initLedger"]}'
```

---

## 📤 Upload & View Records

### 🖥️ Using UI

* Login as Doctor, Patient, Lab, etc.
* Go to **Upload Reports**
* Upload file and submit

### 🧪 Using CURL

```bash
curl -X POST http://localhost:4000/api/patient/upload \
  -F "file=@/path/to/report.pdf" \
  -F "linkedId=P001"
```

---

## 📜 Query from Fabric CLI

Set environment:

```bash
export CORE_PEER_LOCALMSPID="DoctorMSP"
export CORE_PEER_ADDRESS="localhost:7061"
export CORE_PEER_TLS_ROOTCERT_FILE=$PWD/fablo-target/fabric-config/crypto-config/peerOrganizations/doctor.healthcare.com/peers/peer0.doctor.healthcare.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=$PWD/fablo-target/fabric-config/crypto-config/peerOrganizations/doctor.healthcare.com/users/Admin@doctor.healthcare.com/msp
```

Query example:

```bash
peer chaincode query \
  -C healthcare-channel \
  -n hospitalcc \
  -c '{"Args":["HospitalContract:getPatientDetails", "P001"]}'
```

---

## 🌍 Sample IPFS Report URL

```bash
https://ipfs.io/ipfs/Qm...yourHash
```

---

## 🎯 Git LFS Commands (if using large files)

```bash
git lfs track "*.zip"
git lfs track "*.tar"
git lfs track "*.bin"
git add .gitattributes
git commit -m "Track large files using Git LFS"
git push
```

---

## 🧹 Recommended `.gitignore`
node_modules/
fablo/node_modules/
frontend/node_modules/
backend/node_modules/
# Build & cache
build/
*.tar
*.zip
*.log
*.deb
.cache/
*.pack
# Sensitive files
.env
wallets-backup/
fablo-target/
---

## 🙋‍♀️ Project Contribution

This project was developed as part of my **academic internship** at **NIT Warangal**, and was **individually designed and implemented** by *Boga Sushmita*.

It integrates **Hyperledger Fabric**, **IPFS**, **MongoDB**, **Node.js**, and **React.js** into a complete decentralized EHR system. I handled the full development lifecycle including setup, coding, testing, and deployment.

📧 [SushmitaBoga373@gmail.com](mailto:SushmitaBoga373@gmail.com)  
🌐 [github.com/Susmitha123205](https://github.com/Susmitha123205)

---



## 📃 License

This project is licensed under the **MIT License**.

---

⭐ **Give this repo a star if you found it useful!**
💬 *Feel free to open issues or contribute improvements.*

```


