import { notFound } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProductDetailMarket from '@/components/products/ProductDetailMarket';
import ProductDetailMining from '@/components/products/ProductDetailMining';
import ProductDetailBouquet from '@/components/products/ProductDetailBouquet';
import { getProductById } from '@/lib/mock-data';
import { MarketProduct, MiningProduct, BouquetProduct } from '@/types/product';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <DashboardLayout>
      {product.type === 'market' && (
        <ProductDetailMarket product={product as MarketProduct} />
      )}
      {product.type === 'mining' && (
        <ProductDetailMining product={product as MiningProduct} />
      )}
      {product.type === 'bouquet' && (
        <ProductDetailBouquet product={product as BouquetProduct} />
      )}
    </DashboardLayout>
  );
}



