async function launchBrowser() {
  try { // for aws-based image
    const chromium = require('chrome-aws-lambda');
    console.info('launching chrome-aws-lambda browser');
    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    return browser;
  } catch (e) { // for custom-built image
    console.info('launching puppeteer browser');
  }
}

async function lambdaHandler(event, context) {
  console.info(`EVENT ${JSON.stringify(event, null, 2)}`);
  const browser = await launchBrowser();
  console.info('browser launched');
  const page = await browser.newPage();
  console.info('opened new tab');
  //let extractedText = '';
  let bodyText = '';
  try {
    await page.goto(event.url, {
      waitUntil: 'networkidle0',
      timeout: 10 * 1000,
    });
    console.info('page opened');
		//extractedText = await page.$eval('*', (el) => el.innerText);
  	const stream = await page.pdf();
    bodyText = stream.toString("base64");
    console.info('pdf created');
  } finally {
    console.info('finally');
    await page.close();
    console.info('page closed');
    await browser.close();
    console.info('browser closed');
  }
  //return extractedText;
  return {
    statusCode: 200,
    isBase64Encoded: true,
    headers: {
      "Content-type": "application/pdf"
    },
    body: bodyText
  };
}

module.exports = { handler: lambdaHandler };
