import React, {useEffect} from 'react'
import useProductStore from '../stores/useProductStore.jsx';
import useWindowWidth from '../hooks/useWindowWidth.jsx';
import ProductCard from './ProductCard.jsx';
import MobileCard from './MobileCard.jsx';
import Pagination from './Pagination.jsx';
import { AnimatePresence } from 'framer-motion';

const Offers = () => {

  const width = useWindowWidth();

  
  const fetchOffers = useProductStore((state) => state.fetchOffers);
  const offerProducts = useProductStore((state) => state.offerProducts);
  const offerPagination = useProductStore((state) => state.offerPagination);
  const offersLimit = useProductStore((state) => state.offersLimit)


  
  useEffect(() => {
    fetchOffers(4);
    if (width > 650) {
      fetchOffers({ limit: 4});
    } else {
      fetchOffers({ limit: 4 });
    }
  }, [width]);

  const handlePageChange = (page) => fetchOffers({ page, limit: offersLimit });

  

  return (
    <>

    <main id="pc-pr-container">

      

      {width > 650 && (
        <>
        <header id='pc-pr-header'>
          <h1>Offers</h1>
        </header>
        <div id='pc-pr-cards-container'>
          <div className="pc-pr-cards">
            {offerProducts.map((product) => 
            <ProductCard key={product.id} product={product}/> )}
          </div>
        </div>
        </>
      ) }

      {width <= 650 && (
        <>
        <header id="mob-pr-container">
          <h1>Offers</h1>
        </header>
        <div className='mob-pr-cards'>
          <AnimatePresence initial={false}>
            {offerProducts.map((product, index) => (
              <MobileCard key={product._id || product.id} product={product} customDelay={index * 0.08}/>
            ))}
          </AnimatePresence>
        </div>
        </>
        
      ) }
    
    {offerPagination.totalPages > 0 &&
    <Pagination currentPage={offerPagination.currentPage} 
    totalPages={offerPagination.totalPages} 
    onPageChange={handlePageChange} mobile/>
    }
    

    </main>
    </>
  )
}

export default Offers