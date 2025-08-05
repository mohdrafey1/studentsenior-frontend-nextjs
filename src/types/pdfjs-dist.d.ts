declare module "pdfjs-dist/legacy/build/pdf" {
    export const GlobalWorkerOptions: {
        workerSrc: string;
    };

    export function getDocument(url: string | Uint8Array | ArrayBuffer): {
        promise: Promise<PDFDocumentProxy>;
    };

    export interface PDFPageProxy {
        getViewport: (options: { scale: number }) => {
            width: number;
            height: number;
        };
        render: (options: {
            canvasContext: CanvasRenderingContext2D;
            viewport: { width: number; height: number };
        }) => {
            promise: Promise<void>;
        };
    }

    export interface PDFDocumentProxy {
        getPage: (pageNum: number) => Promise<PDFPageProxy>;
        numPages: number;
    }
}
