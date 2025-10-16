export interface InputByType {
    base64: string;
    string: string;
    text: string;
    binarystring: string;
    array: number[];
    uint8array: Uint8Array;
    arraybuffer: ArrayBuffer;
    blob: Blob;
    stream: NodeJS.ReadableStream;
}
export type InputFileFormat = InputByType[keyof InputByType] | Promise<InputByType[keyof InputByType]>;
export type ArchiveRequestTypeMap = {
    blob: Blob;
    string: string;
    json: object;
    xhtml: Document;
    html: Document;
    htm: Document;
    xml: Document;
    opf: Document;
    ncx: Document;
    text: string;
    base64: string;
};
