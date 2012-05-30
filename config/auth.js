var everyauth   = require('everyauth'),
    util        = require('util');

everyauth.github
    .appId('d3537ef57a252a911c53')
    .appSecret('c8da1fba0aaf4116c09cd7c6d6ea58167616c903')
    .findOrCreateUser( function (session, accessToken, accessTokenExtra, githubUserMetadata) {

        var promise = this.Promise();

        User.all({where: { githubId: githubUserMetadata.id }}, function(err, users) {
            if(err) {
                promise.fail(err);
            } else if(!users.length) {
                User.create({
                    name: githubUserMetadata.name,
                    email: githubUserMetadata.email,
                    githubId: githubUserMetadata.id
                }, function(err, user) {
                    if(err) {
                        promise.fail(err);
                    } else {
                        promise.fulfill(user);
                    }
                });
            } else {
                promise.fulfill(users[0]);
            }
        });

        // find or create user logic goes here
        /*console.log('accessTokenExtra:\n'
            + util.inspect(accessTokenExtra)
            + '\n\ngithubUserMetadata:\n'
            + util.inspect(githubUserMetadata));*/
        return promise;
    })
    .redirectPath('/');

module.exports = everyauth;