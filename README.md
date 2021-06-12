# Use Puppeteer with Docker Lambda, and generate pdf file
This creates an AWS Lambda function. When the Lambda receives an url, Puppeteer renders the web page on Headless Chrome and convert it to a pdf file. 
Base64 pdf data will be returned. 
More detailed info, go here 
https://dev.to/megabotan/puppeteer-performance-in-aws-lambda-docker-containers-2325

## Prerequisite
Docker desktop for local testing
AWS account for deployment

## Local run
You need to setup docker, and download aws-lambda-rie binaries `./download_rie.sh`

#### Run AWS based docker image
`./docker_build_run.sh`

#### Test running image locally
`curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"url": "https://yourfavoritesite.com"}'`

## Deploy
First you have to [setup AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html). 
Don't forget to set credentials and region in AWS cli config files.
After that install [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html).

The file defines the s3 bucket. Make sure the name is unique. 
All deploy steps are in `deploy/deploy_with_sam.sh`
