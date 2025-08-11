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

type Props = {
  children: React.ReactNode;
  tableId: string;
  name: string;
  logoUrl?: string;
};

const ShowTableQRCode = ({ children, tableId, name, logoUrl }: Props) => {
  const url = `${process.env.NEXT_PUBLIC_URL}/menu/${tableId}`;
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const qrCodeInstance = useRef<QRCodeStyling | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [open, setOpen] = useState(false);
  const [qrReady, setQrReady] = useState(false); // <- nouveau state
  const [generate, setGenerate] = useState(false);

  // Crée le QR code une seule fois à l'ouverture
  useEffect(() => {
    if (open && qrCodeRef.current && !qrCodeInstance.current) {
      setQrReady(false); // reset ready state à chaque ouverture
      const qr = new QRCodeStyling({
        width: 300,
        height: 300,
        data: url,
        image: logoUrl || undefined,
        dotsOptions: {
          color: '#000000',
          type: 'rounded',
        },
        backgroundOptions: {
          color: '#ffffff',
        },
        cornersSquareOptions: {
          color: '#ff6200',
        },
        imageOptions: {
          crossOrigin: 'anonymous',
          margin: 10,
        },
      });

      qr.append(qrCodeRef.current);
      qrCodeInstance.current = qr;

      // On peut attendre un peu ou utiliser un timer, car qr-code-styling n'a pas d'event ready.
      // Ici on met un timeout court pour signaler que c'est prêt.
      setTimeout(() => setQrReady(true), 200);
    }
  }, [generate]);
  setTimeout(() => setGenerate(true), 200);

  // Met à jour le QR code si l'URL ou logoUrl change **seulement si déjà créé**
  useEffect(() => {
    if (qrCodeInstance.current) {
      qrCodeInstance.current.update({
        data: url,
        image: logoUrl || undefined,
      });
    }
  }, [url, logoUrl]);

  useEffect(() => {
    if (!open && qrCodeInstance.current) {
      if (qrCodeRef.current) {
        qrCodeRef.current.innerHTML = '';
      }
      qrCodeInstance.current = null;
      setQrReady(false);
    }
  }, [open]);

  const handleDownload = () => {
    if (qrCodeInstance.current) {
      setIsDownloading(true);
      qrCodeInstance.current
        .download({
          name: name.replace(/\s+/g, '_').toLowerCase(),
          extension: 'png',
        })
        .finally(() => setIsDownloading(false));
      setOpen(false);
    }
  };

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        {children}
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle className="flex items-center gap-2">
            <Table2 className="size-5 inline-block" />
            {name}
          </CredenzaTitle>
          <CredenzaDescription>
            Télécharger le QR Code de la table pour l&apos;afficher dans votre établissement.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="overflow-y-auto">
          <div className="flex flex-col items-center justify-center">
            <div ref={qrCodeRef} className="mb-4" style={{ width: 300, height: 300 }} />

            {!qrReady && (
              <Button
                onClick={() => {
                  setGenerate(!generate);
                }}
              >
                Appuyez pour générer le QR Code
              </Button>
            )}
          </div>

          <Button
            disabled={isDownloading || !qrReady}
            className="w-full"
            variant="outline"
            onClick={handleDownload}
          >
            <Download className="size-4 mr-2" />
            Télécharger le QR Code
            {isDownloading && <Loader className="size-4 ml-2 animate-spin" />}
          </Button>

        </CredenzaBody>
        <CredenzaFooter className="pb-2 md:hidden">
          <p className="text-gray-500 text-sm text-center">ClientManager</p>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};

export default ShowTableQRCode;