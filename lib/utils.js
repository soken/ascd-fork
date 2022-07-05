export const getPianoClient = () =>
  typeof window !== 'undefined' && typeof window.tp !== 'undefined'
    ? window.tp
    : undefined

export const getSnipcartClient = () =>
  typeof window !== 'undefined' && typeof window.Snipcart !== 'undefined'
    ? window.Snipcart
    : undefined

// util function to get the host name
export const hostName = 
typeof window !== 'undefined' && window.location.hostname.includes('.ascd.org') ? ".ascd.org" : ""
 
/**
 * This function will return the url needed to allow Snipcart to validate products
 * that are purchased on our site.
 *
 * @param {String} productId
 * @param {Number} productPrice
 * @returns {String}
 */
export const encodeSnipcartOrderValidationUrl = (productId, productPrice) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_SNIPCART_ORDER_VALIDATION_BASE_URL || ''

  const price = productPrice ? productPrice.toString() : '0'

  return `${baseUrl}/api/order-validations/${productId}?vKey=${Buffer.from(
    price,
    'binary'
  ).toString('base64')}`
}
