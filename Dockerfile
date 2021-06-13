FROM public.ecr.aws/lambda/nodejs:14

RUN npm install chrome-aws-lambda@10.0.0 puppeteer-core@10.0.0
COPY src/*  ${LAMBDA_TASK_ROOT}

CMD [ "app.handler" ]
