const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const bucketName = process.env.BUCKET;

exports.main = async function(event, context) {
    try {
        //Get name if present
        var widgetName = event.path.startsWith('/') ? event.path.substring(1) : event.path;

        if(method === "GET") {
            if(event.path === "/") {
                const data = await S3.listObjectsV2( { Bucket: bucketName}).promise();
                var body = {
                    widgets: data.Contents.map(function(e) { return e.key} )
                };
                return {
                    statusCode: 200,
                    headers: {},
                    body: JSON.stringify(body)
                };
            }

            if(widgetName) {
                // GET /name to get info on widget name
                const data = await S3.getObject({ Bucket: bucketName, Key: widgetName }).promise();
                var body = data.Body.toString('utf-8')

                return {
                    statusCode: 200,
                    headers: {},
                    body: JSON.stringify(body)
                };
            }
        }

        // We only accept GET for now
        return {
            statusCode: 400,
            headers: {},
            body: "We only accept GET /"
        };
    } catch(error) {
        var body = error.stack || JSON.stringify(error, null, 2);
        return {
            statusCode: 400,
            headers: {},
            body: JSON.stringify(body)
        }
    }
}