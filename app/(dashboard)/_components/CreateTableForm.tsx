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
import { CreateTable } from '@/app/actions/actions'
import { Input } from '@/components/ui/input'
import { Loader, Table2 } from 'lucide-react'
import { Table } from '@/lib/types'


type Props = {
    children: React.ReactNode,
    setTables: React.Dispatch<React.SetStateAction<Table[]>>,
}
const CreateTableForm = ({ children, setTables }: Props) => {
    const [tableName, setTableName] = useState<string>('');
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    const handleCreateTable = async () => {
        try {
            setIsCreating(true)
            const table = await CreateTable({
                tableName
            })
            setTables(prevTables => [...prevTables, table]);
            setTableName('');
            toast.success("Table créée avec succès");
            setOpen(false);
        } catch (error) {
            toast.error("Erreur lors de la création de la table");
        } finally {
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
                        Créer une table
                    </CredenzaTitle>
                    <CredenzaDescription>
                        Créer une nouvelle table pour votre restaurant
                    </CredenzaDescription>
                </CredenzaHeader>
                <CredenzaBody className='pb-6 md:pb-4'>
                    <div>
                        <Input
                            value={tableName}
                            onChange={(e) => setTableName(e.target.value)}
                            placeholder="Nom de la table"
                            className="mb-4"
                        />

                        <Button
                            onClick={handleCreateTable}
                            disabled={isCreating || !tableName.trim()}
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

export default CreateTableForm