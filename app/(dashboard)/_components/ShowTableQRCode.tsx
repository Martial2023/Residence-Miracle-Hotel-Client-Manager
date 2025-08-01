'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from '@/components/Credenza';
import { Button } from '@/components/ui/button';
import { Download, Loader, Table2 } from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';
import MinLoader from '@/components/MinLoader';
import Link from 'next/link';

type Props = {
  children: React.ReactNode;
  tableId: string;
  name: string;
  logoUrl?: string;
};

const ShowTableQRCode = ({ children, tableId, name, logoUrl }: Props) => {
  const url = `${process.env.NEXT_PUBLIC_URL}/menu/${tableId}`;
  const [qrCode, setQrCode] = useState<QRCodeStyling | null>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  // Initialisation du QR Code dès que le composant est monté et ref est disponible
  useEffect(() => {
    if (qrCodeRef.current && !qrCode) {
      const qr = new QRCodeStyling({
        width: 300,
        height: 300,
        data: url,
        image: logoUrl || undefined, // Assure que logoUrl est undefined si absent
        dotsOptions: {
          color: '#000000',
          type: 'rounded',
        },
        backgroundOptions: {
          color: '#ffffff',
        },
        cornersSquareOptions: {
          color: '#ff6200', // Couleur orange pour les coins
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 10,
        },
      });

      qr.append(qrCodeRef.current);
      setQrCode(qr);
    }
  }, [url, logoUrl, qrCode]);

  // Mettre à jour le QR code si l'URL ou logoUrl change
  useEffect(() => {
    if (qrCode) {
      qrCode.update({
        data: url,
        image: logoUrl || undefined,
      });
    }
  }, [qrCode, url, logoUrl]);

  // Nettoyer le QR code quand le modal se ferme
  useEffect(() => {
    if (!open && qrCode) {
      if (qrCodeRef.current) {
        qrCodeRef.current.innerHTML = ''; // Clear the QR code DOM element
      }
      setQrCode(null);
    }
  }, [open, qrCode]);

  // Gérer le téléchargement
  const handleDownload = () => {
    if (qrCode) {
      setIsDownloading(true);
      qrCode.download({
        name: name.replace(/\s+/g, '_').toLowerCase(),
        extension: 'png',
      }).finally(() => setIsDownloading(false));
    }
  };

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>{children}</CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle className="flex items-center gap-2">
            <Table2 className="size-5 inline-block" />
            {name}
          </CredenzaTitle>
          <CredenzaDescription>
            Télécharger le QR Code de la table pour l'afficher dans votre établissement.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <div className="flex flex-col items-center justify-center">
            <div ref={qrCodeRef} className="mb-4" />
            {!qrCode && (
              <div className="w-[300px] h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded mb-4">
                <MinLoader />
                <p className="text-gray-500">Génération du QR Code...</p>
                <Link href={url} target='_blank' className="mt-2 text-blue-500 hover:underline">
                  Table
                </Link>
              </div>
            )}
          </div>

          <div>
            <Button
              disabled={isCreating || isDownloading || !qrCode}
              className="w-full"
              variant="outline"
              onClick={handleDownload}
            >
              <Download className="size-4 mr-2" />
              <span>Télécharger le QR Code</span>
              {isDownloading && <Loader className="size-4 ml-2 animate-spin" />}
            </Button>
          </div>
        </CredenzaBody>
        <CredenzaFooter className='pb-2 md:hidden'>
          <p className='text-gray-500 text-sm text-center'>ClientManager</p>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};

export default ShowTableQRCode;