'use client';

import { useProductList } from '@/features/product/model/useProductList';
import LocationPin from '@/features/product/ui/LocationPin';
import ProductList from '@/features/product/ui/ProductList';
import { useAuthStore } from '@/shared/model/authStore';
import Loading from '@/shared/ui/Loading/Loading';
import { toast } from '@repo/ui/components/Toast/Sonner';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const HomePage = () => {
  const router = useRouter();
  const userId = useAuthStore((state) => state.user?.id);

  const { data, isLoading, error } = useProductList({
    userId: userId as string,
  });

  useEffect(() => {
    if (!error) return;

    const message = (error as Error).message;

    if (message === '유저 위치 정보가 없습니다.') {
      toast({ content: message });
      router.replace('/setLocation');
    } else {
      toast({ content: '로그인이 필요합니다.' });
      router.replace('/login');
    }
  }, [error, router]);

  if (isLoading || error || !data) {
    return <Loading />;
  }

  return (
    <div className="p-box">
      <LocationPin />
      <ProductList data={data} />
    </div>
  );
};

export default HomePage;
