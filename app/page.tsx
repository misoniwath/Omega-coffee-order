"use client"

import type React from "react"

import { useState, useRef } from "react"
import { ShoppingCart, MapPin, Plus, Minus, Trash2, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Image from "next/image"
import { cn } from "@/lib/utils"

// Types
type Language = "en" | "km" | "ch"

type LocalizedString = {
  en: string
  km: string
  ch: string
}

type Product = {
  id: string
  name: LocalizedString
  price: number
  image: string
  category: string
}

type CartItem = Product & {
  quantity: number
}

// Translations
const TRANSLATIONS = {
  en: {
    title: "COFFEE MENU",
    subtitle: "Order your favorite drinks here",
    addToCart: "Add to Cart",
    yourOrder: "Your Order",
    selectedItems: "Selected Items",
    emptyCart: "Your cart is empty",
    totalAmount: "Total Amount",
    deliveryDetails: "Delivery Details",
    name: "Name",
    namePlaceholder: "Your Name",
    phone: "Phone",
    phonePlaceholder: "012 345 678",
    location: "Location",
    locationPlaceholder: "Location",
    paymentMethod: "Payment Method",
    abaTransfer: "ABA Transfer",
    scanQr: "Scan QR to Pay",
    iHavePaid: "I Have Paid",
    cashCod: "Cash / COD",
    payArrival: "Pay on arrival",
    note: "Note (Optional)",
    notePlaceholder: "Less sweet, extra ice...",
    orderNow: "ORDER NOW",
    sending: "Sending Order...",
    orderSent: "Order Sent!",
    orderConfirmation: "Your order has been sent to the cafe. We'll confirm shortly.",
    orderMore: "Order More",
    scanToPay: "Scan to Pay (ABA)",
  },
  km: {
    title: "ម៉ឺនុយកាហ្វេ",
    subtitle: "កម្មង់ភេសជ្ជៈរបស់អ្នកនៅទីនេះ",
    addToCart: "ទិញ",
    yourOrder: "ការបញ្ជាទិញរបស់អ្នក",
    selectedItems: "ទំនិញដែលបានជ្រើសរើស",
    emptyCart: "កន្ត្រករបស់អ្នកទទេ",
    totalAmount: "សរុបទឹកប្រាក់",
    deliveryDetails: "ព័ត៌មានសម្រាប់ការដឹកជញ្ជូន",
    name: "ឈ្មោះ",
    namePlaceholder: "ឈ្មោះរបស់អ្នក",
    phone: "លេខទូរស័ព្ទ",
    phonePlaceholder: "012 345 678",
    location: "ទីតាំង",
    locationPlaceholder: "ទីតាំង",
    paymentMethod: "វិធីសាស្ត្រទូទាត់",
    abaTransfer: "ផ្ទេរប្រាក់ ABA",
    scanQr: "ស្កេន QR ដើម្បីបង់ប្រាក់",
    iHavePaid: "ខ្ញុំបានបង់ប្រាក់រួចហើយ",
    cashCod: "សាច់ប្រាក់ / ទូទាត់ពេលដឹកដល់",
    payArrival: "ទូទាត់ពេលទទួលបាន",
    note: "កំណត់សម្គាល់ (មិនចាំបាច់)",
    notePlaceholder: "ផ្អែមតិច, ទឹកកកច្រើន...",
    orderNow: "កម្មង់ឥឡូវនេះ",
    sending: "កំពុងផ្ញើ...",
    orderSent: "ការកម្មង់បានជោគជ័យ!",
    orderConfirmation: "ការកម្មង់របស់អ្នកត្រូវបានផ្ញើទៅកាន់ហាង។ យើងនឹងបញ្ជាក់ជូនក្នុងពេលឆាប់ៗនេះ។",
    orderMore: "កម្មង់បន្ថែម",
    scanToPay: "ស្កេនដើម្បីទូទាត់ (ABA)",
  },
  ch: {
    title: "咖啡菜单",
    subtitle: "在此订购您最喜欢的饮料",
    addToCart: "加入购物车",
    yourOrder: "您的订单",
    selectedItems: "已选商品",
    emptyCart: "您的购物车是空的",
    totalAmount: "总金额",
    deliveryDetails: "配送详情",
    name: "姓名",
    namePlaceholder: "您的姓名",
    phone: "电话号码",
    phonePlaceholder: "012 345 678",
    location: "位置",
    locationPlaceholder: "位置",
    paymentMethod: "支付方式",
    abaTransfer: "ABA 转账",
    scanQr: "扫码支付",
    iHavePaid: "我已付款",
    cashCod: "现金 / 货到付款",
    payArrival: "货到付款",
    note: "备注 (可选)",
    notePlaceholder: "少糖, 多冰...",
    orderNow: "立即下单",
    sending: "正在发送...",
    orderSent: "订单已发送！",
    orderConfirmation: "您的订单已发送至咖啡厅。我们将尽快确认。",
    orderMore: "再来一单",
    scanToPay: "扫码支付 (ABA)",
  },
}

const CATEGORIES = [
  { id: "hot-coffee", name: { en: "Hot Coffee", km: "កាហ្វេក្តៅ", ch: "热咖啡" } },
  { id: "soda", name: { en: "Soda Drinks", km: "ភេសជ្ជៈសូដា", ch: "苏打水" } },
  { id: "tea", name: { en: "Tea Drinks", km: "ភេសជ្ជៈតែ", ch: "茶饮料" } },
  { id: "ice-coffee", name: { en: "Ice Coffee", km: "កាហ្វេទឹកកក", ch: "冰咖啡" } },
  { id: "ice-drinks", name: { en: "Ice Drinks", km: "ភេសជ្ជៈទឹកកក", ch: "冰饮" } },
  { id: "frappe", name: { en: "Frappe Drinks", km: "ភេសជ្ជៈក្រឡុក", ch: "冰沙" } },
]

const PRODUCTS: Product[] = [
  // Hot Coffee
  {
    id: "hc1",
    name: { en: "Espresso", km: "អេសប្រេសសូ", ch: "浓缩咖啡" },
    price: 1.0,
    category: "hot-coffee",
    image: "/hot-espresso.jpg",
  },
  {
    id: "hc2",
    name: { en: "Hot Americano", km: "កាហ្វេខ្មៅ", ch: "热美式咖啡" },
    price: 1.25,
    category: "hot-coffee",
    image: "/hot-americano.jpg",
  },
  {
    id: "hc3",
    name: { en: "Hot Latte", km: "ឡាតេក្ដៅ", ch: "热拿铁" },
    price: 1.25,
    category: "hot-coffee",
    image: "/hot-latte.jpg",
  },
  {
    id: "hc4",
    name: { en: "Hot Cappuccino", km: "កាពូជីណូក្ដៅ", ch: "热卡布奇诺" },
    price: 1.5,
    category: "hot-coffee",
    image: "/hot-cappuccino.jpg",
  },
  {
    id: "hc5",
    name: { en: "Hot Mocha", km: "ម ូកាក្ដៅ", ch: "咖啡摩卡" },
    price: 1.5,
    category: "hot-coffee",
    image: "/hot-mocha.jpg",
  },
  {
    id: "hc6",
    name: { en: "Hot Fresh Milk", km: "ទឹកដោះគោក្ដៅ", ch: "热鲜奶" },
    price: 1.25,
    category: "hot-coffee",
    image: "/hot-fresh-milk.jpg",
  },
  {
    id: "hc7",
    name: { en: "Hot Chocolate", km: "សូកូឡាក្ដៅ", ch: "热可可" },
    price: 1.5,
    category: "hot-coffee",
    image: "/hot-chocolate.jpg",
  },
  {
    id: "hc8",
    name: { en: "Hot Green Tea", km: "តែបៃតងក្ដៅ", ch: "热绿茶" },
    price: 1.5,
    category: "hot-coffee",
    image: "/hot-green-tea.jpg",
  },
  {
    id: "hc9",
    name: { en: "Hot Red Tea", km: "តែក្រហមក្ដៅ", ch: "热红茶" },
    price: 1.5,
    category: "hot-coffee",
    image: "/hot-thai-tea.jpg",
  },

  // Soda Drinks
  {
    id: "sd1",
    name: { en: "Blue Sky Soda", km: "សូដាខៀវ", ch: "蓝天苏打" },
    price: 1.25,
    category: "soda",
    image: "/blue-sky-soda.jpg",
  },
  {
    id: "sd2",
    name: { en: "Strawberry Soda", km: "ស្ត្របឺរីសូដា", ch: "草莓苏打" },
    price: 1.25,
    category: "soda",
    image: "/strawberry-soda.jpg",
  },
  {
    id: "sd3",
    name: { en: "Blueberry Soda", km: "ប៊្លូបឺរីសូដា", ch: "蓝莓苏打" },
    price: 1.25,
    category: "soda",
    image: "/blueberry-soda.jpg",
  },
  {
    id: "sd4",
    name: { en: "Green Apple Soda", km: "សូដាប៉ោមខៀវ", ch: "青苹果苏打" },
    price: 1.25,
    category: "soda",
    image: "/green-apple-soda.jpg",
  },
  {
    id: "sd5",
    name: { en: "Kiwi Soda", km: "គីវីសូដា", ch: "猕猴桃苏打" },
    price: 1.25,
    category: "soda",
    image: "/kiwi-soda.jpg",
  },
  {
    id: "sd6",
    name: { en: "Passion Soda", km: "ផាសិនសូដា", ch: "百香果苏打" },
    price: 1.25,
    category: "soda",
    image: "/passion-soda.jpg",
  },

  // Tea Drinks
  {
    id: "td1",
    name: { en: "Ice Lemon Red Tea", km: "តែក្រហមក្រូចឆ្មៅ", ch: "冰柠檬红茶" },
    price: 1.25,
    category: "tea",
    image: "/ice-lemon-red-tea.jpg",
  },
  {
    id: "td2",
    name: { en: "Ice Lemon Green Tea", km: "តែបៃតងក្រូចឆ្មៅ", ch: "冰柠檬绿茶" },
    price: 1.25,
    category: "tea",
    image: "/ice-lemon-green-tea.jpg",
  },

  // Ice Coffee
  {
    id: "ic1",
    name: { en: "Ice Americano", km: "កាហ្វេទឹកកក", ch: "冰咖啡" },
    price: 1.5,
    category: "ice-coffee",
    image: "/ice-coffee.jpg",
  },
  {
    id: "ic2",
    name: { en: "Ice Milk Coffee", km: "កាហ្វេទឹកដោះគោទឹកកក", ch: "冰咖啡加牛奶" },
    price: 1.5,
    category: "ice-coffee",
    image: "/ice-milk-coffee.jpg",
  },
  {
    id: "ic3",
    name: { en: "Ice Latte", km: "ឡាអេទឹកកក", ch: "冰咖啡拿铁" },
    price: 1.5,
    category: "ice-coffee",
    image: "/ice-latte.jpg",
  },
  {
    id: "ic4",
    name: { en: "Ice Cappuccino", km: "កាពូឈីណូ", ch: "冰咖啡卡布奇诺" },
    price: 1.5,
    category: "ice-coffee",
    image: "/ice-cappuccino.jpg",
  },
  {
    id: "ic5",
    name: { en: "Ice Mocha", km: "ម ូកា", ch: "冰咖啡摩卡" },
    price: 1.5,
    category: "ice-coffee",
    image: "/ice-mocha.jpg",
  },

  // Ice Drinks
  {
    id: "id1",
    name: { en: "Milk Green Tea", km: "តែបៃតងទឹកដោះគោ", ch: "冰绿茶" },
    price: 1.5,
    category: "ice-drinks",
    image: "/milk-green-tea.jpg",
  },
  {
    id: "id2",
    name: { en: "Milk Red Tea", km: "តែក្រហមទឹកដោះគោ", ch: "冰红茶" },
    price: 1.5,
    category: "ice-drinks",
    image: "/milk-thai-tea.jpg",
  },
  {
    id: "id3",
    name: { en: "Ice Chocolate", km: "សូកូឡា", ch: "冰巧克力" },
    price: 1.5,
    category: "ice-drinks",
    image: "/ice-chocolate.jpg",
  },
  {
    id: "id4",
    name: { en: "Passion Milk", km: "ផាសិនទឹកដោះគោ", ch: "百香果牛奶" },
    price: 1.5,
    category: "ice-drinks",
    image: "/passion-milk.jpg",
  },
  {
    id: "id5",
    name: { en: "Ice Matcha Latte", km: "ម៉ាត់ឆាទឹកដោះគោទឹកកក", ch: "冰抹茶拿铁" },
    price: 2.0,
    category: "ice-drinks",
    image: "/milk-green-tea.jpg",
  },

  // Frappe Drinks
  {
    id: "fd1",
    name: { en: "Mocha Frappe", km: "ម ូកាក្រឡុក", ch: "咖啡摩卡冰沙" },
    price: 2.0,
    category: "frappe",
    image: "/mocha-frappe.jpg",
  },
  {
    id: "fd2",
    name: { en: "Milk Coffee Frappe", km: "កាហ្វេទឹកដោះគោក្រឡុក", ch: "冰咖啡加牛奶冰沙" },
    price: 2.0,
    category: "frappe",
    image: "/delicious-coffee-cup-indoors (1).jpg",
  },
  {
    id: "fd3",
    name: { en: "Chocolate Frappe", km: "សូកូឡាក្រឡុក", ch: "巧克力冰沙" },
    price: 2.0,
    category: "frappe",
    image: "/chocolate-smoothie.jpg",
  },
  {
    id: "fd4",
    name: { en: "Cappuccino Frappe", km: "កាពូជីណូក្រឡុក", ch: "咖啡卡布奇诺冰沙" },
    price: 2.0,
    category: "frappe",
    image: "/capu-frappe.jpg",
  },
  {
    id: "fd5",
    name: { en: "Passion Frappe", km: "ផាសិនក្រឡុក", ch: "百香果冰沙" },
    price: 2.0,
    category: "frappe",
    image: "/Mango passion fruit smoothie.jpg",
  },
  {
    id: "fd6",
    name: { en: "Blueberry Frappe", km: "ប៊្លូបឺរីក្រឡុក", ch: "蓝莓冰沙" },
    price: 2.0,
    category: "frappe",
    image: "/Pineapple Blueberry Frappuccino – recipestasteful.jpg",
  },
  {
    id: "fd7",
    name: { en: "Strawberry Frappe", km: "ស្ត្របឺរីក្រឡុក", ch: "草莓冰沙" },
    price: 2.0,
    category: "frappe",
    image: "/stawberry-frape.jpg",
  },
  {
    id: "fd8",
    name: { en: "Avocado Frappe", km: "ប៊័រក្រឡុក", ch: "鳄梨冰沙" },
    price: 2.0,
    category: "frappe",
    image: "/avocado-frape.jpg",
  },
  {
    id: "fd9",
    name: { en: "Green Tea Frappe", km: "តែបៃតងក្រឡុក", ch: "绿茶冰沙" },
    price: 2.0,
    category: "frappe",
    image: "/green-tes-frape.jpg",
  },
  {
    id: "fd10",
    name: { en: "Red Tea Frappe", km: "តែក្រហមក្រឡុក", ch: "红茶冰沙" },
    price: 2.0,
    category: "frappe",
    image: "/red-tea-frape.jpg",
  },
]

export default function CoffeeMenu() {
  const [lang, setLang] = useState<Language>("km") // Default to Khmer
  const [activeCategory, setActiveCategory] = useState("hot-coffee")
  const [cart, setCart] = useState<CartItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<"paid" | "not_paid">("not_paid")
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const checkoutRef = useRef<HTMLDivElement>(null)

  const t = TRANSLATIONS[lang]

  // Scroll to category
  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId)
    const element = document.getElementById(categoryId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // Add to cart
  const addToCart = (product: Product) => {
    setLoadingId(product.id)

    // Small delay to show the loading animation
    setTimeout(() => {
      setCart((prev) => {
        const existing = prev.find((item) => item.id === product.id)
        if (existing) {
          return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
        }
        return [...prev, { ...product, quantity: 1 }]
      })
      setLoadingId(null)
    }, 300)
  }

  // Remove from cart
  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId))
  }

  // Update quantity
  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = Math.max(0, item.quantity + delta)
            return { ...item, quantity: newQuantity }
          }
          return item
        })
        .filter((item) => item.quantity > 0)
    })
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (cart.length === 0) return

    setIsSubmitting(true)
    const formData = new FormData(event.currentTarget)

    const orderItems = cart.map((item) => ({
      ...item,
      name: item.name[lang],
    }))

    const orderData = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      location: formData.get("location"),
      paymentStatus: formData.get("paymentStatus"),
      notes: formData.get("notes"),
      items: orderItems,
    }

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) throw new Error("Order failed")

      setIsSuccess(true)
      setCart([])
      setPaymentConfirmed(false)
    } catch (error) {
      console.error(error)
      alert(
        lang === "km"
          ? "មានបញ្ហាក្នុងការដាក់ការបញ្ជាទិញ"
          : lang === "ch"
            ? "下单时出现问题"
            : "There was a problem placing your order",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.orderSent}</h2>
          <p className="text-gray-600 mb-8">{t.orderConfirmation}</p>
          <Button
            onClick={() => setIsSuccess(false)}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-6 rounded-xl text-lg"
          >
            {t.orderMore}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24 md:pb-0">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black font-display text-gray-800 tracking-tight">{t.title}</h1>
            <p className="text-xs text-gray-500 mt-1">{t.subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex bg-gray-100 rounded-full p-1">
              {(["en", "km", "ch"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={cn(
                    "px-2 sm:px-3 py-1 rounded-full text-xs font-bold transition-all",
                    lang === l ? "bg-white shadow text-emerald-600" : "text-gray-500 hover:text-gray-700",
                  )}
                >
                  {l === "en" ? "EN" : l === "km" ? "KH" : "CH"}
                </button>
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-gray-100 rounded-full"
              onClick={() => checkoutRef.current?.scrollIntoView({ behavior: "smooth" })}
            >
              <ShoppingCart className="w-6 h-6 text-gray-800" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Category Nav - Horizontal Scroll */}
        <div className="border-t border-gray-100 overflow-x-auto">
          <div className="container mx-auto px-4 flex gap-2 py-3 min-w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-bold transition-colors whitespace-nowrap font-display",
                  activeCategory === cat.id
                    ? "bg-emerald-500 text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50",
                )}
              >
                {cat.name[lang]}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-10">
        {/* Menu Sections */}
        {CATEGORIES.map((category) => (
          <section key={category.id} id={category.id} className="scroll-mt-40">
            <h2 className="text-xl font-bold font-display text-center text-gray-700 mb-6 uppercase tracking-wider">
              {category.name[lang]}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {PRODUCTS.filter((p) => p.category === category.id).map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name[lang]}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-800 text-sm md:text-base line-clamp-2 mb-1 h-10">
                      {product.name[lang]}
                    </h3>
                    <p className="text-emerald-600 font-black text-lg mb-3">${product.price.toFixed(2)}</p>
                    <Button
                      onClick={() => addToCart(product)}
                      disabled={loadingId === product.id}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg mt-auto"
                      size="sm"
                    >
                      {loadingId === product.id ? <Loader2 className="h-4 w-4 animate-spin" /> : t.addToCart}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Checkout Section */}
        <div ref={checkoutRef} className="mt-12 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gray-800 text-white p-4 text-center">
            <h2 className="text-xl font-bold font-display">{t.yourOrder}</h2>
          </div>

          <div className="p-6 md:p-8 grid lg:grid-cols-2 gap-8">
            {/* Cart Items */}
            <div className="space-y-6">
              <h3 className="font-bold text-gray-700 border-b pb-2">{t.selectedItems}</h3>
              {cart.length === 0 ? (
                <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed">
                  <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>{t.emptyCart}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name[lang]}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 text-sm truncate">{item.name[lang]}</h4>
                        <p className="text-emerald-600 font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2 bg-white rounded-lg border shadow-sm p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded"
                        >
                          {item.quantity === 1 ? <Trash2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                        </button>
                        <span className="w-4 text-center font-bold text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-between items-center pt-4 border-t mt-4">
                    <span className="text-lg font-bold text-gray-600">{t.totalAmount}</span>
                    <span className="text-2xl font-black text-emerald-600">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Order Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="font-bold text-gray-700 border-b pb-2">{t.deliveryDetails}</h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs uppercase font-bold text-gray-500">
                      {t.name}
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      placeholder={t.namePlaceholder}
                      className="bg-gray-50 border-gray-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs uppercase font-bold text-gray-500">
                      {t.phone}
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder={t.phonePlaceholder}
                      className="bg-gray-50 border-gray-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="location" className="text-xs uppercase font-bold text-gray-500">
                    {t.location}
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      name="location"
                      required
                      placeholder={t.locationPlaceholder}
                      className="pl-9 bg-gray-50 border-gray-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold text-gray-500">{t.paymentMethod}</Label>
                  <RadioGroup
                    defaultValue="not_paid"
                    name="paymentStatus"
                    className="grid grid-cols-2 gap-4"
                    onValueChange={(value) => {
                      setPaymentMethod(value as "paid" | "not_paid")
                      setPaymentConfirmed(false)
                    }}
                  >
                    <div>
                      <RadioGroupItem value="paid" id="paid" className="peer sr-only" />
                      <Label
                        htmlFor="paid"
                        className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-transparent p-4 hover:bg-gray-50 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:text-emerald-600 cursor-pointer text-center"
                      >
                        <span className="font-bold">{t.abaTransfer}</span>
                        <span className="text-xs text-muted-foreground mt-1">{t.scanQr}</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="not_paid" id="not_paid" className="peer sr-only" />
                      <Label
                        htmlFor="not_paid"
                        className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-transparent p-4 hover:bg-gray-50 peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:text-emerald-600 cursor-pointer text-center"
                      >
                        <span className="font-bold">{t.cashCod}</span>
                        <span className="text-xs text-muted-foreground mt-1">{t.payArrival}</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {paymentMethod === "paid" && totalAmount > 0 && (
                  <div className="p-4 bg-gray-50 rounded-xl border border-emerald-200 space-y-4">
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-700 mb-3">{t.scanToPay}</p>
                      <div className="bg-white p-4 rounded-lg inline-block border-2 border-gray-200">
                        <Image
                          src="/cafe-qr-2.jpg"
                          alt="Shop Payment QR"
                          width={200}
                          height={200}
                          className="mx-auto"
                        />
                        <p className="text-xs text-gray-500 mt-2">Omiga Coffee</p>
                        <p className="text-lg font-bold text-emerald-600 mt-1">${totalAmount.toFixed(2)}</p>
                      </div>
                      
                      {/* I Have Paid Button */}
                      <Button
                        type="button"
                        onClick={() => setPaymentConfirmed(true)}
                        disabled={paymentConfirmed}
                        className={cn(
                          "w-full mt-4 font-bold rounded-lg transition-all",
                          paymentConfirmed 
                            ? "bg-green-500 hover:bg-green-500 text-white" 
                            : "bg-emerald-100 hover:bg-emerald-200 text-emerald-700"
                        )}
                      >
                        {paymentConfirmed ? "✓ " : ""}{t.iHavePaid}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="notes" className="text-xs uppercase font-bold text-gray-500">
                    {t.note}
                  </Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder={t.notePlaceholder}
                    className="bg-gray-50 border-gray-200 h-20 resize-none"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white text-lg font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all hover:translate-y-[-2px]"
              >
                {isSubmitting ? t.sending : `${t.orderNow} • $${totalAmount.toFixed(2)}`}
              </Button>
            </form>
          </div>
        </div>

      </main>

      {/* Mobile Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-4 right-4 md:hidden z-50">
          <Button
            onClick={() => checkoutRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="w-full h-16 bg-gray-900 text-white rounded-full shadow-2xl flex justify-between items-center px-6 text-lg"
          >
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </div>
              <span>{t.yourOrder}</span>
            </div>
            <span className="font-bold">${totalAmount.toFixed(2)}</span>
          </Button>
        </div>
      )}
    </div>
  )
}
