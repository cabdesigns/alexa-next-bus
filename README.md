# Alexa NextBus

An AWS Lambda function to power your Alexa Skill retrieving the next buses from your configured bus stop(s). [Read more](http://www.chrisbell.eu/bus-timetables-smart-home-alexa-node-js-aws-lambda/).

## Warning
**⚠ USE AT YOUR OWN PERIL! ⚠**

This project has been published for the educational benefit of anyone wanting to try AWS Lambda or Alexa Skills. This should not be the basis for any production applications.

This project was built on Mac OS X using node.js 6. Your results may vary but support will by limited.

## How to use

### 1 Create AWS Lambda and Alexa Skill

Create your skeleton/hello world AWS Lambda and Alexa Skill. [Read more](https://developer.amazon.com/alexa-skills-kit/alexa-skill-quick-start-tutorial).

When you've setup both and they're linked together, you're ready to move on.

### 2 Create TransportAPI account

[Setup an account](https://developer.transportapi.com/), make an app and make note of the app ID and app key. We'll need this to configure the Lambda with.

### 3 Configure Lambda env vars

Configure your AWS Lambda with the following env variables:

* `ATCO_CODES` - A JSON formatted array of your the bus stop IDs you want to use. E.g. `["450011119", "450010285"]`. **NOTE**: This is *slightly* different to the SMS code you might see on the bus stop.
* `SKILL_ID` - Looks something like `amzn1.ask.skill.XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX`, accessible via [Amazon Developer Console](https://developer.amazon.com/edw/home.html).
* `TRANSPORT_API_APP_ID` - Value from previous step.
* `TRANSPORT_API_APP_KEY` - Value from previous step.

### 4 Configure Skill

Edit your skill in [Amazon Developer Console](https://developer.amazon.com/edw/home.html) to configure the following.

#### Skill information

Set the invocation name to "next bus". That means you'll be able to say "Alexa, next bus" and the magic happens.  

#### Interaction model
Paste the contents of `speechAssets/IntentSchema.json` into the Intent Schema of the Interaction Model section.

Still on the Interaction Model section, paste the contents of `speechAssets/SampleUtterances.txt` into Sample Utterances.


###4 Build/upload/test

Run `npm run build` in order to generate a zip archive of the application.

Within AWS console for your function, you'll be able to add your function package as a zip. Upload it and test.

If successful, you should be able to move onto testing on a real device.

Try "**Alexa, next bus**" :)

## FAQs

#### How do I get the ATCO code for my bus stop(s)?

One of the easiest ways is to find your bus stop on [OpenStreetMap](https://www.openstreetmap.org/node/496714689). Clicking on the stop should reveal data including the all important `naptan:AtcoCode`. This is the value you want to use.
 
From experience (examining bus stops by First Leeds), this tends to just look like the SMS code but with an extra 0. You might be able to guess the ATCO code if data is not readily available on OpenStreetMap.

Alternatively, you can view the full data set from DfT [here](https://data.gov.uk/dataset/naptan).