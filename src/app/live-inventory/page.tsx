import type { Metadata } from "next";
import InventoryExplorer from "@/components/inventory/InventoryExplorer";
import { plots } from "@/data/inventory";
import styles from "@/components/inventory/inventory.module.css";

export const metadata: Metadata = {
  title: "Star Gardens Plot Explorer | Star Managed Farmlands",
  description: "Explore the proposed Star Gardens plot layout in Kedakal. View plot shapes and source measurements, and enquire for confirmed availability.",
  alternates: { canonical: "/live-inventory" },
  robots: { index: false, follow: true },
};

export default function LiveInventoryPage() {
  return <div className={styles.page}>
    <header className={styles.intro}><h1>Star <em>Gardens.</em></h1><span>{plots.length} PLOTS · KEDAKAL, COORG</span></header>
    <InventoryExplorer />
  </div>;
}
