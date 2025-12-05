import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = Object.values(product.stock).every((qty) => qty === 0)
  const categoryFallbacks: Record<string, string> = {
    Hoodies: "https://images.unsplash.com/photo-1542293787938-4d273c3f3f50?auto=format&fit=crop&w=800&q=80",
    Tees: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
    Accessories: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80",
    Sweatshirts: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    Outerwear: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
  }
  const imageSrc =
    product.image_url ||
    categoryFallbacks[product.category] ||
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80"

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-square relative bg-muted">
          <img src={imageSrc} alt={product.name} className="object-cover w-full h-full" />
          {product.is_limited_edition && <Badge className="absolute top-2 right-2 bg-primary">Limited Edition</Badge>}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary">Out of Stock</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <span className="text-lg font-bold">₹{product.price.toFixed(2)}</span>
          <span className="text-sm text-muted-foreground">{product.category}</span>
        </CardFooter>
      </Card>
    </Link>
  )
}
