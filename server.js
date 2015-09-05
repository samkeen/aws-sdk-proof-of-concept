var Hapi = require('hapi');
var Good = require('good');
var AWS = require('aws-sdk');

AWS.config.dynamodb = {
    apiVersion: '2012-08-10',
    region: 'us-west-2'
};

var server = new Hapi.Server();
server.connection({port: 3000});

server.route({
    method: 'GET',
    path: '/dynamo-test/tables',
    handler: function (request, reply) {

        var dynamodb = new AWS.DynamoDB();

        dynamodb.listTables(function (error, data) {
            if (error) {
                console.log(error); // error is Response.error
            } else {
                console.log(data); // data is Response.data
                reply(data);
            }
        });

    }
});

server.route({
    method: 'GET',
    path: '/dynamo-test/{guid}',
    handler: function (request, reply) {

        var dynamodb = new AWS.DynamoDB();
        var params = {
            Key: {
                guid: {
                    S: request.params.guid
                }
            },
            TableName: 'test-coinstar',
            AttributesToGet: ['graph_id'],
            ConsistentRead: false,
            ReturnConsumedCapacity: 'TOTAL'
        };

        dynamodb.getItem(params, function (error, data) {
            if (error) {
                console.log(error); // error is Response.error
                reply('BOOM');
            } else {
                console.log(data); // data is Response.data
                reply(data);
            }
        });

    }
});

/**
 * see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#putItem-property
 */
server.route({
    method: 'PUT',
    path: '/dynamo-test',
    handler: function (request, reply) {
        var dynamodb = new AWS.DynamoDB();

        var graphId = request.payload.graphId ? request.params.graphId : 'NONE';

        var params = {
            Item: {
                guid: {
                    S: request.payload.guid
                },
                graph_id: {
                    S: graphId
                }
            },
            TableName: 'test-coinstar',
            ReturnConsumedCapacity: 'TOTAL',
            ReturnItemCollectionMetrics: 'SIZE'
            //ReturnValues: 'ALL_NEW'
        };

        dynamodb.putItem(params, function (error, data) {
            if (error) {
                console.log(error); // error is Response.error
                reply({"message": error.message})
            } else {
                console.log(data); // data is Response.data
                reply(data);
            }
        });

    }
});

server.register({
    register: Good,
    options: {
        reporters: [{
            reporter: require('good-console'),
            events: {
                response: '*',
                log: '*'
            }
        }]
    }
}, function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start(function () {
        var awsProfile = (typeof process.env.AWS_PROFILE == 'undefined') ? 'default' : process.env.AWS_PROFILE;
        server.log('info', 'Using AWS SDK Profile: ' + awsProfile);
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});

