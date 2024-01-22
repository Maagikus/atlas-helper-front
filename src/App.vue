<template>
  <div class="container">
    <div class="wrapper">
      <form @submit.prevent="onSubmit(form)" id="myForm" class="form">
        <div class="form__item">
          <label for="loop">Количество итераций:</label>
          <input
            v-model="form.loop"
            type="number"
            id="loop"
            name="loop"
            required
          />
        </div>

        <div class="form__item">
          <label for="food">Количество еды:</label>
          <input
            v-model="form.food"
            type="number"
            id="food"
            name="food"
            required
          />
        </div>

        <div class="form__item">
          <label for="time">Время в минутах:</label>
          <input
            v-model="form.time"
            type="number"
            id="time"
            name="time"
            required
          />
        </div>

        <div class="form__item">
          <label for="resource">Ресурс:</label>
          <select
            v-model="form.resource"
            id="resource"
            name="resource"
            required
          >
            <option
              v-for="resource in resources"
              :key="resource"
              :value="resource"
            >
              {{ resource }}
            </option>
          </select>
        </div>

        <div class="form__item">
          <label for="planet">planet:</label>
          <input
            v-model="form.planet"
            type="text"
            id="planet"
            name="planet"
            required
          />
        </div>

        <div class="form__item">
          <label for="fleet">fleet:</label>
          <input
            v-model="form.fleet"
            type="text"
            id="fleet"
            name="fleet"
            required
          />
        </div>

        <div class="form__item">
          <label for="key">Пароль:</label>
          <input v-model="form.key" type="text" id="key" name="key" required />
        </div>

        <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
        <div class="success-message" v-if="successMessage">
          {{ successMessage }}
        </div>

        <button type="submit">Отправить</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { reactive, ref } from "vue";
const resources = ref([
  "arco",
  "biomass",
  "carbon",
  "diamond",
  "hydrogen",
  "iron_ore",
  "lumanite",
  "rochinol",
]);
const form = reactive({
  loop: "",
  food: "",
  time: "",
  key: "",
  resource: resources.value[0],
  fleet: "",
});

const errorMessage = ref("");
const successMessage = ref("");

const onSubmit = async (data) => {
  try {
    successMessage.value = "Работаем";
    errorMessage.value = "";
    const response = await fetch(
      "https://staratlas-helper.onrender.com/start",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      // Обрабатывайте ошибки сервера здесь
      const res = await response.json();
      successMessage.value = "";
      errorMessage.value = `Перейди в исходную точку в игре ${res.error}`;

      console.error("Ошибка сервера:", res.error);
    } else {
      // Обработка успешного ответа
      const responseData = await response.json();
      successMessage.value = "Все получилось";
      console.log("Успешный ответ:", responseData);
    }
  } catch (error) {
    // Обрабатывайте сетевые ошибки здесь
    successMessage.value = "";
    errorMessage.value = `Перейди в исходную точку в игре ${error}`;

    console.error("Ошибка сети:", error);
  }
};
</script>

<style scoped>
body {
  //font-family: Arial, sans-serif;
  //display: flex;
  //align-items: center;
  //justify-content: center;
  //height: 100vh;
  //margin: 0;
}

.error-message {
  color: red;
  margin-top: 10px;
}
.success-message {
  color: green;
  margin-top: 10px;
}
.container {
  max-width: 1617px;
  margin: 0 auto;
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding-left: 300px;
  padding-right: 300px;
}
@media screen and (max-width: 1200px) {
  .wrapper {
    padding-left: 150px;
    padding-right: 150px;
  }
}

@media screen and (max-width: 992px) {
  .wrapper {
    padding-left: 100px;
    padding-right: 100px;
  }
}

@media screen and (max-width: 768px) {
  .wrapper {
    padding-left: 15px;
    padding-right: 15px;
  }
}
form {
  width: 100%;
  text-align: center;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.form__item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
label {
  display: block;
}

input {
  width: 100%;
  padding: 8px;
  height: 30px;
  //margin-bottom: 10px;
  box-sizing: border-box;
}

button {
  background-color: #3498db;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #2980b9;
}
</style>
