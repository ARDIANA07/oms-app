<script setup>
import { ref, onMounted, computed } from 'vue'
import SideBar from '@/components/SideBar.vue'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db,auth } from '@/firebase'
import Swal from 'sweetalert2'

const name = ref('')
const price = ref('')
const qty = ref('')
const description = ref('')
const search = ref('')
const isLoading = ref(false)

const allProducts = ref([])
const products = computed(() => {
    if(!search.value) {
        return allProducts.value
    } else {
        return allProducts.value.filter(product => {
            return product.name.toLowerCase().includes(search.value.toLowerCase())
        })
    }
    }
)

const saveProduct = async () => {
    isLoading.value = true
    try {
        await addDoc(collection(db, "products"),
        {
            name: name.value,
            price: parseInt(price.value),
            qty: parseInt(qty.value),
            description: description.value
        })
        name.value = ''
        price.value = ''
        qty.value = ''
        description.value = ''
        Swal.fire({
            icon: 'success',
            title: 'Produk berhasil ditambahkan',
            showConfirmButton: false,
            timer: 1500
        })
        formShow.value = false
        showProducts()
        console.log("Product saved successfully!");
    } catch (e) {
        console.error("Error adding document: ", e);
    }  
    isLoading.value = false 
}

const isFormValid = computed(() => {
  return name.value && price.value && qty.value && description.value
})

const showProducts = async () => {
    products.value = []
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        querySnapshot.forEach((doc) => {
            products.value.push({
                id: doc.id,
                name: doc.data().name,
                price: doc.data().price,
                qty: doc.data().qty,
                description: doc.data().description
            })
        });
    } catch (e) {
        console.error("Error fetching products: ", e);      
    }
}

onMounted(() => {
   showProducts();
})

const formShow = ref(false)

const modalProduct = () => {
    formShow.value = !formShow.value
}

</script>
<template>
    <SideBar />
    <div class="container-fluid">
        <form @submit.prevent="saveProduct" class="mb-3" v-if="formShow">
           <h2>Tambah Produk</h2>
            <div class="mb-3">
                <label for="">Nama Produk</label>
                <input type="text" class="form-control" v-model="name" placeholder="Masukkan nama produk">
            </div>
             <div class="mb-3">
                <label for="">Harga Produk</label>
                <input type="number" class="form-control" v-model="price" placeholder="Masukkan harga produk">
            </div>
             <div class="mb-3">
                <label for="">Jumlah Produk</label>
                <input type="number" class="form-control" v-model="qty" placeholder="Masukkan jumlah produk">
            </div>
             <div class="mb-3">
                <label for="">Deskripsi Produk</label>
                <input type="text" class="form-control" v-model="description" placeholder="Masukkan deskripsi produk">
            </div>
            <div class="d-flex justify-content-end">
                <button type="submit" class="btn btn-success" :disabled="!isFormValid">Simpan</button>
            </div>
        </form>
        <h3>Data Produk</h3>
        <div class="d-flex justify-content-between">
            <button v-if="!formShow" @click="modalProduct()" class="btn btn-primary mb-3">Tambah Produk</button>
            <div class="mb-3">
                <input type="search" class="form-control" placeholder="Cari Produk" v-model="search">
            </div>
        </div>
        <table class="table">
            <thead class="table-dark">
                <tr>
                    <th scope="col">No</th>
                    <th scope="col">Nama Produk</th>
                    <th scope="col">Harga Produk</th>
                    <th scope="col">Jumlah Produk</th>
                    <th scope="col">Deskripsi Produk</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(product, index) in products" :key="product.id">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ product.name }}</td>
                    <td>{{ product.price }}</td>
                    <td>{{ product.qty }}</td>
                    <td>{{ product.description }}</td>
                </tr> 
            </tbody>
        </table>
         <div v-if="products.length == 0" class="text-center">
            <span>Tidak ada data produk</span>
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