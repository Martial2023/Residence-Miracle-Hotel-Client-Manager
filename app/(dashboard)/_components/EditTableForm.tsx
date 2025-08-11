'use client'
import React, { useState } from 'react'
import {
    Credenza,
    CredenzaBody,
    CredenzaContent,
    CredenzaDescription,
    CredenzaHeader,
    CredenzaTitle,
    CredenzaTrigger,
} from "@/components/Credenza"
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { UpdateTable } from '@/app/actions/actions'
import { Input } from '@/components/ui/input'
import { Loader, Table2 } from 'lucide-react'
import { Table } from '@/lib/types'


type Props = {
    children: React.ReactNode,
    setTables: React.Dispatch<React.SetStateAction<Table[]>>,
    tableId: string,
    name: string
}
const EditTableForm = ({ children, tableId, name }: Props) => {
    const [tableName, setTableName] = useState<string>(name);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const handleUpdateTable = async () => {
        try {
            if(!tableId){
                toast.error("ID de la table manquant");
                return;
            }
            if(!tableName.trim() || tableName.trim() === name.trim()){
                setOpen(false);
                return;
            }

            setIsCreating(true)
            await UpdateTable({
                id: tableId,
                name: tableName
            })
            window.location.reload();
            toast.success("Table mise à jour avec succès");
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
            <CredenzaContent className='dark:bg-zinc-900'>
                <CredenzaHeader>
                    <CredenzaTitle className='flex items-center gap-2'>
                        <Table2 className='size-5 inline-block' />
                        Mettre à jour une table
                    </CredenzaTitle>
                    <CredenzaDescription>
                        Mettre à jour la table pour votre restaurant
                    </CredenzaDescription>
                </CredenzaHeader>
                <CredenzaBody className='pb-6 md:pb-2'>
                    <div>
                        <Input
                            value={tableName}
                            onChange={(e) => setTableName(e.target.value)}
                            placeholder="Nom de la table"
                            className="mb-4"
                        />

                        <Button
                            onClick={handleUpdateTable}
                            disabled={isCreating || !tableName.trim() || tableName.trim() === name.trim()}
                            className="w-full"
                        >
                            {isCreating ? <Loader className='size-4 animate-spin' /> : "Créer la table"}
                        </Button>
                    </div>
                </CredenzaBody>
            </CredenzaContent>
        </Credenza>
    )
}

export default EditTableForm