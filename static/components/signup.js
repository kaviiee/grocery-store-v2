const signup={
    template:`
    <div>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous"></link>

<div class="container d-flex justify-content-center align-items-center"
      style="min-height: 100vh">
      	<form class="border shadow p-3 rounded"
      	      method="post" 
      	      style="width: 450px;">
      	      <h1 class="text-center p-3">Signup</h1>
		  <div class="mb-3">
		    <label for="username" 
		           class="form-label">User name</label>
		    <input type="text" 
		           class="form-control" 
		           name="username" v-model="formData.username" id="username" required>
		  </div>
      <div class="mb-3">
		    <label for="email" 
		           class="form-label">Email</label>
		    <input type="text" 
		           class="form-control" 
		           name="email" v-model="formData.email" id="email" required>
		  </div>
		  <div class="mb-3">
		    <label for="password" 
		           class="form-label">Password</label>
		    <input type="password" 
		           name="password" v-model="formData.password"
		           class="form-control" 
		           id="password" required>
		  </div>
		  <div class="mb-1">
		    <label for='role' class="form-label">Select User Type:</label>
		  <select class="form-select mb-3"
		          name="role" v-model="formData.role" 
		          aria-label="Default select example">
			  <option selected name="user" value="user">user</option>
			  <option name="admin" value="admin">admin</option>
		  </select>
      </div>
         <button type="submit" @click.prevent='register'
		          class="btn btn-primary" style="width:415px;">SIGNUP</button><br><br>
         <div class="text-start">Already have an account...? Click <button @click='login'>Login</button></div>
		</form>
      </div>
      </div>
    `,

    data(){
      return{
        formData:{
          username:"",
          email:"",
          password:"",
          role:""
      },
      success:true,
      error:'thisistheerror'
      }
    },
    methods:{
      async register() {
        //const formData = new FormData()
        const res = await fetch("/user", {
          method: "post",
          headers: {
            "Content-Type": "application/json",       
          },
          body: JSON.stringify(this.formData),
           
        })
        const data = await res.json()
        if (res.ok) {                
            console.log(data)
            this.$router.push('/')
        }
        else{
          this.success=false,
          this.error=data.message
        }
    },
    async login(){
      this.$router.push('/')
    }
    }
    
}
export default signup