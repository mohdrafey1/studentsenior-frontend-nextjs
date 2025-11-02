'use client';

import { Download } from 'lucide-react';
import { useState } from 'react';

interface ISyllabus {
    _id: string;
    slug: string;
    year: number;
    semester: number;
    units: {
        unitNumber: number;
        title: string;
        content: string;
    }[];
    referenceBooks: string;
    subject: {
        subjectName?: string;
        subjectCode?: string;
    };
    description?: string;
    viewCount: number;
    isActive: boolean;
}

interface DownloadPdfButtonProps {
    syllabus: ISyllabus;
}

export default function DownloadPdfButton({
    syllabus,
}: DownloadPdfButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const generatePDF = async () => {
        setIsGenerating(true);

        try {
            const { default: jsPDF } = await import('jspdf');

            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 15;
            let yPosition = margin;

            // Sky blue palette
            const darkSkyBlue = [41, 128, 185] as const;
            const lightBlue = [245, 250, 255] as const;
            const borderColor = [70, 130, 180] as const;

            // Watermark
            const addWatermark = () => {
                doc.saveGraphicsState();
                doc.setTextColor(135, 206, 235);
                doc.setFontSize(50);
                doc.setFont('helvetica', 'bold');
                const text = 'Student Senior';
                const centerX = pageWidth / 2;
                const centerY = pageHeight / 2;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                doc.setGState(new (doc as any).GState({ opacity: 0.05 }));
                doc.text(text, centerX, centerY, {
                    align: 'center',
                    angle: 45,
                });
                doc.restoreGraphicsState();
            };

            // Draw table cell
            const drawCell = (
                x: number,
                y: number,
                width: number,
                height: number,
                text: string,
                isHeader: boolean = false,
                isBold: boolean = false,
            ) => {
                // Background
                if (isHeader) {
                    doc.setFillColor(...darkSkyBlue);
                } else {
                    doc.setFillColor(255, 255, 255);
                }
                doc.rect(x, y, width, height, 'F');

                // Border
                doc.setDrawColor(...borderColor);
                doc.setLineWidth(0.3);
                doc.rect(x, y, width, height, 'S');

                // Text
                if (isHeader) {
                    doc.setTextColor(255, 255, 255);
                } else {
                    doc.setTextColor(80, 80, 80); // lighter gray instead of black
                }

                doc.setFont(
                    'helvetica',
                    isBold || isHeader ? 'bold' : 'normal',
                );
                doc.setFontSize(isHeader ? 9 : 8);

                const lines = doc.splitTextToSize(text, width - 4);
                const textY = y + 5;
                lines.forEach((line: string, index: number) => {
                    doc.text(line, x + 2, textY + index * 4);
                });
            };

            const checkNewPage = (neededSpace: number) => {
                if (yPosition + neededSpace > pageHeight - 20) {
                    doc.addPage();
                    addWatermark();
                    yPosition = margin;
                    return true;
                }
                return false;
            };

            addWatermark();

            // Header
            doc.setFillColor(...darkSkyBlue);
            doc.rect(0, 0, pageWidth, 35, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text('Integral University, Lucknow', pageWidth / 2, 15, {
                align: 'center',
            });
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text('Course Syllabus', pageWidth / 2, 25, { align: 'center' });

            yPosition = 45;

            const tableWidth = pageWidth - 2 * margin;
            const col1Width = 40;
            const col2Width = tableWidth - col1Width;

            // Course Info Table
            drawCell(margin, yPosition, col1Width, 8, 'Subject Name', true);
            drawCell(
                margin + col1Width,
                yPosition,
                col2Width,
                8,
                `${syllabus.subject?.subjectName} - ${syllabus.subject?.subjectCode}` ||
                    'N/A',
                true,
            );
            yPosition += 8;

            drawCell(
                margin,
                yPosition,
                col1Width,
                8,
                'Year / sem',
                false,
                true,
            );
            drawCell(
                margin + col1Width,
                yPosition,
                col2Width,
                8,
                `${syllabus.year.toString()} / ${syllabus.semester.toString()}` ||
                    'N/A',
                false,
            );
            yPosition += 15;

            // Course Objectives
            if (syllabus.description) {
                checkNewPage(30);
                doc.setFillColor(...darkSkyBlue);
                doc.rect(margin, yPosition, tableWidth, 8, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.text('Course Objectives', margin + 2, yPosition + 5.5);
                yPosition += 10;

                doc.setTextColor(80, 80, 80);
                doc.setFontSize(9);
                doc.setFont('helvetica', 'normal');
                const descLines = doc.splitTextToSize(
                    syllabus.description,
                    tableWidth - 4,
                );
                descLines.forEach((line: string) => {
                    checkNewPage(10);
                    doc.text(line, margin + 2, yPosition);
                    yPosition += 5;
                });
                yPosition += 5;
            }

            // Units Table
            if (syllabus.units?.length > 0) {
                checkNewPage(40);

                const unitNoWidth = 15;
                const titleWidth = 50;
                const contentWidth = tableWidth - unitNoWidth - titleWidth;

                // Header Row
                drawCell(margin, yPosition, unitNoWidth, 10, 'Unit No.', true);
                drawCell(
                    margin + unitNoWidth,
                    yPosition,
                    titleWidth,
                    10,
                    'Title of the Unit',
                    true,
                );
                drawCell(
                    margin + unitNoWidth + titleWidth,
                    yPosition,
                    contentWidth,
                    10,
                    'Content of Unit',
                    true,
                );
                yPosition += 10;

                // Table Rows
                syllabus.units.forEach((unit, index) => {
                    const contentLines = doc.splitTextToSize(
                        unit.content || '',
                        contentWidth - 4,
                    );
                    const titleLines = doc.splitTextToSize(
                        unit.title || '',
                        titleWidth - 4,
                    );
                    const rowHeight = Math.max(
                        contentLines.length * 4 + 6,
                        titleLines.length * 4 + 6,
                        15,
                    );

                    checkNewPage(rowHeight + 5);

                    // Alternate row background
                    if (index % 2 === 0) {
                        doc.setFillColor(...lightBlue);
                        doc.rect(margin, yPosition, tableWidth, rowHeight, 'F');
                    }

                    doc.setDrawColor(...borderColor);
                    doc.setLineWidth(0.3);

                    // Unit number
                    doc.rect(margin, yPosition, unitNoWidth, rowHeight);
                    doc.setTextColor(80, 80, 80);
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(9);
                    doc.text(
                        (unit.unitNumber || '').toString(),
                        margin + unitNoWidth / 2,
                        yPosition + rowHeight / 2,
                        { align: 'center' },
                    );

                    // Title
                    doc.rect(
                        margin + unitNoWidth,
                        yPosition,
                        titleWidth,
                        rowHeight,
                    );
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(8);
                    titleLines.forEach((line: string, idx: number) => {
                        doc.text(
                            line,
                            margin + unitNoWidth + 2,
                            yPosition + 5 + idx * 4,
                        );
                    });

                    // Content
                    doc.rect(
                        margin + unitNoWidth + titleWidth,
                        yPosition,
                        contentWidth,
                        rowHeight,
                    );
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(8);
                    contentLines.forEach((line: string, idx: number) => {
                        doc.text(
                            line,
                            margin + unitNoWidth + titleWidth + 2,
                            yPosition + 5 + idx * 4,
                        );
                    });

                    yPosition += rowHeight;
                });
                yPosition += 10;
            }

            // Reference Books
            if (syllabus.referenceBooks) {
                checkNewPage(30);
                doc.setFillColor(...darkSkyBlue);
                doc.rect(margin, yPosition, tableWidth, 8, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.text('Reference Books:', margin + 2, yPosition + 5.5);
                yPosition += 10;

                doc.setTextColor(80, 80, 80);
                doc.setFontSize(8);
                doc.setFont('helvetica', 'normal');
                const refBooks = syllabus.referenceBooks
                    .split('\n')
                    .filter((b) => b.trim());
                refBooks.forEach((book, index) => {
                    checkNewPage(10);
                    const bookLines = doc.splitTextToSize(
                        `${index + 1}. ${book}`,
                        tableWidth - 4,
                    );
                    bookLines.forEach((line: string) => {
                        doc.text(line, margin + 2, yPosition);
                        yPosition += 4.5;
                    });
                    yPosition += 2;
                });
            }

            // Footer
            const pageCount = doc.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setDrawColor(...darkSkyBlue);
                doc.setLineWidth(0.5);
                doc.line(
                    margin,
                    pageHeight - 15,
                    pageWidth - margin,
                    pageHeight - 15,
                );
                doc.setFontSize(8);
                doc.setTextColor(100, 100, 100);
                doc.setFont('helvetica', 'normal');
                doc.text(
                    `Page ${i} of ${pageCount}`,
                    pageWidth / 2,
                    pageHeight - 10,
                    { align: 'center' },
                );
                doc.text(`Powered by Student Senior`, margin, pageHeight - 10);
            }

            const fileName = `${syllabus.subject?.subjectCode || 'syllabus'}_${syllabus.subject?.subjectName?.replace(/\s+/g, '_') || 'course'}.pdf`;
            doc.save(fileName);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <button
            onClick={generatePDF}
            disabled={isGenerating}
            className='w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-lg hover:from-sky-600 hover:to-blue-600 transition-all font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105'
        >
            <Download className='w-5 h-5' />
            {isGenerating ? 'Generating PDF...' : 'Download as PDF'}
        </button>
    );
}
