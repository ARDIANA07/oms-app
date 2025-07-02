<script setup>
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
const auth = getAuth()
const router = useRouter()

const logout = async () => {
    await signOut(auth)
    router.push('/')
}
</script>

<template>
  <div>
    <ul class="nav flex-column bg-light sidebar px-3">
      <h4 class="text-center">Order Management System</h4>

      <li class="nav-item mb-3">
        <router-link to="/" class="nav-link" active-class="active-link" exact>Produk</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/order" class="nav-link" active-class="active-link">Order</router-link>
      </li>
      <li class="nav-item mt-3">
        <button class="btn btn-secondary w-100" @click="logout">Logout</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}

.nav-link {
  padding: 10px;
  display: block;
  color: #000;
  text-decoration: none;
}

.nav-link:hover {
  background-color: #e0e0e0;
  border-radius: 4px;
}

.active-link {
  background-color: #ced4da; 
  border-radius: 4px;
  font-weight: bold;
  text-decoration: none;
}
</style>
