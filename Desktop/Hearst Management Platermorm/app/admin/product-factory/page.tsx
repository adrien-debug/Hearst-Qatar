import DashboardLayout from '@/components/layout/DashboardLayout';
import ProductFactoryForm from '@/components/admin/ProductFactoryForm';
import styles from './page.module.css';

export default function ProductFactoryPage() {
  return (
    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Product Factory</h1>
          <p className={styles.subtitle}>
            Create and configure new products for the Hearth Management Platform.
          </p>
        </div>
        <ProductFactoryForm />
      </div>
    </DashboardLayout>
  );
}



