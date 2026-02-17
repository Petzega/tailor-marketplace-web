// app/page.tsx
import { ProductGrid } from "@/components/catalog/product-grid";

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          Tailor Marketplace
        </h1>
        <p className="text-muted-foreground text-lg">
          Costura a medida y moda lista para usar.
        </p>
      </div>

      {/* Aquí insertamos nuestro catálogo */}
      <ProductGrid />
    </main>
  );
}