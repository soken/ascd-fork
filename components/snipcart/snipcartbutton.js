import React from 'react'
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'
import { encodeSnipcartOrderValidationUrl } from '@/lib/utils'

export default function SnipcartButton({
  snipcart,
  className,
  onclick = null,
}) {
  const description = documentToPlainTextString(snipcart.dataItemDescription)

  return (
    <button
      className={`snipcart-add-item ${className}`}
      data-item-id={snipcart.dataItemId}
      data-item-price={snipcart.dataItemPrice}
      data-item-file-guid={snipcart.digitalFileGuid}
      data-item-weight={snipcart.dataItemPrice}
      data-item-custom1-name='TaxJarCategory'
      data-item-custom1-value={snipcart.dataItemCustom1Value}
      data-item-custom1-type='hidden'
      data-item-custom1-required='false'
      data-item-url={encodeSnipcartOrderValidationUrl(
        snipcart.dataItemId,
        snipcart.dataItemPrice
      )}
      data-item-description={
        snipcart
          ? description.substring(0, description.indexOf('.') + 1)
          : false
      }
      data-item-image={snipcart.dataItemImage}
      data-item-name={snipcart.dataItemName}
      data-item-quantity={snipcart.dataItemQuantity}
      onClick={() => (onclick ? onclick() : void 0)}
    >
      {snipcart.label}
    </button>
  )
}
