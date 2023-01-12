const printReportProvider = require("../provider/print-report-provider");

class printReportController{
    printReport = async (req, res, next) => {
        
        const template = await this.getReportTemplate();
        console.log("template",typeof template);
        const pdf = await printReportProvider.generatePdfReport({ file: template }).catch(next);
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="123.pdf"`,
            "Content-Length": pdf.length
        });
        res.send(pdf);  
    }

    getReportTemplate = async () => {
        const fs = require("fs");
        const path = require("path");
        const publicFolderName = "report-template";
        const parentFolderName = "BZ_IA_INTERIM_MLC_CHKLIST";
        const parentFolderPath = `${publicFolderName}/${parentFolderName}/`;

        const directoryPath = path.join(`${parentFolderPath}`);
        console.log("directoryPath", directoryPath);
        const file = {
            file_name:"",
            html: `${directoryPath}/HTML/index.html`,
            css: `${directoryPath}/HTML/css/custom.css`,
            js: `${directoryPath}/HTML/js/custom.js`,
            config: `${directoryPath}/HTML/config.json`
        }
        const htmlContent = fs.readFileSync(path.join(file.html), "utf8");
        const cssContent = fs.readFileSync(path.join(file.css), "utf8");

        return {
            html: htmlContent,
            css: cssContent
        };
    }
}

module.exports = new printReportController();
