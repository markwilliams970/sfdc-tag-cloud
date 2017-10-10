# Flowdock Visualizations

### Screenshot


### Setup

```bash
npm install
npm install -g static
```

### Running

First you have to extract the data from Salesforce

```bash
node extractor.js StartDateISO8601
```

Example:

```bash
node extractor.js "2017-10-02T00:00:00.000+0000"
```

This will extract the data and put it in the web/data directory. After
you have extracted all of the information you can spin up the web
server.

```bash
cd web
python -m SimpleHTTPServer
```

Now navigate to http://localhost:8000/
Enjoy!

### Adding more visualizations

TODO: Documentation :)