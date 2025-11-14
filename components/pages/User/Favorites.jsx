import React from 'react';
import useFavoritesStore from '../../stores/useFavoritesStore.jsx';
import ProductGrid from '../../main/ProductGrid.jsx';
import ProductBlock from '../../main/ProductBlock.jsx';
import ProductCard from '../../main/ProductCard.jsx';
import '../../../styles/favorites.css';
import { Link } from 'react-router-dom';
import useTranslate from '../../hooks/useTranslate.jsx';
import useWindowWidth from '../../hooks/useWindowWidth.jsx';

const Favorites = () => {
  const { favorites } = useFavoritesStore();
  const t = useTranslate();
  const width = useWindowWidth();

  return (
    <>
      <header id='fav-container' dir={t.language === 'ar' ? 'rtl' : 'ltr'}>
        <h1 style={{ textAlign: t.textAlign }}>
          {t('My Favorites', 'مفضلتي')}
        </h1>
        <p style={{ textAlign: t.textAlign, marginTop: "12px" }}>
          {t(
            'Your hand-picked treasures, saved just for you. 💖',
            'اختياراتك المفضلة المحفوظة خصيصًا لك 💖'
          )}
        </p>
      </header>

      {favorites.length === 0 ? (
        <main id='no-favs' dir={t.language === 'ar' ? 'rtl' : 'ltr'} style={{ textAlign: t.textAlign }}>
          <p>
            {t(
              <>
                No favorites yet. Start <Link to="/">discovering</Link> products you'll love!
              </>,
              <>
                لا توجد منتجات مفضلة بعد. ابدأ <Link to="/">باستكشاف</Link> المنتجات التي ستُحبها!
              </>
            )}
          </p>
        </main>
      ) : (
       <div
          className={width > 650 ? "pc-pr-cards" : "mobile-grid"}
          style={{ textAlign: t.textAlign }}
        >
          {favorites.map((fav, i) => (
            width > 650 ? (
              <ProductCard key={fav._id || i} product={fav} />
            ) : (
              <ProductBlock key={fav._id || i} product={fav} />
            )
          ))}
        </div>

      )}
    </>
  );
};

export default Favorites;
