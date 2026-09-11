import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product, StorageBox } from '../types';
import { useFirebase } from '../components/FirebaseProvider';
import { getStoredProducts, getStoredBoxes, saveStoredProducts, saveStoredBoxes } from '../lib/storage';

export function useFirestoreData() {
  const { user } = useFirebase();
  const [products, setProductsState] = useState<Product[]>(() => getStoredProducts());
  const [storageBoxes, setStorageBoxesState] = useState<StorageBox[]>(() => getStoredBoxes());
  const [isLoading, setIsLoading] = useState(true);

  // Firestore path builders
  const getProductsPath = () => user ? `users/${user.uid}/products` : null;
  const getBoxesPath = () => user ? `users/${user.uid}/storage_boxes` : null;

  useEffect(() => {
    if (!user) {
      setProductsState(getStoredProducts());
      setStorageBoxesState(getStoredBoxes());
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const pathProducts = getProductsPath();
    const pathBoxes = getBoxesPath();

    if (!pathProducts || !pathBoxes) return;

    const unsubscribeProducts = onSnapshot(collection(db, pathProducts), (snapshot) => {
      const fetchedProducts: Product[] = [];
      snapshot.forEach(doc => {
        fetchedProducts.push(doc.data() as Product);
      });
      // Sort by newest by default
      fetchedProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setProductsState(fetchedProducts);
      saveStoredProducts(fetchedProducts);
    }, (error) => handleFirestoreError(error, OperationType.GET, pathProducts));

    const unsubscribeBoxes = onSnapshot(collection(db, pathBoxes), (snapshot) => {
      const fetchedBoxes: StorageBox[] = [];
      snapshot.forEach(doc => {
        fetchedBoxes.push(doc.data() as StorageBox);
      });
      setStorageBoxesState(fetchedBoxes);
      saveStoredBoxes(fetchedBoxes);
      setIsLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.GET, pathBoxes));

    return () => {
      unsubscribeProducts();
      unsubscribeBoxes();
    };
  }, [user]);

  // Setters that sync to Firestore if user is logged in, else local storage
  const setProducts = async (newProductsAction: React.SetStateAction<Product[]>) => {
    const nextProducts = typeof newProductsAction === 'function' ? newProductsAction(products) : newProductsAction;
    
    if (!user) {
      setProductsState(nextProducts);
      saveStoredProducts(nextProducts);
      return;
    }

    // Determine what changed by comparing `products` and `nextProducts`
    // Wait, since we are doing optimistic updates or syncing, if they call setProducts we should sync to firestore.
    // However, it's difficult to diff the entire array perfectly. 
    // Usually, `setProducts` in App.tsx is used for CRUD operations on single items.
    // It would be much better to provide specific functions: addProduct, updateProduct, deleteProduct.
  };

  return { 
    products, 
    setProductsState, // raw state setter
    storageBoxes, 
    setStorageBoxesState,
    isLoading 
  };
}
