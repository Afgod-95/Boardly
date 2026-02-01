import { notFound } from 'next/navigation';
import { itemData } from '@/data/ItemsData';
import PinDetailClient from '@/components/pins/PinDetailClient';

const page = async ({ params }: { params: Promise<{ id: string | number} >}) => {
    const { id } = await params;
    const pinId = isNaN(Number(id)) ? id : Number(id);
    const pin = itemData.find((p) => p.id === pinId || p.id?.toLocaleString() === id);
  
    if (!pin) notFound();
    
    return <PinDetailClient initialPin={pin} />;
}

export default page;