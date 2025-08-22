'use client'
import { fetchRestaurant, updateRestaurant } from '@/app/actions/actions'
import LogoUpload from '@/components/LogoUpload'
import MinLoader from '@/components/MinLoader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { MapPin } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { generateReactHelpers } from '@uploadthing/react';
import { deleteMediaUploadThing } from '@/lib/deleteMediaUploadThing'

const { uploadFiles } = generateReactHelpers();

const page = () => {

    const [restaurantLoading, setRestaurantLoading] = useState<boolean>(true)
    const [restaurantCreating, setRestaurantCreating] = useState<boolean>(false)
    const [restaurantName, setRestaurantName] = useState<string>('')
    const [restaurantAddress, setRestaurantAddress] = useState<string>('')
    const [restaurantEmails, setRestaurantEmails] = useState<string[]>([])
    const [restaurantPhone, setRestaurantPhone] = useState<string>('')
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [logoUrl, setLogoUrl] = useState<string | null>(null)
    const [restaurantDescription, setRestaurantDescription] = useState<string>('')
    const [website, setWebsite] = useState<string>('')
    const [sendReportsClock, setSendReportsClock] = useState<Date | null>(null)
    const [geoLongitude, setGeoLongitude] = useState<number | null>(null)
    const [geoLatitude, setGeoLatitude] = useState<number | null>(null)
    const [updating, setUpdating] = useState<boolean>(false)
    const [radius, setRadius] = useState<number>(60)


    const initializeRestaurant = async () => {
        try {
            setRestaurantLoading(true);
            const restaurant = await fetchRestaurant();
            if (restaurant) {
                setRestaurantName(restaurant.name);
                setRestaurantAddress(restaurant.address ?? '');
                setRestaurantEmails(restaurant.email ?? []);
                setLogoUrl(restaurant.logo ?? '');
                setRestaurantDescription(restaurant.description ?? '');
                setWebsite(restaurant.website ?? '');
                setSendReportsClock(restaurant.sendReportsClock ?? null);
                setGeoLongitude(restaurant.geoLongitude ?? null);
                setGeoLatitude(restaurant.geoLatitude ?? null);
                setRadius(restaurant.radius ?? 60);
            }
        } catch (error) {
            toast.error('Erreur lors de la récupération de l\'établissement. Veuillez réessayer.')
        } finally {
            setRestaurantLoading(false);
        }
    };
    useEffect(() => {
        initializeRestaurant();
    }, []);

    const handleUpdateRestaurant = async () => {
        try {
            setUpdating(true);
            let imageUrls: string[] = [];
            if (logoFile) {
                const uploadedFiles = await uploadFiles('image', { files: [logoFile] });
                imageUrls = uploadedFiles.map(file => file.ufsUrl);
            }

            if (logoUrl && imageUrls[0] !== logoUrl) {
                await deleteMediaUploadThing([logoUrl]);
            }

            await updateRestaurant({
                name: restaurantName,
                address: restaurantAddress,
                email: restaurantEmails,
                phone: restaurantPhone,
                logo: imageUrls[0],
                description: restaurantDescription,
                website: website,
                sendReportsClock: sendReportsClock,
                geoLongitude: geoLongitude,
                geoLatitude: geoLatitude,
                radius: radius
            });
            toast.success('Établissement mis à jour avec succès.')
        } catch {
            toast.error('Erreur lors de la mise à jour de l\'établissement. Veuillez réessayer.')
        } finally {
            setUpdating(false);
        }
    };

    const handleGeolocate = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setGeoLatitude(position.coords.latitude);
                setGeoLongitude(position.coords.longitude);
            });
        }
    };

    return (
        <main className='min-h-screen px-2 md:px-4'>
            <div className="flex items-center justify-between p-4 px-0">
                <h4 className="text-2xl font-bold">Paramètres</h4>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {new Date().toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        day: '2-digit',
                        month: 'long',
                        year: '2-digit'
                    })}
                </p>
            </div>

            {
                restaurantLoading ? (
                    <div className='flex items-center justify-center h-full'>
                        <MinLoader />
                    </div>
                ) : (
                    <div className='space-y-4 md:space-y-6 w-full rounded-lg border border-gray-200 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-zinc-900'>
                        <div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
                            <div className='flex-1'>
                                <Label className='mb-1'>Nom du restaurant</Label>
                                <Input
                                    value={restaurantName}
                                    onChange={(e) => setRestaurantName(e.target.value)}
                                    placeholder="Nom du restaurant"
                                    disabled={updating}
                                />
                            </div >
                            <div className='flex-1'>
                                <Label className='mb-1'>Adresse</Label>
                                <Input
                                    value={restaurantAddress}
                                    onChange={(e) => setRestaurantAddress(e.target.value)}
                                    placeholder="Adresse du restaurant"
                                    disabled={updating}
                                />
                            </div>
                        </div >

                        <div className='border rounded-md shadow-md p-2'>
                            <Label className='mb-1'>Logo</Label>
                            <LogoUpload
                                setMediaFile={setLogoFile}
                                fileUrl={logoUrl || null}
                            />
                        </div>

                        <div>
                            <Label className='mb-1'>Description</Label>
                            <Textarea
                                value={restaurantDescription}
                                onChange={(e) => setRestaurantDescription(e.target.value)}
                                placeholder="Description du restaurant"
                                disabled={updating}
                            />
                        </div>

                        <div>
                            <Label className='mb-1'>Site Web</Label>
                            <Input
                                type="url"
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                placeholder="Site Web du restaurant"
                                disabled={updating}
                            />
                        </div>

                        <div>
                            <Label className='mb-1'>Envoi de rapports</Label>
                            <Input
                                type="datetime-local"
                                value={sendReportsClock ? sendReportsClock.toISOString().slice(0, 16) : ''}
                                onChange={(e) => setSendReportsClock(e.target.value ? new Date(e.target.value) : null)}
                                disabled={updating}
                            />
                        </div>

                        <div>
                            <Label className='mb-1'>Géolocalisation</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    value={geoLongitude?.toString()}
                                    onChange={(e) => setGeoLongitude(parseFloat(e.target.value))}
                                    placeholder="Longitude"
                                    disabled={updating}
                                />
                                <span>°</span>
                                <Input
                                    type="number"
                                    value={geoLatitude?.toString()}
                                    onChange={(e) => setGeoLatitude(parseFloat(e.target.value))}
                                    placeholder="Latitude"
                                    disabled={updating}
                                />
                                <span>°</span>
                            </div>
                            <Button
                                variant={"outline"}
                                onClick={handleGeolocate}
                                className='w-full mt-2'
                                disabled={updating}
                            >
                                <MapPin className='size-4' /> Géolocaliser Automatiquement
                            </Button>
                        </div>

                        <div>
                            <Label className='mb-1'>Périmètre de l'établissement(mètre)</Label>
                            <Input
                                type="number"
                                value={radius?.toString()}
                                onChange={(e) => setRadius(parseFloat(e.target.value))}
                                placeholder="Rayon de livraison"
                                disabled={updating}
                                className='w-full'
                            />
                        </div>

                        <Button
                            className='w-full mb-2'
                            onClick={handleUpdateRestaurant}
                            disabled={updating}
                        >
                            {updating ? 'Mise à jour...' : 'Mettre à jour le restaurant'}
                        </Button>
                    </div >
                )
            }
        </main >
    )
}

export default page