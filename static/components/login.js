const login={
    template:`
    <div>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous"></link>
        <div class="container d-flex justify-content-center align-items-center" style="min-height: 100vh">
            
              <form class="border shadow p-3 rounded" action="" style="width: 450px;">
              <h1 class="text-center p-3">LOGIN</h1>
            <div class="form-group">
                <label for="email" class="form-label">Email</label>
                <input type="text" class="form-control" name="email" id="email" v-model="formData.email" placeholder="email" required>
            </div>
            <div class="form-group">
                <label for="password" class="form-label">Password</label>
                <input type="password" v-model="formData.password" name="password" class="form-control" id="password" placeholder="password" required>
            </div>
            <p v-if="e_error" style="font-weight: bold;color:red">{{e_error}}</p>
            <p v-if="p_error" style="font-weight: bold;color:red">{{p_error}}</p>
      
            <br>
            <div class="form-group">
                <button @click.prevent='loginUser' type="submit" style="width: 415px;" class="btn btn-primary btn-block"> Login</button>
            </div>
            <br>
            <div class="form-group">
                <button @click='signup' style="width: 415px;" class="btn btn-primary">SIGNUP</button>
            </div>
            </form>
            </div>
        </div>
    `,

    data(){
        return{
            formData:{
                email:"",
                password:"",
                
            },
            success:true,
            // error:"This is the error",
            e_error:"",
            p_error:"",
        }
    },
    methods:{
        async loginUser() {
            try{
            const res = await fetch("/login?include_auth_token", {
              method: "post",
              headers: {
                  "Content-Type": "application/json",
                  'Access-Control-Allow-Origin': '*'
              },
              follow: false,
              body: JSON.stringify(this.formData)
          })
          //if (res.status === 302) {
            //const location = res.headers.get("Location")
            //const newRes = await fetch(location)
            //const json = await newRes.json()
            // Do something with the JSON object
            //if (res.redirected) {
                //const newRes = await res.follow()
                // Do something with the new response object
                //const location = res.headers.get("Location")
                //const newRes = await fetch(location)
                const data = await res.json()
            console.log(res)
            //const data = await newRes.json()
            
            if (res.ok) {  
              localStorage.clear()
              const id=data.response.user.id    
              localStorage.setItem(
                'auth-token',
                data.response.user.authentication_token)   
              localStorage.setItem('id',id)  
              console.log(data)
                
              const resrole = await fetch(`/user/${localStorage.getItem('id')}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*',
                    'Authentication-Token': localStorage.getItem('auth-token')
                },
                //body: JSON.stringify(this.current_user),
            })
                const datarole = await resrole.json()
            console.log(datarole)
              const role = datarole.role;  // Assuming role is available in the API response
                if(role=="user"){
                    this.$router.push(`/user_home`)
                }
                if(role=="admin"){
                    this.$router.push(`/admin_home`)
                }
            }else if(data.response.errors.password){
              // this.success=false,
              this.e_error=""
              this.p_error="Invalid password"
              // alert("Invalid password")
        }else if(data.response.errors.username){
          // this.success=false,
          this.p_error=""
          this.e_error="Specified user does not exist"
          // alert("This user does not exist")
      
      }
      else{
        console.error("User data is missing in the response")
        }}
        catch(error){
            console.log(`Error while fetching users ${error}`)
        }
        },
    async signup(){
        this.$router.push(`/signup`)
    }
    },
  }
 

export default login