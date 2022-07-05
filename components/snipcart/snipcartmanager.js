import React, { useState, useContext, useEffect } from 'react'
import { AppContext } from '@/context/state'
import { hasMemberBookPrice } from '@/lib/access-validator'
import { getSnipcartClient } from '@/lib/utils'
import { fetchProductPricesByProductNumbers } from '@/lib/contentful'

/**
 * Snipcart is a third party app service that we are using for buying items such as books.
 * This is used to manage the interaction with the snipcart and the user account information.
 * There is nothing to display on the site, this component is just used to update snipcart state.
 *
 * @return {Component}
 */
const SnipcartManager = () => {
  const { user, userAccessData } = useContext(AppContext)
  const [snipcartClient, setSnipcartClient] = useState(getSnipcartClient())

  // Get Snipcart client
  useEffect(() => {
    if (!snipcartClient) {
      document.addEventListener('snipcart.ready', () => {
        setSnipcartClient(window.Snipcart)
      })
    }
  }, [])

  // Update Piano user id if User changes
  useEffect(() => {
    if (snipcartClient) {
      addPianoIdUid()
    }
  }, [user])

  // Update Product Prices if User Access Changes
  useEffect(() => {
    if (snipcartClient?.store.getState().cart.items.items.length > 0) {
      updateProductPrices()
    }
  }, [userAccessData])

  const addPianoIdUid = () => {
    snipcartClient.api.cart
      .update({
        metadata: {
          'piano-id-uid': user.id,
        },
      })
      .catch((e) => {
        throw Error(`Unable to add piano-id-uid to snipcart. | ${e.message}`)
      })
  }

  const updateCartItemPrice = (item) =>
    snipcartClient.api.cart.items.update(item)

  const updateProductPrices = () => {
    const productNumbers = snipcartClient.store
      .getState()
      .cart.items.items.map((item) => item.id)
    const cartItems = snipcartClient.store
      .getState()
      .cart.items.items.map((item) => ({
        uniqueId: item.uniqueId,
        productNumber: item.id,
      }))

    fetchProductPricesByProductNumbers(productNumbers)
      .then((response) => {
        const useMemberBookPrice = hasMemberBookPrice(userAccessData)

        const bookPrices = response.items.map((product) => ({
          uniqueId: cartItems.find(
            (item) => item.productNumber === product.fields.productNumber
          )?.uniqueId,
          price: useMemberBookPrice
            ? product.fields.priceMember
            : product.fields.priceNonMember,
        }))

        Promise.all(bookPrices.map((item) => updateCartItemPrice(item)))
      })
      .catch((e) => {
        throw Error(
          `Unable to update product prices in snipcart. | ${e.message}`
        )
      })
  }

  return <></>
}

export default SnipcartManager
