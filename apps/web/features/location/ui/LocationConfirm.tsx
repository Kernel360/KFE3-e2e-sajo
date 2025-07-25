'use client';

import { useEffect, useState } from 'react';
import { AdvancedMarker, APIProvider, Map, Pin } from '@vis.gl/react-google-maps';
import { Button } from '@repo/ui/components/Button/Button';
import DotStepper from '@/features/location/ui/DotStepper';
import { getAddressFromLatLng } from '@/features/location/api/getAddressFromLatLng';
import { SetLocation } from '@/features/location/api/setLocation';
import { useAuthStore } from '@/shared/model/authStore';
import { useRouter } from 'next/navigation';
import { toast } from '@repo/ui/components/Toast/Sonner';

const MAPAPIKEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

type LocationConfirmProps = {
  onNext: () => void;
};

const LocationConfirm = ({ onNext }: LocationConfirmProps) => {
  const router = useRouter();
  const [position, setPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [address, setAddress] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const userId = useAuthStore((state) => state.user?.id);
  const updateAddress = useAuthStore((state) => state.updateAddress);

  const handleNext = async () => {
    if (!userId) {
      toast({ content: '로그인이 필요합니다.' });
      router.replace('/login');
      return;
    }
    if (!position) {
      toast({ content: '위치 정보가 없습니다.' });
      return;
    }

    if (!address) {
      toast({ content: '주소 정보가 없습니다.' });
      return;
    }
    updateAddress(address);

    try {
      await SetLocation({
        userId,
        lat: position.lat,
        lng: position.lng,
        address,
      });

      onNext();
    } catch (err) {
      console.error('위치 저장 실패:', err);
      toast({ content: '위치 저장에 실패했습니다.' });
    }
  };

  const fetchLocation = () => {
    setLoading(true);
    setError(false);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setPosition(coords);
        const fullAddress = await getAddressFromLatLng(coords);
        if (fullAddress) setAddress(fullAddress);
        setLoading(false);
      },
      (err) => {
        toast({ content: '지도를 불러오는 데 문제가 발생했습니다.' });
        console.error('지도를 불러오는 데 문제가 발생했습니다.', err);
        setError(true);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <>
      <div className="p-box flex flex-1 flex-col justify-center">
        <h2 className="typo-subtitle-medium mb-[16px] text-neutral-900">
          <span className="text-main">현재 위치</span>가 맞으신가요?
        </h2>
        <div className="typo-body-regular mb-[29px] text-neutral-700">
          <p>모든 회원은 거래를 위해</p>
          <p>사용자 위치를 설정해야 합니다.</p>
        </div>

        <DotStepper activeIndex={1} />

        <div className="bg-neutral-050 flex h-[200px] flex-col justify-center gap-[8px] rounded-2xl p-[8px] pb-[12px]">
          <APIProvider apiKey={MAPAPIKEY}>
            {loading ? (
              <div className="typo-body-medium text-neutral-600">위치 정보를 불러오는 중...</div>
            ) : error ? (
              <div className="text-danger typo-body-medium flex flex-col items-center gap-2">
                위치 정보를 가져올 수 없습니다.
                <Button onClick={fetchLocation} size="sm" variant="outline">
                  다시 시도
                </Button>
              </div>
            ) : (
              <>
                <Map zoom={13} center={position!} disableDefaultUI={true} mapId="setLocation">
                  <AdvancedMarker position={position!} clickable={false}>
                    <Pin
                      background="var(--color-main)"
                      glyphColor="var(--color-neutral-0)"
                      borderColor="var(--color-main)"
                    />
                  </AdvancedMarker>
                </Map>
                <div className="text-caption text-neutral-600">{address}</div>
              </>
            )}
          </APIProvider>
        </div>
      </div>

      <div>
        <div className="bg-warning-light text-warning-medium typo-body-medium flex h-[42px] items-center justify-center">
          반경 3km 이내의 오차가 있을 수 있습니다.
        </div>
        <div className="bg-main h-24 pt-3">
          <Button onClick={handleNext} disabled={!position}>
            위치 저장
          </Button>
        </div>
      </div>
    </>
  );
};

export default LocationConfirm;
