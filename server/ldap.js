var ldap = Meteor.npmRequire('ldapjs'),
    assert = Npm.require('assert'),
    Future = Npm.require('fibers/future'),
    LDAP = {};

/* To enhance usability, we authenticate as quickly as possible
 * and return to the client. User data can be scraped in later
 * async calls.
 */
LDAP.quickAuth = function (options) {
  var username = options.username.trim().toLowerCase();
  LDAP.quickClient = ldap.createClient({url: 'ldaps://ldap.rit.edu'});
  var exec = Meteor.sync(function (done) {
    var bindDN = 'uid=' + username + ',ou=People,dc=rit,dc=edu';
    LDAP.quickClient.bind(bindDN, options.password, function onQuickLDAPBind (err) {
      done(err);
    });
  });
  if (!exec.err) {
    var query = {username: username};
    Meteor.users.upsert(query, {$set: query, $setOnInsert: {evaluationCounts: [], sectionIds: []}});
  }
  return exec;
};

LDAP.updateAccountMetadata = function (username) {
  var opts = {};
  var bindDN = 'uid=' + username + ',ou=People,dc=rit,dc=edu';
    var esUser = LDAP.quickClient.search(bindDN, opts, Meteor.bindEnvironment(function(err, res) {
      assert.ifError(err);
      res.on('searchEntry',  Meteor.bindEnvironment(function(entry) {
        //console.log('entry: ' + JSON.stringify(entry.object));
        Meteor.users.update(
          {username: username},
          {
            $set: {
              identity: {
                name: entry.object.cn,
                firstName: entry.object.givenName,
                lastName: entry.object.sn
              }
            }
          });
      }));
      res.on('searchReference', function(referral) {
        //console.log('referral: ' + referral.uris.join());
      });
      res.on('error', function(err) {
        console.error('error: ' + err.message);
      });
      res.on('end', function(result) {
        //console.log('status: ' + result.status);
      });
    }));
  //var sectionIds = _.pluck(Meteor.users.getSections(esUser), "_id");

}

Accounts.registerLoginHandler('ldap', function (request) {
  var username = request.username.trim().toLowerCase(),
      auth = LDAP.quickAuth(request);
  if (!auth.error) {
    var user = Meteor.users.findOne({username: username});
    // Load account metadata asynchronously
    Meteor.setTimeout(function() { LDAP.updateAccountMetadata(username); }, 0);
    return {userId: user._id};
  } else {
    return {error: auth.error};
  }
});
