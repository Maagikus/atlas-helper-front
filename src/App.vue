<template>
  <div class="container">
    <div class="login">
      <form @submit.prevent="setKey(key)" class="login__form">
        <div class="login__input">
          <label for="" class="form-transport__label">Key</label>
          <input
            v-model="key"
            id=""
            autocomplete="off"
            type="text"
            name="form[]"
            data-error="Ошибка"
            placeholder=""
            class="form-transport__input"
          />
        </div>
        <button type="submit" class="login__button">Задать ключ</button>
        <div v-if="cklicked" class="forSanuya">
          <img src="./assets/1.png" alt="" />
          <div class="text">Ты нажал!!!</div>
        </div>
      </form>
    </div>
    <div class="wrapper">
      <ul class="menu">
        <li
          class="menu__item"
          @click="menuItem = 0"
          :class="{ active: menuItem === 0 }"
        >
          Майнинг
        </li>
        <li
          class="menu__item"
          @click="menuItem = 1"
          :class="{ active: menuItem === 1 }"
        >
          Перевозки
        </li>
      </ul>
      <div v-if="menuItem === 0" class="mining-form">
        <h2 class="mining-form__title">Mining</h2>
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
            <label for="fleet">Флот:</label>
            <select v-model="form.fleet" id="fleet" name="fleet" required>
              <option disabled value="">Выберите флот</option>
              <option
                v-for="(fleet, index) in fleets"
                :key="index"
                :value="fleet"
              >
                {{ fleet }}
              </option>
            </select>
          </div>

          <div class="error-message" v-if="errorMessage">
            {{ errorMessage }}
          </div>
          <div class="success-message" v-if="successMessage">
            {{ successMessage }}
          </div>

          <button type="submit">Отправить</button>
        </form>
      </div>
      <div v-if="menuItem === 1" class="transport-form">
        <form class="transport-form form-transport">
          <div class="form-transport__wrapper">
            <div class="form-transport__general">
              <h2 class="form-transport__title">General Settings</h2>
              <div class="form__item">
                <label for="fleet">Флот:</label>
                <select
                  v-model="formForTransfer.fleet"
                  id="fleet"
                  name="fleet"
                  required
                >
                  <option disabled value="">Выберите флот</option>
                  <option
                    v-for="(fleet, index) in fleets"
                    :key="index"
                    :value="fleet"
                  >
                    {{ fleet }}
                  </option>
                </select>
              </div>

              <div class="form-transport__item">
                <label for="" class="form-transport__label">Loops</label>
                <input
                  v-model="formForTransfer.loop"
                  id=""
                  autocomplete="off"
                  type="number"
                  name="form[]"
                  data-error="Ошибка"
                  placeholder=""
                  class="form-transport__input"
                />
              </div>
            </div>
            <div class="form-transport__left">
              <h2 class="form-transport__title">From</h2>

              <!-- <div class="form-transport__item">
                <label for="" class="form-transport__label">Food</label>
                <input
                  v-model="formForTransfer.depositFood"
                  id=""
                  autocomplete="off"
                  type="number"
                  name="form[]"
                  data-error="Ошибка"
                  placeholder=""
                  class="form-transport__input"
                />
              </div> -->
              <div class="form-transport__item">
                <label for="" class="form-transport__label">Fuel</label>
                <input
                  v-model="formForTransfer.fuelAtStartingPoint"
                  id=""
                  autocomplete="off"
                  type="number"
                  name="form[]"
                  data-error="Ошибка"
                  placeholder=""
                  class="form-transport__input"
                />
              </div>
              <!-- <div class="form-transport__item">
                <label for="" class="form-transport__label">Ammo</label>
                <input
                  v-model="formForTransfer.depositAmmo"
                  id=""
                  autocomplete="off"
                  type="number"
                  name="form[]"
                  data-error="Ошибка"
                  placeholder=""
                  class="form-transport__input"
                />
              </div> -->
              <div class="form__item select">
                <label for="resource">Ресурс:</label>
                <div class="select__wrap">
                  <select
                    v-model="formForTransfer.resource"
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
                  <input
                    v-model="formForTransfer.resourceValueAtStartingPoint"
                    id=""
                    autocomplete="off"
                    type="number"
                    name="form[]"
                    data-error="Ошибка"
                    placeholder=""
                    class="select__input"
                  />
                </div>
              </div>

              <div class="form-transport__item">
                <label for="" class="form-transport__label"
                  >Координаты warp вперед</label
                >
                <input
                  v-model="formForTransfer.forwardCoordForWarp"
                  id=""
                  autocomplete="off"
                  type="text"
                  name="form[]"
                  data-error="Ошибка"
                  placeholder="2 -34"
                  class="form-transport__input"
                />
              </div>
              <div class="form-transport__item">
                <label for="" class="form-transport__label"
                  >Координаты subWarp вперед</label
                >
                <input
                  v-model="formForTransfer.forwardCoordForSubWarp"
                  id=""
                  autocomplete="off"
                  type="text"
                  name="form[]"
                  data-error="Ошибка"
                  placeholder="2 -34"
                  class="form-transport__input"
                />
              </div>
            </div>
            <div class="form-transport__right">
              <h2 class="form-transport__title">To</h2>
              <!-- <div class="form-transport__item">
                <label for="" class="form-transport__label">Food</label>
                <input
                  v-model="formForTransfer.withdrawFood"
                  id=""
                  autocomplete="off"
                  type="number"
                  name="form[]"
                  data-error="Ошибка"
                  placeholder=""
                  class="form-transport__input"
                />
              </div> -->
              <div class="form-transport__item">
                <label for="" class="form-transport__label">Fuel</label>
                <input
                  v-model="formForTransfer.fuelAtDestination"
                  id=""
                  autocomplete="off"
                  type="number"
                  name="form[]"
                  data-error="Ошибка"
                  placeholder=""
                  class="form-transport__input"
                />
              </div>
              <!-- <div class="form-transport__item">
                <label for="" class="form-transport__label">Ammo</label>
                <input
                  v-model="formForTransfer.withdrawAmmo"
                  id=""
                  autocomplete="off"
                  type="number"
                  name="form[]"
                  data-error="Ошибка"
                  placeholder=""
                  class="form-transport__input"
                />
              </div> -->
              <div class="form__item select">
                <label for="resource">Ресурс:</label>
                <div class="select__wrap">
                  <select
                    v-model="formForTransfer.resource"
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
                  <input
                    v-model="formForTransfer.resourceValueAtDestination"
                    id=""
                    autocomplete="off"
                    type="number"
                    name="form[]"
                    data-error="Ошибка"
                    placeholder="666"
                    class="select__input"
                  />
                </div>
              </div>
              <div class="form-transport__item">
                <label for="" class="form-transport__label"
                  >Координаты warp</label
                >
                <input
                  v-model="formForTransfer.backCoordForWarp"
                  id=""
                  autocomplete="off"
                  type="text"
                  name="form[]"
                  data-error="Ошибка"
                  placeholder="2 -34"
                  class="form-transport__input"
                />
              </div>
              <div class="form-transport__item">
                <label for="" class="form-transport__label"
                  >Координаты subWarp</label
                >
                <input
                  v-model="formForTransfer.backCoordForSubWarp"
                  id=""
                  autocomplete="off"
                  type="text"
                  name="form[]"
                  data-error="Ошибка"
                  placeholder="2 -34"
                  class="form-transport__input"
                />
              </div>
            </div>
          </div>
          <div class="error-message" v-if="errorMessage">
            {{ errorMessage }}
          </div>
          <div class="success-message" v-if="successMessage">
            {{ successMessage }}
          </div>
          <div class="move" @click="setSettings(formForTransfer)">
            set movement settings
          </div>
          <div @click="movement(formForTransfer)" class="move">двигаться</div>
        </form>
      </div>
      <div v-if="fleetData.length > 0" class="process">
        <ProcessStatus
          @execute-movement="movement"
          v-for="item in fleetData"
          :fleet="item"
        ></ProcessStatus>
      </div>
    </div>
  </div>
</template>

<script setup>
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { io } from "socket.io-client";
import { reactive, ref, onMounted } from "vue";
import ProcessStatus from "./components/ProcessStatus.vue";
import { useCookies } from "vue3-cookies";
const fleets = ref([]);
const key = ref("");
const fleetData = ref([]);
const menuItem = ref(0);
const { cookies } = useCookies();
const cklicked = ref(false);
const resources = ref([
  "arco",
  "biomass",
  "carbon",
  "diamond",
  "hydrogen",
  "iron_ore",
  "lumanite",
  "rochinol",
  "framework",
  "fuel",
  "polymer",
  "copper_ore",
  "magnet",
  "copper",
]);
const form = reactive({
  loop: "",
  food: "",
  time: "",
  key: key.value,
  resource: resources.value[0],
  fleet: fleets.value[0],
});
const formForTransfer = reactive({
  loop: "",
  key: key.value,
  fleet: "",
  fillFuel: "",
  fillAmmo: "",
  depositFood: "",
  depositAmmo: "",
  depositFuel: "",
  depositFrame: "",
  withdrawFuel: "",
  withdrawFood: "",
  withdrawAmmo: "",
  withdrawFrame: "",
  forwardCoordForWarp: "",
  forwardCoordForSubWarp: "",
  backCoordForWarp: "",
  backCoordForSubWarp: "",
  resource: resources.value[0],
  resourceValueAtStartingPoint: "",
  resourceValueAtDestination: "",
  fuelAtStartingPoint: "",
  fuelAtDestination: "",
});
const settingsForTransfer = ref([]);
const setSettings = (dataForSending) => {
  const data = {
    fleet: dataForSending.fleet,
    fuelAtStartingPoint: dataForSending.fuelAtStartingPoint,
    fuelAtDestination: dataForSending.fuelAtDestination,
    resourceValueAtDestination: dataForSending.resourceValueAtDestination,
    resourceValueAtStartingPoint: dataForSending.resourceValueAtStartingPoint,
    loop: dataForSending.loop,
    key: dataForSending.key,
    resource: dataForSending.resource,
    forwardCoordForWarp: dataForSending.forwardCoordForWarp,
    forwardCoordForSubWarp: dataForSending.forwardCoordForSubWarp,
    backCoordForWarp: dataForSending.backCoordForWarp,
    backCoordForSubWarp: dataForSending.backCoordForSubWarp,
  };
  settingsForTransfer.value = [...settingsForTransfer.value, data];
  console.log(settingsForTransfer.value);
};
const errorMessage = ref("");
const successMessage = ref("");
const loadFleets = async (userKey) => {
  try {
    const response = await fetch(
      `https://staratlas-helper-98g9.onrender.com/getAllFleet?key=${encodeURIComponent(
        userKey
      )}`
    );
    if (!response.ok) {
      throw new Error("Ошибка при загрузке списка флотов");
    }
    const data = await response.json();

    fleets.value = [...data.planets];
  } catch (error) {
    console.error(error);
  }
};
const setKey = async (key) => {
  form.key = key;
  formForTransfer.key = key;
  loadFleets(key);
  cklicked.value = true;
  //   try {
  //     const response = await fetch(
  //       "https://staratlas-helper-98g9.onrender.com/saveKeyToCookie",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ key }),
  //         credentials: "include",
  //       }
  //     );

  //     if (response.ok) {
  //       const result = await response.json();
  //       form.key = key;
  //       formForTransfer.key = key;
  //       loadFleets();
  //     } else {
  //       console.error("Ошибка при сохранении ключа в куки:", response.statusText);
  //     }
  //   } catch (error) {
  //     console.error("Произошла ошибка при отправке запроса:", error);
  //   }
};
// const getDataWithKey = async () => {
//   try {
//     const response = await fetch("http://localhost:8080/getDataWithKey", {
//       method: "GET",
//       credentials: "include", // Передача куки в запросе
//     });
//     if (!response.ok) {
//       throw new Error(`Ошибка HTTP: ${response.status}`);
//     }
//     const data = await response.text();
//     return data; // Вывод полученных данных в консоль
//     // Здесь можно обрабатывать полученные данные или выполнять другие действия
//   } catch (error) {
//     console.error("Ошибка при получении данных:", error);
//   }
// };
onMounted(async () => {
  const dataFromLocalStorage = JSON.parse(localStorage.getItem("fleetData"));
  if (dataFromLocalStorage) {
    fleetData.value = dataFromLocalStorage;
  }
});

const socket = io("https://staratlas-helper-98g9.onrender.com");

// const socket = io(
//   "https://staratlas-helper-98g9.onrender.com" || "http://localhost:3000"
// );
// const socket = io("http://localhost:8080");

socket.on("message", (response) => {
  const responseData = JSON.parse(response);
  const index = fleetData.value.findIndex(
    (item) => item.fleet === responseData.fleet
  );
  if (index !== -1) {
    // Обновляем только поля action и mess для найденного объекта
    fleetData.value[index].action = responseData.action;
    fleetData.value[index].mess = responseData.mess;
  } else {
    fleetData.value.push(responseData);
  }
  localStorage.setItem("fleetData", JSON.stringify(fleetData.value));
  if (!responseData.success) {
    successMessage.value = "";
    errorMessage.value = `Перейди в исходную точку в игре ${responseData.error}`;
    console.error("Ошибка сервера:", responseData.error);
  }
});
const onSubmit = () => {
  try {
    successMessage.value = "Работаем";
    errorMessage.value = "";

    // Отправка данных на сервер через веб-сокет
    socket.send(JSON.stringify(form));
  } catch (error) {
    console.error("Произошла ошибка:", error);
  }
};
socket.on("connect_error", (error) => {
  successMessage.value = "";
  errorMessage.value = `Перейди в исходную точку в игре ${error}`;
  console.error("Ошибка сети:", error);
});

// const movement = () => {
//   const data = {
//     fleet: formForTransfer.fleet,
//     fuelAtStartingPoint: formForTransfer.fuelAtStartingPoint,
//     fuelAtDestination: formForTransfer.fuelAtDestination,
//     resourceValueAtDestination: formForTransfer.resourceValueAtDestination,
//     resourceValueAtStartingPoint: formForTransfer.resourceValueAtStartingPoint,
//     loop: formForTransfer.loop,
//     key: formForTransfer.key,
//     resource: formForTransfer.resource,
//     forwardCoordForWarp: formForTransfer.forwardCoordForWarp,
//     forwardCoordForSubWarp: formForTransfer.forwardCoordForSubWarp,
//     backCoordForWarp: formForTransfer.backCoordForWarp,
//     backCoordForSubWarp: formForTransfer.backCoordForSubWarp,
//   };
//   try {
//     successMessage.value = "Двигаемся";
//     errorMessage.value = "";

//     // Отправка данных на сервер через веб-сокет
//     socket.emit("move", JSON.stringify(data));
//   } catch (error) {
//     console.error("Произошла ошибка:", error);
//   }
// };

const movement = (dataForSending) => {
  const data = {
    fleet: dataForSending.fleet,
    fuelAtStartingPoint: dataForSending.fuelAtStartingPoint,
    fuelAtDestination: dataForSending.fuelAtDestination,
    resourceValueAtDestination: dataForSending.resourceValueAtDestination,
    resourceValueAtStartingPoint: dataForSending.resourceValueAtStartingPoint,
    loop: dataForSending.loop,
    key: dataForSending.key,
    resource: dataForSending.resource,
    forwardCoordForWarp: dataForSending.forwardCoordForWarp,
    forwardCoordForSubWarp: dataForSending.forwardCoordForSubWarp,
    backCoordForWarp: dataForSending.backCoordForWarp,
    backCoordForSubWarp: dataForSending.backCoordForSubWarp,
  };
  try {
    successMessage.value = "Двигаемся";
    errorMessage.value = "";

    // Отправка данных на сервер через веб-сокет
    socket.emit("move", JSON.stringify(settingsForTransfer.value));
  } catch (error) {
    console.error("Произошла ошибка:", error);
  }
};
</script>

<style>
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
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
.move {
  background-color: #3498db;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.move:hover {
  background-color: #2980b9;
}
button:hover {
  background-color: #2980b9;
}
.mining-form {
  flex: 1 0 auto;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
}
.form-transport__wrapper {
  display: flex;
  gap: 50px;
  flex-wrap: wrap;
  align-items: flex-start;
}
@media screen and (max-width: 992px) {
  .form-transport__wrapper {
    flex-direction: column;
    align-items: center;
  }
}
.select__wrap {
  display: flex;
  gap: 5px;
}
.select__wrap select {
  flex: 1 0 auto;
}
.select__input {
  flex: 0 1 50%;
}
.menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu__item {
  display: inline-block;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.menu__item.active {
  background-color: #3498db;
  color: #fff;
}
.menu__item.active:hover {
  background-color: #3498db;
  color: #fff;
}

.menu__item:hover {
  background-color: #f2f2f2;
}
.process {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.login__form {
  position: relative;
}
.forSanuya {
  width: 500px;
  display: flex;
  align-items: center;
  gap: 20px;
}
.text {
  font-size: 50px;
  color: #29a4c3;
}
.forSanuya img {
  width: 20%;
  height: 500%;
}
</style>
