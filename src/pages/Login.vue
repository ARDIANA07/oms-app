<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

const login = async () => {
    isLoading.value = true
    try {
        await signInWithEmailAndPassword(auth,email.value, password.value)
        router.push('/produk')
    } catch (err) {
        error.value = "Email atau password salah!"
    }
    isLoading.value = false
}
</script>

<template>
  <div class=" d-flex justify-content-center align-items-center vh-100 bg-secondary">
  <div class="card w-25 h-auto pb-3 shadow">
    <div class="text-center">
        <h1 class="text-center text-success">Login</h1>
        <h5>Order Management System</h5>
    </div>
    <div class="container">
            <div>
                <label for="email">Email <span class="text-danger">*</span></label>
                <input type="email" class="form-control" v-model="email" placeholder="Masukkan email">
                <span class="text-danger">{{ error }}</span>
                <p class="text-secondary ">email: testing@gmail.com</p>
            </div>
             <div class="my-3">
                <label for="password">Password <span class="text-danger">*</span></label>
                <input type="password" class="form-control" v-model="password" placeholder="Masukkan password">
                <p class="text-secondary ">password: testing1234</p>
            </div>
            <div class="d-flex justify-content-center">
                <button @click="login" :disabled="isLoading" class="btn btn-success w-50">
                    <div class="spinner-border" v-if="isLoading">
                    </div>
                    <div v-else>
                        Login
                    </div>
                </button>
            </div>
    </div>
  </div>
  </div>
</template>
