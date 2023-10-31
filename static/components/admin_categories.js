const admin_categories={
    template:`
<div>

<div class="jumbotron">
<div class="container text-center">
  <h1>Grocery Store</h1>      
</div>
</div>

<div class="container page">  


<div>
<nav class="navbar navbar-inverse">
<div class="container-fluid">
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
</div>
</nav>
</div>

<div v-if="ecategory.name">
<form>
    <h3>Edit Category</h3>
    <br>
    <label for="edit_category" class="form-label">Edit Category:</label>
	<input style="width: 270px;" type="text" class="form-control" v-model="ecategory.name" name="edit_category" id="edit_category" placeholder="Category name" required>
    <br>
    <label for="img_url" class="form-label">Image URL:</label>
	<input style="width: 270px;" type="text" class="form-control" v-model="ecategory.img_url" name="img_url" id="img_url" placeholder="Image URL">
    <br>
    <input type="submit" class="btn btn-primary" name="edit_category" @click.prevent="edit_cat(ecategory.id)" value="Edit Category" id="edit_category">
</form>
</div>

<div v-else>
<form>
    <h3>Add Category</h3>
    <br>
    <label for="add_category" class="form-label">Add Category:</label>
	<input v-model="category.name" style="width: 270px;" type="text" class="form-control" name="add_category" id="add_category" placeholder="Category name" required>
    <br>
    <label for="img_url" class="form-label">Image URL:</label>
	<input v-model="category.img_url" style="width: 270px;" type="text" class="form-control" name="img_url" id="img_url" placeholder="Image URL">
    <br>
    <input type="submit" @click.prevent="add_category" class="btn btn-primary" name="add_category" id="add_category">
</form>
</div>

<br>
<br>
<h3>Available categories are:</h3>
<br>

<div class="col-md-3" v-for="cat in cats" :key="cat.id"> 
    <div class="panel panel-success">
        <div class="panel-heading">{{cat.name}}</div>
        <div class="panel-body" style="height: 270px;">
            <div v-if="cat.img_url">
            <img :src="'static/' + cat.img_url" style="height: 250px; width: 220px;" class="img-responsive" alt="Image">
            </div>
            <div v-else>
            <p>No image Available</p>
            </div>
        </div>
        <div class="panel-footer">
            <a @click="edit_category(cat.id)" class="btn btn-primary" name="edit" value="edit">Edit</a>
            <a @click="delete_category(cat.id)" class="btn btn-primary" name="delete" value="delete">Delete</a>
            <a @click="admin_products(cat.id)" class="btn btn-primary" name="Products" value="products">Products</a>
        </div>
    </div>
</div>



</div>

<footer class="container-fluid text-center">
<p>Online Store Copyright</p>  
</footer>
</div>
    `,
    data(){
        return{
            ecategory:{
                id:"",
                name:"",
                img_url:""
                
            },
            category:{
                id:"",
                name:"",
                img_url:""
                
            },
            cats:[]
        }
    },
    methods:{
        async admin_home(){
            this.$router.push(`/admin_home`)
        },
        async admin_categories(){
            this.ecategory.id = null;
            this.ecategory.name = null;
            this.ecategory.img_url = null;

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
        async edit_category(id){
            //localStorage.setItem('catid',id)
            //this.$router.push(`/edit_category/${id}`)

            const res = await fetch(`/edit_cat/${id}`, {
                method:"get",
                headers:{
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*',
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
                //body : JSON.stringify(this.category)
            })
            const data = await res.json()
            this.ecategory=data
            //location.reload()
            this.$router.push(`/admin_categories`)
            
        },
        async edit_cat(id){
            const res = await fetch(`/edit_cat/${id}`, {
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*',
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
                body : JSON.stringify(this.ecategory)
            })
            const data = await res.json()
            console.log(data)
            location.reload()
            this.$router.push(`/admin_categories`)
        },
        async add_category(){
            const res = await fetch(`/categories`, {
                method:"POST",
                headers:{
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*',
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
                body : JSON.stringify(this.category)
            })
            const data = await res.json()
            console.log(data)
            this.cats.push(data)
            this.$router.push(`/admin_categories`)
        },
        async delete_category(id){
            const res = await fetch(`/categories/${id}`, {
                method:"delete",
                headers:{
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*',
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
                //body : JSON.stringify(this.category)
            })
            const data = await res.json()
            console.log(data)
            location.reload()
            this.$router.push(`/admin_categories`)
        },
        async admin_products(id){
            this.$router.push('/admin_products')
        }
    },
  async mounted(){

    const res = await fetch(`/categories`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
            'Authentication-Token': localStorage.getItem('auth-token')
        },
        
    })
    if(res.ok){
        this.cats = await res.json()
    }
    else {
        console.error("Failed to fetch category data");
      }
  }

}
export default admin_categories