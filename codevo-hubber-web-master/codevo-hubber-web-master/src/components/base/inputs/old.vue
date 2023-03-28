<div class="input-container">
  <v-text-field
    class="rounded-lg"
    label="Il tuo indirizzo email"
    variant="plain"
    placeholder="Email"
    v-model="email"
    :rules="[rules.required, rules.email]"
    density="comfortable"
    hide-details
  >
    
  </v-text-field>
</div>

<div class="input-container">
          <v-text-field
            color="black"
            text-color="black"
            label="Password"
            variant="plain"
            placeholder="Password"
            v-model="password"
            :rules="[rules.required, rules.password]"
            type="password"
            density="comfortable"
            hide-details
          ></v-text-field>
        </div>
