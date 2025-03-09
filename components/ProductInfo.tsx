"use client"

import { useState } from "react"
import { MinusCircle, PlusCircle, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import useCart from "@/lib/hooks/useCart"
import HeartFavorite from "./HeartFavorite"

const ProductInfo = ({ productInfo }: { productInfo: ProductType }) => {
  const [selectedColor, setSelectedColor] = useState<string>(productInfo.colors[0])
  const [selectedSize, setSelectedSize] = useState<string>(productInfo.sizes[0])
  const [quantity, setQuantity] = useState<number>(1)

  const cart = useCart()

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="space-y-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-heading3-bold">{productInfo.title}</CardTitle>
          <HeartFavorite product={productInfo} />
        </div>

        <div className="flex gap-2">
          <p className="text-base-medium text-grey-2">Category:</p>
          <p className="text-base-bold">{productInfo.category}</p>
        </div>
        <p className="text-heading3-bold">$ {productInfo.price}</p>

      </CardHeader>

      <CardContent className="space-y-3">

        <div className="flex flex-col gap-2">
          <p className="text-base-medium text-grey-2">Description:</p>
          <p className="text-small-medium">{productInfo.description}</p>
        </div>

        {productInfo.colors.length > 0 && (
          <div>
            <h3 className="text-base-medium text-grey-2 mb-2">Colors:</h3>
            <div className="flex flex-wrap gap-2">
              {productInfo.colors.map((color) => (
                <Button
                  key={color}
                  variant={selectedColor === color ? "default" : "outline"}
                  onClick={() => setSelectedColor(color)}
                  className="min-w-[4rem] p-2"
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>
        )}

        {productInfo.sizes.length > 0 && (
          <div>
            <h3 className="text-base-medium text-grey-2 mb-2">Sizes:</h3>
            <div className="flex flex-wrap gap-2">
              {productInfo.sizes.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  onClick={() => setSelectedSize(size)}
                  className="min-w-[3rem] p-2"
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-base-medium text-grey-2 mb-2">Quantity:</h3>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => quantity > 1 && setQuantity(quantity - 1)}>
              <MinusCircle className="h-4 w-4" />
            </Button>
            <span className="text-xl font-semibold">{quantity}</span>
            <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="pt-6">
        <Button
          className="w-full"
          onClick={() => {
            cart.addItem({
              item: productInfo,
              quantity,
              color: selectedColor,
              size: selectedSize,
            })
          }}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ProductInfo

