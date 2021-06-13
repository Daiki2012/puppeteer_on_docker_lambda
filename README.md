# Take screenshot and convert to pdf with Puppeteer on Docker Lambda
This AWS Lambda function receives an url and Puppeteer renders the web page on Headless Chrome and convert it to a pdf file. Base64 pdf data will be returned. 
Japanese article:

## Motivation
Wanted to create a service for web scraping and testing. The service should take an url as an input, and wait for the page to fully-loaded and convert html page to a pdf. 

## Identifying Best Approach
To convert a html to pdf, there are several options. Easiest solution would be using a js library. It is light weight, and easy to manage. The problem with this is flexibility. Taking screenshot is ok, but if you want to reuse the function for differnet purpose (web scraping etc), this does not work. Furthermore, since this is not taking the actual screenshot, instead converting DOM to canvas, there are some known issues (final output does not exactly match with the original image). If you are interested in js library, check this. [html2canvas](https://github.com/niklasvh/html2canvas)

[Puppeteer](https://github.com/puppeteer/puppeteer) can control Headless Chrome, and access to Chrome DevTools, it has more potential to use this in various projects. This is the reason why Puppeteer was selected. To minimize the onging cost, I decided to use AWS serverless solution, Lambda. 

To control Headless Chrome on Lambda, [chrome-aws-lambda](https://github.com/alixaxel/chrome-aws-lambda) was needed.Lambda layer can store a zipped file under 50MB, and the chrome-aws-lambda is 44MB, and fit in this size. The smaller size means it is much faster to load in AWS Lambda, and this will reduce the overall ongoing cost.   

## Why use Docker and ECS
AWS annoucneed contaienr image suport for Lambda in 2020 Dec. This means that you can build Docker image locally with AWS Lambda image, and add your custom scirpts to it. Previously, it was hard to develop, test and deploy Lambda functions, but with the Container image support, this will be streamlined.  

## Prerequisite
Docker Desktop (Mac OS Recommended. Shell scripts in this repo was tested only on Mac)
- AWS account and for S3, ECS, Lambda
- Basics understanding in Docker, SAM and ECS
[setup AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) for deloyment
[SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html).


## Packages
You need to select appropriate versions for each. As the [chrome-aws-lambda](https://github.com/alixaxel/chrome-aws-lambda) package depends on the underlying puppeteer version.
```
chrome-aws-lambda@10.0.0 
puppeteer-core@10.0.0
```

## Local run
You need to setup docker, and download aws-lambda-rie binaries 
`./get_lambda_rie.sh`

#### Create Docker image
This contains 2 docker commands. Docker build and run. Docker image is created, and localhost:9000 will be used as a port.
`./docker_build_run.sh`

#### Test running image locally
From terminal or Postman, execute below. Make sure to specify your favorite website. This will return base64 data. The data can be converted to pdf file with a site such as [Base64Guru](https://base64.guru/converter/decode/pdf)
`curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"url": "https://yourfavoritesite.com"}'`

## Deploy to AWS
Before execution, make sure to set credentials and region in AWS cli config files. The file defines the s3 bucket. Make sure the name is unique. 
All deploy steps are in
`deploy/deploy_with_sam.sh`

## References
[Puppeteer on AWS Lambda で日本語対応したキャプチャを撮影してS3にアップロードするまでの設定](https://qiita.com/zyyx-matsushita/items/c33f79e33f242395019e)
[HTML to PDF using a Chrome puppet in the cloud](https://morioh.com/p/d8043f7defbf)

