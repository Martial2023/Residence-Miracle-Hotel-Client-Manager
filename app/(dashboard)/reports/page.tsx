import React from 'react'

const page = () => {
    return (
        <main className='min-h-screen px-2 md:px-4'>
            <div className="flex items-center justify-between p-4 px-0">
                <h4 className="text-2xl font-bold">Commandes</h4>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {new Date().toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        day: '2-digit',
                        month: 'long',
                        year: '2-digit'
                    })}
                </p>
            </div>

            <div>
                <p>ClientManagerAI</p>
            </div>
        </main>
    )
}

export default page