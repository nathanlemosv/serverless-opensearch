const axios = require('axios');

exports.main = async function (event) {
    const { Message } = event.Records[0].Sns;
    const headers = {
        'Authorization': `Basic ${Buffer.from(`master:${process.env.OPENSEARCH_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/json'
    }
    try {
        await axios.post(`https://${process.env.OPENSEARCH_ENDPOINT}/document-index/_doc`,
            JSON.parse(Message),
            {
                headers
            }
        )
    } catch (e) {
        console.log('Error: ', e);
    }
}