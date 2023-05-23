import {
  IonAvatar,
  IonBadge,
  IonButton,
  IonButtons,
  IonCardSubtitle,
  IonCol,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import {
  cart,
  checkmarkSharp,
  chevronBackOutline,
  trashOutline
} from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { CartStore, removeFromCart } from "../data/CartStore";
import { ProductStore } from "../data/ProductStore";

import styles from "./CartProducts.module.css";

const CartProducts = () => {
  const cartRef = useRef();
  const products = ProductStore.useState((s) => s.products);
  const shopCart = CartStore.useState((s) => s.product_ids);
  const [cartProducts, setCartProducts] = useState([]);
  const [amountLoaded, setAmountLoaded] = useState(6);

  const [total, setTotal] = useState(0);

  useEffect(() => {
    const getCartProducts = () => {
      setCartProducts([]);
      setTotal(0);

      const cartProductMap = new Map();

      shopCart.forEach((product) => {
        const [categorySlug, productID] = product.split("/");
        const tempCategory = products.find((p) => p.slug === categorySlug);
        const tempProduct = tempCategory.products.find(
          (p) => parseInt(p.id) === parseInt(productID)
        );

        const cartProductKey = `${tempProduct.id}-${tempProduct.name}`;
        if (cartProductMap.has(cartProductKey)) {
          const existingProduct = cartProductMap.get(cartProductKey);
          existingProduct.quantity += 1;
          cartProductMap.set(cartProductKey, existingProduct);
        } else {
          cartProductMap.set(cartProductKey, {
            category: tempCategory,
            product: tempProduct,
            quantity: 1
          });
        }
        setTotal(
          (prevTotal) =>
            prevTotal + parseInt(tempProduct.price.replace("£", ""))
        );
      });

      const stackedCartProducts = Array.from(cartProductMap.values());
      setCartProducts(stackedCartProducts);
    };

    getCartProducts();
  }, [shopCart]);

  const fetchMore = async (e) => {
    //	Increment the amount loaded by 6 for the next iteration
    setAmountLoaded((prevAmount) => prevAmount + 6);
    e.target.complete();
  };

  const removeProductFromCart = async (index) => {
    const selectedProduct = cartProducts[index];
    const categorySlug = selectedProduct.category.slug;
    const productID = selectedProduct.product.id;
    const cartProductID = `${categorySlug}/${productID}`;

    const productIndex = shopCart.indexOf(cartProductID);
    if (productIndex > -1) {
      removeFromCart(productIndex);
    }
  };

  return (
    <IonPage id="category-page" className={styles.categoryPage}>
      <IonHeader>
        <IonToolbar className="ion-text-center">
          <IonButtons slot="start">
            <IonButton color="dark" routerLink="/" routerDirection="back">
              <IonIcon color="dark" icon={chevronBackOutline} />
              &nbsp;Categories
            </IonButton>
          </IonButtons>
          <IonTitle className={styles.cartTitle}>Cart</IonTitle>
          <IonButtons slot="end">
            <IonBadge color="dark">{shopCart.length}</IonBadge>
            <IonButton color="dark">
              <IonIcon
                ref={cartRef}
                className="animate__animated"
                icon={cart}
              />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRow className="ion-text-center ion-margin-top">
          <IonCol size="12">
            <IonNote>
              {cartProducts && cartProducts.length}{" "}
              {cartProducts.length > 1 || cartProducts.length === 0
                ? " products"
                : " product"}{" "}
              found
            </IonNote>
          </IonCol>
        </IonRow>

        <IonList>
          {cartProducts &&
            cartProducts.map((product, index) => {
              if (index <= amountLoaded) {
                const itemTotal =
                  parseFloat(product.product.price.replace("£", "")) *
                  product.quantity;
                return (
                  <IonItemSliding className={styles.cartSlider} key={index}>
                    <IonItem
                      lines="none"
                      detail={false}
                      className={styles.cartItem}
                    >
                      <IonAvatar>
                        <IonImg src={product.product.image} />
                      </IonAvatar>
                      <IonLabel className="ion-padding-start ion-text-wrap">
                        <p>{product.category.name}</p>
                        <h4>{product.product.name}</h4>
                        <p>Quantity: {product.quantity}</p>
                        <p>Cost (per item): {product.product.price} </p>
                      </IonLabel>

                      <div className={styles.cartActions}>
                        <IonBadge color="dark">
                          Total: £{itemTotal.toFixed(2)}
                        </IonBadge>{" "}
                        {/* Updated line */}
                      </div>
                    </IonItem>

                    <IonItemOptions side="end">
                      <IonItemOption
                        color="danger"
                        style={{ paddingLeft: "1rem", paddingRight: "1rem" }}
                        onClick={() => removeProductFromCart(index)}
                      >
                        <IonIcon icon={trashOutline} />
                      </IonItemOption>
                    </IonItemOptions>
                  </IonItemSliding>
                );
              }
            })}
        </IonList>
      </IonContent>

      <IonFooter className={styles.cartFooter}>
        <div className={styles.cartCheckout}>
          <IonCardSubtitle>Total Cost: £{total.toFixed(2)}</IonCardSubtitle>

          <IonButton color="dark">
            <IonIcon icon={checkmarkSharp} />
            &nbsp;Checkout
          </IonButton>
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default CartProducts;
