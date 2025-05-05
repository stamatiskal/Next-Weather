import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Welcome to the Weather App</h1>
        <p className={styles.description}>
          Discover real-time weather information for any city in the world.
        </p>
        <Link href="/Search">
          <button className={styles.button}>Get Started</button>
        </Link>
      </div>
    </>
  );
}
