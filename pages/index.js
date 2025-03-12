import Featured from "@/components/Featured";
import Header from "@/components/Header";
import NewProduct from "@/components/NewProduct";
import Catagories from "@/components/Catagories";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import Footer from "@/components/Footer";
import Head from "next/head";
import FixedButton from "@/components/FixedButton";
import Mostview from "@/components/mostviwe";

export default function HomePage({ newProducts, categoriesWithoutParent ,MostviewPorduct}) {
    return (
    <div>
      <Head>
        <title>SPACE BIKE TH</title>
            <meta name="description" content="จักรยาน TWITTER KAZE STORM จักรยานเสือหมอบ" />
            <meta name="keywords" content="bikes, bicycles, เปลียบเทียบ,  จักรยานเสือหมอบ" />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href="https://specbikethailand.com" />
      </Head>
      <Header />
      <FixedButton />
      <Featured  />
      <NewProduct products={newProducts} />
      <Mostview products={MostviewPorduct} />
      <Catagories categories={categoriesWithoutParent} />
      <Footer /> 
    </div>
  );
}

export async function getServerSideProps() { 
  await mongooseConnect();
  const [categoriesWithoutParent, newProducts, MostviewPorduct] = await Promise.all([
    // Category.find({ parent: { $ne: null } }),
    Category.find({ images: { $exists: true } }), 
    Product.find({}, null, { sort: { '_id': -1 }, limit: 5 }),
    Product.find({}, null ,{ sort: { views: -1 },limit: 5 }),
  ]);
  
  return {
    props: {
      newProducts: JSON.parse(JSON.stringify(newProducts)),
      categoriesWithoutParent: JSON.parse(JSON.stringify(categoriesWithoutParent)),
      MostviewPorduct: JSON.parse(JSON.stringify(MostviewPorduct)), // Pass it as an array directly (no JSON.stringify)
    },
  };
}
