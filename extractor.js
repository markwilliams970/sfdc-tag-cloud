var
    _,
    fs,
    Promise,
    getAllData,
    dataDir;

_          = require('lodash');
fs         = require('fs');
Promise    = require('bluebird');
sfdc       = require('jsforce');

dataDir    = 'web/data/';
// Configuration and authentication information
var config = require('./sfdcConfig.json');


getAllData = function () {

    var sfdcConnection       = new sfdc.Connection({
        oauth2: {
            clientId         : config["sfdcClientId"],
            clientSecret     : config["sfdcClientSecret"],
            redirectUri      : config["sfdcRedirectUri"]
        },
        instanceUrl          : config["sfdcInstanceUrl"],
        accessToken          : config["sfdcAccessToken"],
        refreshToken         : config["sfdcRefreshToken"]
    });

    var foundTopicAssignment, foundCaseId, foundCaseThreadId, foundAccountName, caseInfo;

    sfdcConnection.sobject('TopicAssignment')
        .select('Id, TopicId, EntityType, EntityId, CreatedById, CreatedDate, Topic.Name')
        .where("CreatedDate >= 2017-10-02T00:00:00.000+0000")
        .execute(function(err, records) {

        if (records.length > 0) {

            var data = [];
            _.each(records, function(record) {
                thisRecord = {
                    "TopicName"   : record.Topic.Name,
                    "TopicId"     : record.TopicId,
                    "CreatedDate" : record.CreatedDate,
                    "CreatedById" : record.CreatedById,
                    "EntityType"  : record.EntityType,
                    "EntityId"    : record.EntityId
                }
                data.push(thisRecord);
            });
            console.log("Found %s Topic Tags Applied", records.length);
            console.log("Writing JSON data to %s.", dataDir + 'topics.json');
            fs.writeFileSync(dataDir + 'topics.json', JSON.stringify(data, null, '\t'));
        }
    }).on('error', function(err) {
        console.log(err);
    });
};

getAllData();