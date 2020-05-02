<template>
  <div>
      <!-- <div>{{userId}}</div>
      <br>
      <div>{{activeCode}}</div> -->
  </div>
</template>

<script>
export default {
    data(){
        return{
            userId: this.$route.query.userId,
            activeCode: this.$route.query.activeCode
        }
    },
    mounted(){
        this.tryActive()
    },
    methods:{
       async tryActive(){
           if(!this.userId || !this.activeCode){
               return this.$message.error('参数不合法')
           }
           const {data:res} = await this.$http.get('/auth/active',{
               params:{
                   userId: this.userId,
                   activeCode: this.activeCode
               }
           })
           if(res.status!==200){
               return this.$message.error('激活失败')
           }
           this.$router.push('/')
           return this.$message.success('激活成功，回到主页')
       } 
    }
}
</script>

<style>

</style>