<script setup>
import SideBar from '@/components/SideBar.vue';
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'
import { onMounted, ref, computed } from 'vue'
import Swal from 'sweetalert2'

const products = ref([])
const orderQty = ref(1)
const search = ref('')
const formShow = ref(false)

const selectedProductId = ref(null)
const selectedProduct = computed(() => {
  return products.value.find(p => p.id === selectedProductId.value)
})

const getProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"))
      products.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        price: doc.data().price,
        qty: doc.data().qty,
        description: doc.data().description
      }))
    } catch (e) {
      console.error("Error fetching products: ", e);
    }
  }

 const total = computed(() => {
  if (!selectedProduct.value || !orderQty.value) return 0
  return selectedProduct.value.price * orderQty.value
})

  const formatCurrency = (value) => {
     return new Intl.NumberFormat('id-ID', { 
      style: 'currency', currency: 'IDR' 
    }).format(value)
  }

  const submitOrder = async () => {
    if (!selectedProduct.value) {
      alert("Pilih produk terlebih dahulu.");
      return;
    }
    try {
      await addDoc(collection(db, "orders"), {
        productId: selectedProduct.value.id,
        productName: selectedProduct.value.name,
        orderQty: orderQty.value,
        total: total.value,
        orderDate: new Date()
      })

      selectedProductId.value = null
      orderQty.value = 1
      showOrders()
      Swal.fire({
        icon: 'success',
        title: 'Order berhasil ditambahkan',
        showConfirmButton: false,
        timer: 1500
      })
      formShow.value = false
    } catch (e) {
      console.error("Error adding order: ", e)
    }
  }
 const allOrders = ref([])

  const orders = computed(() => {
    if (!search.value) {
      return allOrders.value
    }
    return allOrders.value.filter(order =>
      order.productName.toLowerCase().includes(search.value.toLowerCase())
    )
  })

 const showOrders = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "orders"))
    allOrders.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      productId: doc.data().productId,
      productName: doc.data().productName,
      orderQty: doc.data().orderQty,
      total: doc.data().total,
      orderDate: doc.data().orderDate
    }))
  } catch (e) {
    console.error("Error fetching orders: ", e);
  }
}

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return '-'
    return timestamp.toDate().toLocaleString("id-ID")
  }

  const modalOrder = () => {
    formShow.value = !formShow.value
  }

  onMounted(() => {
    getProducts(),
    showOrders()
  })

</script>
<template>
      <SideBar />
    <div class="container-fluid">
      <form @submit.prevent="submitOrder" v-if="formShow" >
      <h1>Order Produk</h1>
        <div>
         <label for="produk">Pilih Produk</label>
        <select class="form-select" v-model="selectedProductId">
          <option value="" disabled>Pilih Produk</option>
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.name }}
          </option>
        </select>

        </div>
        <div class="my-3">
         <label for="qty">Jumlah Order</label>
         <input type="number" class="form-control" v-model="orderQty" placeholder="Masukkan jumlah order">
        </div>
         <div class="mb-3">
          <label>Total Harga</label>
          <input type="text" class="form-control" :value="formatCurrency(total)" readonly />
        </div>
        <div class="d-flex justify-content-end">
          <button type="submit" class="btn btn-success">Pesan</button>
        </div>
      </form>
      <h3>Riwayat Order</h3>
      <div class="d-flex justify-content-between my-3">
        <button v-if="!formShow" @click="modalOrder()" type="button" class="btn btn-primary">Buat Order</button>
        <div>
         <input type="search" class="form-control" placeholder="Cari Produk Order" v-model="search">
        </div>
      </div>
       <table class="table">
            <thead class="table-dark">
                <tr>
                    <th scope="col">No</th>
                    <th scope="col">Nama Produk</th>
                    <th scope="col">Jumlah Order</th>
                    <th scope="col">Total Harga</th>
                    <th scope="col">Tanggal Order</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(order, index) in orders" :key="order.id">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ order.productName }}</td>
                    <td>{{ order.orderQty }}</td>
                    <td>{{ formatCurrency(order.total) }}</td>
                    <td>{{ formatDate(order.orderDate) }}</td>
                </tr> 
            </tbody>
        </table>
        <div v-if="orders.length == 0" class="text-center">
            <span>Tidak ada data order</span>
        </div>
    </div>
</template>
<style scoped>
.container-fluid {
  margin-left: 250px;
  padding: 20px;
  width: calc(100% - 250px);
}
</style>