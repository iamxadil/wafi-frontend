import React from 'react';
import useFavoritesStore from '../../stores/useFavoritesStore.jsx';
import ProductGrid from '../../main/ProductGrid.jsx';
import '../../../styles/favorites.css'
import { Link } from 'react-router-dom';

const Favorites = () => {
  const { favorites } = useFavoritesStore();

  return (
      <>
      <header id='fav-container'>
        <h1>My Favorites</h1>
        <p>Your hand-picked treasures, saved just for you. 💖</p>
      </header>

      {favorites.length === 0 ? (
        <main id='no-favs'>
          <p>No favorites yet. Start <Link to="/">discovering</Link> products you'll love!</p>
        </main>
      ) : (
      <main className='products-grid-container'>
        {favorites.map((fav) => <ProductGrid key={fav.id || fav._id} product={fav} />)}
      </main>
      )}
   </>
  );
};

export default Favorites;
