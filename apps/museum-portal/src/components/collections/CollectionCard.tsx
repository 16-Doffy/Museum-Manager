import React from 'react';
import { Collection } from '../../lib/types/types';

interface CollectionCardProps {
  collection: Collection;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  return (
    <div className="collection-card">
      <h2>{collection.title}</h2>
      <p>{collection.description}</p>
      <button>View Collection</button>
    </div>
  );
};

export default CollectionCard;