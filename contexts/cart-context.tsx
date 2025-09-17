"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

interface CartItem {
  id: string
  title: string
  price: number
  icon: string
  category: string
  href: string
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

const getCartFromLocalStorage = (): CartItem[] => {
  const savedCart = localStorage.getItem("downdating-cart")
  if (savedCart) {
    try {
      return JSON.parse(savedCart)
    } catch (error) {
      console.error("Error parsing cart from localStorage:", error)
      return []
    }
  }
  return []
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  // Always check localStorage for latest data
  const localStorageItems = getCartFromLocalStorage()
  let currentItems = localStorageItems.length > 0 ? localStorageItems : state.items

  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = currentItems.find((item) => item.id === action.payload.id)
      if (existingItem) {
        return state // Don't add duplicate items
      }
      const newItems = [...currentItems, action.payload]
      const total = newItems.reduce((sum, item) => sum + item.price, 0)
      return {
        items: newItems,
        total,
        itemCount: newItems.length,
      }
    }
    case "REMOVE_ITEM": {
      const newItems = currentItems.filter((item) => item.id !== action.payload)
      const total = newItems.reduce((sum, item) => sum + item.price, 0)
      return {
        items: newItems,
        total,
        itemCount: newItems.length,
      }
    }
    case "CLEAR_CART":
      return {
        items: [],
        total: 0,
        itemCount: 0,
      }
    case "LOAD_CART":
      const total = action.payload.reduce((sum, item) => sum + item.price, 0)
      return {
        items: action.payload,
        total,
        itemCount: action.payload.length,
      }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    const cartItems = getCartFromLocalStorage()
    if (cartItems.length > 0) {
      dispatch({ type: "LOAD_CART", payload: cartItems })
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("downdating-cart", JSON.stringify(state.items))
  }, [state.items])

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
