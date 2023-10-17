import fs from "fs";
import PDFDocument from "pdfkit";

var doc=new PDFDocument;

doc.pipe(fs.createWriteStream('output.pdf'));

doc.image('./Manga/01-2.webp', {
    // fit take full width and height of the page
    fit: [500, 500],
    align: 'center',
    valign: 'center'
    
  });



  doc.end();

