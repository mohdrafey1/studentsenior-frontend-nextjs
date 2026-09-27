const { test } = require('node:test');
const assert = require('node:assert/strict');
const { jsPDF } = require('jspdf');
test('updated PDF library generates a readable multi-page syllabus document', () => {
    const pdf = new jsPDF();
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(16); pdf.text('Syllabus fixture', 20, 20);
    pdf.setFont('helvetica', 'normal'); pdf.text(pdf.splitTextToSize('Unit one: example syllabus content.', 170), 20, 35);
    pdf.addPage(); pdf.text('Unit two', 20, 20);
    assert.equal(pdf.getNumberOfPages(), 2);
    const output = Buffer.from(pdf.output('arraybuffer'));
    assert.equal(output.subarray(0, 5).toString(), '%PDF-');
});
