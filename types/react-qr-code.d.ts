declare module "react-qr-code" {
  import * as React from "react";

  export interface QRCodeProps extends React.SVGProps<SVGElement> {
    value: string;
    size?: number; // Defaults to 128
    bgColor?: string; // Defaults to '#FFFFFF'
    fgColor?: string; // Defaults to '#000000'
    level?: "L" | "M" | "Q" | "H"; // Defaults to 'L'
    viewBox?: string; // Defaults to undefined
  }

  const QRCode: React.FC<QRCodeProps>;

  export default QRCode;
}
