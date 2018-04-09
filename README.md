
# SOAP-HELPER


## How to use

```
const Helpler = require('soap-helpler');

const configCertificates = {};
const configSoapClient = {};

const Certificates = new Helpler.Certificates(configCertificates);
const SoapClient = new Helpler.SoapClient(configSoapClient);

```
### Certificates
#### Config object
	{
		AWS: {
		region:  AWS_REGION,
		S3: {
			signing_bucket:  SIGNING_BUCKET,
			signing_prefix:  SIGNING_PREFIX,
			signing_private_key:  SIGNING_PRIVATE_KEY,
			signing_public_key:  SIGNING_PUBLIC_KEY,
			signing_certificate_passphrase:  SIGNING_KEY_PASSPHRASE
			}
		}
	}
	// If not pass in contructor when new, object will created based on ENV

#### Methods
- decryptCertificates
	```
		params: no
		return Promise Bluebird return signing
		---------------------------------------------
		const Helpler = require('soap-helpler');
		const Certificates = new Helpler.Certificates(); // <-- Using ENV config
		Certificates.decryptCertificates()
			.then()
			.catch()
		
	```
### SoapClient
#### Config object
		{
			ESBIntegrationAction:  ESB_INTEGRATION_ACTION,
			ESBIntegrationURL:  ESB_INTEGRATION_URL,
			DIBPEnvironment:  DIBP_ENVIRONMENT,
		}
		// If not pass in contructor when new, object will created based on ENV
#### Methods
- signXML
	```
		params: no
		- requestXML: XML string request
		- certificates: certificates { privateKey: string, publicKey: string }
		return Promise Bluebird return response
		---------------------------------------------
		const Helpler = require('soap-helpler');
		const SoapClient = new Helpler.SoapClient(); // <-- Using ENV config
		const signXML = '<?xml version="1.0" encoding="UTF-8"?>...';
		const certificates = { privateKey: '', publicKey: ''};
		SoapClient.SignXML(signXML, certificates)
			.then()
			.catch()
	```
