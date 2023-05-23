import { useState } from "react";
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonIcon
} from "@ionic/react";

import styles from "./Home.module.css";
import { searchOutline, cart, heart } from "ionicons/icons";

import { ProductStore } from "../data/ProductStore";
import { FavouritesStore } from "../data/FavouritesStore";
import { CartStore } from "../data/CartStore";

const Home = () => {
  const products = ProductStore.useState((s) => s.products);
  const favourites = FavouritesStore.useState((s) => s.product_ids);
  const shopCart = CartStore.useState((s) => s.product_ids);

  const [searchText, setSearchText] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <IonPage id="home-page" className={styles.homePage}>
      <IonHeader>
        <IonToolbar>
          <div className={styles.centerContainer}>
            <IonTitle>Categories</IonTitle>
          </div>
          <IonButtons slot="start" className="ion-padding-start">
            <IonCardSubtitle className={styles.logo}>
              Ionic Furniture
            </IonCardSubtitle>
          </IonButtons>

          <IonButtons slot="end">
            <IonBadge color="danger">{favourites.length}</IonBadge>
            <IonButton color="danger" routerLink="/favourites">
              <IonIcon icon={heart} />
            </IonButton>

            <IonBadge color="dark">{shopCart.length}</IonBadge>
            <IonButton color="dark" routerLink="/cart">
              <IonIcon icon={cart} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Categories</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonSearchbar
          className={styles.search}
          color="primary"
          placeholder="Search here"
          value={searchText}
          onIonChange={(e) => setSearchText(e.detail.value)}
        ></IonSearchbar>
        <IonGrid>
          <IonRow>
            {filteredProducts.map((category, index) => {
              return (
                <IonCol size="6" key={`category_list_${index}`}>
                  <IonCard
                    routerLink={`/category/${category.slug}`}
                    className={styles.categoryCard}
                  >
                    <div className={styles.centerContainer}>
                      <img src={category.cover} alt="category cover" />
                    </div>

                    <IonCardContent className={styles.categoryCardContent}>
                      <IonCardSubtitle>{category.name}</IonCardSubtitle>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              );
            })}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
