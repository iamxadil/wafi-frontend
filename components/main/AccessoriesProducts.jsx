import React from 'react'
import { Link } from 'react-router-dom'
import { Joystick } from 'lucide-react';
import ProductCard from './ProductCard.jsx'
import MobileCard from './MobileCard.jsx'
import Pagination from './Pagination.jsx'
import useWindowWidth from '../hooks/useWindowWidth.jsx'
import useAccessoriesStore from '../stores/useAccessoriesStore.jsx'
import { useAccessoriesQuery } from '../hooks/useAccessoriesQuery.jsx'
import Loading from './Loading.jsx'
import useTranslate from '../hooks/useTranslate.jsx';

const AccessoriesProducts = () => {


  //Setup
  const width = useWindowWidth();
 
  //Language Setup
  const t = useTranslate();

  // Zustand state
  const params = useAccessoriesStore((state) => state.accessoriesParams);
  const setParams = useAccessoriesStore((state) => state.setAccessoriesParams);

  // Query
  const { data, isLoading, isError } = useAccessoriesQuery(params);
  const products = data?.products || [];
  const pagination = data?.pagination || { currentPage: 1, totalPages: 0 };
  const maxPages = 2;
  const totalPages = Math.min(pagination.totalPages, maxPages);

  //States
   const handlePageChange = (page) => {
    if (page !== pagination.currentPage) setParams({ page });
  };

  //Handle Errors
  if (isLoading) return <Loading message="Loading Accessories..." />;
  if (isError) return <p style={{ textAlign: "center" }}>Failed to load laptops.</p>;

  return (
    <>
    <main id='pc-pr-container'>
      <header className='pr-header' >
        <Link to="/accessories" style={{flexDirection: t.rowReverse}}>
        <h1>{t("Accessories", "الأكسسوارات")}</h1> <p>{t("View More", "رؤية المزيد")}</p>
        </Link>
        </header>

       <div className={width > 650 ? "pc-pr-cards" : "mob-pr-cards"}>
        {products.length > 0 ? (
          products.map((product, i) =>
            width > 650 ? (
              <ProductCard key={product._id || product.id} product={product} />
            ) : (
              <MobileCard
                key={product._id || product.id}
                product={product}
                customDelay={i * 0.08}
              />
            )
          )
        ) : (
          <p style={{ textAlign: "center" }}>{t("No Accessories Found", "لا توجد اكسسوارات")}</p>
        )}
      </div>


      {products.length > 0 && totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={totalPages}   
          onPageChange={handlePageChange}
        />
      )}

    </main>
    </>
  )
}

export default AccessoriesProducts