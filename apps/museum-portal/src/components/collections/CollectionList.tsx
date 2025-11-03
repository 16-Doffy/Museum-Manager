import React from 'react';
import CollectionCard from './CollectionCard';
import { Collection } from '../../lib/types/types';

const collections: Collection[] = [
  { id: 1, title: 'Ancient Artifacts', description: 'Explore ancient items.' },
  { id: 2, title: 'Modern Art', description: 'Discover modern masterpieces.' },
  
];

const CollectionList = () => {
  return (
    <div className="collection-list">
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
};

export default CollectionList;