const otpAuth = require('./OTP/otpAuth');
const constants = require('./OTP/constants');
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

const onPremise = require('../../ReOAuth/OnPrem Module/onPremise');
const blockchain = require('../../ReOAuth/BlockChain/passwordManager');

const masterPasswordKey = 'masterPassword';

async function requestOtp(phNo) {
  try {
    let result = await otpAuth.sendOtp(phNo);
    return result.auth_id;
  } catch(e) {
    throw e;
  }
}

async function verifyOtp(otp, authId) {
  try {
    let result = await otpAuth.sendOtp(phNo);
    return result.flag == constants.responseFlags.ACTION_COMPLETE;
  } catch(e) {
    throw e;
  }
}

async function getOnPremIds() {
  return onPremise.getIds(getMasterPassword());
}

async function getGoogleDriveIds() {

}

async function getTrustedDeviceIds() {

}

async function getBlockchainIds() {
  return blockchain.getIds();
}

async function getIds() {
  let ids = await getOnPremIds();
  // ids = ids.concat(await getGoogleDriveIds());
  // ids = ids.concat(await getTrustedDeviceIds());
  ids = ids.concat(await getBlockchainIds());

  return ids;
}

async function addId(domain, id, password, securityLevel) {
  switch(securityLevel) {
    case 0:
    onPremise.saveId(domain, id, password, getMasterPassword());
      break;
    case 1:
      break;
    case 2:
      break;
    case 3:
      await blockchain.saveId(domain, id, password);
      break;
    default:

  }
}

async function deleteId(domain, id, securityLevel) {
  switch(securityLevel) {
    case 0:
      onPremise.deleteAccount(domain, id);
      break;
    case 1:
      break;
    case 2:
      break;
    case 3:
      blockchain.deleteId(domain, id);
      break;
    default:

  }
}

async function changePasswordForId(domain, id, pass, securityLevel) {
  switch(securityLevel) {
    case 0:
      onPremise.changePasswordForId(domain, id, pass, getMasterPassword());
      break;
    case 1:
      break;
    case 2:
      break;
    case 3:
      blockchain.saveId(domain, id, pass);
      break;
    default:

  }
}

async function createServer() {
  return '12345';
}

async function connect(pin) {
  return '12345' === pin;
}

async function loginToGoogle() {

}

async function setMasterPassword(password) {
  localStorage.setItem(masterPasswordKey, password);

  blockchain.setMasterPassword(password);
}

async function getMasterPassword() {
  return 'master@123';//localStorage.getItem(masterPasswordKey);
}

module.exports = {
  requestOtp,
  verifyOtp,
  addId,
  getIds,
  changePasswordForId,
  deleteId,
  setMasterPassword,
  createServer,
  connect,
  loginToGoogle
}

async function main() {
  await addId('mno.com', '1123@xyz.com', '112345', 0);
  console.log("saved to drive");
  await addId('pqr.com', 'xyz@xyz.com', '56789', 3);
  console.log("saved to bcd");
  let ids = await getIds();
  console.log(ids);

}

main();
