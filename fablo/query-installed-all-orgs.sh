#!/bin/bash

# === Config ===
ORG_LIST=("patient" "doctor" "pharmacy" "lab" "insurance")
CC_LABEL="chaincode1_0.0.1"
BASE_PATH=$PWD/fablo-target/fabric-config/crypto-config
PORT_MAP=("patient" 7061 "doctor" 7041 "pharmacy" 7081 "lab" 7101 "insurance" 7121)

# === Script ===
for ORG in "${ORG_LIST[@]}"; do
  ORG_CAPITALIZED="$(tr '[:lower:]' '[:upper:]' <<< ${ORG:0:1})${ORG:1}"
  PEER="peer0.${ORG}.healthcare.com"

  for ((i=0; i<${#PORT_MAP[@]}; i+=2)); do
    if [[ "${PORT_MAP[i]}" == "$ORG" ]]; then
      PORT="${PORT_MAP[i+1]}"
    fi
  done

  echo ""
  echo "🔷 Querying installed chaincode for ORG: $ORG_CAPITALIZED ($PEER:$PORT)"

  PEER_PATH=$BASE_PATH/peerOrganizations/${ORG}.healthcare.com/peers/${PEER}
  ADMIN_PATH=$BASE_PATH/peerOrganizations/${ORG}.healthcare.com/users/Admin@${ORG}.healthcare.com/msp
  TLS_CA_FILE=$PEER_PATH/tls/ca.crt

  export CORE_PEER_LOCALMSPID="${ORG_CAPITALIZED}MSP"
  export CORE_PEER_ADDRESS=localhost:${PORT}     # Use localhost here for Docker port forwarding
  export CORE_PEER_MSPCONFIGPATH=$ADMIN_PATH

  if [[ -f "$TLS_CA_FILE" ]]; then
    export CORE_PEER_TLS_ENABLED=true
    export CORE_PEER_TLS_ROOTCERT_FILE=$TLS_CA_FILE
    TLS_CMD="--tls --peerAddresses $CORE_PEER_ADDRESS --tlsRootCertFiles $TLS_CA_FILE"
    echo "✅ TLS is ENABLED"
  else
    export CORE_PEER_TLS_ENABLED=false
    TLS_CMD="--peerAddresses $CORE_PEER_ADDRESS"
    echo "⚠ TLS is DISABLED or cert not found"
  fi

  # If admin MSP path missing, skip
  if [[ ! -d "$ADMIN_PATH" ]]; then
    echo "❌ Admin MSP for $ORG is missing at $ADMIN_PATH"
    continue
  fi

  # Run the query
  peer lifecycle chaincode queryinstalled $TLS_CMD | tee installed_${ORG}.txt

done
