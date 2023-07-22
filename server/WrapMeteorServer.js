import { Meteor } from 'meteor/meteor';
import { get } from 'lodash';

export function wrapMeteorServer(Meteor, accountsServer){
  if((!get(Meteor.server.method_handlers, 'jsaccounts/validateLogout')) && (!get(Meteor.server.method_handlers, 'jsaccounts/validateLogin'))){

    Meteor.methods({
      'jsaccounts/validateLogout': function (accessToken) {
        const connection = this.connection;

        process.env.DEBUG_ACCOUNTS && console.log('accountsServer', accountsServer);
        process.env.DEBUG_ACCOUNTS && console.log('connection', connection);
        process.env.DEBUG_ACCOUNTS && console.log('accessToken', accessToken);

        if (AccountsServer) {
          Meteor._noYieldsAllowed(function () {
            accountsServer.logout(accessToken);
            // AccountsServer._removeTokenFromConnection(connection.id);
            // AccountsServer._setAccountData(connection.id, 'loginToken', null);
          });
        }

        // if(get(Meteor, 'settings.private.accessControl.enableHipaaLogging')){
        //   let newAuditEvent = { 
        //     "resourceType" : "AuditEvent",
        //     "type" : { 
        //       'code': 'DeactivateUser',
        //       'display': 'Deactivate User'
        //       }, 
        //     "action" : 'Deactivation',
        //     "recorded" : new Date(), 
        //     "outcome" : [{
        //       "coding": [{
        //         "display": "Operation Successful",
        //         "code": "success",
        //         "system": "http://hl7.org/fhir/issue-severity"
        //       }]
        //     }],
        //     "agent" : [{ 
        //       "name" : FhirUtilities.pluckName(selectedPatient),
        //       "who": {
        //         "display": FhirUtilities.pluckName(selectedPatient),
        //         "reference": "Patient/" + selectedPatientId
        //       },
        //       "requestor" : false
        //     }],
        //     "source" : { 
        //       "site" : Meteor.absoluteUrl(),
        //       "identifier": {
        //         "value": Meteor.absoluteUrl()
        //       }
        //     },
        //     "entity": [{
        //       "reference": {
        //         "reference": ''
        //       }
        //     }]
        //   };
        //   process.env.DEBUG_ACCOUNTS && console.log('Logging a hipaa event...', newAuditEvent);
        //   let hipaaEventId = Meteor.call("logAuditEvent", newAuditEvent);            
        // }

        this.setUserId(null);
      },
      'jsaccounts/validateLogin': function (accessToken) {
        const connection = this.connection;
        const meteorContext = this;

        const method = Meteor.wrapAsync(function (accessToken, callback) {

          // ServerValidator.validateToken(accessToken, meteorContext)
          accountsServer.findSessionByAccessToken(accessToken)
            .then(user => {
              callback(null, user);
            })
            .catch(e => {
              callback(e, null);
            })
        });

        const user = method(accessToken);
        const jsaccountsContext = {
          userId: user ? user.id : null,
          user: user || null,
          accessToken,
        };

        if (AccountsServer)  {
          Meteor._noYieldsAllowed(function () {
            AccountsServer._removeTokenFromConnection(connection.id);
            AccountsServer._setAccountData(connection.id, 'loginToken', jsaccountsContext.accessToken);
            // AccountsServer.logout(jsaccountsContext.accessToken);
          });
        }

        this.setUserId(jsaccountsContext.userId);

        return true;
      }
    });  
  }
}