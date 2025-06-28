const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const orgs = ['patient', 'doctor', 'pharmacy', 'lab', 'insurance'];

async function enrollAdmin(org) {
    try {
        const ccpPath = path.resolve(__dirname, '..', '..', 'gateway', `connection-${org}.json`);
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        const caURL = "http://localhost:7060";
        const caInfo = ccp.certificateAuthorities[`ca.${org}.healthcare.com`];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        const walletPath = path.join(__dirname, 'wallets', `${org}-wallet`);
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const identity = await wallet.get('admin');
        if (identity) {
            console.log(`✅ Admin already enrolled for ${org}`);
            return;
        }

        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: `${capitalize(org)}MSP`,
            type: 'X.509',
        };

        await wallet.put('admin', x509Identity);
        console.log(`✅ Successfully enrolled admin for ${org}`);
    } catch (error) {
        console.error(`❌ Failed to enroll admin for ${org}: ${error}`);
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Enroll admins for all orgs
(async () => {
    for (const org of orgs) {
        await enrollAdmin(org);
    }
})();
