'use client'
import React, { useState } from 'react'
import {
    Credenza,
    CredenzaBody,
    CredenzaContent,
    CredenzaHeader,
    CredenzaTitle,
    CredenzaTrigger,
} from "@/components/Credenza"
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { deleteTable } from '@/app/actions/actions'
import { Loader, Table2, TriangleAlert } from 'lucide-react'
import { Table } from '@/lib/types'


type Props = {
    children: React.ReactNode,
    setTables: React.Dispatch<React.SetStateAction<Table[]>>,
    tableId: string,
    name: string
}
const DeleteTableForm = ({ children, tableId, setTables, name }: Props) => {
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const handleDeleteTable = async () => {
        try {
            if (!tableId) {
                toast.error("ID de la table manquant");
                return;
            }

            setIsCreating(true)
            await deleteTable({
                id: tableId,
            })
            toast.success("Table supprimée avec succès");
            setTables(prevTables => prevTables.filter(table => table.id !== tableId));
            // setOpen(false);

        } catch (error) {
            toast.error("Erreur lors de la mise à jour de la table");
            setIsCreating(false)
        }
    }
    return (
        <Credenza open={open} onOpenChange={setOpen}>
            <CredenzaTrigger asChild>
                {children}
            </CredenzaTrigger>
            <CredenzaContent>
                <CredenzaHeader>
                    <CredenzaTitle className='flex items-center gap-2'>
                        <Table2 className='size-5 inline-block' />
                        Supprimer la table: {name}
                    </CredenzaTitle>
                </CredenzaHeader>
                <CredenzaBody>
                    <div>
                        <div className='w-full mb-4 flex flex-col items-center gap-2'>
                            <TriangleAlert />
                            <div className='text-center'>
                                <p className='text-sm text-red-500'>Cette action est irréversible.</p>
                                <p className='text-sm text-red-500'>Êtes-vous sûr de vouloir supprimer cette table ?</p>
                                <p>Les Ventes de la table seront perdues.</p>
                            </div>
                        </div>

                        <Button
                            onClick={handleDeleteTable}
                            className="w-full"
                        >
                            {isCreating ? <Loader className='size-4 animate-spin' /> : `Oui, supprimer ${name}`}
                        </Button>
                    </div>
                </CredenzaBody>
            </CredenzaContent>
        </Credenza>
    )
}

export default DeleteTableForm