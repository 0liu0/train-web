<template>
  <div class="bg">
    <img src="../assets/img.png" alt="nihao" style="width: auto; height: 100%; display: block;">
    <a-row class="login">
      <a-col :span="8" :offset="8" class="login-main">
        <h1 style="text-align: center">
          <rocket-two-tone/>&nbsp;刘彻12306贩票系统
        </h1>
        <a-form
            :model="loginForm"
            name="basic"
            autocomplete="off"
        >
          <a-form-item
              label=""
              name="mobile"
              :rules="[{ required: true, message: '请输入手机号!' }]"
          >
            <a-input v-model:value="loginForm.mail" placeholder="手机号"/>
          </a-form-item>

          <a-form-item
              label=""
              name="code"
              :rules="[{ required: true, message: '请输入验证码!' }]"
          >
            <a-input v-model:value="loginForm.mailCode">
              <template #addonAfter>
                <a @click="sendCode">获取验证码</a>
              </template>
            </a-input>
            <!--<a-input v-model:value="loginForm.code" placeholder="验证码"/>-->
          </a-form-item>

          <a-form-item>
            <a-button type="primary" block @click="login">登录</a-button>
          </a-form-item>

        </a-form>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import {reactive} from 'vue';
import {message, notification} from 'ant-design-vue';
import {useRouter} from 'vue-router'
import store from "@/store";
import myAxios from "@/utils/myAxios";

const router = useRouter();

const loginForm = reactive({
  mail: '706716852@qq.com',
  mailCode: '888888',
});

const sendCode = () => {
  myAxios.get(`/member/user/send/code?mail=${loginForm.mail}`).then(response => {
    let data = response.data;
    if (data.success) {
      message.success('发送验证码成功！');
    } else {
      message.error(data.message);
    }
  });
};

const login = () => {
  myAxios.post("/member/user/authenticate", loginForm).then((response) => {
    let data = response.data;
    if (data.success) {
      message.success('登录成功！');
      // 登录成功，跳到控台主页
      router.push("/content");
      store.commit('setMemberToSessionStorage', data.content);
    } else {
      message.error(data.message);
    }
  })
};
</script>

<style>
.login-main h1 {
  font-size: 25px;
  font-weight: bold;
}

.login-main {
  margin-top: 100px;
  padding: 30px 30px 20px;
  border: 2px solid white;
  border-radius: 10px;
  background-color: #fcfcfc;
}


img {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1000; /* or any negative value */
  /* ... other styles */
}
</style>
