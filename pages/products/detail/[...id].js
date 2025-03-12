import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/router"
import LayoutComapare from "@/components/Layout_compare"
import DetailForm from "@/components/Detailform"
import Tag from "@/components/Tag"
import Head from 'next/head';



export default function Detail(){
    const [productInfo, setProductInfo] = useState(null)
    const [recommend, setRecommend] = useState(null)

    const router = useRouter();
    const  {id}  = router.query;

    useEffect(() => {
        if (!id) {
            return;
        }
        
        axios.get('/api/products?id=' + id).then(res => {
            setProductInfo(res.data.products);
            setRecommend(res.data.recommend)
        });
    }, [id]);
    
    return (
        <LayoutComapare>
            <Head>
            <title>{productInfo?.title}</title>
                <meta name="description" content={productInfo?.title} />
                <meta name="keywords" content="bikes, bicycles, เปลียบเทียบ,  จักรยานเสือหมอบ" />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://specbikethailand.com" />
            </Head>
            {productInfo && (
                <>
                    <Tag productInfo={productInfo}/>
                    <DetailForm productInfo={productInfo} recommend={recommend}/>
                </>
            )}
        </LayoutComapare>
    );
}





