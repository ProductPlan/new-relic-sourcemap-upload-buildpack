// Get api key and app id
const apiKey = process.env.NEW_RELIC_SOURCE_MAPS_API_KEY;
const applicationid = process.env.NEW_RELIC_APPLICATION_ID;
// if (!apiKey) throw new Error("Must provide NR api key")
// if (!applicationid) throw new Error("Must provide NR application id")
const dir = process.env.DIR

// Get main nr package and log the manifest
const publishSourcemap = require('@newrelic/publish-sourcemap').publishSourcemap;
const manifest = require(`${dir}/public/packs/manifest.json`);
console.log("webpack manifest:", manifest);

// Build a queue from the manifest of source maps to upload
const queue = [];
Object.values(manifest).forEach(value => {
    if (value.includes(".js.map")) {
        queue.push({
            sourcemapUrl: `https://sassets0.productplan.com${value}`.replace(".map", ""),
            javascriptUrl: `https://sassets0.productplan.com${value}`,
            // applicationId: applicationid,
            // apiKey: apiKey
        })
    }
})

// Log the queue - really only useful for local debugging
// Should not be left on in the pipeline as it exposes the api key
console.log("source map upload queue:", queue);

// Loop over and upload source maps
// Note: per the docs there are some limits to these uploads:
// > - You can upload a maximum of 100 source maps per minute
// > - You can upload a maximum of 5,000 source maps per day
// > - Source map files can be a maximum of 50Mb in size.
// https://docs.newrelic.com/docs/browser/new-relic-browser/browser-pro-features/upload-source-maps-api/
// const handleResponse = (err)=> { console.log(err || `Source map upload done`)}
// queue.forEach(entry => publishSourcemap(entry, handleResponse).then(console.log));