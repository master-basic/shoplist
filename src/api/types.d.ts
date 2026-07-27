declare module 'tesseract.js' {
  const Tesseract: {
    recognize: (image: File | Blob | string, languages: string, options?: { logger: (m: unknown) => void }) => {
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      off: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  };
  export default Tesseract;
}
