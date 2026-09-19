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

            // Notion aesthetic palette
            const notionCanvasSoft = [246, 245, 244] as const; // #f6f5f4
            const notionSurface = [255, 255, 255] as const; // #ffffff
            const notionHairline = [230, 230, 230] as const; // #e6e6e6
            const notionInk = [0, 0, 0] as const; // #000000
            const notionInkSecondary = [49, 48, 46] as const; // #31302e

            // Watermark
            const addWatermark = () => {
                doc.saveGraphicsState();
                doc.setTextColor(230, 230, 230); // notionHairline
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

            // Draw a rounded card for sections
            const drawRoundedCard = (
                y: number,
                title: string,
                contentLines: string[],
                titleWidth: number = 30
            ) => {
                const rowHeight = Math.max(contentLines.length * 4 + 4, 8);
                const width = pageWidth - 2 * margin;
                
                // Background & Border
                doc.setFillColor(...notionSurface);
                doc.setDrawColor(...notionHairline);
                doc.setLineWidth(0.3);
                doc.roundedRect(margin, y, width, rowHeight, 3, 3, 'FD');

                // Title Section (Soft background)
                doc.setFillColor(...notionCanvasSoft);
                // We draw a smaller rounded rect for the title area to keep it neat
                doc.roundedRect(margin, y, titleWidth, rowHeight, 3, 3, 'F');
                // Hide the right-side rounded corners of the title background to blend it
                doc.rect(margin + titleWidth - 2, y, 2, rowHeight, 'F');
                // Vertical divider
                doc.setDrawColor(...notionHairline);
                doc.line(margin + titleWidth, y, margin + titleWidth, y + rowHeight);

                // Text
                doc.setTextColor(...notionInk);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(8);
                
                // Center title vertically
                const titleLines = doc.splitTextToSize(title, titleWidth - 4);
                const titleY = y + (rowHeight - (titleLines.length * 4)) / 2 + 3;
                titleLines.forEach((line: string, idx: number) => {
                    doc.text(line, margin + 2, titleY + idx * 4);
                });

                doc.setTextColor(...notionInkSecondary);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8);
                contentLines.forEach((line: string, idx: number) => {
                    doc.text(line, margin + titleWidth + 3, y + 5 + idx * 4);
                });

                return rowHeight;
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
            doc.setFillColor(...notionCanvasSoft);
            doc.rect(0, 0, pageWidth, 35, 'F');
            doc.setTextColor(...notionInk);
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text('Integral University, Lucknow', pageWidth / 2, 15, {
                align: 'center',
            });
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text('Course Syllabus', pageWidth / 2, 25, { align: 'center' });
            
            // Header bottom border
            doc.setDrawColor(...notionHairline);
            doc.setLineWidth(0.5);
            doc.line(0, 35, pageWidth, 35);

            yPosition = 45;

            const tableWidth = pageWidth - 2 * margin;
            const col1Width = 40;
            const col2Width = tableWidth - col1Width;

            // Course Info Cards
            const subjectText = `${syllabus.subject?.subjectName} - ${syllabus.subject?.subjectCode}` || 'N/A';
            const subjectLines = doc.splitTextToSize(subjectText, tableWidth - col1Width - 4);
            const h1 = drawRoundedCard(yPosition, 'Subject Name', subjectLines, col1Width);
            yPosition += h1 + 3;

            const yearText = `${syllabus.year.toString()} / ${syllabus.semester.toString()}` || 'N/A';
            const yearLines = doc.splitTextToSize(yearText, tableWidth - col1Width - 4);
            const h2 = drawRoundedCard(yPosition, 'Year / Sem', yearLines, col1Width);
            yPosition += h2 + 6;

            // Course Objectives
            if (syllabus.description) {
                checkNewPage(30);
                
                doc.setTextColor(...notionInk);
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                doc.text('Course Objectives', margin, yPosition + 4);
                yPosition += 6;

                const descLines = doc.splitTextToSize(
                    syllabus.description,
                    tableWidth - 6,
                );
                
                const h3 = Math.max(descLines.length * 4 + 4, 8);
                doc.setFillColor(...notionSurface);
                doc.setDrawColor(...notionHairline);
                doc.setLineWidth(0.3);
                doc.roundedRect(margin, yPosition, tableWidth, h3, 3, 3, 'FD');
                
                doc.setTextColor(...notionInkSecondary);
                doc.setFontSize(8);
                doc.setFont('helvetica', 'normal');

                descLines.forEach((line: string, idx: number) => {
                    checkNewPage(10);
                    doc.text(line, margin + 3, yPosition + 5 + idx * 4);
                });
                yPosition += h3 + 6;
            }

            // Units Section
            if (syllabus.units?.length > 0) {
                checkNewPage(20);
                
                doc.setTextColor(...notionInk);
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                doc.text('Course Units', margin, yPosition + 4);
                yPosition += 6;

                const unitNoWidth = 14;
                const titleWidth = 45;
                const contentWidth = tableWidth - unitNoWidth - titleWidth;

                // Render each unit as a compact card
                syllabus.units.forEach((unit) => {
                    const contentLines = doc.splitTextToSize(
                        unit.content || '',
                        contentWidth - 4,
                    );
                    const titleLines = doc.splitTextToSize(
                        unit.title || '',
                        titleWidth - 4,
                    );
                    const rowHeight = Math.max(
                        contentLines.length * 4 + 4,
                        titleLines.length * 4 + 4,
                        12,
                    );

                    checkNewPage(rowHeight + 5);

                    // Row background
                    doc.setFillColor(...notionSurface);
                    doc.setDrawColor(...notionHairline);
                    doc.setLineWidth(0.3);
                    doc.roundedRect(margin, yPosition, tableWidth, rowHeight, 3, 3, 'FD');

                    // Unit number block
                    doc.setFillColor(...notionCanvasSoft);
                    doc.roundedRect(margin, yPosition, unitNoWidth, rowHeight, 3, 3, 'F');
                    doc.rect(margin + unitNoWidth - 2, yPosition, 2, rowHeight, 'F');
                    doc.setDrawColor(...notionHairline);
                    doc.line(margin + unitNoWidth, yPosition, margin + unitNoWidth, yPosition + rowHeight);
                    
                    doc.setTextColor(...notionInkSecondary);
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(8);
                    doc.text(
                        (unit.unitNumber || '').toString(),
                        margin + unitNoWidth / 2,
                        yPosition + rowHeight / 2 + 1,
                        { align: 'center' },
                    );

                    // Title
                    doc.setTextColor(...notionInk);
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(7.5);
                    titleLines.forEach((line: string, idx: number) => {
                        doc.text(
                            line,
                            margin + unitNoWidth + 2,
                            yPosition + 4 + idx * 4,
                        );
                    });

                    // Title divider
                    doc.setDrawColor(...notionHairline);
                    doc.line(margin + unitNoWidth + titleWidth, yPosition, margin + unitNoWidth + titleWidth, yPosition + rowHeight);

                    // Content
                    doc.setTextColor(...notionInkSecondary);
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(7.5);
                    contentLines.forEach((line: string, idx: number) => {
                        doc.text(
                            line,
                            margin + unitNoWidth + titleWidth + 2,
                            yPosition + 4 + idx * 4,
                        );
                    });

                    yPosition += rowHeight + 3; // compact gap between units
                });
                yPosition += 3;
            }

            // Reference Books
            if (syllabus.referenceBooks) {
                checkNewPage(30);
                
                doc.setTextColor(...notionInk);
                doc.setFontSize(9);
                doc.setFont('helvetica', 'bold');
                doc.text('Reference Books', margin, yPosition + 4);
                yPosition += 6;

                const refBooks = syllabus.referenceBooks
                    .split('\n')
                    .filter((b) => b.trim());
                
                // Calculate height
                let totalRefHeight = 4;
                refBooks.forEach((book, index) => {
                    const bookLines = doc.splitTextToSize(`${index + 1}. ${book}`, tableWidth - 6);
                    totalRefHeight += bookLines.length * 4 + 2;
                });
                
                doc.setFillColor(...notionSurface);
                doc.setDrawColor(...notionHairline);
                doc.setLineWidth(0.3);
                doc.roundedRect(margin, yPosition, tableWidth, Math.max(totalRefHeight, 8), 3, 3, 'FD');

                doc.setTextColor(...notionInkSecondary);
                doc.setFontSize(8);
                doc.setFont('helvetica', 'normal');
                
                let textY = yPosition + 5;
                refBooks.forEach((book, index) => {
                    checkNewPage(10);
                    const bookLines = doc.splitTextToSize(
                        `${index + 1}. ${book}`,
                        tableWidth - 6,
                    );
                    bookLines.forEach((line: string) => {
                        doc.text(line, margin + 3, textY);
                        textY += 4;
                    });
                    textY += 2;
                });
            }

            // Footer
            const pageCount = doc.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setDrawColor(...notionHairline);
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
            className='w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-[#202020] text-[#101828] dark:text-[#ededed] rounded-xl border border-[#e6e6e6] dark:border-[#383838] hover:bg-[#fcfbf9] dark:hover:bg-[#2a2a2a] hover:border-[#d2d2d2] dark:hover:border-[#4d4d4d] transition-all font-semibold shadow-[0_2px_8px_rgb(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgb(0,0,0,0.1)] disabled:opacity-50 disabled:cursor-not-allowed text-sm'
        >
            <Download className='w-4 h-4' />
            {isGenerating ? 'Generating PDF...' : 'Download as PDF'}
        </button>
    );
}
