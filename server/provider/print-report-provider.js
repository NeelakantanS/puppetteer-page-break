const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

class printReportProvider {

    generatePdfReport = async ({ file, pageRanges, isDraftMode = true, options={} }) => {
        const indexHtml = file.html;
        const styleUrl = file.css;
        const css = file.css;
        const cheerioContent = cheerio.load(indexHtml);
        const header = cheerioContent.html("header[id=ors-header]").toString("utf-8");
        const footer = cheerioContent.html("footer[id=ors-footer]").toString("utf-8");
        console.log("debugging", 2);

        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--font-render-hinting=none"]
        });
        const page = await browser.newPage();
        await page.setContent(indexHtml);

        await page.evaluate(() => {
            const headerElement = document.querySelector("header[id='ors-header']");
            headerElement?.parentNode.removeChild(headerElement);
            const footerElement = document.querySelector("footer[id='ors-footer']");
            footerElement?.parentNode.removeChild(footerElement);
        });
        if (isDraftMode) {
            await page.evaluate(() => {
                const div = document.createElement("div");
                div.innerHTML = "DRAFT";
                div.style.cssText = "position: fixed;top: 50%;left: 50%;z-index: 10000;font-size:150px;color:#cccccc;transform: translate(-50%,-50%) rotate(-65deg);opacity:40%";
                document.body.appendChild(div);
            });
        }
        await page.addStyleTag({ content: css});
        const buffer = await page.pdf({
            // path: `${directoryPath}/${file.file_name}/${file.file_name}.pdf`,
            format: "A4",
            displayHeaderFooter: true,
            headerTemplate: `<style>${css}</style> ${header}`,
            footerTemplate: `<style>${css}</style> ${footer}`,
            pageRanges: options.pageRange,
            margin: {
                top: options.margin?.top || "0.80in",
                right: options.margin?.right || "0.4in",
                bottom: options.margin?.bottom || "1.0in",
                left: options.margin?.left || "0.4in"
            }
        });
        await browser.close();
        return buffer;
    }
}

module.exports = new printReportProvider()
