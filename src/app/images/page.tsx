import { collection, getDocs, query, where } from 'firebase/firestore'
import Image from 'next/image'
import { FC } from 'react'
import { firebaseFirestore } from '@/shared/api/firebase'

const Images: FC = async () => {
    const imagesCollection = collection(firebaseFirestore, 'images')
    const q = query(imagesCollection, where('userUid', '==', '9ZGcdid0EITWlxlOskDHt0JYoSn2'))

    const querySnapshot = await getDocs(q)

    const data: { fileUrl: string }[] = []

    querySnapshot.forEach((doc) => {
        data.push(doc.data() as { fileUrl: string })
    })

    return (
        <ul>
            {data.map((item) => (
                <li key={item.fileUrl}>
                    <Image alt={'image'} height={200} priority={true} src={item.fileUrl} width={200} />
                </li>
            ))}
        </ul>
    )
}

export default Images
