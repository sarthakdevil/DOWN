"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

interface CartItem {
  id: string
  title: string
  price: number
  icon: string
  category: string
  quantity?: number
}

interface UserInfo {
  name: string
  email: string
  phone: string
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  userInfo: UserInfo | null
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }
  | { type: "SET_USER_INFO"; payload: UserInfo }

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

const getUserInfoFromLocalStorage = (): UserInfo | null => {
  const savedUserInfo = localStorage.getItem("downdating-user-info")
  if (savedUserInfo) {
    try {
      return JSON.parse(savedUserInfo)
    } catch (error) {
      console.error("Error parsing user info from localStorage:", error)
      return null
    }
  }
  return null
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  // Always check localStorage for latest data
  const localStorageItems = getCartFromLocalStorage()
  let currentItems = localStorageItems.length > 0 ? localStorageItems : state.items

  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = currentItems.find((item) => item.id === action.payload.id)
      if (existingItem) {
        // Allow multiple quantities of the same item
        const updatedItems = currentItems.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        )
        const total = updatedItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
        return {
          ...state,
          items: updatedItems,
          total,
          itemCount: updatedItems.length,
        }
      }
      const newItems = [...currentItems, { ...action.payload, quantity: 1 }]
      const total = newItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
      return {
        ...state,
        items: newItems,
        total,
        itemCount: newItems.length,
      }
    }
    case "REMOVE_ITEM": {
      const itemToRemove = currentItems.find((item) => item.id === action.payload)
      if (itemToRemove && (itemToRemove.quantity || 1) > 1) {
        // Decrease quantity if more than 1
        const updatedItems = currentItems.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: (item.quantity || 1) - 1 }
            : item
        )
        const total = updatedItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
        return {
          ...state,
          items: updatedItems,
          total,
          itemCount: updatedItems.length,
        }
      } else {
        // Remove item completely if quantity is 1 or undefined
        const newItems = currentItems.filter((item) => item.id !== action.payload)
        const total = newItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
        return {
          ...state,
          items: newItems,
          total,
          itemCount: newItems.length,
        }
      }
    }
    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
      }
    case "LOAD_CART":
      const total = action.payload.reduce((sum, item) => sum + item.price, 0)
      return {
        ...state,
        items: action.payload,
        total,
        itemCount: action.payload.length,
      }
    case "SET_USER_INFO":
      return {
        ...state,
        userInfo: action.payload,
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
    userInfo: null,
  })

  // Load cart and user info from localStorage on mount
  useEffect(() => {
    const cartItems = getCartFromLocalStorage()
    if (cartItems.length > 0) {
      dispatch({ type: "LOAD_CART", payload: cartItems })
    }

    const userInfo = getUserInfoFromLocalStorage()
    if (userInfo) {
      dispatch({ type: "SET_USER_INFO", payload: userInfo })
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("downdating-cart", JSON.stringify(state.items))
  }, [state.items])

  // Save user info to localStorage whenever it changes
  useEffect(() => {
    if (state.userInfo) {
      localStorage.setItem("downdating-user-info", JSON.stringify(state.userInfo))
    } else {
      localStorage.removeItem("downdating-user-info")
    }
  }, [state.userInfo])

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
