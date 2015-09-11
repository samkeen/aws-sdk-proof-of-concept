var config = {};

config.awsAccountNumber = '';
config.awsAccountRegion = '';
config.awsDynamoDbSdkApiVersion = '2012-08-10';
config.awsSnsApiVersion = '2010-03-31';
config.awsSqsSdkApiVersion = '2012-11-05';

config.workQueueName = '';
config.workQueueWaitTime = ''; // seconds
config.workQueueVisibilityTimeout = ''; // seconds
config.workQueueMaxNumberOfMessages = '';

module.exports = config;