import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product, StorageBox } from '../types';
import { useFirebase } from '../components/FirebaseProvider';
import { getStoredProducts, getStoredBoxes, saveStoredProducts, saveStoredBoxes } from '../lib/storage';

export function useInventory() {
  const { user } = useFirebase();
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());
  const [storageBoxes, setStorageBoxes] = useState<StorageBox[]>(() => getStoredBoxes());
  const [isLoading, setIsLoading] = useState(true);

  // Load data
  useEffect(() => {
    if (!user) {
      setProducts(getStoredProducts());
      setStorageBoxes(getStoredBoxes());
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const productsRef = collection(db, `users/${user.uid}/products`);
    const boxesRef = collection(db, `users/${user.uid}/storage_boxes`);

    const unsubscribeProducts = onSnapshot(productsRef, (snapshot) => {
      const items: Product[] = [];
      snapshot.forEach((d) => items.push(d.data() as Product));
      setProducts(items);
      saveStoredProducts(items);
    }, (error) => handleFirestoreError(error, OperationType.GET, `users/${user.uid}/products`));

    const unsubscribeBoxes = onSnapshot(boxesRef, (snapshot) => {
      const items: StorageBox[] = [];
      snapshot.forEach((d) => items.push(d.data() as StorageBox));
      setStorageBoxes(items);
      saveStoredBoxes(items);
      setIsLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.GET, `users/${user.uid}/storage_boxes`));

    return () => {
      unsubscribeProducts();
      unsubscribeBoxes();
    };
  }, [user]);

  // Sync state changes to Firestore
  const syncProducts = async (nextProducts: Product[]) => {
    setProducts(nextProducts);
    saveStoredProducts(nextProducts);
    
    if (!user) return;

    // Find deleted
    const currentIds = new Set(nextProducts.map(p => p.id));
    const oldIds = new Set(products.map(p => p.id));
    
    for (const p of products) {
      if (!currentIds.has(p.id)) {
        try {
          await deleteDoc(doc(db, `users/${user.uid}/products/${p.id}`));
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/products/${p.id}`);
        }
      }
    }

    // Find added or updated
    for (const p of nextProducts) {
      const old = products.find(op => op.id === p.id);
      if (!old || JSON.stringify(old) !== JSON.stringify(p)) {
        try {
          // ensure userId is set
          const toSave = { ...p, userId: user.uid };
          await setDoc(doc(db, `users/${user.uid}/products/${p.id}`), toSave);
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/products/${p.id}`);
        }
      }
    }
  };

  const syncStorageBoxes = async (nextBoxes: StorageBox[]) => {
    setStorageBoxes(nextBoxes);
    saveStoredBoxes(nextBoxes);
    
    if (!user) return;

    const currentIds = new Set(nextBoxes.map(b => b.id));
    const oldIds = new Set(storageBoxes.map(b => b.id));
    
    for (const b of storageBoxes) {
      if (!currentIds.has(b.id)) {
        try {
          await deleteDoc(doc(db, `users/${user.uid}/storage_boxes/${b.id}`));
        } catch (error) {
          handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/storage_boxes/${b.id}`);
        }
      }
    }

    for (const b of nextBoxes) {
      const old = storageBoxes.find(ob => ob.id === b.id);
      if (!old || JSON.stringify(old) !== JSON.stringify(b)) {
        try {
          const toSave = { ...b, userId: user.uid };
          await setDoc(doc(db, `users/${user.uid}/storage_boxes/${b.id}`), toSave);
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/storage_boxes/${b.id}`);
        }
      }
    }
  };

  // Safe wrapper for setProducts to handle callback updates
  const handleSetProducts = (action: React.SetStateAction<Product[]>) => {
    const next = typeof action === 'function' ? action(products) : action;
    syncProducts(next);
  };

  const handleSetStorageBoxes = (action: React.SetStateAction<StorageBox[]>) => {
    const next = typeof action === 'function' ? action(storageBoxes) : action;
    syncStorageBoxes(next);
  };

  return {
    products,
    setProducts: handleSetProducts,
    storageBoxes,
    setStorageBoxes: handleSetStorageBoxes,
    isLoading
  };
}
