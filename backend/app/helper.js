'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');

const getCCP = async (org) => {
    let ccpPath;
    switch (org) {
        case "patient":
            ccpPath = path.resolve(__dirname, '..', 'config', 'connection-profile-patient.json');
            break;
        case "doctor":
            ccpPath = path.resolve(__dirname, '..', 'config', 'connection-profile-doctor.json');
            break;
        case "pharmacy":
            ccpPath = path.resolve(__dirname, '..', 'config', 'connection-profile-pharmacy.json');
            break;
        case "lab":
            ccpPath = path.resolve(__dirname, '..', 'config', 'connection-profile-lab.json');
            break;
        case "insurance":
            ccpPath = path.resolve(__dirname, '..', 'config', 'connection-profile-insurance.json');
            break;
        default:
            throw new Error("Invalid organization");
    }

    console.log("CCP Path: ", ccpPath);
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    return ccp;
};

const getWalletPath = async (org) => {
    const walletDir = path.join(__dirname, 'wallets');
    const walletPath = path.join(walletDir, `${org}-wallet`);
    console.log("Wallet Path: ", walletPath);
    return walletPath;
};

const getAffiliation = async (org) => {
    return `${org}.department1`;
};

const getCaInfo = async (org, ccp) => {
    const caKey = Object.keys(ccp.certificateAuthorities)[0];
    return ccp.certificateAuthorities[caKey];
};

const getCaUrl = async (org, ccp) => {
    const caInfo = await getCaInfo(org, ccp);
    return caInfo.url;
};

const enrollAdmin = async (org, ccp) => {
    try {
        console.log(`📥 Enrolling admin for ${org}`);
        const caInfo = await getCaInfo(org, ccp);
        const caTLSCACerts = caInfo.tlsCACerts.pem || fs.readFileSync(caInfo.tlsCACerts.path);
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        const walletPath = await getWalletPath(org);
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const identity = await wallet.get('admin');
        if (identity) {
            console.log('✅ Admin already enrolled');
            return;
        }

        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });

        const mspId = `${org.charAt(0).toUpperCase() + org.slice(1)}MSP`;

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: mspId,
            type: 'X.509',
        };

        await wallet.put('admin', x509Identity);
        console.log('✅ Successfully enrolled admin and imported into wallet');
    } catch (error) {
        console.error(`❌ Failed to enroll admin: ${error}`);
    }
};

const getRegisteredUser = async (username, userOrg, isJson) => {
    const ccp = await getCCP(userOrg);
    const caURL = await getCaUrl(userOrg, ccp);
    const ca = new FabricCAServices(caURL);

    const walletPath = await getWalletPath(userOrg);
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`📁 Wallet path: ${walletPath}`);

    const userIdentity = await wallet.get(username);
    if (userIdentity) {
        console.log(`✅ Identity for ${username} already exists`);
        return {
            success: true,
            message: `${username} enrolled successfully`
        };
    }

    let adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
        await enrollAdmin(userOrg, ccp);
        adminIdentity = await wallet.get('admin');
    }

    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');
    const secret = await ca.register({
        affiliation: await getAffiliation(userOrg),
        enrollmentID: username,
        role: 'client'
    }, adminUser);

    const enrollment = await ca.enroll({ enrollmentID: username, enrollmentSecret: secret });

    const mspId = `${userOrg.charAt(0).toUpperCase() + userOrg.slice(1)}MSP`;

    const x509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
        },
        mspId: mspId,
        type: 'X.509',
    };

    await wallet.put(username, x509Identity);
    console.log(`✅ User ${username} enrolled and imported into wallet`);

    return {
        success: true,
        message: `${username} enrolled successfully`
    };
};

const isUserRegistered = async (username, userOrg) => {
    const walletPath = await getWalletPath(userOrg);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get(username);
    return !!userIdentity;
};

const registerAndGetSecret = async (username, userOrg) => {
    const ccp = await getCCP(userOrg);
    const caURL = await getCaUrl(userOrg, ccp);
    const ca = new FabricCAServices(caURL);
    const walletPath = await getWalletPath(userOrg);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userIdentity = await wallet.get(username);
    if (userIdentity) {
        return {
            success: true,
            message: `${username} already exists`,
        };
    }

    let adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
        await enrollAdmin(userOrg, ccp);
        adminIdentity = await wallet.get('admin');
    }

    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');

    const secret = await ca.register({
        affiliation: await getAffiliation(userOrg),
        enrollmentID: username,
        role: 'client'
    }, adminUser);

    return {
        success: true,
        secret: secret
    };
};

// === EXPORTS ===
module.exports = {
    getCCP,
    getWalletPath,
    getRegisteredUser,
    isUserRegistered,
    enrollAdmin,
    registerAndGetSecret
};
