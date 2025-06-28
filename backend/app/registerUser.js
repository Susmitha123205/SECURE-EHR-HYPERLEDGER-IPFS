const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const orgUsers = {
    patient: ['user1', 'user2'],
    doctor: ['doctor1', 'doctor2'],
    pharmacy: ['pharm1', 'pharm2'],
    lab: ['lab1', 'lab2'],
    insurance: ['ins1', 'ins2']
};

async function registerUser(org, userId) {
    try {
        const ccpPath = path.resolve(__dirname, '..', '..', 'gateway', `connection-${org}.json`);
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        const caInfo = ccp.certificateAuthorities[`ca.${org}.healthcare.com`];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        const walletPath = path.join(__dirname, 'wallets', `${org}-wallet`);
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const userIdentity = await wallet.get(userId);
        if (userIdentity) {
            console.log(`✅ Identity for ${userId} already exists in wallet (${org})`);
            return;
        }

        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            console.log(`❌ Admin not enrolled for ${org}. Run enrollAdmin.js first.`);
            return;
        }

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // Use blank affiliation if you didn't define org.department1 in CA config
        const secret = await ca.register({
            enrollmentID: userId,
            role: 'client',
            affiliation: '' // <-- skip if you didn't configure affiliations
        }, adminUser);

        const enrollment = await ca.enroll({
            enrollmentID: userId,
            enrollmentSecret: secret,
        });

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: `${capitalize(org)}MSP`,
            type: 'X.509',
        };

        await wallet.put(userId, x509Identity);
        console.log(`✅ Registered and enrolled ${userId} in ${org}`);
    } catch (error) {
        console.error(`❌ Failed to register ${userId} in ${org}: ${error.message || error}`);
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Register users in each org
(async () => {
    for (const org of Object.keys(orgUsers)) {
        for (const userId of orgUsers[org]) {
            await registerUser(org, userId);
        }
    }
})();
