<template>
  <div class="mining-form">
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
        <select v-model="form.resource" id="resource" name="resource" required>
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

      <div class="error-message" v-if="errorMessage">
        {{ errorMessage }}
      </div>
      <div class="success-message" v-if="successMessage">
        {{ successMessage }}
      </div>

      <button type="submit">Отправить</button>
      <div @click="movement" class="move">двигаться</div>
    </form>
  </div>
</template>
<script></script>
