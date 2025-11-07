import React from 'react'

//hooks
import { useAccessoriesQuery } from '../components/hooks/useAccessoriesQuery.jsx';
import useAccessoriesStore from '../components/stores/useAccessoriesStore.jsx';
import useWindowWidth from '../components/hooks/useWindowWidth.jsx';
import useTranslate from '../components/hooks/useTranslate.jsx';
//Components
import MobileCard from '../components/main/MobileCard.jsx';
import ProductGrid from '../components/main/ProductGrid.jsx';
import Pagination from '../components/main/Pagination.jsx';
import Loading from '../components/main/Loading.jsx';
import ProductBlock from '../components/main/ProductBlock.jsx';

const GamingAccessories = () => {

  //Zustand
  const {gamingAccessories, setGamingAccessories} = useAccessoriesStore();

  //Query
  const { data: gaming, isLoading, isError } = useAccessoriesQuery({
  ...gamingAccessories,
   tags: ["Gaming"],
  }); 
  const products = gaming?.products ?? [];
  const pagination = gaming?.pagination ?? {};
   
  //Translate
  const t = useTranslate();

  //Width
  const width = useWindowWidth();

  //Handlers
  const handlePageChange = (page) => {
    if (page !== pagination.currentPage) setGamingAccessories({ page });
  };

  //Debug 
  console.log(products);
  console.log(pagination);


if (isLoading)
    return (
      <Loading
        message={t("Loading Accessories...", "جاري تحميل الإكسسوارات...")}
      />
    );

  if (isError)
    return (
      <p style={{ textAlign: "center" }}>
        {t("Failed to load accessories.", "فشل تحميل الإكسسوارات.")}
      </p>
    );

  return (
    <section id='pc-pr-container'>
        <header className='pr-header'><h1>Gaming</h1></header>


     <div className={width > 650 ? "products-grid-container " : "mobile-grid"}>
      {products.length > 0 ? (
        products.map((product, i) =>
          width > 650 ? (
            <ProductGrid key={product._id || product.id} product={product} />
          ) : (
            <ProductBlock
              key={product._id || product.id}
              product={product}
              customDelay={i * 0.08}
            />
          )
        )
      ) : (
        <p style={{ textAlign: "center" }}>
          {t("No gaming accessories found.", "لم يتم العثور على إكسسوارات ألعاب.")}
        </p>
      )}
    </div>

    {products.length > 0 && pagination.totalPages > 1 && (
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    )}

    </section>
  )
}

export default GamingAccessories