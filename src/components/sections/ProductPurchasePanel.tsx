"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { VariantSelector } from "@/components/ui/VariantSelector";
import { useCartStore } from "@/lib/cart/store";
import type { AnyProduct, ProductVariation } from "@/lib/repo/types";
import { formatPrice } from "@/lib/utils/format-price";

export interface ProductPurchasePanelProps {
  product: AnyProduct;
}

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const t = useTranslations("ProductPurchasePanel");
  const tStock = useTranslations("StockStatus");
  const addItem = useCartStore((s) => s.addItem);
  const [variation, setVariation] = useState<ProductVariation | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const isVariable = product.__typename === "VariableProduct";

  const price = isVariable
    ? (variation?.price ?? variation?.regularPrice ?? product.price)
    : product.price;
  const stockStatus = isVariable
    ? (variation?.stockStatus ?? product.stockStatus)
    : product.stockStatus;

  const canAddToCart = useMemo(() => {
    if (stockStatus === "OUT_OF_STOCK") return false;
    if (isVariable && !variation) return false;
    return true;
  }, [isVariable, variation, stockStatus]);

  function handleAddToCart() {
    if (!canAddToCart || !price) return;
    const attributeLabels =
      product.__typename === "VariableProduct" ? product.attributes.nodes : [];
    const displayAttributes = variation?.attributes.map((a) => ({
      name: a.name,
      label: attributeLabels.find((attr) => attr.name === a.name)?.label ?? a.name,
      value: a.value,
    }));
    addItem(
      {
        productId: product.id,
        variationId: variation?.id ?? null,
        slug: product.slug,
        name: product.name,
        image: variation?.image ?? product.image,
        price,
        attributes: displayAttributes,
        databaseId: variation?.databaseId ?? product.databaseId,
      },
      quantity,
    );
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-[22px] font-mono text-accent">{formatPrice(price)}</div>

      {isVariable && product.__typename === "VariableProduct" && (
        <VariantSelector
          attributes={product.attributes.nodes}
          variations={product.variations.nodes}
          onChange={setVariation}
        />
      )}

      {stockStatus === "OUT_OF_STOCK" && (
        <p className="label-nav text-danger">{tStock("outOfStock")}</p>
      )}
      {stockStatus === "ON_BACKORDER" && (
        <p className="label-nav text-warning">{tStock("onBackorder")}</p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <QuantityStepper value={quantity} onChange={setQuantity} min={1} />
        <Button
          onClick={handleAddToCart}
          disabled={!canAddToCart}
          trailingArrow
          className="disabled:cursor-not-allowed disabled:opacity-40"
        >
          {justAdded ? t("addedToCart") : t("addToCart")}
        </Button>
      </div>

      <Button href="/kontakt" variant="secondary" compact className="self-start">
        {t("askInstallation")}
      </Button>
    </div>
  );
}
