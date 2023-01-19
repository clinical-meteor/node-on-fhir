//https://www.accountsjs.com/docs/transports/rest-client

import { SHA256 } from 'crypto-js';
import { AccountsClient } from '@accounts/client';
import { AccountsClientPassword } from '@accounts/client-password';
import { RestClient } from '@accounts/rest-client';
import { get } from 'lodash';
// import Session from '../../server/Session';
import { Session } from 'meteor/session';
import jwt from 'jsonwebtoken';

let apiHostFromSettings = get(Meteor, 'settings.public.interfaces.accountsServer.host') + ":" + get(Meteor, 'settings.public.interfaces.accountsServer.port');
console.log('Accounts.apiHost', apiHostFromSettings);

const accountsRest = new RestClient({
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

Meteor.startup(async function(){

  try {
    if(typeof(Storage) !== "undefined"){
      let tokens = await accountsClient.getTokens();
      console.log('tokens', tokens)
      if(get(tokens, 'accessToken')){
        let decoded = jwt.decode(tokens.accessToken, {complete: true});
        console.log('decoded', decoded)
        Session.set('accountsAccessToken', get(tokens, 'accessToken'))
        Session.set('accountsRefreshToken', get(tokens, 'refreshToken'))
      }          
    }
  } catch (error) {
    console.error(error)
  }

  if(typeof window === "object"){
    window.onbeforeunload = async function(){
      // Do something
      await accountsClient.clearTokens();
    }
     // OR
     window.addEventListener("beforeunload", async function(e){
      await accountsClient.clearTokens();
     }, false);  
  }  
})


export { accountsClient, accountsRest, accountsPassword };

