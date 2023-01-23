const replaceMethod = (source, dest, callbackify, argumentsTransformation, returnValueTransformation) => {
    argumentsTransformation = argumentsTransformation || (args => args);
    returnValueTransformation = returnValueTransformation || (retVal => retVal);
  
    source.obj[source.method] = (...args) => {
      let methodWithContext;
  
      if (typeof dest.method === 'string') {
        methodWithContext = dest.obj[dest.method].bind(dest.obj);
      } else {
        methodWithContext = dest.method.bind(dest.obj, dest.obj);
      }
  
      let baseRet, catchedErr;
  
      try {
        baseRet = methodWithContext(...(argumentsTransformation(args)));
      } catch (e) {
        catchedErr = e;
      }
  
      const isPromise = baseRet instanceof Promise;
      const ret = isPromise ? baseRet.then(res => returnValueTransformation(res)) : returnValueTransformation(baseRet);
  
      if (callbackify && args && args[args.length - 1] && typeof args[args.length - 1] === 'function') {
        const callback = args[args.length - 1];
  
        if (isPromise) {
          ret
            .then(result => {
              callback(null, result);
            })
            .catch(e => {
              callback(e, null);
            });
        } else {
          if (catchedErr) {
            callback(catchedErr, null);
          } else {
            callback(null, baseRet);
          }
        }
      } else {
        if (catchedErr && !callbackify) {
          throw catchedErr;
        } else {
          return ret;
        }
      }
    };
  };
  
const clearMeteorOldTokens = Accounts => {
  if (!localStorage) {
    return;
  }

  localStorage.removeItem(Accounts.LOGIN_TOKEN_KEY);
  localStorage.removeItem(Accounts.LOGIN_TOKEN_EXPIRES_KEY);
  localStorage.removeItem(Accounts.USER_ID_KEY);
};

export const wrapMeteorClient = (Meteor, Accounts, AccountsClient) => {
  if (Accounts) {
    Meteor.clearInterval(Accounts._pollIntervalTimer);
    clearMeteorOldTokens(Accounts);

    replaceMethod({
        obj: Accounts,
        method: '_storedLoginToken',
      }, {
        obj: AccountsClient,
        method: 'tokens',
      },
      false,
      null,
      (result) => result.accessToken || undefined);
  }

  replaceMethod({
      obj: Meteor,
      method: 'loginWithPassword',
    }, {
      obj: AccountsClient,
      method: 'loginWithPassword',
    },
    true,
  );
  replaceMethod({
    obj: Meteor,
    method: 'logout',
  }, {
    obj: AccountsClient,
    method: 'logout',
  });
};