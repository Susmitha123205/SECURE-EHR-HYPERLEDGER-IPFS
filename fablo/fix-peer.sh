#!/bin/bash

set -e

MSP_PATH=~/sus123/fablo/fablo-target/fabric-config/crypto-config/peerOrganizations/patient.healthcare.com/users/Admin@patient.healthcare.com/msp
ADMIN_CERT="$MSP_PATH/signcerts/Admin@patient.healthcare.com-cert.pem"
ADMIN_CERT_DEST="$MSP_PATH/admincerts/Admin@patient.healthcare.com-cert.pem"

echo "Copying admin cert to admincerts folder..."
mkdir -p "$MSP_PATH/admincerts"
cp "$ADMIN_CERT" "$ADMIN_CERT_DEST"

echo "Exporting environment variables..."
export CORE_PEER_LOCALMSPID="PatientMSP"
export CORE_PEER_ADDRESS=localhost:7041
export CORE_PEER_MSPCONFIGPATH="$MSP_PATH"
export CORE_PEER_TLS_ENABLED=false

echo "Restarting peer container..."
docker restart peer0.patient.healthcare.com

echo "Waiting 5 seconds for peer to restart..."
sleep 5

echo "Listing channels..."
peer channel list
