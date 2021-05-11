//https://www.accountsjs.com/docs/transports/rest-client

import { SHA256 } from 'crypto-js';
import { AccountsClient } from '@accounts/client';
import { AccountsClientPassword } from '@accounts/client-password';
import { RestClient } from '@accounts/rest-client';
import { get } from 'lodash';

let apiHostFromSettings = get(Meteor, 'settings.public.interfaces.accountsServer.host') + ":" + get(Meteor, 'settings.public.interfaces.accountsServer.port');
console.log('Accounts.apiHost', apiHostFromSettings);

const accountsRest = new RestClient({
  // apiHost: 'http://localhost:4000',
  apiHost: apiHostFromSettings,
  rootPath: '/accounts'
});

const accountsClient = new AccountsClient({}, accountsRest);
const accountsPassword = new AccountsClientPassword(accountsClient, {
  // hashPassword: (password) => {
  //   // Here we hash the password on the client before it's sent to the server
  //   const hashedPassword = SHA256(password);
  //   return hashedPassword.toString();
  // }
});

export { accountsClient, accountsRest, accountsPassword };

