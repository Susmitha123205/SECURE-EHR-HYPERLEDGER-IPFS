FROM hyperledger/fabric-nodeenv:2.4

WORKDIR /usr/src/app

# Copy everything from your chaincode directory into the container
COPY package*.json ./
RUN npm install

COPY . .

# Required to expose the chaincode interface
CMD ["node", "index.js"]
