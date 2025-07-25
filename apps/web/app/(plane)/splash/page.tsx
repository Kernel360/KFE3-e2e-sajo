'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/shared/ui/icon/Logo';
import { Button } from '@repo/ui/components/Button/Button';
import Link from 'next/link';

export default function SplashPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const checkIsAuthenticated = (): boolean => {
    if (typeof window === 'undefined' || !isMounted) return false;

    const tokenData = localStorage.getItem('sb-nrxemenkpeejarhejbbk-auth-token');

    if (!tokenData) return false;

    const accessToken = JSON.parse(tokenData).access_token;

    return !!accessToken;
  };

  const handleStartClick = () => {
    if (!isMounted) return;

    const isAuthenticated = checkIsAuthenticated();

    if (isAuthenticated) {
      const authStorage = localStorage.getItem('auth-storage');

      if (!authStorage) return false;
      const address = JSON.parse(authStorage).state.user.address;

      if (address && address !== 'null') {
        router.push('/');
      } else {
        router.push('/setLocation');
      }
    } else {
      router.push('/signup');
    }
  };

  if (!isMounted) {
    return (
      <div className="bg-main fixed inset-0 z-50 flex items-center justify-center">
        <div className="flex flex-1 scale-[2.5] items-center justify-center">
          <Logo variant="reversal" />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-main fixed inset-0 z-50 flex items-center justify-center">
        <div className="flex flex-1 scale-[2.5] items-center justify-center">
          <Logo variant="reversal" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex-1"></div>

      <div className="flex items-center justify-center">
        <div className="scale-[2.5]">
          <Logo variant="blue" />
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-end">
        <div className="flex flex-col items-center gap-4 px-3 pb-16">
          <Button className="w-full" onClick={handleStartClick}>
            시작하기
          </Button>
          <p className="typo-caption-regular text-center">
            이미 계정이 있나요?{' '}
            <Link href="/login" className="text-main cursor-pointer underline">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
