require('dotenv').config();
const Airtable = require('airtable-node');
 
const airtable = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
  .base('appSDUSVBT43SZhKK')
  .table('products')

exports.handler = async (event, context) => {
    const {id} = event.queryStringParameters;
    if(id) {
        try {
            const product = await airtable.retrieve(id);
            if (product.error) {
                return {
                    statusCode: 404,
                    body: `No product with id ${id}`
                }
            }
            return{
                statusCode: 200,
                body: JSON.stringify(product)
            } 
        }catch (err) {
            return{
                statusCode: 500,
                body: 'Server Error'
            }
        }  
    }
    // same route, if has id,then search for sigle product
    // no, then provide all list
    try {
        const {records} = await airtable.list();
        const products = records.map((product) => {
            const {id} = product;
            const {name, image, price} = product.fields;
            // console.log(product.fields);
            const url = image[0].url;
            return {id,name,url,price};
        });
        return{
            statusCode: 200,
            body: JSON.stringify(products)
        };
    }catch(err) {
        return{
            statusCode: 500,
            body: 'Server Error'
        }
    }
}