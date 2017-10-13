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
var topicCategories = require('./topicCategories.json');

var productTopics       = topicCategories.product;
var componentTopics     = topicCategories.component;
var subComponentTopics  = topicCategories.subcomponent;
var symptomTopics       = topicCategories.symptom;
var causeTopics         = topicCategories.cause;

const CATEGORY_PRODUCT        = "Product";
const CATEGORY_COMPONENT      = "Component";
const CATEGORY_SUBCOMPONENT   = "Sub-component";
const CATEGORY_SYMPTOM        = "Symptom";
const CATEGORY_CAUSE          = "Cause";

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

            var productData      = [];
            var componentData    = [];
            var subComponentData = [];
            var symptomData      = [];
            var causeData        = [];

            _.each(records, function(record) {
                thisRecord = {
                    "TopicName"     : record.Topic.Name,
                    "TopicId"       : record.TopicId,
                    "TopicCategory" : "N/A",
                    "CreatedDate"   : record.CreatedDate,
                    "CreatedById"   : record.CreatedById,
                    "EntityType"    : record.EntityType,
                    "EntityId"      : record.EntityId,
                };

                if (productTopics.indexOf(record.Topic.Name) !== -1 ) {
                    thisRecord.TopicCategory = CATEGORY_PRODUCT;
                    productData.push(thisRecord);
                }
                if (componentTopics.indexOf(record.Topic.Name) !== -1) {
                    thisRecord.TopicCategory = CATEGORY_COMPONENT;
                    componentData.push(thisRecord);
                }
                if (subComponentTopics.indexOf(record.Topic.Name) !== -1) {
                    thisRecord.TopicCategory = CATEGORY_SUBCOMPONENT;
                    subComponentData.push(thisRecord);
                }
                if (symptomTopics.indexOf(record.Topic.Name) !== -1) {
                    thisRecord.TopicCategory = CATEGORY_SYMPTOM;
                    symptomData.push(thisRecord);
                }
                if (causeTopics.indexOf(record.Topic.Name) !== -1) {
                    thisRecord.TopicCategory = CATEGORY_CAUSE;
                    causeData.push(thisRecord);
                }
            });
            console.log("Found %s Topic Tags Applied", records.length);

            console.log("Writing Product JSON data to %s.", dataDir + 'product_topics.json');
            fs.writeFileSync(dataDir + 'product_topics.json', JSON.stringify(productData, null, '\t'));

            console.log("Writing Component JSON data to %s.", dataDir + 'component_topics.json');
            fs.writeFileSync(dataDir + 'component_topics.json', JSON.stringify(componentData, null, '\t'));

            console.log("Writing Sub-component JSON data to %s.", dataDir + 'subcomponent_topics.json');
            fs.writeFileSync(dataDir + 'subcomponent_topics.json', JSON.stringify(subComponentData, null, '\t'));

            console.log("Writing Symptom JSON data to %s.", dataDir + 'symptom_topics.json');
            fs.writeFileSync(dataDir + 'symptom_topics.json', JSON.stringify(symptomData, null, '\t'));

            console.log("Writing Cause JSON data to %s.", dataDir + 'cause_topics.json');
            fs.writeFileSync(dataDir + 'cause_topics.json', JSON.stringify(causeData, null, '\t'));
        }
    }).on('error', function(err) {
        console.log(err);
    });
};

getAllData();