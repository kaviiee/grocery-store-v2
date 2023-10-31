const admin_products={
    template:`
     
<div>
<div class="jumbotron">
    <div class="container text-center">
        <h1>Grocery Store</h1>      
    </div>
</div>
    
<div class="container page">  
    
    <nav class="navbar navbar-inverse">
    <div class="navbar-header">
    <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
    <span class="icon-bar"></span>
    <span class="icon-bar"></span>
    <span class="icon-bar"></span>                        
    </button>
        
    </div>
    <div class="collapse navbar-collapse" id="myNavbar">
        <ul class="nav navbar-nav">
          <li class="active"><a @click="admin_home">Home</a></li>
          <li><a @click="admin_categories">Categories</a></li>
          <li><a @click="admin_products">Products</a></li>
          <li><a @click="admin_contactus">ContactUs</a></li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
          <li><a @click="logout"><span class="glyphicon glyphicon-user"></span> Logout</a></li>
        </ul>
    </div>
    </nav>
    <div class="row">
      <div class="col-md-4">
        <form @submit.prevent="search_products">
          <h3>Search Products</h3>
          <br>
          <label for="field" class="form-label">Search based on:</label><br>
          <select v-model="search.field" class="form-control" name="field" required>
            <option value="name">Name</option>
            <option value="category">Category</option>
            <option value="rate_per_unit">Rate per unit</option>
          </select>
          <br>
          <label for="value" class="form-label">Value:</label>
          <input v-model="search.value" type="text" class="form-control" name="value" id="value" placeholder="Value" required>
          <br>
          <input type="submit" class="btn btn-primary" name="submit" id="submit" value="Search">
          <br>
          <p> Category does not exist? Add it. <router-link to="/admin_categories" class="btn btn-primary">Add Category</router-link></p>
        </form>
      </div>
      <div v-if="editProduct.id">
        <form @submit.prevent="edit_prod(editProduct.id)">
          <div class="col-md-4">
            <h3>Edit Product</h3>
            <br>
            <label for="edit_product" class="form-label">Product name:</label>
            <input style="width: 270px;" v-model="editProduct.name" type="text" class="form-control" name="edit_product" id="edit_product" placeholder="Product name" required>
            <br>
            <label for="category" class="form-label">Category:</label>
            <input style="width: 270px;" v-model="editProduct.category" type="text" class="form-control" name="category" id="category" placeholder="Category name" required>
            <br>
            <label for="mfg_date" class="form-label">Manufacture Date in 'YYYY-MM-DD' format:</label>
            <input style="width: 270px;" v-model="editProduct.manufacture_date" type="text" class="form-control" name="mfg_date" id="mfg_date" placeholder="YYYY-MM-DD" required>
            <br>
          </div>
          <div class="col-md-4">
        <br>
        <label for="expiry_date" class="form-label">Expiry Date in "YYYY-MM-DD" format:</label>
        <input style="width: 270px;" type="text" class="form-control" v-model="editProduct.expiry_date" name="expiry_date" id="expiry_date" placeholder="YYYY-MM-DD" required>
        <br>
        <label for="rate" class="form-label">Rate per unit:</label>
        <input style="width: 270px;" type="number" step="0.01" class="form-control" v-model="editProduct.rate_per_unit" name="rate" id="rate" placeholder="rate" required>
        <br>
        <label for="unit" class="form-label">Unit:</label>
        <select class="form-control" name="unit" aria-label="Default select example" v-model="editProduct.unit" required>
            <option name="Rs/Kg" value="Rs/Kg">Rs/Kg</option>
            <option name="Rs/g" value="Rs/g">Rs/g</option>
            <option name="Rs/l" value="Rs/l">Rs/l</option>
            <option name="Rs/ml" value="Rs/ml">Rs/ml</option>
        </select>
        <br>
        <label for="qty" class="form-label">Available Quantity:</label>
        <input style="width: 270px;" v-model="editProduct.available_quantity" type="number" class="form-control" name="qty" id="qty">
        <br>
        <input type="submit" class="btn btn-primary" name="edit_product" id="edit_product">
        </div>
        </form>
      </div>
      <div v-else>
      <form @submit.prevent="add_product">
        <div class="col-md-4">
          <h3>Add Product</h3>
          <br>
          <label for="add_product" class="form-label">Add product:</label>
          <input style="width: 270px;" v-model="newProduct.name" type="text" class="form-control" id="add_product" placeholder="Product name" required>
          <br>
          <label for="category" class="form-label">Category:</label>
          <input style="width: 270px;" v-model="newProduct.category" type="text" class="form-control" id="category" placeholder="Category name" required>
          <br>
          <label for="mfg_date" class="form-label">Manufacture Date in "DD-MM-YYYY" format:</label>
          <input style="width: 270px;" v-model="newProduct.manufacture_date" type="date" class="form-control" id="mfg_date" placeholder="DD-MM-YYYY" required>
          <br>
        </div>
        <div class="col-md-4">
          <br>
          <label for="expiry_date" class="form-label">Expiry Date in "DD-MM-YYYY" format:</label>
          <input style="width: 270px;" v-model="newProduct.expiry_date" type="date" class="form-control" id="expiry_date" placeholder="DD-MM-YYYY" required>
          <br>
          <label for="rate" class="form-label">Rate per unit:</label>
          <input style="width: 270px;" v-model="newProduct.rate_per_unit" type="number" step="0.01" class="form-control" id="rate" placeholder="rate" required>
          <br>
          <label for="unit" class="form-label">Unit:</label>
          <select style="width: 270px;" v-model="newProduct.unit" class="form-control" aria-label="Default select example" required>
            <option value="Rs/Kg">Rs/Kg</option>
            <option value="Rs/g">Rs/g</option>
            <option value="Rs/l">Rs/l</option>
            <option value="Rs/ml">Rs/ml</option>
          </select>
          <br>
          <label for="qty" class="form-label">Available Quantity:</label>
          <input style="width: 270px;" v-model="newProduct.available_quantity" type="number" class="form-control" id="qty">
          <br>
          <button type="submit" class="btn btn-primary" name="add_category" id="add_category">Add Product</button>
        </div>
      </form>
    </div>
    <div class="row">
    <div class="col-md-12">
      <h3>Available Products are:</h3>
      <div v-for="(products, category) in productsGrouped" :key="category">
        <h4>{{ category }}</h4>
        <div class="row">
          <div v-for="product in products" :key="product.id" class="col-md-3">
            <div class="panel panel-success">
              <div class="panel-heading">{{ product.name }}</div>
              <div class="panel-body" style="height: 170px;">
                <p>Rate per unit: {{ product.rate_per_unit }}</p>
                <p>Unit: {{ product.unit }}</p>
                <p>Available quantity: {{ product.available_quantity }}</p>
                <p>Manufacture Date: {{ product.manufacture_date }}</p>
                <p>Expiry Date: {{ product.expiry_date }}</p>
              </div>
              <div class="panel-footer">
                <a @click="edit_product(product.id)" class="btn btn-primary" name="edit" value="edit">Edit</a>
                <a @click="delete_product(product.id)" class="btn btn-primary" name="delete" value="delete">Delete</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
    </div>
    `,

data() {
return {
  prod: null,
  search: {
    field: '',
    value: ''
  },
  productsGrouped:{},
  newProduct:{
    name:"",
    category:"",
    manufacture_date:"",
    expiry_date:"",
    rate_per_unit:"",
    unit:"",
    available_quantity:"",

  },
  editProduct:{
    name:"",
    category:"",
    manufacture_date:"",
    expiry_date:"",
    rate_per_unit:"",
    unit:"",
    available_quantity:"",
    id:""
  }
  // Other data properties
}
},
async mounted() {
  const res = await fetch(`/all_products`,{
    method:'put',
    headers:{
      'Content-Type': "application/json",
      'Access-Control-Allow-Origin': '*',
      'Authentication-Token': localStorage.getItem('auth-token')
    },
    body: JSON.stringify(this.search)
  })
  this.productsGrouped = await res.json()
},
methods: {
  async add_product(){
    const res = await fetch(`/all_products`,{
    method:"POST",
    body : JSON.stringify(this.newProduct),
    headers: {
      "Content-Type": "application/json",
      'Access-Control-Allow-Origin': '*',
      'Authentication-Token': localStorage.getItem('auth-token')
    }
    })
    const data = await res.json()
    console.log(data)
    this.$router.push(`/admin_products`)
    location.reload()
  },
  async delete_product(id){
    const res = await fetch(`/all_products/${id}`, {
      method:"delete",
      headers:{
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
          'Authentication-Token': localStorage.getItem('auth-token')
      },
      //body : JSON.stringify(this.category)
  })
  const data = await res.json()
  location.reload()
  this.$router.push(`/admin_products`)
  },
  async edit_product(id){
    const res = await fetch(`/edit_product/${id}`, {
      method:"get",
      headers:{
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
          'Authentication-Token': localStorage.getItem('auth-token')
      },
      //body : JSON.stringify(this.category)
  })
  const data = await res.json()
  this.editProduct=data
  console.log(this.editProduct)
  //location.reload()
  this.$router.push(`/admin_products`)
  },
  async edit_prod(id){
    const res = await fetch(`/edit_product/${id}`, {
      method:"post",
      headers:{
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
          'Authentication-Token': localStorage.getItem('auth-token')
      },
      body : JSON.stringify(this.editProduct)
  })
  const data = await res.json()
  location.reload()
  this.$router.push(`/admin_products`)
  },
  async admin_home(){
    this.$router.push(`/admin_home`)
  },
async admin_categories(){
    this.$router.push(`/admin_categories`)
},
async admin_products(){
    this.$router.push(`/admin_products`)
},
async admin_contactus(){
    this.$router.push(`/admin_contactus`)
},
async logout(){
  const res= await fetch('/logout')
  if (res.ok){
      localStorage.clear()
      this.$router.push('/')
  }else{
      console.log('could not log out the user')
  }
},
async search_products() {
  const res = await fetch(`/all_products`,{
    method:'put',
    headers:{
      'Content-Type': "application/json",
      'Access-Control-Allow-Origin': '*',
      'Authentication-Token': localStorage.getItem('auth-token')
    },
    body: JSON.stringify(this.search)
  })
  this.productsGrouped = await res.json()
},
//editProduct() {
  // Handle edit product form submission
//},

}
}
export default admin_products