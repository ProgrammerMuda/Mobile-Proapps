import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon } from '@phosphor-icons/react';
import bannerLiftRepairImg from '../../assets/banners/banner-lift-repair.png';
import bannerPowerOutageImg from '../../assets/banners/banner-power-outage.png';
import bannerTariffAdjustmentImg from '../../assets/banners/banner-tariff-adjustment.png';
import bannerParkingRulesImg from '../../assets/banners/banner-parking-rules.png';
import bannerBuildingRulesImg from '../../assets/banners/banner-building-rules.png';

const DEFAULT_BANNERS = [
  {
    id: 'banner-1',
    title: 'Pengumuman: Perbaikan Lift Tower A',
    subtitle: '15 - 17 Sept 2026 (09.00 - 17.00 WIB)',
    image: bannerLiftRepairImg,
    bgColor: '#0284C7',
    borderColor: '#0284C7',
  },
  {
    id: 'banner-2',
    title: 'Pengumuman: Pemadaman Listrik Semua Tower',
    subtitle: '20 September 2026 (09.00 - 17.00 WIB)',
    image: bannerPowerOutageImg,
    bgColor: '#0284C7',
    borderColor: '#0284C7',
  },
  {
    id: 'banner-3',
    title: 'Pengumuman: Perubahan Tarif atau Kebijakan Pembayaran',
    subtitle: 'Berlaku Mulai 1 Oktober 2026',
    image: bannerTariffAdjustmentImg,
    bgColor: '#0284C7',
    borderColor: '#0284C7',
  },
  {
    id: 'banner-4',
    title: 'Pengumuman: Aturan Baru Tamu, Kendaraan, atau Parkir',
    subtitle: 'Berlaku Mulai 1 Oktober 2026',
    image: bannerParkingRulesImg,
    bgColor: '#0284C7',
    borderColor: '#0284C7',
  },
  {
    id: 'banner-5',
    title: 'Pengumuman: Tata Tertib Demi Kenyamanan Bersama',
    subtitle: 'Dilarang Merokok, Jaga Ketertiban, Buang Sampah, Hewan Peliharaan',
    image: bannerBuildingRulesImg,
    bgColor: '#0284C7',
    borderColor: '#0284C7',
  },
];

/**
 * Horizontal Banner Slider Component with Scroll Snap & Dot Indicators
 */
export const PromoBannerSlider = ({ banners = DEFAULT_BANNERS, onBannerClick }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    if (clientWidth > 0) {
      const index = Math.round(scrollLeft / clientWidth);
      setActiveIndex(Math.min(Math.max(index, 0), banners.length - 1));
    }
  };

  const scrollToIndex = (index) => {
    if (!scrollRef.current) return;
    const clientWidth = scrollRef.current.clientWidth;
    scrollRef.current.scrollTo({
      left: index * clientWidth,
      behavior: 'smooth',
    });
    setActiveIndex(index);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="banner-scroll-container"
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          gap: '12px',
          width: '100%',
          boxSizing: 'border-box',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {banners.map((item, idx) => (
          <div
            key={item.id || idx}
            onClick={() => onBannerClick && onBannerClick(item, idx)}
            style={{
              flex: '0 0 100%',
              width: '100%',
              height: '155px',
              borderRadius: '16px',
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always',
              background: item.bgColor || '#F8FAFC',
              border: `1px solid ${item.borderColor || '#E2E8F0'}`,
              boxSizing: 'border-box',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: onBannerClick ? 'pointer' : 'default',
              userSelect: 'none',
            }}
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.title || `Banner ${idx + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            ) : (
              /* Clean Placeholder State */
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  color: '#94A3B8',
                  padding: '16px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    border: '1px dashed #CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#09B2FF',
                  }}
                >
                  <ImageIcon size={20} weight="duotone" />
                </div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569' }}>
                  {item.title}
                </span>
                <span style={{ fontSize: '0.6875rem', fontWeight: 500, color: '#94A3B8' }}>
                  {item.subtitle || 'Slot Banner Kosong'}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Indicator Dots */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          paddingTop: '2px',
        }}
      >
        {banners.map((_, idx) => {
          const isActive = activeIndex === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToIndex(idx)}
              aria-label={`Go to banner ${idx + 1}`}
              style={{
                width: isActive ? '20px' : '6px',
                height: '6px',
                borderRadius: '9999px',
                backgroundColor: isActive ? 'var(--color-primary)' : '#CBD5E1',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                outline: 'none',
              }}
            />
          );
        })}
      </div>

      <style>{`
        .banner-scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default PromoBannerSlider;
